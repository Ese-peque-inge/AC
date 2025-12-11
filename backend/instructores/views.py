from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Instructor
from .serializers import InstructorSerializer


class InstructorViewSet(viewsets.ModelViewSet):
    queryset = Instructor.objects.all().select_related('usuario')
    serializer_class = InstructorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        # Búsqueda por nombre
        busqueda = self.request.query_params.get('busqueda', None)
        if busqueda:
            queryset = queryset.filter(nombre_completo__icontains=busqueda)
        
        # Filtrar por estado
        estado = self.request.query_params.get('estado', None)
        if estado:
            queryset = queryset.filter(estado=estado)
        
        return queryset

    @action(detail=False, methods=['get'])
    def mi_perfil(self, request):
        """Obtener perfil del instructor autenticado"""
        try:
            instructor = Instructor.objects.get(usuario=request.user)
            serializer = self.get_serializer(instructor)
            return Response(serializer.data)
        except Instructor.DoesNotExist:
            return Response(
                {'error': 'No se encontró el perfil de instructor'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def activos(self, request):
        """Obtener instructores activos"""
        instructores = self.get_queryset().filter(estado='Activo')
        serializer = self.get_serializer(instructores, many=True)
        return Response(serializer.data)
