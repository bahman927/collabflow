from rest_framework.permissions import BasePermission
from memberships.models import WorkspaceMembership


class IsWorkspaceMember(BasePermission):

    def has_object_permission(self, request, view, obj):
        workspace = obj.project.workspace

        membership = WorkspaceMembership.objects.filter(
            user=request.user,
            workspace=workspace
        ).first()

        if not membership:
            return False

        # Safe methods → everyone can read
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True

        # Owner → full access
        if membership.role == "Owner":
            return True

        # Member → no delete
        if membership.role == "Member":
            return request.method != "DELETE"

        # Viewer → read only
        return False