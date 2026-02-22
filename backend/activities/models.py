from django.db import models
from django.conf import settings
from workspaces.models import Workspace


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
                                 related_name="activities"
                                )

    user = models.ForeignKey(
                                settings.AUTH_USER_MODEL,
                                on_delete=models.CASCADE,
                                related_name="activities"
                            )

     

    message = models.TextField(default="")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.activity_type}"