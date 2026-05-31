from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import ValidationError

from .models import Task
from .serializers import TaskSerializer
from projects.models import Project
from activities.models import Activity
from tasks.models import TaskAssignee
from workspaces.models import WorkspaceMember

STATUS_CHOICES = [
    ("todo", "To Do"),
    ("in_progress", "In Progress"),
    ("done", "Done"),
    ("overdue", "Overdue"),
]


class TaskViewSet(ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    queryset = Task.objects.all() 
    def get_queryset(self):
        
        user = self.request.user
        workspace_id = self.kwargs["workspace_id"]

        member = WorkspaceMember.objects.filter(
            workspace_id=workspace_id,
            user=user
        ).first()

        if not member:
            return Task.objects.none()

        # OWNER → full access
        if member.role == "owner":
            return Task.objects.filter(project__workspace_id=workspace_id)

        # MEMBER → only tasks assigned to them
        if member.role == "member":
            return Task.objects.filter(
                project__workspace_id=workspace_id,
                # assignees__user=user
                assignees__member__user=user

            )

        return Task.objects.none()

     
    def perform_create(self, serializer):
        project_id = self.request.data.get("project_id")
        if not project_id:
            raise ValidationError({"project_id": "This field is required."})

        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            raise ValidationError({"project_id": "Invalid project_id"})

        workspace = project.workspace
        user = self.request.user

      # 🔐 Permission check — only workspace owners can create tasks
        membership = WorkspaceMember.objects.filter(
         workspace=workspace,
         user=user
        ).first()

        if not membership:
            raise PermissionDenied("You are not a member of this workspace.")

        if membership.role != "Owner":
            raise PermissionDenied("Only workspace owners can create tasks.")

        task = serializer.save(
            project=project,
            workspace=workspace
        )

        Activity.objects.create(
            activity_type="TASK_CREATED",
            workspace=workspace,
            user=self.request.user,
            message=f"{self.request.user.email} created task '{task.name}'"
        )


    def perform_update(self, serializer):
        project = serializer.validated_data.get("project")

        if project:
            # If project changed, update workspace too
            serializer.save(workspace=project.workspace)
        else:
            # Keep existing workspace
            serializer.save()
    

    def update(self, request, *args, **kwargs):
        task = self.get_object()
        workspace = task.project.workspace

        is_assignee = task.assignees.filter(member__user=request.user).exists()
        is_assigned_to = task.assignees.filter(member__user=request.user).exists()

        membership = workspace.memberships.filter(user=request.user).first()
        is_workspace_member = membership and membership.role in ("Owner", "Member")

        if not (is_assignee or is_assigned_to or is_workspace_member):
            return Response({"detail": "Not allowed"}, status=403)

        # ⭐ FIX: ensure workspace is saved
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(task, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        project = serializer.validated_data.get("project", task.project)
        updated_task = serializer.save(workspace=project.workspace)

        Activity.objects.create(
            activity_type="TASK_UPDATED",
            workspace=workspace,
            user=request.user,
            message=f"{request.user.email} updated task '{task.name}'"
        )

        return Response(serializer.data)



    def validate_status(self, value):
        valid_values = [choice[0] for choice in Task.STATUS_CHOICES]
        if value not in valid_values:
            raise serializers.ValidationError("Invalid status")
        return value


# ✅ Moved OUTSIDE the class — @api_view is for standalone functions

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_tasks(request, workspace_id):
    """All tasks assigned to the current user in this workspace."""

    # 1. Get the workspace member object
    member = WorkspaceMember.objects.get(
        workspace_id=workspace_id,
        user=request.user
    )

    # 2. Get tasks assigned to this member
    tasks = Task.objects.filter(
        project__workspace_id=workspace_id,
        assignees__member=member
    ).select_related("project").distinct().order_by("-updated_at")

    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

 