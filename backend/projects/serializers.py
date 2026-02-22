from rest_framework import serializers
from .models import Project
from tasks.models import Task
from tasks.serializers import TaskSerializer

class ProjectSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)  # nested tasks

    class Meta:
        model = Project
        fields = ["id", "name", "description", "owner", "created_at", "updated_at", "tasks"]


 
