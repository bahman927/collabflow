from .base import *

DEBUG = True

ALLOWED_HOSTS = []

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

CORS_ALLOW_ALL_ORIGINS = True


#   instead of python manage.py runserver
#   set DJANGO_SETTINGS_MODULE=api.settings.dev

# for development:
#   python manage.py runserver --settings=api.settings.dev

# for production:
#   export DJANGO_SETTINGS_MODULE=api.settings.prod
