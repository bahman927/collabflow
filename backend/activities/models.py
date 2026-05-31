from django.db import models
from django.conf import settings
from workspaces.models import Workspace
from projects.models import Project


class Activity(models.Model):

    ACTIVITY_TYPES = (
                        ("PROJECT_CREATED", "Project Created"),
                        ("TASK_CREATED", "Task Created"),
                        ("TASK_UPDATED", "Task Updated"),
                        ("TASK_MOVED", "Task Moved"),
                        ("MEMBER_ADDED", "Member Added"),
                    )
    activity_type = models.CharField(
                        max_length=50,
                        choices=ACTIVITY_TYPES,
                        default="PROJECT_CREATED",
                        null=True,
                        blank=True
                    )

    workspace = models.ForeignKey(
                                 Workspace,
                                 on_delete=models.CASCADE,
                                 related_name="activities",
                                 null=True,  
                                 blank=True  
                                )

    user = models.ForeignKey(
                                settings.AUTH_USER_MODEL,
                                on_delete=models.CASCADE,
                                related_name="activities",
                                null=True,
                                blank=True,
                            )

    project = models.ForeignKey(Project, on_delete=models.CASCADE, null=True, blank=True)
    action = models.CharField(max_length=50)
    description = models.TextField()

    message = models.TextField(default="")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
# ✅ Safe version
def __str__(self):
    email = self.user.email if self.user else "Deleted User"
    return f"{email} - {self.action}"
