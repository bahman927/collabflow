from rest_framework.permissions import BasePermission
from memberships.models import WorkspaceMembership


class IsProjectWorkspaceMember(BasePermission):

    def has_object_permission(self, request, view, obj):
        workspace = obj.workspace

        membership = WorkspaceMembership.objects.filter(
            user=request.user,
            workspace=workspace
        ).first()

        if not membership:
            return False

        # Everyone can read
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True

        if membership.role == "Owner":
            return True

        if membership.role == "Member":
            return request.method != "DELETE"

        return False