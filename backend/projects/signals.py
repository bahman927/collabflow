from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

from .models import Project
from activities.models import Activity


@receiver(post_save, sender=Project)
def create_project_activity(sender, instance, created, **kwargs):
    if created:
        Activity.objects.create(
            workspace=instance.workspace,
            user=instance.created_by,
            activity_type="PROJECT_CREATED",
            message=f"Project '{instance.name}' was created."
        )