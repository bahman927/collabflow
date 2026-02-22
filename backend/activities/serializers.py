from rest_framework import serializers
from .models import Activity


class ActivitySerializer(serializers.ModelSerializer):

    user_email = serializers.ReadOnlyField(source="user.email")
    workspace_name = serializers.ReadOnlyField(source="workspace.name")

    class Meta:
        model = Activity
        fields = [
            "id",
            "workspace",
            "workspace_name",
            "user",
            "user_email",
            "activity_type",
            "message",
            "created_at",
        ]
        read_only_fields = ["created_at"]