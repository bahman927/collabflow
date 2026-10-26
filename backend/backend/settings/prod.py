
from .base import *
import os

INSTALLED_APPS += ["anymail"]

EMAIL_BACKEND = "anymail.backends.resend.EmailBackend"

ANYMAIL = {
    "RESEND_API_KEY": os.environ["RESEND_API_KEY"],
}

DEFAULT_FROM_EMAIL = os.environ["RESEND_FROM_EMAIL"]

from .base import *

SIMPLE_JWT = {
    **SIMPLE_JWT,
    "SIGNING_KEY": os.environ["JWT_SIGNING_KEY"],
}

# Production mode
DEBUG = False

# Set these environment variables in Render.
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]

ALLOWED_HOSTS = [
    host.strip()
    for host in os.environ["ALLOWED_HOSTS"].split(",")
    if host.strip()
]

CORS_ALLOWED_ORIGINS = [
    "https://collabflow-five.vercel.app",
    "http://localhost:5174",
]


# CORS_ALLOWED_ORIGINS = [
#     origin.strip()
#     for origin in os.environ["CORS_ALLOWED_ORIGINS"].split(",")
#     if origin.strip()
# ]

CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS
SECURE_HSTS_SECONDS = 3600
SECURE_HSTS_INCLUDE_SUBDOMAINS = False
SECURE_HSTS_PRELOAD = False

# PostgreSQL database
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ["POSTGRES_DB"],
        "USER": os.environ["POSTGRES_USER"],
        "PASSWORD": os.environ["POSTGRES_PASSWORD"],
        "HOST": os.environ["POSTGRES_HOST"],
        "PORT": os.environ.get("POSTGRES_PORT", "5432"),
        "OPTIONS": {
            "sslmode": "require",
        },
    }
}

# Use Render's HTTPS proxy correctly.
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# Serve Django static files through WhiteNoise.
MIDDLEWARE.insert(
    2,
    "whitenoise.middleware.WhiteNoiseMiddleware",
)

STORAGES = {
    **STORAGES,
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}
