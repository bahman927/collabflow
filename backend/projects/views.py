from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Project
from .serializers import ProjectSerializer
from .permissions import IsProjectWorkspaceMember


class ProjectViewSet(ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsProjectWorkspaceMember]

    def get_queryset(self):
        return Project.objects.filter(
            workspace__memberships__user=self.request.user
        ).distinct()

    def perform_create(self, serializer):
        workspace = serializer.validated_data["workspace"]

        membership = workspace.memberships.filter(
            user=self.request.user
        ).first()

        if not membership or membership.role == "Viewer":
            raise PermissionDenied("You cannot create project in this workspace.")

        serializer.save()



# urlpatterns = [
#     path("admin/", admin.site.urls),
#     path("", api_root),

#     path("api/users/", include("users.urls")),
#     path("api/projects/", include("projects.urls")),
#     path("api/tasks/", include("tasks.urls")),

#     path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
#     path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
# ]
