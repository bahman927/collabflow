
from rest_framework.permissions import BasePermission
from workspaces.models import WorkspaceMember
from rest_framework.permissions import BasePermission
from .models import WorkspaceMember

class IsWorkspaceAdminOrOwner(BasePermission):
    """
    Allows access only to workspace owners and admins.
    """
    def has_permission(self, request, view):
        workspace_id = view.kwargs.get('workspace_id')
        try:
            member = WorkspaceMember.objects.get(
                workspace_id=workspace_id,
                user=request.user,
                is_active=True,
            )
            return member.role in ('owner', 'admin')
        except WorkspaceMember.DoesNotExist:
            return False
 

class IsWorkspaceOwner(BasePermission):
    def has_permission(self, request, view):
        workspace_id = view.kwargs.get('workspace_id')

        return WorkspaceMember.objects.filter(
            workspace_id=workspace_id,
            user=request.user,
            role='Owner'
        ).exists()
