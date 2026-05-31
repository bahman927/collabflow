from rest_framework import serializers
from .models import Project, ProjectMember
from tasks.models import Task
from tasks.serializers import TaskSerializer
from rest_framework import serializers
from .models import Project, ProjectMember



class ProjectSerializer(serializers.ModelSerializer):
    workspace_id = serializers.ReadOnlyField(source="workspace.id")
    created_by_email = serializers.ReadOnlyField(source="created_by.email")

    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "description",
            "workspace_id",
            # 'member_ids',
            'created_by_email',   
            'created_at',
             
        ]
        read_only_fields = ["created_by", "workspace_id", "created_at", "updated_at"]
        
    def validate_member_ids(self, value):
        workspace = self.context['workspace']
        valid = set(
            workspace.members.values_list('id', flat=True)
        )
        invalid = set(value) - valid
        if invalid:
            raise serializers.ValidationError(f"Members {invalid} don't belong to this workspace.")
        return value
    
class ProjectMemberSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='member.user.get_full_name', read_only=True)
    member_email = serializers.CharField(source='member.user.email', read_only=True)
    role = serializers.CharField(source='member.role', read_only=True)

    class Meta:
        model = ProjectMember
        fields = ['id', 'member', 'member_name', 'member_email', 'role', 'assigned_at']   

# projects/serializers.py


class ProjectCreateSerializer(serializers.ModelSerializer):
    member_ids = serializers.ListField(
        child=serializers.IntegerField(), required=False, default=[]
    )

    class Meta:
        model = Project
        fields = ['name', 'description', 'member_ids']

    def validate_member_ids(self, value):
        workspace = self.context.get('workspace')
        if workspace and value:
            valid = set(workspace.members.values_list('id', flat=True))
            invalid = set(value) - valid
            if invalid:
                raise serializers.ValidationError(
                    f"Members {invalid} don't belong to this workspace."
                )
        return value

