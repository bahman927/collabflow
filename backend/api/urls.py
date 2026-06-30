 
from rest_framework.routers import DefaultRouter
from projects.views   import ProjectViewSet
from workspaces.views import WorkspaceViewSet
from tasks.views      import TaskViewSet
from activities.views import ActivityViewSet
from django.urls      import path

router = DefaultRouter()

router.register("projects",   ProjectViewSet,   basename="projects")
router.register("workspaces", WorkspaceViewSet, basename="workspaces")
router.register("tasks",      TaskViewSet,      basename="tasks")
router.register("activities", ActivityViewSet,  basename="activities")
 

urlpatterns = router.urls 

    


 

# Final API structure result from above urlpatterns are:
# /api/projects/
# /api/workspaces/
# /api/tasks/
# /api/activities/

 
# Why JWT Should NOT Be In Router

# Routers are for:

   # CRUD operations

   # ModelViewSet

   # ReadOnlyModelViewSet

# JWT is:

    # Authentication endpoint

    # Not tied to a model

    # Not CRUD

    # No queryset

# So it does not belong to router.

# 🧠 Mental Model

# Router	          path()
#----------------------------------
# ViewSets      	APIViews
# CRUD models   	Auth / custom logic
# Resources 	    Actions
















# from django.contrib import admin
# from django.urls import path, include
# from .views import api_root

# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,
#     TokenRefreshView,
# )

# urlpatterns = [
#     path("admin/", admin.site.urls),
#     path("", api_root),
#     path("api/users/", include("users.urls")),
#     path("api/projects/", include("projects.urls")),
#     path("api/tasks/", include("tasks.urls")),

#     path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
#     path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
# ]
