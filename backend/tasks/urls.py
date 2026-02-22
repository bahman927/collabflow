from django.urls import path
from . import views

app_name = 'tasks'


from django.urls import path
from . import views

app_name = "tasks"

urlpatterns = [
    path("", views.TaskListCreateAPIView.as_view(), name="list"),  # GET all tasks / POST new task
    path("<int:pk>/", views.TaskRetrieveUpdateDestroyAPIView.as_view(), name="detail"),  # GET/PUT/PATCH/DELETE task
]


 