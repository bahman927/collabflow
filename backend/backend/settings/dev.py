from .base import *

DEBUG = True

ALLOWED_HOSTS = ["localhost",
    "127.0.0.1",]
 

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "collabflow",
        "USER": "postgres",
        "PASSWORD": "postgres",
        "HOST": "localhost",
        "PORT": "5432",
    }
}

CORS_ALLOW_ALL_ORIGINS = True

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True

EMAIL_HOST_USER = "bahman927@gmail.com"

DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

 
