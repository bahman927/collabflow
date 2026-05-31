from django.db import models
from users.models import User
from django.conf import settings


class Workspace(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="created_workspaces",
        null=True,
        blank=True
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name

    @property
    def owners(self):
        return self.memberships.filter(role="Owner")
    
    
class WorkspaceMember(models.Model):

     ROLE_CHOICES = (
        ("Owner", "Owner"),
        ("Member", "Member"),
        ("Viewer", "Viewer"),
    )

     user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="workspace_memberships"

    )

     workspace = models.ForeignKey(
        Workspace,
        on_delete=models.CASCADE,
        related_name="memberships"
    )

     role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES
    )
     is_active = models.BooleanField(default=True)         

     avatar_url = models.URLField(blank=True, null=True) 

     joined_at = models.DateTimeField(auto_now_add=True)

     class Meta:
      unique_together = ("workspace", "user")

     def __str__(self):
        return f"{self.user} in {self.workspace} ({self.role})"
     
     
class Invitation(models.Model):

      email = models.EmailField()

      workspace = models.ForeignKey(
        "workspaces.Workspace",
        on_delete=models.CASCADE,
        related_name="invitations"
    )

      role = models.CharField(
        max_length=20,
        choices=(
            ("Member", "Member"),
            ("Viewer", "Viewer"),
        )
    )

      invited_by = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE
    )
      project_ids = models.JSONField(default=list, blank=True)
      task_ids = models.JSONField(default=list, blank=True)
      created_at = models.DateTimeField(auto_now_add=True)

      accepted = models.BooleanField(default=False)

      def __str__(self):
        return f"{self.email} invited to {self.workspace.name}"