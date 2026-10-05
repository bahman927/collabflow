from django.core.mail import send_mail
from activities.models import Activity
from django.shortcuts import get_object_or_404
from .models import Workspace
from .serializers import WorkspaceSerializer
from tasks.serializers import TaskSerializer
from workspaces.models import WorkspaceMember
from projects.models import Project, ProjectMember
from tasks.models import Task, TaskAssignee
from rest_framework import viewsets
from django.utils.crypto import get_random_string
from memberships.serializers import MemberSerializer
# from .emails import send_invitation_email
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework import generics, status
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from invitations.models import Invitation  
from .serializers import InvitationSerializer, WorkspaceMemberDetailSerializer
from rest_framework.viewsets import ModelViewSet
from .permissions import IsWorkspaceOwner
from workspaces.activity.logger import ActivityLogger
from .models import Workspace, WorkspaceMember
from users.models   import User
from invitations.services import send_invitation_email
from memberships.serializers import UpdateMemberSerializer
from .serializers import (
    WorkspaceSerializer,
    WorkspaceMemberSerializer,
    InviteMemberSerializer,
    InvitationListSerializer,
)


class WorkspaceViewSet(ModelViewSet):
    serializer_class = WorkspaceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
       

        return Workspace.objects.filter(   
            memberships__user=user
        ).distinct()

    def perform_create(self, serializer):
        user = self.request.user

        # If user is a MEMBER in any workspace, block creation
        is_member = WorkspaceMember.objects.filter(
          user=user,
          role="Member"
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



    @action(
        detail=True,
        methods=["get"],
        url_path="tasks"
    )
    def tasks(self, request, pk=None):
        
        workspace = self.get_object()


       
        tasks = Task.objects.filter(
            project__workspace=workspace
        )

       
        serializer = TaskSerializer(
            tasks,
            many=True
        )

        return Response(serializer.data)
    


    @action(detail=True, methods=["post"])
    def invite(self, request, pk=None):
        workspace = self.get_object()

        email = request.data.get("email", "").strip().lower()
        role = request.data.get("role", "").strip().lower()

        # 1. Validate email
        if not email:
            return Response(
                {"error": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if "@" not in email:
            return Response(
                {"error": "Invalid email"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 2. Validate role
        if role not in ["member", "viewer"]:
            return Response(
                {"error": "Role must be either member or viewer."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 3. Do not allow an existing CollabFlow user to be invited
        if User.objects.filter(email__iexact=email).exists():
            return Response(
                {
                    "error": (
                        "This email already belongs to a CollabFlow account."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 4. Do not allow another pending invitation
        pending_invitation = Invitation.objects.filter(
            workspace=workspace,
            email__iexact=email,
            status="pending",
        ).exists()

        if pending_invitation:
            return Response(
                {
                    "error": (
                        "A pending invitation already exists "
                        "for this email."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 5. Create invitation
        token = get_random_string(32)

        invitation = Invitation.objects.create(
            email=email,
            workspace=workspace,
            invited_by=request.user,
            token=token,
            status="pending",
            role=role,
        )

        # 6. Send invitation email
        send_invitation_email(invitation)

        # 7. Build acceptance URL
        accept_url = f"http://localhost:5173/invite/{token}"
        print("accept_url =", accept_url)

        # 8. Log activity
        ActivityLogger.member_invited(
            request.user,
            workspace,
            email,
        )

        # 9. Return response
        return Response(
            {
                "message": "Invitation sent",
                "token": token,
                "role": role,
            },
            status=status.HTTP_200_OK,
        )


    @action(
        detail=True,
        methods=["get"],
        url_path="invitations"
    )
    def invitations(self, request, pk=None):

        workspace = self.get_object()


        # print("🔥 WORKSPACE:", workspace.id, workspace.name)

        invitations = Invitation.objects.filter(
            workspace=workspace,
            status="pending"
        )
 

        serializer = InvitationListSerializer(
            invitations,
            many=True
        )

        
        return Response(serializer.data)

    @action(
    detail=True,
    methods=["get"]
)
    def members(self, request, pk=None):

        workspace = self.get_object()

        members = WorkspaceMember.objects.filter(
            workspace=workspace
        )

        serializer = MemberSerializer(
            members,
            many=True
        )

        return Response(serializer.data)    

    
    @action(
    detail=True,
    methods=["get"],
    url_path="members/me",
    )
    def current_member(self, request, pk=None):
        workspace = self.get_object()

        membership = WorkspaceMember.objects.filter(
            workspace=workspace,
            user=request.user,
        ).first()

        if not membership:
            return Response(
                {"detail": "Not a member of this workspace."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = WorkspaceMemberSerializer(membership)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


    @action(
    detail=True,
    methods=["patch", "delete"],
    url_path=r"members/(?P<member_id>\d+)"
    )
    def member_detail(self, request, pk=None, member_id=None):

        workspace = self.get_object()

        member = get_object_or_404(
            WorkspaceMember,
            id=member_id,
            workspace=workspace,
        )

        # -------------------------
        # PATCH — update member
        # -------------------------

        if request.method == "PATCH":

            if member.role == "owner":
                return Response(
                    {"error": "Cannot modify workspace owner"},
                    status=status.HTTP_403_FORBIDDEN,
                )

            serializer = UpdateMemberSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # Remember the values before changing them
            old_role = member.role
            old_status = member.is_active

            # Apply the requested changes
            if "role" in serializer.validated_data:
                member.role = serializer.validated_data["role"]

            if "isActive" in serializer.validated_data:
                member.is_active = serializer.validated_data["isActive"]

            member.save()

            # ---------------------------------
            # Log role change
            # ---------------------------------
            if old_role != member.role:
                ActivityLogger.member_role_changed(
                    actor=request.user,
                    workspace=workspace,
                    target_user=member.user,
                    old_role=old_role,
                    new_role=member.role,
                )

            # ---------------------------------
            # Log status change
            # ---------------------------------
            if old_status != member.is_active:
                ActivityLogger.member_status_changed(
                    actor=request.user,
                    workspace=workspace,
                    target_user=member.user,
                    new_status=member.is_active,
                )

            return Response(
                MemberSerializer(member).data,
                status=status.HTTP_200_OK,
    )

 
        # -------------------------
        # DELETE — remove member
        # -------------------------
        if request.method == "DELETE":

            if member.role == "owner":
                return Response(
                    {"error": "Cannot remove workspace owner"},
                    status=status.HTTP_403_FORBIDDEN,
                )

            removed_user = member.user

            ActivityLogger.member_removed(
                actor=request.user,
                workspace=workspace,
                removed_user=removed_user,
            )

            member.delete()

            return Response(
                status=status.HTTP_204_NO_CONTENT
            )
        
#     @action(
#     detail=True,
#     methods=["get"],
#     url_path="members/me"
# )
#     def my_membership(self, request, pk=None):

#         workspace = self.get_object()

#         membership = WorkspaceMember.objects.get(
#             workspace=workspace,
#             user=request.user
#         )

#         serializer = MemberSerializer(membership)

#         return Response(serializer.data)
        
   

class WorkspaceMemberViewSet(viewsets.ModelViewSet):
    serializer_class = WorkspaceMemberSerializer

    @action(detail=False, methods=["get"])
    def list_members(self, request, workspace_id=None):

        members = WorkspaceMember.objects.filter(
            workspace_id=workspace_id
        ).select_related("user")

        serializer = WorkspaceMemberDetailSerializer(
            members,
            many=True
        )

        return Response(serializer.data)

    def destroy(self, request, workspace_id=None, pk=None):
        member = self.get_object()

        if member.role == "owner":
            return Response(
                {"error": "Cannot remove workspace owner"},
                status=status.HTTP_403_FORBIDDEN,
            )

        actor = request.user
        removed_user = member.user
        workspace = member.workspace

        member.delete()

        ActivityLogger.member_removed(
            actor,
            workspace,
            removed_user
        )

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


 