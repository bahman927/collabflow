from rest_framework.viewsets import ModelViewSet
from projects.models import Project
from projects.serializers import ProjectSerializer

class ProjectViewSet(ModelViewSet):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        queryset = Project.objects.all()
        workspace_id = self.request.query_params.get("workspace")

        if workspace_id:
            queryset = queryset.filter(workspace_id=workspace_id)

        return queryset