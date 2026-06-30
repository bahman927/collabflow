from rest_framework import serializers
from tasks.models import Task
from .models import Workspace, WorkspaceMember, Invitation
from tasks.models import TaskAssignee

class WorkspaceSerializer(serializers.ModelSerializer):

 owner = serializers.ReadOnlyField(source="created_by.id")
 owner_email = serializers.ReadOnlyField(source="created_by.email")
 member_count = serializers.SerializerMethodField()
 

 class Meta:
        model = Workspace
        fields = [
            "id",
            "name",
            "description",
            "owner",
            "owner_email",
            "member_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["owner", "created_at", "updated_at"]

 def get_member_count(self, obj):
        return obj.memberships.count()
 
 def get_owner_email(self, obj):
        return obj.created_by.email if obj.created_by else None

def get_member_count(self, obj):
        return obj.members.count()
    
class InviteMemberSerializer(serializers.Serializer):
    """Used when inviting a member with optional project/task assignments."""
    email = serializers.EmailField()
    role = serializers.ChoiceField(choices=["owner","admin", "Member", "viewer"], default="Member")
    project_ids = serializers.ListField(
        child=serializers.IntegerField(), required=False, default=[]
    )
    task_ids = serializers.ListField(
        child=serializers.IntegerField(), required=False, default=[]
    )

    def validate_email(self, value):
        workspace = self.context['workspace']
        if WorkspaceMember.objects.filter(workspace=workspace, user__email=value).exists():
            raise serializers.ValidationError("This user is already a member.")
        if Invitation.objects.filter(workspace=workspace, email=value, accepted=False).exists():
            raise serializers.ValidationError("An invitation has already been sent.")
        return value

    def validate_project_ids(self, value):
        workspace = self.context['workspace']
        valid = set(workspace.projects.values_list('id', flat=True))
        invalid = set(value) - valid
        if invalid:
            raise serializers.ValidationError(f"Projects {invalid} don't belong to this workspace.")
        return value

    def validate_task_ids(self, value):
        workspace = self.context['workspace']

        # 1. Validate tasks belong to workspace
        valid_ids = set(
            Task.objects.filter(project__workspace=workspace).values_list('id', flat=True)
        )
        invalid = set(value) - valid_ids
        if invalid:
            raise serializers.ValidationError(f"Tasks {invalid} don't belong to this workspace.")

        # 2. Check duplicate assignment (only if member already exists)
        email = self.initial_data.get("email")

        try:
            member = WorkspaceMember.objects.get(workspace=workspace, user__email=email)
        except WorkspaceMember.DoesNotExist:
            # Member not created yet → no duplicates possible
            return value

        duplicates = TaskAssignee.objects.filter(
            member=member,
            task_id__in=value
        ).select_related("task")

        if duplicates.exists():
            task_names = ", ".join([d.task.name for d in duplicates])
            raise serializers.ValidationError(
                f"This member is already assigned to: {task_names}"
            )

        return value

    
class InvitationListSerializer(serializers.ModelSerializer):
    invited_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Invitation
        fields = [
            'id',
            'email',
            'role',
            'accepted',
            'invited_by_name',
            'created_at',
            'token',
        ]

    def get_invited_by_name(self, obj):
        if obj.invited_by:
            return obj.invited_by.get_full_name() or obj.invited_by.email
        return None


class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = [
            'id',
            'email',
            'workspace',
            'role',
            'invited_by',
            'project_ids',
            'task_ids',
            'created_at',
            'accepted',
        ]
        read_only_fields = ['id', 'workspace', 'invited_by', 'created_at', 'accepted']

# workspaces/serializers.py (or members/serializers.py)

class WorkspaceMemberDetailSerializer(serializers.ModelSerializer):
    user_id = serializers.ReadOnlyField(source='user.id')
    email = serializers.ReadOnlyField(source='user.email')
    first_name = serializers.ReadOnlyField(source='user.first_name')
    last_name = serializers.ReadOnlyField(source='user.last_name')
    display_name = serializers.SerializerMethodField()
    is_active = serializers.ReadOnlyField(source='user.is_active')
    projects = serializers.SerializerMethodField()
    tasks = serializers.SerializerMethodField()

    class Meta:
        model = WorkspaceMember
        fields = [
            'id', 'user_id', 'email', 'first_name', 'last_name',
            'display_name', 'role', 'is_active', 'joined_at',
            'projects', 'tasks',
        ]

    def get_display_name(self, obj):
        full = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return full or obj.user.email

    def get_projects(self, obj):
        from tasks.models import TaskAssignee

        assignments = (
            TaskAssignee.objects
            .filter(member=obj)
            .select_related("task__project")
        )

        seen = set()
        projects = []

        for a in assignments:
            p = a.task.project
            if p.id not in seen:
                seen.add(p.id)
                projects.append({"id": p.id, "name": p.name})

        return projects
    
    def get_tasks(self, obj):
        from tasks.models import TaskAssignee

        assignments = (
            TaskAssignee.objects
            .filter(
                member=obj,
                task__workspace=obj.workspace   # ⭐ critical fix
            )
            .select_related("task", "task__project")
            .distinct()
        )

        return [
            {
                "id": a.task.id,
                "name": a.task.name,
                "status": a.task.status,
                "project": {
                    "id": a.task.project.id,
                    "name": a.task.project.name,
                }
            }
            for a in assignments
        ]

 
class WorkspaceMemberSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = WorkspaceMember
        fields = ["id", "workspace", "user", "role", "joined_at"]

    def get_user(self, obj):
        u = obj.user
        return {
            "id": u.id,
            "email": u.email,
            "first_name": u.first_name,
            "last_name": u.last_name,
            "avatar_url": getattr(u, "avatar_url", None),
        }



#     {
#   "id": 1,
#   "name": "Marketing Team",
#   "description": "Marketing planning workspace",
#   "owner": 3,
#   "owner_email": "bahman@email.com",
#   "member_count": 5,
#   "created_at": "2026-02-21T10:00:00Z",
#   "updated_at": "2026-02-21T10:00:00Z"
# }

# User
#    ↑
# WorkspaceMembership (role)
#    ↓
# Workspace
#    ↓
# Project
#    ↓
# Task