from rest_framework import serializers
from .models import Doctor, Department, Hospital, Service, DoctorBreak

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class HospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = [
            'id',
            'name',
            'address',
            'phone',
            'email',
            'description',
            'operating_hours'
        ]

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

#class DoctorSerializer(serializers.ModelSerializer):
#    department = DepartmentSerializer(read_only=True)
#    full_name = serializers.SerializerMethodField()
#
#    class Meta:
#        model = Doctor
#        fields = ['id', 'name', 'full_name', 'specialty', 'qualification', 'department', 'available_from', 'available_to']
#
#    def get_full_name(self, obj):
#        if obj.name:
#            return obj.name
#        if obj.user:
#            return getattr(obj.user, 'get_full_name', lambda: obj.user.username)()
#        return ""
cclass DoctorSerializer(serializers.ModelSerializer):
    department = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    available_from = serializers.TimeField(format="%H:%M", required=False, allow_null=True)
    available_to = serializers.TimeField(format="%H:%M", required=False, allow_null=True)

    class Meta:
        model = Doctor
        fields = [
            'id',
            'name',
            'full_name',
            'specialty',
            'qualification',
            'department',
            'available_from',
            'available_to'
        ]

    def get_department(self, obj):
        try:
            if obj.department:
                return {
                    "id": obj.department.id,
                    "name": obj.department.name
                }
        except Exception:
            pass
        return None

    def get_full_name(self, obj):
        if obj.name:
            return obj.name
        
        if obj.user:
            try:
                full_name = obj.user.get_full_name()
                if full_name:
                    return full_name
                return obj.user.username or "Unknown Doctor"
            except Exception:
                return "Unknown Doctor"
        
        return "Unknown Doctor"

     


class DoctorBreakSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorBreak
        fields = '__all__'
