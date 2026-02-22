from rest_framework import serializers
from .models import Task

from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):

    project_name = serializers.ReadOnlyField(source="project.name")
    assigned_email = serializers.ReadOnlyField(source="assigned_to.email")

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "project",
            "project_name",
            "assigned_to",
            "assigned_email",
            "status",
            "priority",
            "due_date",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]