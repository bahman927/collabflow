from .models import WorkspaceMembership

def get_membership(user, workspace):
    return WorkspaceMembership.objects.filter(
        user=user,
        workspace=workspace
    ).first()