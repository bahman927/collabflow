# users/views.py

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
# from workspaces.services import create_workspace_for_user
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
    UserSerializer,
)

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers        import EmailTokenObtainPairSerializer
from projects.models     import ProjectMember
from tasks.models        import TaskAssignee
from workspaces.models   import Workspace, WorkspaceMember
from projects.models     import Project
from tasks.models        import Task

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer

# ----------------------------------------
# Register View
# ----------------------------------------
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            print("REGISTER ERRORS:", serializer.errors)
            return Response(serializer.errors, status=400)

        user = serializer.save()

        # If registering via invitation, accept it (no workspace creation)
        invite_token = request.data.get("invite_token")
        if invite_token:
            try:
                invitation = Invitation.objects.get(token=invite_token, accepted=False)
                if invitation.email != user.email:
                    return Response({'error': 'Email mismatch.'}, status=400)

                accept_invitation(invitation, user)
            except Invitation.DoesNotExist:
                return Response({'error': 'Invalid invitation.'}, status=400)

        # No invite → just a bare user, no workspace
        return Response(UserSerializer(user).data, status=201)
    
    def accept_invitation(invitation, user):

    # 1. Create workspace membership
     workspace_member = WorkspaceMember.objects.create(
        user=user,
        workspace=invitation.workspace,
        role=invitation.role,
    )

    # 2. Assign to projects
     for project_id in invitation.project_ids:
        try:
            project = Project.objects.get(id=project_id, workspace=invitation.workspace)
            ProjectMember.objects.get_or_create(
                project=project,
                member=workspace_member,
                defaults={'assigned_by': invitation.invited_by}
            )
        except Project.DoesNotExist:
            pass  # project may have been deleted since invitation

    # 3. Assign to tasks
     for task_id in invitation.task_ids:
        try:
            task = Task.objects.get(id=task_id, project__workspace=invitation.workspace)
            TaskAssignee.objects.get_or_create(
                task=task,
                member=workspace_member,
            )
        except Task.DoesNotExist:
            pass  # task may have been deleted since invitation

    # 4. Mark invitation accepted
     invitation.accepted = True
     invitation.save()

     return workspace_member


# ----------------------------------------
# Login View (Custom JWT)
# ----------------------------------------
class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


# ----------------------------------------
# Logout View (Blacklist Refresh Token)
# ----------------------------------------
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()

            return Response({"detail": "Logged out successfully."})

        except Exception:
            return Response(
                {"detail": "Invalid or expired token."},
                status=status.HTTP_400_BAD_REQUEST,
            )


# ----------------------------------------
# Auth Me View (Restore Session)
# ----------------------------------------
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)