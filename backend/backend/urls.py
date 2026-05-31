from django.contrib import admin
from django.urls import path, include
from users.views import EmailTokenObtainPairView
from django.urls import get_resolver
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("admin/", admin.site.urls),

    # 🔐 AUTH (JWT)
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    # path("api/auth/token/", EmailTokenObtainPairView.as_view(), name="token_obtain_pair"),

    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # 👤 USERS
    path("api/users/", include("users.urls")),

    # 📦 MAIN API
    path("api/", include("api.urls")),
    
    path("", include("workspaces.urls")),

   ]
for url in get_resolver().url_patterns:
        print(url.pattern)