from django.db import models
from django.conf import settings
from workspaces.models import Workspace


class Project(models.Model):

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    workspace = models.ForeignKey(
        Workspace,
        on_delete=models.CASCADE,
        related_name="projects"
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_projects"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ProjectMember(models.Model):
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='project_members')
    member = models.ForeignKey('workspaces.WorkspaceMember', on_delete=models.CASCADE, related_name='project_memberships')
    assigned_at = models.DateTimeField(auto_now_add=True)
    assigned_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    class Meta:
        unique_together = ('project', 'member')  # ← HERE, not on User

    def __str__(self):
        return f"{self.member} → {self.project.name}"