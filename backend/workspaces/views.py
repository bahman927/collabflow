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
from invitations.services import send_invitation_email
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
    


    @action(detail=True, methods=['post'])
    def invite(self, request, pk=None):
        workspace = self.get_object()
        email = request.data.get("email")

        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        # 1️⃣ Create token
        token = get_random_string(32)

        # 2️⃣ Create invitation record
        invitation = Invitation.objects.create(
            email=email,
            workspace=workspace,
            invited_by=request.user,
            token=token,
            status="pending",
        )
        send_invitation_email(invitation)

        # 3️⃣ Build acceptance URL
        accept_url = f"http://localhost:5173/invite/{token}"
        print("accept_url =", accept_url)

        # 4️⃣ Send email
        send_mail(
            subject="You have been invited to join a workspace",
            message=f"You have been invited to join {workspace.name}. Click here to accept: {accept_url}",
            from_email="no-reply@collabflow.com",
            recipient_list=[email],
            fail_silently=False,
        )

        from workspaces.activity.logger import ActivityLogger

        ActivityLogger.member_invited(
            request.user,
            workspace,
            email
        )
        

        # 6️⃣ Return success
        return Response(
            {"message": "Invitation sent", "token": token},
            status=status.HTTP_200_OK
        )  


    @action(
        detail=True,
        methods=["get"],
        url_path="invitations"
    )
    def invitations(self, request, pk=None):

        workspace = self.get_object()

        invitations = Invitation.objects.filter(
            workspace=workspace,
            status="pending"
        )

        serializer = InvitationSerializer(
            invitations,
            many=True
        )

        
        # print("SERIALIZER:", serializer)
        # print("DATA:", serializer.data)

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

    # @action(
    # detail=True,
    # methods=["get"]
    # )
    # def members(self, request, pk=None):

    #     workspace = self.get_object()

    #     current_member = WorkspaceMember.objects.filter(
    #         workspace=workspace,
    #         user=request.user
    #     ).first()

    #     if not current_member:
    #         return Response(
    #             {"error": "You are not a member of this workspace."},
    #             status=status.HTTP_403_FORBIDDEN
    #         )

    #     # Owner sees everyone
    #     if current_member.role.lower() == "owner":

    #         members = WorkspaceMember.objects.filter(
    #             workspace=workspace
    #         )

    #     else:

    #         # IDs of members assigned to tasks
    #         # that the logged-in user is also assigned to.
    #         related_member_ids = Task.objects.filter(
    #             workspace=workspace,
    #             assignees__member=current_member
    #         ).values_list(
    #             "assignees__member_id",
    #             flat=True
    #         )

    #         members = WorkspaceMember.objects.filter(
    #             workspace=workspace,
    #             id__in=related_member_ids
    #         )

    #         # Always include the logged-in user.
    #         members = members | WorkspaceMember.objects.filter(
    #             id=current_member.id
    #         )

    #     members = members.select_related("user").distinct()

    #     serializer = MemberSerializer(
    #         members,
    #         many=True
    #     )

    #     return Response(serializer.data)
    

    # @action(
    #     detail=True,
    #     methods=["get"]
    # )
    # def members(self, request, pk=None):

    #     workspace = self.get_object()

    #     members = WorkspaceMember.objects.filter(
    #         workspace=workspace
    #     )

    #     serializer = MemberSerializer(
    #         members,
    #         many=True
    #     )

    #     return Response(serializer.data)
   

    @action(
        detail=True,
        methods=["delete"],
        url_path=r"members/(?P<member_id>[^/.]+)"
    )
    def remove_member(self, request, pk=None, member_id=None):

        workspace = self.get_object()

        member = get_object_or_404(
            WorkspaceMember,
            id=member_id,
            workspace=workspace,
        )
        removed_user = member.user   # save before delete

        ActivityLogger.member_removed(
            actor=request.user,
            workspace=workspace,
            removed_user=removed_user
        )

        member.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(
    detail=True,
    methods=["get"],
    url_path="members/me"
)
    def my_membership(self, request, pk=None):

        workspace = self.get_object()

        membership = WorkspaceMember.objects.get(
            workspace=workspace,
            user=request.user
        )

        serializer = MemberSerializer(membership)

        return Response(serializer.data)
        
   

class WorkspaceMemberViewSet(viewsets.ModelViewSet):


#   @action(detail=False, methods=["get"])
#   def list_members(self, request, workspace_id=None):
#     print(' **** you have reached WorkspaceMemberViewSet')
#     workspace = get_object_or_404(
#         Workspace,
#         id=workspace_id
#     )

#     # Find the logged-in user's membership
#     current_member = WorkspaceMember.objects.filter(
#         workspace=workspace,
#         user=request.user
#     ).first()

#     if not current_member:
#         return Response(
#             {"error": "You are not a member of this workspace."},
#             status=status.HTTP_403_FORBIDDEN
#         )

#     # ------------------------------------------------
#     # OWNER
#     # ------------------------------------------------
#     # Owner can see every member in the workspace.
#     # ------------------------------------------------

#     if current_member.role.lower() == "owner":

#         members = WorkspaceMember.objects.filter(
#             workspace=workspace
#         ).select_related("user")

#     # ------------------------------------------------
#     # MEMBER / VIEWER
#     # ------------------------------------------------
#     # Show:
#     #   1. The logged-in user
#     #   2. Other members assigned to the same tasks
#     #      as the logged-in user
#     # ------------------------------------------------

#     else:

#         # Find tasks assigned to the logged-in member
#         user_task_ids = Task.objects.filter(
#             workspace=workspace,
#             assignees__member=current_member
#         ).values_list(
#             "id",
#             flat=True
#         )

#         # Find members assigned to those tasks
#         related_member_ids = Task.objects.filter(
#             id__in=user_task_ids
#         ).values_list(
#             "assignees__member_id",
#             flat=True
#         )

#         # Include the logged-in member as well
#         related_member_ids = list(related_member_ids)

#         if current_member.id not in related_member_ids:
#             related_member_ids.append(current_member.id)

#         members = WorkspaceMember.objects.filter(
#             workspace=workspace,
#             id__in=related_member_ids
#         ).select_related("user")

#     # ------------------------------------------------
#     # Serialize
#     # ------------------------------------------------

#     serializer = WorkspaceMemberDetailSerializer(
#         members.distinct(),
#         many=True
#     )

#     return Response(serializer.data)


    
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


 