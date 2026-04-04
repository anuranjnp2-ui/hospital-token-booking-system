from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from django.conf import settings
from datetime import datetime, time
from .models import Token
from .serializers import TokenSerializer
from apps.doctors.models import Doctor
from django.db import transaction

class TokenViewSet(viewsets.ModelViewSet):
    queryset = Token.objects.all()
    serializer_class = TokenSerializer
    
    def get_permissions(self):
        if self.action in ['current', 'book', 'list']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def _is_after_reset(self):
        """Returns True if current time is past the 9:00 PM reset time."""
        now = timezone.localtime(timezone.now())
        reset_time_str = getattr(settings, 'BOOKING_END_TIME', '21:00')
        reset_hour, reset_min = map(int, reset_time_str.split(':'))
        return now.time() >= time(reset_hour, reset_min)

    def get_queryset(self):
        # Implementation of "Automatic Reset at 9:00 PM"
        # If it's after 9:00 PM, we treat the current day's tokens as "cleared" for the UI.
        if self._is_after_reset():
            return Token.objects.none()
            
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

        # Booking Time Control (8:00 AM to 9:00 PM)
        now = timezone.localtime(timezone.now())
        start_time_str = getattr(settings, 'BOOKING_START_TIME', '08:00')
        end_time_str = getattr(settings, 'BOOKING_END_TIME', '21:00')
        
        start_hour, start_min = map(int, start_time_str.split(':'))
        end_hour, end_min = map(int, end_time_str.split(':'))
        
        start_time = time(start_hour, start_min)
        end_time = time(end_hour, end_min)
        
        if not (start_time <= now.time() < end_time):
            return Response({
                "error": f"Token booking is available from {start_time_str} to {end_time_str}."
            }, status=status.HTTP_400_BAD_REQUEST)

        today = timezone.now().date()
        patient_name = request.data.get('patient_name', '')
        phone = request.data.get('phone', '')



        if not patient_name or not phone:
            return Response(
                {"error": "Name and phone are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        



        
        last_token = Token.objects.filter(doctor=doctor, date=today).order_by('-token_number').first()
        token_number = 1 if not last_token else last_token.token_number + 1

        with transaction.atomic():

            last_token = Token.objects.select_for_update().filter(
                doctor=doctor, date=today
            ).order_by('-token_number').first()

            token_number = 1 if not last_token else last_token.token_number + 1

            token = Token.objects.create(
                user=request.user if request.user.is_authenticated else None,
                patient_name=patient_name,
                phone=phone,
                doctor=doctor,
                token_number=token_number,
                date=today
            )
            















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
             
        # If after 9:00 PM, show zero/reset state
        if self._is_after_reset():
            return Response({
                "id": None,
                "token_number": 0, 
                "status": "PENDING",
                "message": "Queue has been reset for the day"
            })
            
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
            return Response({
                "id": None,
                "token_number": last_completed.token_number, 
                "status": "COMPLETED",
                "message": "No active token"
            })
            
        return Response({
            "id": None,
            "token_number": 0, 
            "status": "PENDING",
            "message": "No tokens started yet"
        })
