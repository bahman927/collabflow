
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from users.models import User
from tasks.models import Task 
from workspaces.models import Workspace, WorkspaceMember
from .serializers import (
    MemberSerializer,
    InviteMemberSerializer,
    UpdateMemberSerializer,
)

from .permissions import IsWorkspaceAdminOrOwner
from tasks.models import Task, TaskAssignee
from workspaces.models import WorkspaceMember


class MemberViewSet(viewsets.ModelViewSet):
    serializer_class = MemberSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        workspace_id = self.kwargs['workspace_id']
        qs = WorkspaceMember.objects.filter(
            workspace_id=workspace_id
        ).select_related('user')

        search = self.request.query_params.get('search', '')
        role = self.request.query_params.get('role', '')
        member_status = self.request.query_params.get('status', '')

        if search:
            qs = qs.filter(
                Q(user__email__icontains=search)
                | Q(user__first_name__icontains=search)
                | Q(user__last_name__icontains=search)
            )
        if role:
            qs = qs.filter(role=role)
        if member_status == 'active':
            qs = qs.filter(is_active=True)
        elif member_status == 'inactive':
            qs = qs.filter(is_active=False)

        return qs.order_by('role', 'user__first_name')
    
    @action(detail=False, methods=["get"], url_path="me")
    def me(self, request, workspace_id=None):
        membership = WorkspaceMember.objects.filter(
            workspace_id=workspace_id,
            user=request.user
        ).first()

        if not membership:
            return Response({"detail": "Not a member"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(membership)
        return Response(serializer.data)

    
    @action(
    detail=False,
    methods=['post'],
    permission_classes=[IsWorkspaceAdminOrOwner],
    )
    
    def invite(self, request, workspace_id=None):
        serializer = InviteMemberSerializer(
            data=request.data,
            context={"workspace": Workspace.objects.get(id=workspace_id)}
        )
        serializer.is_valid(raise_exception=True)

        workspace = Workspace.objects.get(id=workspace_id)
        email = serializer.validated_data["email"]
        role = serializer.validated_data["role"]
        task_ids = serializer.validated_data.get("taskIds", [])

        # 1️⃣ User must already exist
        user = User.objects.filter(email=email).first()
        if not user:
            return Response(
                {"error": "No account found with this email. User must sign up first."},
                status=status.HTTP_404_NOT_FOUND,
            )

    # 2️⃣ Check if member already exists
        existing_member = WorkspaceMember.objects.filter(
            workspace=workspace,
            user=user,
        ).first()

        print("DEBUG request.data =", request.data)
        print("DEBUG validated =", serializer.validated_data)
        print("DEBUG task_ids =", serializer.validated_data.get("task_ids"))


        # ───────────────────────────────────────────────
        # CASE A — EXISTING MEMBER → only assign tasks
        # ───────────────────────────────────────────────
        if existing_member:
            if task_ids:
                tasks = Task.objects.filter(
                    id__in=task_ids,
                    project__workspace=workspace,
                )

                for task in tasks:
                    TaskAssignee.objects.get_or_create(
                        task=task,
                        member=existing_member
                    )

            return Response(
                MemberSerializer(existing_member).data,
                status=status.HTTP_200_OK,
            )

    # ───────────────────────────────────────────────
    # CASE B — NEW MEMBER → create + assign tasks
    # ───────────────────────────────────────────────
        new_member = WorkspaceMember.objects.create(
            workspace=workspace,
            user=user,
            role=role,
        )

        if task_ids:
            tasks = Task.objects.filter(
                id__in=task_ids,
                project__workspace=workspace,
            )

            for task in tasks:
                TaskAssignee.objects.get_or_create(
                    task=task,
                    member=new_member
                )

        return Response(
            MemberSerializer(new_member).data,
            status=status.HTTP_201_CREATED,
        )

 
    def partial_update(self, request, workspace_id=None, pk=None):
        member = self.get_object()

        if member.role == 'owner':
            return Response(
                {'error': 'Cannot modify workspace owner'},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = UpdateMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if 'role' in serializer.validated_data:
            member.role = serializer.validated_data['role']
        if 'isActive' in serializer.validated_data:
            member.is_active = serializer.validated_data['isActive']
        member.save()

        return Response(MemberSerializer(member).data)

    def destroy(self, request, workspace_id=None, pk=None):
        member = self.get_object()
        if member.role == 'owner':
            return Response(
                {'error': 'Cannot remove workspace owner'},
                status=status.HTTP_403_FORBIDDEN,
            )
        member.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)





 