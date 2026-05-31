# workspaces/admin.py

from django.contrib import admin
from .models import Workspace, WorkspaceMember, Invitation
from tasks.models import Task


class WorkspaceMemberInline(admin.TabularInline):
    model = WorkspaceMember
    extra = 0
 
 
@admin.register(Workspace)
class WorkspaceAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'created_at')
    inlines = [WorkspaceMemberInline]


@admin.register(WorkspaceMember)
class WorkspaceMemberAdmin(admin.ModelAdmin):
    list_display = ('user', 'workspace', 'role', 'is_active',)
    list_filter = ('role', 'is_active')
    search_fields = (
        "user__email",
        "user__first_name",
        "user__last_name",
    )


@admin.register(Invitation)
class InvitationAdmin(admin.ModelAdmin):
    list_display = ('email', 'workspace', 'role', 'invited_by', 'accepted')
