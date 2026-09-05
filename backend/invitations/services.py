from django.core.mail import send_mail


def send_invitation_email(invitation):

    accept_url = (
        f"http://localhost:5173/invite/"
        f"{invitation.token}"
    )

    send_mail(
        subject="You are invited to join CollabFlow",

        message=(
            f"Hi,\n\n"
            f"You've been invited to join the workspace "
            f"'{invitation.workspace.name}'.\n\n"
            f"Click here to accept: {accept_url}\n\n"
            f"— {invitation.invited_by.get_full_name() or invitation.invited_by.email}"
        ),
    
        from_email=None,

        recipient_list=[
            invitation.email
        ],
    )