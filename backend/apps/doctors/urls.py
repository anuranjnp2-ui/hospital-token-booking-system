#from django.urls import path, include
#from rest_framework.routers import DefaultRouter
#from .views import DoctorViewSet, DepartmentViewSet, HospitalViewSet, ServiceViewSet, DoctorBreakViewSet

#router = DefaultRouter()
#router.register(r'doctors', DoctorViewSet)
#router.register(r'departments', DepartmentViewSet)
#router.register(r'hospital', HospitalViewSet)
#router.register(r'services', ServiceViewSet)
#router.register(r'breaks', DoctorBreakViewSet)

#urlpatterns = [
#    path('', include(router.urls)),
#]


from django.urls import path, include 
from rest_framework.routers import DefaultRouter
from .views import DoctorViewSet, DepartmentViewSet, HospitalViewSet, ServiceViewSet, DoctorBreakViewSet

router = DefaultRouter()

# ✅ FIX HERE
router.register(r'', DoctorViewSet, basename='doctors')

router.register(r'departments', DepartmentViewSet)
router.register(r'hospital', HospitalViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'breaks', DoctorBreakViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
