from rest_framework import serializers
from .models import WorkspaceMembership


class WorkspaceMembershipSerializer(serializers.ModelSerializer):

    user_email = serializers.ReadOnlyField(source="user.email")
    workspace_name = serializers.ReadOnlyField(source="workspace.name")

    class Meta:
        model = WorkspaceMembership
        fields = [
            "id",
            "user",
            "user_email",
            "workspace",
            "workspace_name",
            "role",
            "joined_at",
        ]
        read_only_fields = ["joined_at"]