from django.contrib import admin
from .models import Task, TaskAssignee
from workspaces.models import WorkspaceMember

class TaskAssigneeInline(admin.TabularInline):
    model = TaskAssignee
    extra = 0
    autocomplete_fields = ["member"]
    readonly_fields = ["assigned_at"]

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "workspace","project_name", "assigned_members", "status")
    list_filter = ("workspace","status", "project")

    search_fields = ["name"]

    inlines = [TaskAssigneeInline]
    
    def project_name(self, obj):
        return obj.project.name

    project_name.short_description = "Project"

    def assigned_members(self, obj):
        return ", ".join(
            (
                f"{a.member.user.first_name} {a.member.user.last_name}".strip()
                or a.member.user.email
            )
            for a in obj.assignees.select_related("member__user")
        )
 


@admin.register(TaskAssignee)
class TaskAssigneeAdmin(admin.ModelAdmin):
    autocomplete_fields = ["task", "member"]
    list_display = ["id", "task", "member", "assigned_at"]





 