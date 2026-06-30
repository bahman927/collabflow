from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    ActivityViewSet,
    CurrentActivityView,
    WeeklyActivitySummaryView,
    ActivityCreateView
)

router = DefaultRouter()
router.register(r'activities', ActivityViewSet, basename='activities')

urlpatterns = [
    # Custom dashboard endpoints
    path(
        "workspaces/<int:workspace_pk>/activity/",
        ActivityCreateView.as_view(),
        name="activity-create"
    ),
    path(
        "workspaces/<int:workspace_pk>/activity/current/",
        CurrentActivityView.as_view(),
        name="activity-current"
    ),
    path(
        "workspaces/<int:workspace_pk>/activity/weekly/",
        WeeklyActivitySummaryView.as_view(),
        name="activity-weekly"
    ),
]

# Include router URLs
urlpatterns += router.urls
