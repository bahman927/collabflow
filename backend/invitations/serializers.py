# invitations/serializers.py
from rest_framework import serializers
from .models import Invitation

class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = "__all__"
        read_only_fields = ["token", "status", "invited_by", "workspace"]
