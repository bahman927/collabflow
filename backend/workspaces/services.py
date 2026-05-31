# workspaces/services.py

from .models import Workspace, WorkspaceMember

def create_workspace_for_user(user, workspace_name):
    workspace = Workspace.objects.create(
        name=workspace_name,
        created_by=user
    )

    WorkspaceMember.objects.create(
        user=user,
        workspace=workspace,
        role="Owner"
    )

    return workspace