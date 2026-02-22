from rest_framework import serializers
from .models import Workspace


class WorkspaceSerializer(serializers.ModelSerializer):

    owner_email = serializers.ReadOnlyField(source="owner.email")
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Workspace
        fields = [
            "id",
            "name",
            "description",
            "owner",
            "owner_email",
            "member_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["owner", "created_at", "updated_at"]

    def get_member_count(self, obj):
        return obj.members.count()
    


#     {
#   "id": 1,
#   "name": "Marketing Team",
#   "description": "Marketing planning workspace",
#   "owner": 3,
#   "owner_email": "bahman@email.com",
#   "member_count": 5,
#   "created_at": "2026-02-21T10:00:00Z",
#   "updated_at": "2026-02-21T10:00:00Z"
# }

# User
#    ↑
# WorkspaceMembership (role)
#    ↓
# Workspace
#    ↓
# Project
#    ↓
# Task