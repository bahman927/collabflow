
from django.contrib import admin
from .models import Invitation


@admin.register(Invitation)
class InvitationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "email",
        "workspace",
        "invited_by",
        "role",
        "status",
        "created_at",
    )

    list_filter = ("status", "role", "created_at")
    search_fields = ("email", "workspace__name")
    readonly_fields = ("token", "created_at")
