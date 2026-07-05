from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from .models import Activity
from .serializers import ActivitySerializer
from workspaces.models import Workspace
from datetime import timedelta
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from activities.models import Activity
from rest_framework.decorators import action


class ActivityViewSet(ModelViewSet):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # User sees only activities in workspaces they belong to
        return Activity.objects.filter(
            workspace__memberships__user=self.request.user
        ).distinct()

    def perform_create(self, serializer):
        workspace_id = self.request.data.get("workspace_id")
        if not workspace_id:
            raise PermissionDenied("workspace_id is required")

        workspace = Workspace.objects.get(id=workspace_id)

        if not workspace.memberships.filter(user=self.request.user).exists():
            
            raise PermissionDenied("Not allowed")
        
       

        serializer.save(
            workspace=workspace,
            user=self.request.user
        )


    @action(detail=False, methods=["get"], url_path="debug")
    def debug(self, request):
        rows = Activity.objects.all().order_by("-created_at").values()
        return Response(list(rows))
            
   

class ActivityCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, workspace_pk):
        workspace = Workspace.objects.get(pk=workspace_pk)

        Activity.objects.create(
            workspace=workspace,
            user=request.user,
            activity_type=request.data.get("activity_type"),
            action=request.data.get("action"),
            message=request.data.get("message", ""),
        )

        return Response({"status": "ok"})


class CurrentActivityView(APIView):
    permission_classes = [IsAuthenticated]

    # In your CurrentActivityView
    def get(self, request, workspace_pk):

        try:
            events = Activity.objects.filter(
                workspace_id=workspace_pk,
                created_at__gte=timezone.now() - timezone.timedelta(days=2)
            )
            serializer = ActivitySerializer(events, many=True)
            print("🔥 ACTIVITY RESPONSE:", serializer.data)
            return Response(serializer.data)
        except Exception as e:
            import traceback
            print("🔥 BACKEND ERROR:", e)
            traceback.print_exc()
            raise

 
    
class WeeklyActivitySummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, workspace_pk):
        since = timezone.now() - timedelta(days=7)

        events = (
            Activity.objects
            .filter(workspace_id=workspace_pk, created_at__gte=since)
            .select_related("user")
        )

        workspace = Workspace.objects.get(id=workspace_pk)

        # FIX: use the correct relation name
        members = workspace.memberships.select_related("user")

        summary = []

        for member in members:
            user_events = events.filter(user_id=member.user_id)

            summary.append({
                "memberId": member.id,
                "memberName": member.user.full_name,
                "tasksCompleted": user_events.filter(
                    activity_type="TASK_UPDATED",
                    action="completed"
                ).count(),
                "tasksAssigned": user_events.filter(
                    activity_type="TASK_CREATED"
                ).count(),
                "comments": user_events.filter(
                    action="commented"
                ).count(),
                "statusChanges": user_events.filter(
                    activity_type="TASK_UPDATED",
                    action="status_changed"
                ).count(),
            })

        return Response(summary)

class FullActivityFeedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, workspace_id):
        activities = Activity.objects.filter(
            workspace=workspace_id
        ).order_by('-created_at')

        serializer = ActivitySerializer(activities, many=True)
        return Response(serializer.data)
   


   



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