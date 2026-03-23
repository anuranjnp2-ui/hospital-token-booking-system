from django.db import models

class QueueStatus(models.Model):
    doctor = models.OneToOneField('doctors.Doctor', on_delete=models.CASCADE, related_name='queue_status')
    current_token_number = models.PositiveIntegerField(default=0)
    latest_token_issued = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Queue for {self.doctor.user.get_full_name()} - Current: {self.current_token_number}"
