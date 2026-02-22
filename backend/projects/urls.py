from django.urls import path
from . import views

app_name = 'projects'  # namespacing is good practice

 

urlpatterns = [
    path("", views.ProjectListCreateAPIView.as_view(), name="list"),  # GET all projects / POST new project
    path("<int:pk>/", views.ProjectRetrieveUpdateDestroyAPIView.as_view(), name="detail"),  # GET/PUT/PATCH/DELETE project
]




# urlpatterns = [
#     path('', views.ProjectListView.as_view(), name='list'),
#     path('<int:pk>/', views.ProjectDetailView.as_view(), name='detail'),
#     path('create/', views.ProjectCreateView.as_view(), name='create'),
#     path('<int:pk>/update/', views.ProjectUpdateView.as_view(), name='update'),
# ]
