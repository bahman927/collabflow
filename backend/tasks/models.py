from django.db import models
from django.conf import settings
from projects.models import Project
from workspaces.models  import Workspace


class Task(models.Model):

    STATUS_CHOICES = (
    ("todo", "To Do"),
    ("in_progress", "In Progress"),
    ("done", "Done"),
    ("overdue", "Overdue"),
)


    PRIORITY_CHOICES = (
        ("LOW", "Low"),
        ("MEDIUM", "Medium"),
        ("HIGH", "High"),
    )

    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    workspace = models.ForeignKey(
        Workspace,
        on_delete=models.CASCADE,
        related_name="tasks",
        
    )   
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="tasks"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="todo"
    )

    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default="MEDIUM"
    )

    due_date = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("workspace","project", "name"),
        ordering = ["-created_at"]

    def __str__(self):
        return self.name
    
class TaskAssignee(models.Model):
    """Links a workspace member to a specific task."""
    task = models.ForeignKey("Task", on_delete=models.CASCADE, related_name='assignees')
    member = models.ForeignKey('workspaces.WorkspaceMember', on_delete=models.CASCADE, related_name='task_assignments')
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ( 'task', 'member')

    def __str__(self):
        return f"{self.member} → {self.task.name}"    
    






    
