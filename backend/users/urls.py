# users/urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    MeView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/",    LoginView.as_view(), name="login"),
    path("refresh/",  TokenRefreshView.as_view(), name="refresh"),
    path("logout/",   LogoutView.as_view(), name="logout"),
    path("me/",       MeView.as_view(), name="me"),
]


# based on backend/urls.py

# POST   api/users/register/
# POST   api/users/login/
# POST   api/users/refresh/
# POST   api/users/logout/
# GET    api/users/me/

# /api/projects/
# /api/workspaces/
# /api/tasks/
# /api/activities/