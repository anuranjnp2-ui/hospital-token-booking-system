from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from .models import Token
from .serializers import TokenSerializer
from apps.doctors.models import Doctor

class TokenViewSet(viewsets.ModelViewSet):
    queryset = Token.objects.all()
    serializer_class = TokenSerializer
    
    def get_permissions(self):
        if self.action in ['current', 'book', 'list']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        today = timezone.now().date()
        return Token.objects.filter(date=today).order_by('token_number')

    @action(detail=False, methods=['post'])
    def book(self, request):
        doctor_id = request.data.get('doctor')
        
        if not doctor_id:
            doctor = Doctor.objects.first()
            if not doctor:
                return Response({"error": "No doctors available in the system. Please add one in Admin panel."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                doctor = Doctor.objects.get(id=doctor_id)
            except Doctor.DoesNotExist:
                return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)

        today = timezone.now().date()
        patient_name = request.data.get('patient_name', '')
        phone = request.data.get('phone', '')
        
        last_token = Token.objects.filter(doctor=doctor, date=today).order_by('-token_number').first()
        token_number = 1 if not last_token else last_token.token_number + 1

        token = Token.objects.create(
            user=request.user if request.user.is_authenticated else None,
            patient_name=patient_name,
            phone=phone,
            doctor=doctor,
            token_number=token_number,
            date=today
        )
        
        serializer = self.get_serializer(token)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def current(self, request):
        doctor_id = request.query_params.get('doctor')
        if not doctor_id:
             doctor = Doctor.objects.first()
             if not doctor:
                 return Response({"error": "No doctors in system"}, status=status.HTTP_400_BAD_REQUEST)
             doctor_id = doctor.id
             
        today = timezone.now().date()
        current_token = Token.objects.filter(
            doctor_id=doctor_id, 
            date=today,
            status='IN_PROGRESS'
        ).first()
        
        if current_token:
            return Response(self.get_serializer(current_token).data)
            
        last_completed = Token.objects.filter(
            doctor_id=doctor_id,
            date=today,
            status='COMPLETED'
        ).order_by('-token_number').first()
        
        if last_completed:
            return Response({"current_token_number": last_completed.token_number, "status": "No active token"})
            
        return Response({"current_token_number": 0, "status": "No tokens started yet"})
