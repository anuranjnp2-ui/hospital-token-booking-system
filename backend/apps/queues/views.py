from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import QueueStatus
from .serializers import QueueStatusSerializer

class QueueStatusViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = QueueStatus.objects.all()
    serializer_class = QueueStatusSerializer
    permission_classes = [AllowAny]
