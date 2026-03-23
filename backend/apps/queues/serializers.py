from rest_framework import serializers
from .models import QueueStatus
from apps.doctors.serializers import DoctorSerializer

class QueueStatusSerializer(serializers.ModelSerializer):
    doctor_details = DoctorSerializer(source='doctor', read_only=True)

    class Meta:
        model = QueueStatus
        fields = '__all__'
