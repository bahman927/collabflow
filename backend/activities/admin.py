from django.contrib import admin
from .models import Activity

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ("id", "workspace", "user", "action", "message", "created_at")
    list_filter = ("workspace", "user", "activity_type", "created_at")
    search_fields = ("message", "action", "description")
    ordering = ("-created_at",)

