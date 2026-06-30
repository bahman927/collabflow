from rest_framework import serializers
from .models import Activity
from django.utils.timesince import timesince

class ActivitySerializer(serializers.ModelSerializer):
    actorName = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    relativeTime = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = ["id", "workspace", "activity_type", "actorName", "description", "created_at", "relativeTime"]

    def get_actorName(self, obj):
        return obj.user.email.split("@")[0].capitalize()

        
    def get_description(self, obj):
        return obj.message      

    def get_relativeTime(self, obj):
        return timesince(obj.created_at) + " ago"


 