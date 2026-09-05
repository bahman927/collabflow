from rest_framework import serializers
from .models import Task, TaskAssignee
from users.models import User
from projects.models import Project
from workspaces.models import WorkspaceMember, Workspace
from workspaces.utils import ensure_member_role
from activities.models import Activity
from workspaces.activity.logger import ActivityLogger

class TaskAssigneeSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'name', 'email']

    def get_name(self, obj):
        return obj.get_full_name() or obj.email


class TaskSerializer(serializers.ModelSerializer):
    workspace = serializers.PrimaryKeyRelatedField(
        queryset=Workspace.objects.all(),
        required=True
    )
    project_id = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(),
        source='project',
    )
    assignees = serializers.SerializerMethodField()
    assignee_ids = serializers.ListField(
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
        read_only_fields = ["project"]

    # -----------------------------
    # READ: return list of assignees
    # -----------------------------
    def get_assignees(self, task):
        assignees = task.assignees.select_related("member__user").all()

        result = []
        for a in assignees:
            user = a.member.user
            full_name = user.get_full_name().strip()
            result.append({
                "id": user.id,
                "member_id": a.member.id,
                "name": full_name or user.email,
                "email": user.email,
            })

        return result

    # -----------------------------
    # READ: return list of emails
    # -----------------------------
    def get_assignee_emails(self, task):
        return [
            a.member.user.email
            for a in task.assignees.select_related("member__user").all()
        ]

    

    # ── READ: return all TaskAssignee members ──
     # ----------------------------------------------------
    # ASSIGNEE SYNC
    # ----------------------------------------------------
    def _sync_assignees(self, task, member_ids):
        workspace = task.project.workspace
        actor = self.context["request"].user


        # If omitted → clear all assignees
        if member_ids is None:
            removed = list(task.assignees.all())
            task.assignees.all().delete()

            for assignee in removed:
                ActivityLogger.task_unassigned(
                    actor=actor,
                    workspace=workspace,
                    task=task,
                    unassigned_user=assignee.member.user
                )
            return

        # Deduplicate
        member_ids = list(set(member_ids))

        # Track old assignees
        old_assignees = list(task.assignees.all())

        old_ids = {a.member_id for a in old_assignees}

        # Remove old
        task.assignees.exclude(member_id__in=member_ids).delete()

        # Log removed
        removed = [a for a in old_assignees if a.member_id not in member_ids]
        for assignee in removed:
            ActivityLogger.task_unassigned(
                actor=actor,
                workspace=workspace,
                task=task,
                unassigned_user=assignee.member.user
            )

        # Add new
        for member_id in member_ids:
            member = WorkspaceMember.objects.get(id=member_id)

            obj, created = TaskAssignee.objects.get_or_create(
                task=task,
                member=member
            )

            if created:
                ActivityLogger.task_assigned(
                    actor=actor,
                    workspace=workspace,
                    task=task,
                    assigned_user=member.user
                )
    
   
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

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data
    
    def create(self, validated_data):
        # print('taskSerializer->valiated_data in update() ->', validated_data)
        member_ids = (
            validated_data.pop("assignee_ids", None)
            or validated_data.pop("assigneeIds", None)
            or validated_data.pop("taskIds", None)
        )

        # member_ids = validated_data.pop('assignee_ids', None)
        task = super().create(validated_data)
        self._sync_assignees(task, member_ids)
        return task

    def update(self, instance, validated_data):

        actor = self.context["request"].user

        old_name = instance.name
        old_description = instance.description
        old_status = instance.status

        member_ids = (
            validated_data.pop("assignee_ids", None)
            or validated_data.pop("assigneeIds", None)
            or validated_data.pop("taskIds", None)
        )

        task = super().update(instance, validated_data)

        workspace = task.project.workspace

        if old_status != task.status:
            ActivityLogger.task_status_changed(
                actor=actor,
                workspace=workspace,
                task=task,
                old_status=old_status,
                new_status=task.status,
            )

        if old_name != task.name:
            ActivityLogger.task_renamed(
                actor=actor,
                workspace=workspace,
                task=task,
                old_name=old_name,
                new_name=task.name,
            )

        if old_description != task.description:
            ActivityLogger.task_description_updated(
                actor=actor,
                workspace=workspace,
                task=task,
            )

        if member_ids is not None:
            self._sync_assignees(task, member_ids)

        return task