from django.db.models.signals import post_save
from django.dispatch import receiver
from tasks.models import Task
from .models import Activity

@receiver(post_save, sender=Task)
def create_task_activity(sender, instance, created, **kwargs):
    if created:
        assignees = instance.assignees.select_related("member__user")

        for assignee in assignees:
            Activity.objects.create(
                user=assignee.member.user,
                project=instance.project,
        )

       