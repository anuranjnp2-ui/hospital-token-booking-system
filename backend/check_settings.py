from django.conf import settings
import os
print(f"DEBUG: {settings.DEBUG}")
print(f"CORS_ALLOW_ALL_ORIGINS: {getattr(settings, 'CORS_ALLOW_ALL_ORIGINS', 'MISSING')}")
print(f"CORS_ALLOWED_ORIGINS: {getattr(settings, 'CORS_ALLOWED_ORIGINS', 'MISSING')}")
print(f"ENVIRONMENT DEBUG: {os.environ.get('DEBUG')}")
