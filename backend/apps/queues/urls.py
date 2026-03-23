from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QueueStatusViewSet

router = DefaultRouter()
router.register(r'queue-status', QueueStatusViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
