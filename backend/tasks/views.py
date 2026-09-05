from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from workspaces.activity.logger import ActivityLogger
from projects.models import Project, ProjectMember

from .models import Task
from .serializers import TaskSerializer
from projects.models import Project
from activities.models import Activity
from tasks.models import TaskAssignee
from workspaces.models import WorkspaceMember
from rest_framework.decorators import action
from rest_framework import status

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
        workspace_id = self.kwargs.get("workspace_id")

        qs = Task.objects.all()

        print("qs -> all tasks:", qs)

        if workspace_id:
            membership = WorkspaceMember.objects.filter(
                workspace_id=workspace_id,
                user=user
            ).first()

            if not membership:
                return Task.objects.none()

            # Owner sees everything
            if membership.role.lower() == "owner":
                return qs.filter(workspace_id=workspace_id)

            # Members/Viewers see only their assigned tasks
            print ("qs.filter for user's task :", qs.filter(
                workspace_id=workspace_id,
                assignees__member__user=user
            ).distinct())

            return qs.filter(
                workspace_id=workspace_id,
                assignees__member__user=user
            ).distinct()

        return qs.filter(
            assignees__member__user=user
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

        # -----------------------------------------
        # 1. Get project_id from request
        # -----------------------------------------
        project_id = self.request.data.get("project_id")

        if not project_id:
            raise ValidationError({
                "project_id": "This field is required."
            })

        # -----------------------------------------
        # 2. Find the project
        # -----------------------------------------
        try:
            project = Project.objects.get(
                id=project_id
            )
        except Project.DoesNotExist:
            raise ValidationError({
                "project_id": "Invalid project_id"
            })

        # -----------------------------------------
        # 3. Get workspace and logged-in user
        # -----------------------------------------
        workspace = project.workspace
        user = self.request.user

        # -----------------------------------------
        # 4. Find user's workspace membership
        # -----------------------------------------
        membership = WorkspaceMember.objects.filter(
            workspace=workspace,
            user=user
        ).first()

        if not membership:
            raise PermissionDenied(
                "You are not a member of this workspace."
            )

        # -----------------------------------------
        # 5. OWNER
        # -----------------------------------------
        if membership.role.lower() == "owner":

            task = serializer.save(
                project=project,
                workspace=workspace
            )

        # -----------------------------------------
        # 6. MEMBER
        # -----------------------------------------
        elif membership.role.lower() == "member":

            has_project_access = ProjectMember.objects.filter(
                project=project,
                member=membership
            ).exists()

            if not has_project_access:
                raise PermissionDenied(
                    "You do not have access to this project."
                )

            task = serializer.save(
                project=project,
                workspace=workspace
            )

            TaskAssignee.objects.get_or_create(
                task=task,
                member=membership
            )

        # -----------------------------------------
        # 7. VIEWER
        # -----------------------------------------
        else:

            raise PermissionDenied(
                "You do not have permission to create tasks."
            )

        # -----------------------------------------
        # 8. Activity log
        # -----------------------------------------
        ActivityLogger.task_created(
            actor=user,
            workspace=workspace,
            task=task
        )

    # def perform_create(self, serializer):
    #         project_id = self.request.data.get("project_id")
    #         if not project_id:
    #             raise ValidationError({"project_id": "This field is required."})

    #         try:
    #             project = Project.objects.get(id=project_id)
    #         except Project.DoesNotExist:
    #             raise ValidationError({"project_id": "Invalid project_id"})

    #         workspace = project.workspace
    #         user = self.request.user

    #     # 🔐 Permission check — only workspace owners can create tasks
    #         membership = WorkspaceMember.objects.filter(
    #         workspace=workspace,
    #         user=user
    #         ).first()

    #         if not membership:
    #             raise PermissionDenied("You are not a member of this workspace.")

    #         if membership.role != "Owner":
    #             raise PermissionDenied("Only workspace owners can create tasks.")

    #         task = serializer.save(
    #             project=project,
    #             workspace=workspace
    #         )

    #         # CENTRAL LOGGER
    #         ActivityLogger.task_created(
    #           actor=user,
    #           workspace=workspace,
    #           task=task
    #         )

            

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

        kwargs["partial"] = True

        # --------------------------------
        # 1. Get task DIRECTLY
        # --------------------------------
        task = get_object_or_404(
            Task,
            pk=kwargs["pk"]
        )

        # --------------------------------
        # 2. Get workspace
        # --------------------------------
        workspace = task.workspace
        actor = request.user

        # --------------------------------
        # 3. Get actor's membership
        # --------------------------------
        membership = get_object_or_404(
            WorkspaceMember,
            workspace=workspace,
            user=actor
        )

        # --------------------------------
        # 4. Check Model B permission
        # --------------------------------

        # OWNER → can edit any task
        if membership.role.lower() == "owner":
            pass

        # MEMBER → can edit only tasks assigned to himself
        elif membership.role.lower() == "member":

            is_assignee = task.assignees.filter(
                member=membership
            ).exists()

            if not is_assignee:
                raise PermissionDenied(
                    "You can only edit tasks assigned to you."
                )

        # VIEWER → cannot edit
        else:
            raise PermissionDenied(
                "You do not have permission to edit tasks."
            )

        # --------------------------------
        # 5. Create serializer
        # --------------------------------
        serializer = self.get_serializer(
            task,
            data=request.data,
            partial=True
        )

        serializer.is_valid(
            raise_exception=True
        )

        # --------------------------------
        # 6. Save through perform_update()
        # --------------------------------
        self.perform_update(serializer)

        # --------------------------------
        # 7. Return updated task
        # --------------------------------
        return Response(serializer.data)
    
     # ----------------------------------------------------
    # DELETE
    # ----------------------------------------------------
    def destroy(self, request, *args, **kwargs):
        task = get_object_or_404(
            Task,
            pk=kwargs["pk"]
        )

        workspace = task.workspace
        actor = request.user

        # --------------------------------
        # Owner check
        # --------------------------------
        get_object_or_404(
            WorkspaceMember,
            workspace=workspace,
            user=actor,
            role__iexact="owner"
        )

        # Log BEFORE deleting
        ActivityLogger.task_deleted(
            actor=actor,
            workspace=workspace,
            task_name=task.name
        )

        task.delete()

        return Response(
         status=status.HTTP_204_NO_CONTENT
        )

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
       
        ActivityLogger.task_unassigned(
            actor=actor,
            workspace=workspace,
            task=task,
            unassigned_user=assignee.member.user
        )

        assignee.delete()
        return Response(status=204)
    
# ________________________assignee____________________   

    @action(
    detail=True,
    methods=["post", "delete"],
    url_path=r"assignees/(?P<member_id>[^/.]+)"
    )
    def assignee(self, request, pk=None, member_id=None):

        # --------------------------------
        # 1. Get the task directly
        # --------------------------------
        task = get_object_or_404(
            Task,
            pk=pk
        )

        # --------------------------------
        # 2. Get the workspace
        # --------------------------------
        workspace = task.project.workspace

        actor = request.user

        # --------------------------------
        # 3. Verify actor is workspace owner
        # --------------------------------

        owner_membership = get_object_or_404(
            WorkspaceMember,
            workspace=workspace,
            user=actor,
            role__iexact="owner"
        )

        #______________alternative_________________ 

        # is_owner = WorkspaceMember.objects.filter(
        #      workspace=workspace, 
        #      user=actor, 
        #      role__iexact="owner" )
        #      .exists()  
        # ----- doesn't retrieve the entire WorkspaceMember object.
        #     It simply asks:  Does at least one matching membership exist?


        
        # --------------------------------
        # 4. Get target member
        # --------------------------------
        member = get_object_or_404(
            WorkspaceMember,
            id=member_id,
            workspace=workspace
        )

        # --------------------------------
        # 5. ASSIGN
        # --------------------------------
        if request.method == "POST":

            _, created = TaskAssignee.objects.get_or_create(
                task=task,
                member=member
            )

            if created:
                ActivityLogger.task_assigned(
                    actor=actor,
                    workspace=workspace,
                    task=task,
                    assigned_user=member.user
                )

            return Response(
                status=status.HTTP_201_CREATED
            )

        # --------------------------------
        # 6. UNASSIGN
        # --------------------------------
        if request.method == "DELETE":

            deleted, _ = TaskAssignee.objects.filter(
                task=task,
                member=member
            ).delete()

            if deleted:
                ActivityLogger.task_unassigned(
                    actor=actor,
                    workspace=workspace,
                    task=task,
                    unassigned_user=member.user
                )

            return Response(
                status=status.HTTP_204_NO_CONTENT
            )
    
     
    @api_view(["GET"])
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

 