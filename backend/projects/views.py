# projects/views.py
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

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

        # If this is a detail route (GET/PUT/PATCH/DELETE /projects/<id>/)
        if "pk" in self.kwargs:
            qs = Project.objects.all()
            if user.is_admin:
                return qs
            return qs.filter(workspace__memberships__user=user)

        # Otherwise it's a list route (GET /projects/?workspace=ID)
        workspace_id = self.request.query_params.get("workspace")
        if not workspace_id:
                return Project.objects.none()

        if user.is_admin:
            return Project.objects.filter(workspace_id=workspace_id)

        return Project.objects.filter(
            workspace_id=workspace_id,
            workspace__memberships__user=user
        ).distinct()


    def perform_create(self, serializer):
        workspace_id = self.request.data.get("workspace_id")
        if not workspace_id:
            raise PermissionDenied("workspace_id is required")

        workspace = Workspace.objects.get(id=workspace_id)

    # 🔐 Permission check
        membership = WorkspaceMember.objects.filter(
                workspace=workspace,
                user=self.request.user
            ).first()
        
        print("role = ", membership, membership.role)
        if not membership or membership.role != "Owner":
           raise PermissionDenied("Only workspace owners can create projects.")
 
        # Create the project
        project = serializer.save(
            workspace=workspace,
            created_by=self.request.user
        )

        # Log activity
        Activity.objects.create(
            activity_type="PROJECT_CREATED",
            workspace=workspace,
            user=self.request.user,
            message=f"{self.request.user.email} created project '{project.name}'"
        )

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

    
