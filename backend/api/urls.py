from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter

from projects.views import ProjectViewSet
from workspaces.views import WorkspaceViewSet
from tasks.views import TaskViewSet
from activities.views import ActivityViewSet
from memberships.views import MemberViewSet
from invitations.views import InvitationViewSet

from django.urls import path, include


# --------------------------------------------------
# Main router
# --------------------------------------------------

router = DefaultRouter()

router.register(
    "projects",
    ProjectViewSet,
    basename="projects",
)

router.register(
    "workspaces",
    WorkspaceViewSet,
    basename="workspaces",
)

router.register(
    "tasks",
    TaskViewSet,
    basename="tasks",
)

router.register(
    "activities",
    ActivityViewSet,
    basename="activities",
)

router.register(
    "invitations",
    InvitationViewSet,
    basename="invitations",
)


# --------------------------------------------------
# Nested router for workspaces
# --------------------------------------------------

workspace_router = NestedDefaultRouter(
    router,
    "workspaces",
    lookup="workspace",
)

workspace_router.register(
    "members",
    MemberViewSet,
    basename="workspace-members",
)


# --------------------------------------------------
# Nested router for workspace invitations
# --------------------------------------------------

workspace_router.register(
    "invitations",
    InvitationViewSet,
    basename="workspace-invitations",
)


# --------------------------------------------------
# URLs
# --------------------------------------------------

urlpatterns = [
    path(
        "",
        include(router.urls),
    ),

    path(
        "",
        include(workspace_router.urls),
    ),

    path(
        "",
        include("activities.urls"),
    ),

    path(
        "auth/",
        include("users.urls"),
    ),
] 



 
 