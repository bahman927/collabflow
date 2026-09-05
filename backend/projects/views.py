# projects/views.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from workspaces.activity.logger import ActivityLogger

from .models import Project
from .serializers import ProjectSerializer
from workspaces.models import Workspace
from activities.models import Activity
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Project, ProjectMember
from .serializers import ProjectCreateSerializer
from workspaces.models import Workspace, WorkspaceMember


class ProjectViewSet(ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user
        workspace_id = self.request.query_params.get("workspace")
        # workspace_id = self.kwargs.get("workspace_id")

        print("projectViewSet - workspace_id :", workspace_id)

        qs = Project.objects.all()

        if not workspace_id:
            return qs.none()

        membership = WorkspaceMember.objects.filter(
            workspace_id=workspace_id,
            user=user
        ).first()

        if not membership:
            return qs.none()

        # if membership.role.lower() == "owner" || :
        #     return qs.filter(
        #         workspace_id=workspace_id
        #     )

        return qs.filter(
            workspace_id=workspace_id,
            # project_members__member=membership
        )

 

    # ---------------------------------------------------------
    # PROJECT CREATED
    # ---------------------------------------------------------
    def perform_create(self, serializer):
        user = self.request.user
        workspace_id = self.request.data.get("workspace_id")
        if not workspace_id:
            raise PermissionDenied("workspace_id is required")

        workspace = Workspace.objects.get(id=workspace_id)

    # 🔐 Permission check
        membership = WorkspaceMember.objects.filter(
                workspace=workspace,
                user=self.request.user
            ).first()
        
        if not membership or membership.role != "Owner":
           raise PermissionDenied("Only workspace owners can create projects.")
 
        # Create the project
        project = serializer.save(
            workspace=workspace,
            created_by=self.request.user
        )

        # CENTRAL LOGGER
        ActivityLogger.project_created(
            actor=user,
            workspace=workspace,
            project=project
        )

      # ---------------------------------------------------------
    # PROJECT UPDATED
    # ---------------------------------------------------------
    def perform_update(self, serializer):
        project = serializer.save()
        workspace = project.workspace

        ActivityLogger.project_updated(
            actor=self.request.user,
            workspace=workspace,
            project=project
        )

    # ---------------------------------------------------------
    # PROJECT DELETED
    # ---------------------------------------------------------
    def destroy(self, request, *args, **kwargs):
        project = self.get_object()
        workspace = project.workspace
        project_name = project.name

        # ⭐ Log BEFORE deletion
        ActivityLogger.project_deleted(
            actor=request.user,
            workspace=workspace,
            project_name=project_name
        )

        return super().destroy(request, *args, **kwargs)


class ProjectListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(workspace_id=self.kwargs['workspace_id'])
   

    def create(self, request, *args, **kwargs):
        workspace = Workspace.objects.get(id=self.kwargs['workspace_id'])
        serializer = ProjectCreateSerializer(
            data=request.data,
            context={'workspace': workspace}
        )
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        # 1. Create project
        project = Project.objects.create(
            workspace=workspace,
            name=data['name'],
            description=data.get('description', ''),
            created_by=request.user,
        )

        # 2. Assign members to the project
        for member_id in data.get('member_ids', []):
            try:
                member = WorkspaceMember.objects.get(id=member_id, workspace=workspace)
                ProjectMember.objects.create(
                    project=project,
                    member=member,
                    assigned_by=request.user,
                )
            except WorkspaceMember.DoesNotExist:
                pass

        # 3. Auto-assign the creator
        creator_membership = WorkspaceMember.objects.filter(
            workspace=workspace, user=request.user
        ).first()
        if creator_membership:
            ProjectMember.objects.get_or_create(
                project=project,
                member=creator_membership,
                defaults={'assigned_by': request.user}
            )

        return Response(
            {'id': project.id, 'name': project.name},
            status=status.HTTP_201_CREATED
        )

    
