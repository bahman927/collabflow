from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Activity
from .serializers import ActivitySerializer


class ActivityViewSet(ReadOnlyModelViewSet):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Activity.objects
            .filter(workspace__memberships__user=self.request.user)
            .select_related("user", "workspace")
            .order_by("-created_at")
        )
    



#     🔹 ReadOnlyModelViewSet

# Allows only:

# GET /activities/

# GET /activities/{id}/

# No POST / PUT / DELETE.

# 🔹 Queryset Filtering
# workspace__memberships__user=self.request.user

# Ensures:

    # Multi-tenant isolation

    # Users cannot see activities from other workspaces

    # 🔹 select_related
    # .select_related("user", "workspace")

    # Prevents N+1 queries.

    # Production-level optimization.

# 🚀 Final Endpoints

# With router:

# router.register("activities", ActivityViewSet, basename="activities")

# You now have:

# GET /api/activities/
# GET /api/activities/5/

# 🔥 Example Response
# {
#   "id": 12,
#   "workspace": 3,
#   "workspace_name": "Marketing",
#   "user": 4,
#   "user_email": "bahman@email.com",
#   "activity_type": "PROJECT_CREATED",
#   "message": "Project 'Website Redesign' was created.",
#   "created_at": "2026-02-21T12:40:00Z"
# }

# Perfect for your React activity feed.

# 🧠 Optional Upgrade (Recommended)

# If you want to filter by workspace:

# /api/activities/?workspace=3

# We can easily add that.

# 🏗 Current Architecture Status

# You now have:

# Users → JWT

# Workspaces → Role-based security

# Projects → Permission control

# Tasks → Permission control

# Activities → Auto-logged feed

# Multi-tenant filtering

# Query optimization

# You’re building a serious SaaS backend now 👌