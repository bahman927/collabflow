from rest_framework.permissions import BasePermission
from workspaces.models import WorkspaceMember
from projects.models  import Project

class IsWorkspaceMember(BasePermission):

    def has_object_permission(self, request, view, obj):
        workspace = obj.project.workspace

        membership = WorkspaceMember.objects.filter(
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
    
# class IsTaskCreator(BasePermission):
#     def has_permission(self, request, view):
#         project_id = request.data.get("project")

#         if not project_id:
#             return False

#         try:
#             project = Project.objects.get(id=project_id)
#         except Project.DoesNotExist:
#             return False

#         return WorkspaceMember.objects.filter(
#             workspace=project.workspace,
#             user=request.user,
#              role__in=["Owner", "Member"]
#         ).exists()

    
# class CanUpdateTask(BasePermission):
#     def has_object_permission(self, request, view, task):
#         return (
#             task.assigned_to == request.user or
#             task.workspace.owner == request.user
#         )
   
