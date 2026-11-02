# users/views.py

from django.conf import settings
from django.core.mail import send_mail

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
    UserSerializer,
    NormalRegisterSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
)

from .serializers        import EmailTokenObtainPairSerializer
 

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer

# ----------------------------------------
# Register View
# ----------------------------------------

from django.db import transaction
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import generics, serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import NormalRegisterSerializer, UserSerializer
from invitations.models import Invitation
from workspaces.models import WorkspaceMember


User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = NormalRegisterSerializer
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        token = request.data.get("token")

        # Normal signup: no invitation token supplied.
        if not token:
            serializer = self.get_serializer(data=request.data)

            if not serializer.is_valid():
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = serializer.save()

        # Invitation signup.
        else:
            full_name = (request.data.get("full_name") or "").strip()
            password = request.data.get("password")
            avatar = request.FILES.get("avatar")

            if not full_name:
                return Response(
                    {"full_name": ["This field is required."]},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not password:
                return Response(
                    {"password": ["This field is required."]},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                invitation = Invitation.objects.select_related(
                    "workspace", "invited_by"
                ).get(
                    token=token,
                    status="pending",
                )
            except Invitation.DoesNotExist:
                return Response(
                    {"token": ["This invitation is invalid or no longer pending."]},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            email = invitation.email.strip().lower()

            if User.objects.filter(email__iexact=email).exists():
                return Response(
                    {"email": ["An account with this email already exists."]},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                validate_password(password)
            except Exception as exc:
                return Response(
                    {"password": list(exc.messages)},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            with transaction.atomic():
                user = User.objects.create_user(
                    email=email,
                    full_name=full_name,
                    password=password,
                )

                if avatar:
                    user.avatar = avatar
                    user.save(update_fields=["avatar"])

                

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "user": UserSerializer(user).data,
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
            },
            status=status.HTTP_201_CREATED,
        )



# class RegisterView(generics.CreateAPIView):
#     # serializer_class = RegisterSerializer
#     serializer_class = NormalRegisterSerializer
#     permission_classes = [AllowAny]
#     parser_classes = [JSONParser, MultiPartParser, FormParser]

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)

#         if not serializer.is_valid():
#             print("REGISTER ERRORS:", serializer.errors)
#             return Response(serializer.errors, status=400)

#         user = serializer.save()
#         refresh = RefreshToken.for_user(user)

#         return Response(
#             {
#                 "user": UserSerializer(user).data,
#                 "tokens": {
#                     "access": str(refresh.access_token),
#                     "refresh": str(refresh),
#                 },
#             },
#             status=201,
#         )

    


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
# Auth Me View (Restore / Update Session)
# ----------------------------------------
class MeView(APIView):
   
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        import logging
        logger = logging.getLogger(__name__)

        serializer = UserSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        try:
            serializer = UserSerializer(
                request.user,
                data=request.data,
                partial=True,
            )

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception:
            logger.exception("Profile PATCH failed")
            raise

class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        result = serializer.save()

        # Same response whether the email exists or not.
        if result:
            user = result["user"]
            uid = result["uid"]
            token = result["token"]

            reset_url = (
                f"http://localhost:5173/reset-password/"
                f"{uid}/{token}"
            )

            send_mail(
                subject="Reset your CollabFlow password",
                message=(
                    "You requested a password reset for your "
                    "CollabFlow account.\n\n"
                    f"Click the following link to reset your password:\n\n"
                    f"{reset_url}\n\n"
                    "If you did not request this, you can safely "
                    "ignore this email."
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
            )

        return Response(
            {
                "message": (
                    "If an account exists for this email, "
                    "a password-reset link has been sent."
                )
            },
            status=status.HTTP_200_OK,
        ) 

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "message": "Password has been reset successfully."
            },
            status=status.HTTP_200_OK,
        )        