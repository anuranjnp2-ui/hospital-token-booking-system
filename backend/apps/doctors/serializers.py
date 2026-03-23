from rest_framework import serializers
from .models import Doctor, Department, Hospital, Service, DoctorBreak

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class HospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class DoctorSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Doctor
        fields = ['id', 'name', 'full_name', 'specialty', 'qualification', 'department', 'available_from', 'available_to']

    def get_full_name(self, obj):
        return obj.name or (obj.user.get_full_name() if obj.user else '')

class DoctorBreakSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorBreak
        fields = '__all__'
