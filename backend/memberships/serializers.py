from rest_framework import serializers
from workspaces.models import WorkspaceMember
from django.contrib.auth import get_user_model
from tasks.models import Task, TaskAssignee
from projects.models import ProjectMember


User = get_user_model()


class MemberSerializer(serializers.ModelSerializer):
    tasks = serializers.SerializerMethodField()
    userId = serializers.CharField(
        source='user.id', read_only=True
    )
    email = serializers.EmailField(
        source='user.email', read_only=True
    )
    firstName = serializers.CharField(
        source='user.first_name', read_only=True
    )
    lastName = serializers.CharField(
        source='user.last_name', read_only=True
    )
    displayName = serializers.SerializerMethodField()
    avatarUrl = serializers.SerializerMethodField()
   
    joinedAt = serializers.DateTimeField(
        source='created_at', read_only=True
    )
    isActive = serializers.BooleanField(
        source='is_active'
    )
    projects = serializers.SerializerMethodField()
    tasks = serializers.SerializerMethodField()

    class Meta:
        model = WorkspaceMember
        fields = [
            'id', 'userId', 'email',
            'firstName', 'lastName',
            'displayName', 'avatarUrl',
            'role', 'joinedAt', 'isActive',
            'projects', 'tasks',
        ]

    

    def get_displayName(self, obj):
        full = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return full or obj.user.email

    def get_projects(self, obj):

        assignments = (
            ProjectMember.objects
            .filter(member=obj)
            .select_related("project")
        )

        return [
            {
                "id": assignment.project.id,
                "name": assignment.project.name,
            }
            for assignment in assignments
        ]
    
    
    def get_tasks(self, obj):
        tasks = Task.objects.filter(
            assignees__member=obj,
            project__workspace=obj.workspace,
        )

        return [
            {
                'id': t.id,
                'name': t.name,
                'status': t.status,
                'projectId': t.project_id,
            }
            for t in tasks
        ]

    def get_avatarUrl(self, obj):
        user = obj.user

        if not user.avatar:
            return None

        try:
            return user.avatar.url
        except ValueError:
            return None

class InviteMemberSerializer(serializers.Serializer):
    email = serializers.EmailField()
    role = serializers.ChoiceField(
        choices=['member', 'viewer']
    )
    message = serializers.CharField(
        required=False, allow_blank=True
    )
    taskIds = serializers.ListField(          
        child=serializers.IntegerField(),     
        required=False,                       
        default=[],                           
    )

    def validate_taskIds(self, value):
        workspace = self.context['workspace']

        # 1. Validate tasks belong to workspace
        valid = set(
            Task.objects.filter(project__workspace=workspace).values_list('id', flat=True)
        )
        invalid = set(value) - valid
        if invalid:
            raise serializers.ValidationError(f"Tasks {invalid} don't belong to this workspace.")

        return value

class UpdateMemberSerializer(serializers.Serializer):
    role = serializers.ChoiceField(
        choices=['member', 'viewer'],
        required=False,
    )
    isActive = serializers.BooleanField(
        required=False
    )



 