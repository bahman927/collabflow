
from rest_framework.permissions import BasePermission


class IsWorkspaceAdminOrOwner(BasePermission):
    """
    Allows access only to workspace admins or owners.
    """

    def has_permission(self, request, view):
        workspace_id = view.kwargs.get('workspace_id')
        if not workspace_id:
            return False

        # Import here to avoid circular imports
        from workspaces.models import WorkspaceMember

        try:
            member = WorkspaceMember.objects.get(
                workspace_id=workspace_id,
                user=request.user,
            )
            return member.role in ('Owner')
        except WorkspaceMember.DoesNotExist:
            return False
