from rest_framework import serializers
from .models import Inscripcion, DetalleInscripcion
from alumnos.serializers import AlumnoSerializer
from cursos.serializers import CursoSerializer
from instructores.serializers import InstructorSerializer


class DetalleInscripcionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleInscripcion
        fields = ['id', 'inscripcion', 'concepto', 'cantidad', 'precio_unitario', 'subtotal']


class InscripcionSerializer(serializers.ModelSerializer):
    alumno_data = AlumnoSerializer(source='alumno', read_only=True)
    curso_data = CursoSerializer(source='curso', read_only=True)
    instructor_data = InstructorSerializer(source='instructor', read_only=True)
    detalles = DetalleInscripcionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Inscripcion
        fields = [
            'id', 'alumno', 'curso', 'instructor', 'fecha_inscripcion',
            'metodo_pago', 'estado_inscripcion', 'total_pago',
            'alumno_data', 'curso_data', 'instructor_data', 'detalles'
        ]
        read_only_fields = ['fecha_inscripcion']


class CrearInscripcionSerializer(serializers.ModelSerializer):
    detalles = DetalleInscripcionSerializer(many=True, required=False)
    
    class Meta:
        model = Inscripcion
        fields = [
            'alumno', 'curso', 'instructor', 'metodo_pago',
            'estado_inscripcion', 'total_pago', 'detalles'
        ]
    
    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles', [])
        inscripcion = Inscripcion.objects.create(**validated_data)
        
        # Crear detalles
        for detalle_data in detalles_data:
            DetalleInscripcion.objects.create(inscripcion=inscripcion, **detalle_data)
        
        # Incrementar inscritos en el curso
        curso = inscripcion.curso
        curso.inscritos_actuales += 1
        curso.save()
        
        return inscripcion
