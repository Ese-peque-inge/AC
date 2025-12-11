from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Curso
from .serializers import CursoSerializer
from auditorias.models import AuditoriaCursos


class CursoViewSet(viewsets.ModelViewSet):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer

    def get_permissions(self):
        # Permitir acceso público a listar y ver cursos
        if self.action in ['list', 'retrieve', 'publicos', 'por_categoria']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Búsqueda por nombre
        busqueda = self.request.query_params.get('busqueda', None)
        if busqueda:
            queryset = queryset.filter(nombre_curso__icontains=busqueda)
        
        # Filtrar por estado
        estado = self.request.query_params.get('estado', None)
        if estado:
            queryset = queryset.filter(estado_curso=estado)
        
        # Filtrar por categoría
        categoria = self.request.query_params.get('categoria', None)
        if categoria:
            queryset = queryset.filter(categoria=categoria)
        
        return queryset.order_by('-fecha_inicio')

    def perform_create(self, serializer):
        curso = serializer.save()
        # Registrar en auditoría
        AuditoriaCursos.objects.create(
            curso_id=curso.id,
            accion='CREAR',
            descripcion=f'Curso creado: {curso.nombre_curso}'
        )

    def perform_update(self, serializer):
        curso = serializer.save()
        # Registrar en auditoría
        AuditoriaCursos.objects.create(
            curso_id=curso.id,
            accion='ACTUALIZAR',
            descripcion=f'Curso actualizado: {curso.nombre_curso}'
        )

    def perform_destroy(self, instance):
        # Registrar en auditoría antes de eliminar
        AuditoriaCursos.objects.create(
            curso_id=instance.id,
            accion='ELIMINAR',
            descripcion=f'Curso eliminado: {instance.nombre_curso}'
        )
        instance.delete()

    @action(detail=False, methods=['get'])
    def publicos(self, request):
        """Obtener cursos activos para vista pública"""
        cursos = self.get_queryset().filter(estado_curso='Activo')
        serializer = self.get_serializer(cursos, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def por_categoria(self, request):
        """Obtener cursos agrupados por categoría"""
        categorias = ['Teclado', 'Guitarra', 'Bateria', 'Violin']
        resultado = {}
        
        for categoria in categorias:
            cursos = self.get_queryset().filter(
                categoria=categoria, 
                estado_curso='Activo'
            )
            resultado[categoria] = self.get_serializer(cursos, many=True).data
        
        return Response(resultado)
