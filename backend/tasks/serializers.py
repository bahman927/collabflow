from rest_framework import serializers
from .models import Task, TaskAssignee
from users.models import User
from projects.models import Project
from workspaces.models import WorkspaceMember


class TaskAssigneeSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'name', 'email']

    def get_name(self, obj):
        return obj.get_full_name() or obj.email


class TaskSerializer(serializers.ModelSerializer):
    project_id = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(),
        source='project',
    )
    assignees = serializers.SerializerMethodField()           # READ — returns list of member
    assignee_ids = serializers.ListField(                     # WRITE — accepts member IDs
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
    )
    assignee_emails = serializers.SerializerMethodField()
    status = serializers.CharField(required=False, default="todo")

    class Meta:
        model = Task
        fields = [
            "id",
            "name",
            "description",
            "priority",
            "due_date",
            "status",
            "project_id",
            "project",
            "workspace", 
            "assignees",
            "assignee_ids",
            "assignee_emails",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["workspace","project"]

    def get_assignee_emails(self, obj):
     return [a.member.user.email for a in obj.assignees.select_related("member__user")]

    # ── READ: return all TaskAssignee members ──
    def get_assignees(self, obj):
        task_assignees = obj.assignees.select_related('member__user').all()

        result = []
        for ta in task_assignees:
            user = ta.member.user
            full_name = f"{user.first_name} {user.last_name}".strip()
            result.append({
                'id': user.id,
                'member_id': ta.member.id,
                'name': full_name or user.email,
                'email': user.email,
            })

        

        return result
 
    def _sync_assignees(self, task, member_ids):
     if member_ids is None:
        return

     member_ids = list(set(member_ids))          

        # Validate all IDs are members of the task's workspace
     workspace = task.project.workspace
     valid_members = WorkspaceMember.objects.filter(
            id__in=member_ids,
            workspace=workspace,
        )

     if valid_members.count() != len(member_ids):
        raise serializers.ValidationError({
                "assignee_ids": "One or more member IDs are not in this workspace."
        })
     task.assignees.exclude(member_id__in=member_ids).delete()

    
     for member_id in member_ids:
            TaskAssignee.objects.get_or_create(task=task, member_id=member_id)



    def create(self, validated_data):
        member_ids = validated_data.pop('assignee_ids', None)
        task = super().create(validated_data)
        self._sync_assignees(task, member_ids)
        return task

    def update(self, instance, validated_data):
        member_ids = validated_data.pop('assignee_ids', None)
        task = super().update(instance, validated_data)
        self._sync_assignees(task, member_ids)
        return task

    def validate_assigned_to(self, value):
        project_id = self.initial_data.get('project_id') or (
            self.instance and self.instance.project_id
        )
        if project_id and value:
            from projects.models import Project
            from workspaces.models import WorkspaceMember
            project = Project.objects.get(id=project_id)
            if not WorkspaceMember.objects.filter(workspace=project.workspace, user=value).exists():
                raise serializers.ValidationError("User is not a member of this workspace.")
        return value

    def validate_status(self, value):
        allowed = ["todo", "in_progress", "done", "overdue"]
        if value not in allowed:
            raise serializers.ValidationError("Invalid status")
        return value
