from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import UserSerializer


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


























# # users/views.py
# from rest_framework import generics
# from .models import User
# from .serializers import UserSerializer

# class UserListAPIView(generics.ListAPIView):  # <-- rename here
#     queryset = User.objects.all()
#     serializer_class = UserSerializer

 