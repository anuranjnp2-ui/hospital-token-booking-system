from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from .models import Doctor, Department, Hospital, Service, DoctorBreak
from .serializers import DoctorSerializer, DepartmentSerializer, HospitalSerializer, ServiceSerializer, DoctorBreakSerializer

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class HospitalViewSet(viewsets.ModelViewSet):
    queryset = Hospital.objects.all()
    serializer_class = HospitalSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class DoctorBreakViewSet(viewsets.ModelViewSet):
    # Publicly allow anyone to check what breaks are active for the public queue dashboard
    permission_classes = [AllowAny]
    queryset = DoctorBreak.objects.all()
    serializer_class = DoctorBreakSerializer

    def get_queryset(self):
        return DoctorBreak.objects.filter(active=True)
