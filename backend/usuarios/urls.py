from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

# Router para ViewSets
router = DefaultRouter()
router.register(r'alumnos', views.AlumnoViewSet, basename='alumno')
router.register(r'instructores', views.InstructorViewSet, basename='instructor')
router.register(r'cursos', views.CursoViewSet, basename='curso')
router.register(r'inscripciones', views.InscripcionViewSet, basename='inscripcion')
router.register(r'detalle-inscripciones', views.DetalleInscripcionViewSet, basename='detalle-inscripcion')
router.register(r'alertas', views.AlertaViewSet, basename='alerta')

urlpatterns = [
    # Autenticación
    path('registro/alumno/', views.registro_alumno, name='registro_alumno'),
    path('registro/instructor/', views.registro_instructor, name='registro_instructor'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('perfil/', views.perfil_usuario, name='perfil_usuario'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # ViewSets routes
    path('', include(router.urls)),
]
