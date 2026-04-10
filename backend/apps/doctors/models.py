from django.db import models
from django.conf import settings

from backend.apps.tokens import serializers

class Hospital(models.Model):
    name = models.CharField(max_length=200, default="Modern Clinic")
    address = models.CharField(max_length=500, blank=True)
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    description = models.TextField(blank=True)
    operating_hours = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return self.name

class Service(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, default="activity")

    def __str__(self):
        return self.name

class Department(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Doctor(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='doctor_profile', null=True, blank=True)
    name = models.CharField(max_length=200, blank=True)
    specialty = models.CharField(max_length=200, blank=True)
    qualification = models.CharField(max_length=200, blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='doctors', null=True, blank=True)
    available_from = serializers.TimeField(format="%H:%M", required=False, allow_null=True)
    available_to = serializers.TimeField(format="%H:%M", required=False, allow_null=True)

    def __str__(self):
        if self.name:
            return f"Dr. {self.name}"
        elif self.user:
            return f"Dr. {self.user.username}"
        return "Dr. Unknown"

class DoctorBreak(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='breaks', null=True, blank=True)
    break_type = models.CharField(max_length=50) # "Tea Break", "Lunch Break"
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.break_type} - Active: {self.active}"
