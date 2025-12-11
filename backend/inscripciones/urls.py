from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InscripcionViewSet, DetalleInscripcionViewSet

router = DefaultRouter()
router.register(r'', InscripcionViewSet, basename='inscripcion')
router.register(r'detalles', DetalleInscripcionViewSet, basename='detalle-inscripcion')

urlpatterns = [
    path('', include(router.urls)),
]
