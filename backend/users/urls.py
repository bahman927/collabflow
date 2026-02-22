# from .views import UserListView, UserDetailView

from django.urls import path
from . import views

app_name = "users"  # must match the namespace

urlpatterns = [
    path("", views.UserListAPIView.as_view(), name="list"),
]



# urlpatterns = [
#     path("", UserListView.as_view(), name="user-list"),
#     path("<int:pk>/", UserDetailView.as_view(), name="user-detail"),
# ]
