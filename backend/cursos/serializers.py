from rest_framework import serializers
from .models import Curso


class CursoSerializer(serializers.ModelSerializer):
    cupos_disponibles = serializers.SerializerMethodField()
    
    class Meta:
        model = Curso
        fields = [
            'id', 'nombre_curso', 'categoria', 'nivel', 'duracion_semanas',
            'costo', 'estado_curso', 'fecha_inicio', 'fecha_fin',
            'cupo_maximo', 'inscritos_actuales', 'cupos_disponibles',
            'imagen', 'descripcion'
        ]
    
    def get_cupos_disponibles(self, obj):
        return obj.cupo_maximo - obj.inscritos_actuales
