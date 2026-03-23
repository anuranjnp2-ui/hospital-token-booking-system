from rest_framework import serializers
from .models import Token
from apps.doctors.serializers import DoctorSerializer

class TokenSerializer(serializers.ModelSerializer):
    doctor_details = DoctorSerializer(source='doctor', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True, required=False)

    class Meta:
        model = Token
        fields = ['id', 'user', 'user_name', 'patient_name', 'phone', 'doctor', 'doctor_details', 'token_number', 'status', 'date', 'created_at', 'estimated_time']
        read_only_fields = ['user', 'token_number', 'date', 'estimated_time']
