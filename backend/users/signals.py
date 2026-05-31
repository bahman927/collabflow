# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from django.conf import settings

# from workspaces.models import Workspace, WorkspaceMember

# User = settings.AUTH_USER_MODEL

# @receiver(post_save, sender=User)
# def create_default_workspace(sender, instance, created, **kwargs):
#     if not created:
#         return

#     # 1. Create workspace
#     ws = Workspace.objects.create(
#         name=f"{instance.full_name or instance.email}'s Workspace",
#         description="Your personal workspace",
#         created_by=instance
#     )

#     # 2. Add membership
#     WorkspaceMember.objects.create(
#         user=instance,
#         workspace=ws,
#         role="Owner"
#     )

     