from django.db import models
from django.conf import settings

class Token(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tokens', null=True, blank=True)
    patient_name = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    doctor = models.ForeignKey('doctors.Doctor', on_delete=models.CASCADE, related_name='tokens')
    token_number = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    date = models.DateField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    estimated_time = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('doctor', 'date', 'token_number')
        ordering = ['date', 'token_number']

    def __str__(self):
        doctor_name = self.doctor.name or (self.doctor.user.get_full_name() if self.doctor.user else "Unknown Doctor")
        return f"Token {self.token_number} - {doctor_name} - {self.date}"
