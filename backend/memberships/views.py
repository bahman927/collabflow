from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import WorkspaceMembership
from .serializers import WorkspaceMembershipSerializer


class WorkspaceMembershipViewSet(ModelViewSet):
    serializer_class = WorkspaceMembershipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WorkspaceMembership.objects.filter(
            user=self.request.user
        )