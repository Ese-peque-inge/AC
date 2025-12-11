from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Inscripcion, DetalleInscripcion
from .serializers import InscripcionSerializer, CrearInscripcionSerializer, DetalleInscripcionSerializer
from auditorias.models import AuditoriaInscripciones
from alumnos.models import Alumno


class InscripcionViewSet(viewsets.ModelViewSet):
    queryset = Inscripcion.objects.all().select_related('alumno', 'curso', 'instructor')
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return CrearInscripcionSerializer
        return InscripcionSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtrar por alumno
        alumno_id = self.request.query_params.get('alumno', None)
        if alumno_id:
            queryset = queryset.filter(alumno_id=alumno_id)
        
        # Filtrar por curso
        curso_id = self.request.query_params.get('curso', None)
        if curso_id:
            queryset = queryset.filter(curso_id=curso_id)
        
        # Filtrar por estado
        estado = self.request.query_params.get('estado', None)
        if estado:
            queryset = queryset.filter(estado_inscripcion=estado)
        
        return queryset.order_by('-fecha_inscripcion')

    def perform_create(self, serializer):
        inscripcion = serializer.save()
        # Registrar en auditoría
        AuditoriaInscripciones.objects.create(
            inscripcion_id=inscripcion.id,
            alumno_id=inscripcion.alumno.id,
            curso_id=inscripcion.curso.id,
            accion='CREAR',
            descripcion=f'Nueva inscripción: {inscripcion.alumno.nombre_completo} en {inscripcion.curso.nombre_curso}'
        )

    def perform_update(self, serializer):
        inscripcion = serializer.save()
        # Registrar en auditoría
        AuditoriaInscripciones.objects.create(
            inscripcion_id=inscripcion.id,
            alumno_id=inscripcion.alumno.id,
            curso_id=inscripcion.curso.id,
            accion='ACTUALIZAR',
            descripcion=f'Inscripción actualizada: #{inscripcion.id}'
        )

    def perform_destroy(self, instance):
        # Registrar en auditoría antes de eliminar
        AuditoriaInscripciones.objects.create(
            inscripcion_id=instance.id,
            alumno_id=instance.alumno.id,
            curso_id=instance.curso.id,
            accion='ELIMINAR',
            descripcion=f'Inscripción eliminada: #{instance.id}'
        )
        
        # Decrementar inscritos en el curso
        curso = instance.curso
        curso.inscritos_actuales = max(0, curso.inscritos_actuales - 1)
        curso.save()
        
        instance.delete()

    @action(detail=False, methods=['get'])
    def mis_inscripciones(self, request):
        """Obtener inscripciones del alumno autenticado"""
        try:
            alumno = Alumno.objects.get(usuario=request.user)
            inscripciones = self.get_queryset().filter(alumno=alumno)
            serializer = InscripcionSerializer(inscripciones, many=True)
            return Response(serializer.data)
        except Alumno.DoesNotExist:
            return Response(
                {'error': 'No se encontró el perfil de alumno'},
                status=status.HTTP_404_NOT_FOUND
            )


class DetalleInscripcionViewSet(viewsets.ModelViewSet):
    queryset = DetalleInscripcion.objects.all()
    serializer_class = DetalleInscripcionSerializer
    permission_classes = [IsAuthenticated]
