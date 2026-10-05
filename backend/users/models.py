from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import UserManager


class User(AbstractUser):
    username  = None  
    email     = models.EmailField(unique=True,null=False,blank=False)
    full_name = models.CharField(max_length=255, blank=True)
    is_admin  = models.BooleanField(default=False)
    avatar = models.ImageField(
        upload_to="avatars/",
        blank=True,
        null=True,
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    objects = UserManager()
    class Meta:
        pass
    def __str__(self):
     return self.full_name or self.email.split("@")[0].capitalize()
