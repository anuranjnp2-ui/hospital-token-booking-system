from apps.users.models import User
from apps.doctors.models import Doctor, Department, Hospital, Service
from django.utils import timezone

def create_seeds():
    # 1. Create Hospital
    hospital, created = Hospital.objects.get_or_create(
        name="City General Hospital",
        defaults={
            "address": "123 Medical Lane",
            "phone": "555-0100",
            "email": "info@cityhospital.com",
            "description": "Leading the way in medical excellence.",
            "operating_hours": "24/7"
        }
    )
    if created: print(f"Created Hospital: {hospital.name}")

    # 2. Create Departments
    dept, _ = Department.objects.get_or_create(name="General Medicine")
    
    # 3. Create Admin Superuser
    if not User.objects.filter(username="admin").exists():
        admin_user = User.objects.create_superuser("admin", "admin@hospital.com", "password123")
        print("Created Admin User: admin")
    else:
        admin_user = User.objects.get(username="admin")
        admin_user.set_password("password123")
        admin_user.is_superuser = True
        admin_user.is_staff = True
        admin_user.save()
        print("Updated Admin User: admin")

    # 4. Create Doctor User
    if not User.objects.filter(username="doctor").exists():
        doctor_user = User.objects.create_user("doctor", "doctor@hospital.com", "password123")
        doctor_user.is_doctor = True
        doctor_user.save()
        print("Created Doctor User: doctor")
    else:
        doctor_user = User.objects.get(username="doctor")
        doctor_user.is_doctor = True
        doctor_user.is_staff = True # Doctors might need staff access depending on site logic
        doctor_user.set_password("password123")
        doctor_user.save()
        print("Updated Doctor User: doctor")

    # 5. Create Doctor Profile
    doctor_profile, created = Doctor.objects.get_or_create(
        user=doctor_user,
        defaults={
            "name": "John Doe",
            "specialty": "General Physician",
            "qualification": "MBBS, MD",
            "department": dept
        }
    )
    if created: print(f"Created Doctor Profile: {doctor_profile.name}")

if __name__ == "django.core.management.commands.shell" or __name__ == "__main__":
    create_seeds()
