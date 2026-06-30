from .models import Workspace
from .serializers import WorkspaceSerializer
from workspaces.models import WorkspaceMember
from projects.models import Project, ProjectMember
from tasks.models import Task, TaskAssignee
from rest_framework import viewsets

# from .emails import send_invitation_email
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework import generics, status
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Invitation  
from .serializers import InvitationSerializer, WorkspaceMemberDetailSerializer
from rest_framework.viewsets import ModelViewSet
from .permissions import IsWorkspaceOwner
from workspaces.activity.logger import ActivityLogger
from .models import Workspace, WorkspaceMember, Invitation
from .serializers import (
    WorkspaceSerializer,
    InviteMemberSerializer,
    InvitationListSerializer,
)


class WorkspaceViewSet(ModelViewSet):
    serializer_class = WorkspaceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # if user.is_admin:
        #     return Workspace.objects.all()
        print("USER OBJECT:", user)
         

        return Workspace.objects.filter(   
            memberships__user=user
        ).distinct()

    def perform_create(self, serializer):
        user = self.request.user

        # If user is a MEMBER in any workspace, block creation
        is_member = WorkspaceMember.objects.filter(
          user=user,
          role="member"
        ).exists()

        if is_member:
         raise PermissionDenied("Members cannot create new workspaces.")

    # Otherwise allow creation (user becomes Owner)
        workspace = serializer.save(created_by=self.request.user)
        WorkspaceMember.objects.create(
            user=self.request.user,
            workspace=workspace,
            role="Owner",
        )

class WorkspaceMemberViewSet(viewsets.ModelViewSet):
    
    @action(detail=False, methods=['get'])
    def list_members(self, request, workspace_id=None):
        members = WorkspaceMember.objects.filter(
            workspace_id=workspace_id
        ).select_related('user')
     
        serializer = WorkspaceMemberDetailSerializer(members, many=True)
        return Response(serializer.data)
    
    def destroy(self, request, workspace_id=None, pk=None):
        member = self.get_object()

        if member.role == 'owner':
            return Response(
                {'error': 'Cannot remove workspace owner'},
                status=status.HTTP_403_FORBIDDEN,
            )
        actor = request.user
        removed_user = member.user
        workspace = member.workspace
        # Delete the member
        member.delete()
            
        # Log activity
        ActivityLogger.member_removed(actor, workspace, removed_user)
        
        return Response(status=status.HTTP_204_NO_CONTENT)



class InvitationViewSet(viewsets.ModelViewSet):
    serializer_class = InvitationSerializer

    def get_queryset(self):
        workspace_id = self.kwargs['workspace_id']
        return Invitation.objects.filter(workspace_id=workspace_id)

    def perform_create(self, serializer):
        workspace_id = self.kwargs['workspace_id']
        serializer.save(
            workspace_id=workspace_id,
            invited_by=self.request.user,
        )


class InvitationListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return InviteMemberSerializer
        return InvitationListSerializer

    def get_queryset(self):
        return Invitation.objects.filter(
            workspace_id=self.kwargs['workspace_id'],
            accepted=False,
        )

    def create(self, request, *args, **kwargs):
        workspace = Workspace.objects.get(id=self.kwargs['workspace_id'])

        # Permission check
        membership = WorkspaceMember.objects.filter(
            workspace=workspace,
            user=request.user,
            role__in=["Owner", "Admin"],
        ).first()

        if not membership:
            return Response(
                {'error': 'You do not have permission to invite members.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(
            data=request.data,
            context={'workspace': workspace},
        )
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data

        invitation = Invitation.objects.create(
            workspace=workspace,
            email=data['email'],
            role=data.get('role', 'Member'),
            invited_by=request.user,
            project_ids=data.get('project_ids', []),
            task_ids=data.get('task_ids', []),
        )

        return Response(
            InvitationListSerializer(invitation).data,
            status=status.HTTP_201_CREATED,
        )
    
    

class ProjectViewSet(ModelViewSet):
    permission_classes = [IsWorkspaceOwner]


 