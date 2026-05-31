from django.urls import path, include
from rest_framework.routers import DefaultRouter
from memberships.views import MemberViewSet
from tasks.views import TaskViewSet
from workspaces.views import InvitationViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='workspace-tasks')
router.register(r'members', MemberViewSet, basename='workspace-members')
router.register(r'invitations', InvitationViewSet, basename='workspace-invitations')

urlpatterns = [
    path(
        'api/workspaces/<int:workspace_id>/',
        include(router.urls),
    ),
]

# router = DefaultRouter()
# router.register(
#     r'members',
#     MemberViewSet,
#     basename='workspace-members',
    
# )
# router.register(
#     r'invitations',
#     InvitationViewSet,
#     basename='workspace-invitations',
# )

# urlpatterns = [
#     path(
#         'api/workspaces/<int:workspace_id>/',
#         include(router.urls),
#     ),
# ]



# from rest_framework.routers import DefaultRouter
# from .views import WorkspaceViewSet

# router = DefaultRouter()
# router.register(r'workspaces', WorkspaceViewSet, basename='workspace')

# urlpatterns = router.urls
