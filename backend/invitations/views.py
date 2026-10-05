# invitations/views.py

import secrets

from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import  IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.db import transaction

from invitations.services import send_invitation_email
from invitations.models import Invitation
from .serializers import InvitationSerializer
from users.serializers import UserSerializer

from workspaces.models import Workspace, WorkspaceMember


from activities.utils import log_activity
from django.conf import settings

User = get_user_model()

class InvitationViewSet(viewsets.ViewSet):
  parser_classes = [MultiPartParser, FormParser, JSONParser]

  def list(self, request, workspace_id=None):

      

        invitations = Invitation.objects.filter(
            workspace_id=workspace_id,
            invited_by=request.user
        )


        serializer = InvitationSerializer(
            invitations,
            many=True
        )


        return Response(serializer.data)
  
    # -----------------------------------
    # Owner sends invitation
    # -----------------------------------
  @action(
    detail=False,
    methods=["post"],
    url_path="send"
  )
  def send_invite(self, request):

    email = request.data.get("email")
    workspace_id = request.data.get("workspace_id")
    role = request.data.get("role")

   

    # ----------------------------------
    # 1. Validate email and role
    # ----------------------------------

    if not email:
        return Response(
            {"error": "Email is required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    role = request.data.get("role")

    if role not in ["member", "viewer"]:
        return Response(
            {"error": "Role must be Member or Viewer."},
            status=status.HTTP_400_BAD_REQUEST
        )

    email = email.strip().lower()

    # ----------------------------------
    # 2. Get workspace
    # ----------------------------------

    workspace = Workspace.objects.get(
        id=workspace_id
    )

    # ----------------------------------
    # 3. Check if already a member
    # ----------------------------------

    already_member = WorkspaceMember.objects.filter(
        workspace=workspace,
        user__email__iexact=email,
    ).exists()

    if already_member:
        return Response(
            {
                "error":
                "This user is already a member of this workspace."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # ----------------------------------
    # 4. Check existing invitation
    # ----------------------------------

    existing = Invitation.objects.filter(
        workspace=workspace,
        email=email,
        status="pending",
    ).first()

    if existing:
        return Response(
            {
                "error":
                "A pending invitation has already been sent to this email."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    ## --------------------------------------
    #    Resend invitation
    #  --------------------------------------    



    token = secrets.token_hex(32)

    # ----------------------------------
    # 6. Create invitation
    # ----------------------------------

    invitation = Invitation.objects.create(
    email=email,
    workspace=workspace,
    invited_by=request.user,
    token=token,
    status="pending",
    role=role,
    )

    # ----------------------------------
    # 7. Send ONE email
    # ----------------------------------

    send_invitation_email(invitation)

    # ----------------------------------
    # 8. Log activity
    # ----------------------------------

    log_activity(
    workspace,
    request.user,
    f"Sent invitation to {email}"
    )

    # ----------------------------------
    # 9. Return
    # ----------------------------------

    return Response(
        InvitationSerializer(invitation).data,
        status=status.HTTP_201_CREATED
    )

  @action(detail=True, methods=["post"], url_path="resend")
  def resend(self, request, pk=None):

        invitation = get_object_or_404(
            Invitation,
            pk=pk
        )

        if invitation.status != "pending":
            return Response(
                {"error": "Only pending invitations can be resent."},
                status=status.HTTP_400_BAD_REQUEST
            )

        send_invitation_email(invitation)

        return Response(
            {"message": "Invitation resent successfully."},
            status=status.HTTP_200_OK
        )

    # -----------------------------------
    # Validate invitation token
    # No database changes
    # -----------------------------------

  @action(
        detail=False,
        methods=["get"],
        url_path=r"validate/(?P<token>[^/.]+)"
    )
  def validate(self, request, token):
        # print("VALIDATION TOKEN RECEIVED:", token)

        try:
            invitation = Invitation.objects.get(
                token=token
            )

        except Invitation.DoesNotExist:

            # print("NO INVITATION FOUND FOR TOKEN:", token)

            return Response(
                {
                    "error": "Invalid token invitation - checked by validate()"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # print("INVITATION FOUND:", invitation.id)
        # print("INVITATION TOKEN:", invitation.token)
        # print("INVITATION STATUS:", invitation.status)


        if invitation.status != "pending":

            return Response(
                {
                    "error":
                    "Invitation already processed"
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        return Response(
            {
                "valid": True,

                "email": invitation.email,

                "workspace": {
                    "id": invitation.workspace.id,
                    "name": invitation.workspace.name,
                },

                "role": invitation.role,

                "invited_by":
                    invitation.invited_by.full_name
            }
        )



    # -----------------------------------
    # Accept invitation
    # User MUST be authenticated
    # -----------------------------------

  @action(
        detail=False,
        methods=["post"],
        url_path="accept",
        permission_classes=[IsAuthenticated],
    )
  def accept(self, request):

    # -----------------------------------
    # 1. Get invitation token
    # -----------------------------------

    token = request.data.get("token")

    if not token:
        return Response(
            {"error": "Token is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # -----------------------------------
    # 2. Find invitation
    # -----------------------------------

    try:
        invitation = Invitation.objects.get(
            token=token
        )

    except Invitation.DoesNotExist:
        return Response(
            {"error": "Invalid invitation token."},
            status=status.HTTP_404_NOT_FOUND
        )

    # -----------------------------------
    # 3. Invitation must still be pending
    # -----------------------------------

    if invitation.status != "pending":
        return Response(
            {"error": "Invitation already processed."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # -----------------------------------
    # 4. Get signup information
    # -----------------------------------

    user = request.user

    # full_name = request.data.get("full_name")
    # password = request.data.get("password")
    # avatar = request.FILES.get("avatar")

    # if not full_name:
    #     return Response(
    #         {"error": "Full name is required."},
    #         status=status.HTTP_400_BAD_REQUEST
    #     )

    # if not password:
    #     return Response(
    #         {"error": "Password is required."},
    #         status=status.HTTP_400_BAD_REQUEST
    #     )

    # -----------------------------------
    # 5. The email comes from invitation
    # -----------------------------------
    if user.email.lower() != invitation.email.lower():
        return Response(
            {
                "error":
                "This invitation belongs to a different email address."
            },
            status=status.HTTP_403_FORBIDDEN,
        )


    # email = invitation.email

    # -----------------------------------
    # 6. Make sure a User doesn't already
    #    exist for this invitation
    # -----------------------------------

    if WorkspaceMember.objects.filter(
        workspace=invitation.workspace,
        user=user,
    ).exists():

        return Response(
            {
                "error":
                "You are already a member of this workspace."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


    # if User.objects.filter(
    #     email__iexact=email
    # ).exists():

    #     return Response(
    #         {
    #             "error":
    #             "An account already exists for this email. "
    #             "Please log in and accept the invitation."
    #         },
    #         status=status.HTTP_400_BAD_REQUEST
    #     )

    # -----------------------------------
    # 7. Create User + membership +
    #    accept invitation atomically
    # -----------------------------------

    with transaction.atomic():

        membership = WorkspaceMember.objects.create(
            workspace=invitation.workspace,
            user=user,
            role=invitation.role,
        )

        invitation.status = "accepted"

        invitation.save(
            update_fields=["status"]
        )


    # -----------------------------------
    # 8. Log activity
    # -----------------------------------

    log_activity(
        invitation.workspace,
        user,
        f"{user.full_name} accepted invitation"
    )

    # -----------------------------------
    # 9. Return response
    # -----------------------------------

    return Response(
        {
            "message": "Account created and invitation accepted.",

            "user": UserSerializer(user).data,

            "workspace": {
                "id": invitation.workspace.id,
                "name": invitation.workspace.name,
                "created_at": invitation.workspace.created_at,
                "currentUserRole": membership.role,
            },

            "membership": {
                "id": membership.id,
                "role": membership.role,
            },
        },
        status=status.HTTP_201_CREATED
    )


 

    # -----------------------------------
    # Deny invitation
    # -----------------------------------

  @action(
        detail=False,
        methods=["post"],
        url_path="deny"
    )
  def deny(self, request):

        token = request.data.get("token")


        if not token:

            return Response(
                {
                    "error":
                    "Token is required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )



        try:

            invitation = Invitation.objects.get(
                token=token
            )


        except Invitation.DoesNotExist:

            return Response(
                {
                    "error":
                    "Invalid token invitation deny"
                },
                status=status.HTTP_404_NOT_FOUND
            )



        if invitation.status != "pending":

            return Response(
                {
                    "error":
                    "Invitation already processed"
                },
                status=status.HTTP_400_BAD_REQUEST
            )



        invitation.status = "denied"

        invitation.save()



        log_activity(
            invitation.workspace,
            None,
            f"{invitation.email} denied invitation"
        )


        return Response(
            {
                "message":
                "Invitation denied"
            }
        )



    # -----------------------------------
    # Owner views sent invitations
    # -----------------------------------


#   def list(self, request):

#         invitations = Invitation.objects.filter(
#             invited_by=request.user
#         )
#         print("INVITATIONS QUERYSET:", invitations)

#         for invitation in invitations:
#             print(
#                 "INVITATION:",
#                 invitation.id,
#                 invitation.email,
#                 invitation.status
#             )

#         serializer = InvitationSerializer(
#             invitations,
#             many=True
#         )

#         print("response invitations : ", serializer.data)
#         return Response(
#             serializer.data
#         )



 