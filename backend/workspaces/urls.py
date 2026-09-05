from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import WorkspaceViewSet, InvitationViewSet
from memberships.views import MemberViewSet
from tasks.views import TaskViewSet

router = DefaultRouter()

router.register(
    "workspaces",
    WorkspaceViewSet,
    basename="workspaces",
)

router.register(
    "members",
    MemberViewSet,
    basename="members",
)

router.register(
    "tasks",
    TaskViewSet,
    basename="tasks",
)

router.register(
    "invitations",
    InvitationViewSet,
    basename="invitations",
)

urlpatterns = [
    path("api/", include(router.urls)),
]