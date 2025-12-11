from rest_framework import serializers
from .models import Alerta
from cursos.serializers import CursoSerializer


class AlertaSerializer(serializers.ModelSerializer):
    curso_data = CursoSerializer(source='curso', read_only=True)
    
    class Meta:
        model = Alerta
        fields = ['id', 'curso', 'tipo_alerta', 'mensaje', 'fecha', 'atendida', 'curso_data']
