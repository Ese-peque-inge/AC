from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Alumno
from .serializers import AlumnoSerializer


class AlumnoViewSet(viewsets.ModelViewSet):
    queryset = Alumno.objects.all().select_related('usuario')
    serializer_class = AlumnoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        # Búsqueda por nombre
        busqueda = self.request.query_params.get('busqueda', None)
        if busqueda:
            queryset = queryset.filter(nombre_completo__icontains=busqueda)
        return queryset

    @action(detail=False, methods=['get'])
    def mi_perfil(self, request):
        """Obtener perfil del alumno autenticado"""
        try:
            alumno = Alumno.objects.get(usuario=request.user)
            serializer = self.get_serializer(alumno)
            return Response(serializer.data)
        except Alumno.DoesNotExist:
            return Response(
                {'error': 'No se encontró el perfil de alumno'},
                status=status.HTTP_404_NOT_FOUND
            )
