from rest_framework import serializers
from .models import Invitation


class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = [
            "id",
            "email",
            "workspace",
            "invited_by",
            "role",
            "status",
            "token",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "workspace",
            "invited_by",
            "status",
            "token",
            "created_at",
        ]