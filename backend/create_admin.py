from django.contrib.auth import get_user_model
import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

User = get_user_model()

# Change these to whatever you want
username = 'admin_new'
email = 'admin@example.com'
password = 'TemporaryPassword123!'

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print(f"Superuser '{username}' created successfully!")
else:
    user = User.objects.get(username=username)
    user.set_password(password)
    user.save()
    print(f"Password for '{username}' updated successfully!")
