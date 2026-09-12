from .base import *

DEBUG = True

ALLOWED_HOSTS = ["localhost",
    "127.0.0.1",]

# DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.sqlite3",
#         "NAME": BASE_DIR / "db.sqlite3",
#     }
# }

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

# EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True

EMAIL_HOST_USER = "bahman927@gmail.com"
# EMAIL_HOST_PASSWORD = "your-gmail-app-password"

DEFAULT_FROM_EMAIL = EMAIL_HOST_USER



#   instead of python manage.py runserver
#   set DJANGO_SETTINGS_MODULE=api.settings.dev

# for development:
#   python manage.py runserver --settings=api.settings.dev

# for production:
#   export DJANGO_SETTINGS_MODULE=api.settings.prod
