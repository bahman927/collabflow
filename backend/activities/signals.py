from django.db.models.signals import post_save
from django.dispatch import receiver
from tasks.models import Task
from .models import Activity

@receiver(post_save, sender=Task)
def create_task_activity(sender, instance, created, **kwargs):
    if created:
        Activity.objects.create(
            user=instance.assigned_to,
            project=instance.project,
            action="TASK_CREATED",
            description=f"Task '{instance.title}' was created."
        )
