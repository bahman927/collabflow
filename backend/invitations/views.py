# invitations/views.py

import secrets

from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from django.core.mail import send_mail
from invitations.services import send_invitation_email
from invitations.models import Invitation
from .serializers import InvitationSerializer

from workspaces.models import Workspace, WorkspaceMember

from activities.utils import log_activity
from django.conf import settings

class InvitationViewSet(viewsets.ViewSet):


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

    # ----------------------------------
    # 1. Validate email
    # ----------------------------------

    if not email:
        return Response(
            {"error": "Email is required"},
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

    # ----------------------------------
    # 5. Create token
    # ----------------------------------

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
        print("VALIDATION TOKEN RECEIVED:", token)

        try:
            invitation = Invitation.objects.get(
                token=token
            )

        except Invitation.DoesNotExist:

            print("NO INVITATION FOUND FOR TOKEN:", token)

            return Response(
                {
                    "error": "Invalid token invitation - checked by validate()"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        print("INVITATION FOUND:", invitation.id)
        print("INVITATION TOKEN:", invitation.token)
        print("INVITATION STATUS:", invitation.status)


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
        permission_classes=[IsAuthenticated]
    )
  def accept(self, request):
        # print("invitatatons.views -> ENTERED ACCEPT VIEW")
        # print("Authenticated user:", request.user)
        # print("Authenticated:", request.user.is_authenticated)

        token = request.data.get("token")


        if not token:

            return Response(
                {
                    "error": "Token is required"
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
                    "Invalid token invitation accept"
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



        # Security check
        # Logged user must match invitation email
        email = request.user.email

        # print("invitation.email: ", invitation.email )  
        # print("logged in email: ", email ) 
        # print("request.user:", request.user)
        # print("request.user.id:", request.user.id)
        # print("request.user.is_authenticated:", request.user.is_authenticated)
        # print("request.user.email:", request.user.email) 

        if not email:
            return Response(
                {"error": "Authenticated user has no email"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        

        # invitation = get_object_or_404(
        #     Invitation,
        #     token=token,
        # )
     

        if email.lower() != invitation.email.lower():
         return Response(
           {"error": "This invitation belongs to another email"},
            status=403
        )
             

        membership, created = (
            WorkspaceMember.objects.get_or_create(

                workspace=invitation.workspace,

                user=request.user,

                defaults={
                    "role": invitation.role
                }
            )
        )
        print("Membership:", membership, created)

        invitation.status = "accepted"

        invitation.save(
            update_fields=[
                "status"
            ]
        )



        log_activity(
            invitation.workspace,

            request.user,

            (
                f"{request.user.full_name} "
                f"accepted invitation"
            )
        )


        return Response(

            {
                "message":
                    "Invitation accepted successfully",

                "workspace": {

                    "id":
                    invitation.workspace.id,

                    "name":
                    invitation.workspace.name,

                    "created_at":
                    invitation.workspace.created_at,

                    "currentUserRole":
                    membership.role
                },
                "membership": {
                    "id": membership.id,
                    "role": membership.role,

                }
            },

            status=status.HTTP_200_OK
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

  def list(self, request):

        invitations = Invitation.objects.filter(
            invited_by=request.user
        )


        serializer = InvitationSerializer(
            invitations,
            many=True
        )


        return Response(
            serializer.data
        )




# # invitations/views.py
# import secrets
# from rest_framework import status, viewsets
# from rest_framework.response import Response
# from django.core.mail import send_mail
# from invitations.models import Invitation
# from .serializers import InvitationSerializer
# from workspaces.models import Workspace, WorkspaceMember
# from activities.utils import log_activity
# from django.contrib.auth import get_user_model

# from rest_framework.decorators import action
# User = get_user_model()

# class InvitationViewSet(viewsets.ViewSet):

#     def send_invite(self, request):
#         email = request.data["email"]
#         workspace_id = request.data["workspace_id"]
#         workspace = Workspace.objects.get(id=workspace_id)

#         token = secrets.token_hex(32)

#         invitation = Invitation.objects.create(
#             email=email,
#             workspace=workspace,
#             invited_by=request.user,
#             token=token
#         )

#         # Send email
#         invite_link = f"https://collabflow.com/invite/{token}"
#         send_mail(
#             subject="Invitation to Join CollabFlow Workspace",
#             message=f"You have been invited to join {workspace.name}. Click to accept: {invite_link}",
#             from_email="no-reply@collabflow.com",
#             recipient_list=[email],
#         )

#         log_activity(
#             workspace,
#             request.user,
#             f"Sent invitation to {email}"
#         )

#         return Response(InvitationSerializer(invitation).data, status=status.HTTP_201_CREATED)
    
    
   


# class InvitationViewSet(viewsets.ViewSet):

#     @action(
#         detail=False,
#         methods=["post"],
#         url_path="accept"
#     )
#     def accept(self, request):

#         token = request.data.get("token")

#         invitation = Invitation.objects.get(
#             token=token
#         )

#         if invitation.status != "pending":
#             return Response(
#                 {"error": "Invitation already processed"},
#                 status=400
#             )
        
#         user, created = User.objects.get_or_create(
#             email=invitation.email,
#             defaults={
#                 "first_name": "",
#                 "last_name": "",
#             }
#         )

#         membership, created = WorkspaceMember.objects.get_or_create(
#             workspace=invitation.workspace,
#             user=user,
#             defaults={
#                 "role": invitation.role
#             }
#         )

#         invitation.status = "accepted"
#         invitation.save()

#         return Response({
#             "message": "Invitation accepted",
#             "workspace": {
#                 "id": invitation.workspace.id,
#                 "name": invitation.workspace.name,
#                 "created_at": invitation.workspace.created_at,
#                 "currentUserRole": membership.role
#             }
#         })
    
#     @action(
#         detail=False,
#         methods=["post"],
#         url_path="deny"
#     )

#     def deny(self, request):

#         token = request.data.get("token")

#         if not token:
#             return Response(
#                 {"error": "Token is required"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         try:
#             invitation = Invitation.objects.get(
#                 token=token
#             )
#         except Invitation.DoesNotExist:
#             return Response(
#                 {"error": "Invalid invitation"},
#                 status=status.HTTP_404_NOT_FOUND
#             )

#         if invitation.status != "pending":
#             return Response(
#                 {"error": "Invitation already processed"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         invitation.status = "denied"
#         invitation.save()

#         log_activity(
#             invitation.workspace,
#             None,
#             f"{invitation.email} denied the invitation"
#         )

#         return Response({
#             "message": "Invitation denied"
#         })

     
#     def list(self, request):
#         invitations = Invitation.objects.filter(
#             invited_by=request.user
#         )

#         serializer = InvitationSerializer(
#             invitations,
#             many=True
#         )

#         return Response(serializer.data)
