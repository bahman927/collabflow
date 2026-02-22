from django.db import models
from django.conf import settings


class WorkspaceMembership(models.Model):

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
        "workspaces.Workspace",
        on_delete=models.CASCADE,
        related_name="memberships"
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="Member"
    )

    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "workspace")

    def __str__(self):
        return f"{self.user.email} - {self.workspace.name} ({self.role})"