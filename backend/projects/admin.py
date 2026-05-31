from django.contrib import admin
from .models import Project
from tasks.models import Task

class TaskInline(admin.TabularInline):
    model = Task
    extra = 1
    fields = ("name", "status", "due_date")
    show_change_link = True
    readonly_fields = ("assignee_list",)

    def assignee_list(self, obj):
     return ", ".join(a.member.user.email for a in obj.assignees.all())


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "workspace", "created_at")
    search_fields = ("name", "workspace__name")
    list_filter = ("workspace",)
    inlines = [TaskInline]
