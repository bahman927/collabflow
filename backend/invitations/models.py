# invitations/models.py
from django.db import models
from workspaces.models import Workspace
from django.conf import settings

class Invitation(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("denied", "Denied"),
        ("expired", "Expired"),
    ]
    ROLE_CHOICES = [
        ("member", "Member"),
        ("viewer", "Viewer"),
    ]

    email = models.EmailField()
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE)

    invited_by = models.ForeignKey(
       settings.AUTH_USER_MODEL,
       on_delete=models.CASCADE,
       related_name="sent_invitations"
    )

    
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="member",
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    token = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.email} → {self.workspace.name} ({self.status})"
