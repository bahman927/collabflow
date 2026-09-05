# workspaces/emails.py

# from django.core.mail import send_mail
# from django.conf import settings


# def send_invitation_email(invitation):
#     """Send an invitation email to the invited user."""
#     invite_url = f"{settings.FRONTEND_URL}/invite/{invitation.token}"

#     send_mail(
#         subject=f"You've been invited to {invitation.workspace.name}",
#         message=(
#             f"Hi,\n\n"
#             f"You've been invited to join the workspace '{invitation.workspace.name}' "
#             f"as a {invitation.role}.\n\n"
#             f"Click here to accept: {invite_url}\n\n"
#             f"— {invitation.invited_by.get_full_name() or invitation.invited_by.email}"
#         ),
#         from_email=settings.DEFAULT_FROM_EMAIL,
#         recipient_list=[invitation.email],
#         fail_silently=False,
#     )
