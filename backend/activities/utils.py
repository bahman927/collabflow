# activity/utils.py
from .models import Activity

def log_activity(workspace, user, message):
    Activity.objects.create(
        workspace=workspace,
        user=user,
        message=message
    )
