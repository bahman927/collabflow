from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from workspaces.activity.logger import ActivityLogger

from .models import Task
from .serializers import TaskSerializer
from projects.models import Project
from activities.models import Activity
from tasks.models import TaskAssignee
from workspaces.models import WorkspaceMember
from rest_framework.decorators import action
from rest_framework import status
print(">>>before  TaskViewSet")
STATUS_CHOICES = [
    ("todo", "To Do"),
    ("in_progress", "In Progress"),
    ("done", "Done"),
    ("overdue", "Overdue"),
]

 

class TaskViewSet(ModelViewSet):
    print(">>>inside  TaskViewSet")

    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    queryset = Task.objects.all() 

    def get_queryset(self):
        user = self.request.user
        workspace_id = self.kwargs.get("workspace_id")

        qs = Task.objects.all()

        if workspace_id:
            return qs.filter(workspace_id=workspace_id)

        return qs.filter(
            workspace__memberships__user=user
        ).distinct()

 
       
    def get_object(self):
     
        obj = super().get_object()
        workspace = obj.workspace
        user = self.request.user

        membership = workspace.memberships.filter(user=user).first()
        is_assignee = obj.assignees.filter(member__user=user).exists()

        if not (membership or is_assignee):
            raise PermissionDenied("Not allowed")

        return obj
  
    
    # ---------------------------------------------------------
    # TASK CREATED
    # ---------------------------------------------------------
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

            # CENTRAL LOGGER
            ActivityLogger.task_created(
              actor=user,
              workspace=workspace,
              task=task
            )

            

     # ---------------------------------------------------------
    # TASK UPDATED
    # ---------------------------------------------------------
    def perform_update(self, serializer):
        # If workspace is explicitly provided in PATCH/PUT, use it
        if "workspace" in serializer.validated_data:
            serializer.save()
            return

        # Otherwise, if project changed, sync workspace from project
        if "project" in serializer.validated_data:
            project = serializer.validated_data["project"]
            serializer.save(workspace=project.workspace)
            return

        # Otherwise, normal update
        serializer.save()

        

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        task = self.get_object()

        serializer = self.get_serializer(task, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Save first — apply workspace_id or project change
        updated_task = serializer.save()

        # Now it's safe to access workspace
        workspace = updated_task.workspace

        # Permission checks AFTER save (because workspace now exists)
        is_assignee = updated_task.assignees.filter(member__user=request.user).exists()
        membership = workspace.memberships.filter(user=request.user).first()
        is_workspace_member = membership and membership.role in ("Owner", "Member")

        if not (is_assignee or is_workspace_member):
            return Response({"detail": "Not allowed"}, status=403)
        
         # CENTRAL LOGGER
        ActivityLogger.task_updated(
            actor=request.user,
            workspace=workspace,
            task=updated_task
        )

        return Response(serializer.data)
    
     # ----------------------------------------------------
    # DELETE
    # ----------------------------------------------------
    def destroy(self, request, *args, **kwargs):
        task = self.get_object()
        workspace = task.project.workspace
        actor = request.user
        task_name = task.name

        # Log BEFORE deleting
        ActivityLogger.task_deleted(
            actor=actor,
            workspace=workspace,
            task_name=task_name
        )

        return super().destroy(request, *args, **kwargs)

    def validate_status(self, value):
            valid_values = [choice[0] for choice in Task.STATUS_CHOICES]
            if value not in valid_values:
                raise serializers.ValidationError("Invalid status")
            return value
    
    # ---------------------------------------------------------
    # REMOVE ASSIGNEE (optional: log if you want)
    # --------------------------------------------------------
    @action(detail=True, methods=["delete"], url_path="assignees/(?P<member_id>[^/.]+)")
    def remove_assignee(self, request, pk=None, member_id=None):
        print(" inside remove_assignee")
        task = self.get_object()
        workspace = task.project.workspace
        actor = request.user

        assignee = TaskAssignee.objects.get(task_id=pk, member_id=member_id)
        # logger.debug(f"[ACTIVITY] Unassigned {assignee.member.user_id} from task {task.id}")
        # LOG BEFORE DELETE
        ActivityLogger.task_unassigned(
            actor=actor,
            workspace=workspace,
            task=task,
            unassigned_user=assignee.member.user
        )

        assignee.delete()
        return Response(status=204)
    

    
    @action(detail=True, methods=["post"], url_path="assignees/(?P<member_id>[^/.]+)")
    def add_assignee(self, request, pk=None, member_id=None):
        print("inside add_assignee")  
              # logger.debug(f"[ADD] Entered add_assignee: task={pk}, member={member_id}, user={request.user.id}")

        task = self.get_object()
        # logger.debug(f"[ADD] get_object OK: task.workspace={task.workspace_id}")


        workspace = task.project.workspace
        actor = request.user

        member = WorkspaceMember.objects.get(id=member_id)
        # logger.debug(f"[ADD] WorkspaceMember OK: user={member.user_id}")

        _, created = TaskAssignee.objects.get_or_create(
            task=task,
            member=member
        )

        # logger.debug(f"[ADD] get_or_create: created={created}")

        if created:
            
            ActivityLogger.task_assigned(
                actor=actor,
                workspace=workspace,
                task=task,
                assigned_user=member.user
            )
        # else:    
            # logger.debug("[ADD] Assignee already exists — no Activity created")

        return Response(status=201)
    
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

print(">>>end of  TaskViewSet")

# class TaskAssigneeView(APIView):
#     permission_classes = [IsAuthenticated]

#     def delete(self, request, task_id, member_id):
#         task = Task.objects.get(id=task_id)
#         workspace = task.project.workspace
#         actor = request.user

#         assignee = TaskAssignee.objects.get(task_id=task_id, member_id=member_id)
#         print("🔥 TaskAssigneeView CALLED", request.method, task_id, member_id)

#         # LOG BEFORE DELETE
#         ActivityLogger.task_unassigned(
#             actor=actor,
#             workspace=workspace,
#             task=task,
#             unassigned_user=assignee.member.user
#         )

#         assignee.delete()
#         return Response(status=204)

#     def post(self, request, task_id, member_id):
#         task = Task.objects.get(id=task_id)
#         workspace = task.project.workspace
#         actor = request.user

#         member = WorkspaceMember.objects.get(id=member_id)

#         obj, created = TaskAssignee.objects.get_or_create(
#             task=task,
#             member=member
#         )

#         if created:
#             ActivityLogger.task_assigned(
#                 actor=actor,
#                 workspace=workspace,
#                 task=task,
#                 assigned_user=member.user
#             )

#         return Response(status=201)
