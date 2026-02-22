from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Workspace
from .serializers import WorkspaceSerializer
from memberships.models import WorkspaceMembership


class WorkspaceViewSet(ModelViewSet):
    serializer_class = WorkspaceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Workspace.objects.filter(
            memberships__user=self.request.user
        ).distinct()

    def perform_create(self, serializer):
        workspace = serializer.save(owner=self.request.user)

        # create owner membership automatically
        WorkspaceMembership.objects.create(
            user=self.request.user,
            workspace=workspace,
            role="Owner"
        )