import os

from django.conf import settings
from django.core.mail import send_mail


def send_invitation_email(invitation):
    frontend_url = os.environ.get(
        "FRONTEND_URL",
        "http://localhost:5174",
    ).rstrip("/")

    accept_url = f"{frontend_url}/invite/{invitation.token}"

    message = (
        f"Hi,\n\n"
        f"You've been invited to join the workspace "
        f"'{invitation.workspace.name}'.\n\n"
        f"Click here to accept: {accept_url}\n\n"
        f"— {invitation.invited_by.get_full_name() or invitation.invited_by.email}"
    )

    send_mail(
        subject="You are invited to join CollabFlow",
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[invitation.email],
        fail_silently=False,
    )