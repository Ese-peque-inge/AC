from rest_framework import serializers
from .models import Instructor
from usuarios.serializers import UsuarioSerializer


class InstructorSerializer(serializers.ModelSerializer):
    usuario_data = UsuarioSerializer(source='usuario', read_only=True)
    email = serializers.EmailField(source='usuario.email', read_only=True)
    nombre_usuario = serializers.CharField(source='usuario.nombre_usuario', read_only=True)
    
    class Meta:
        model = Instructor
        fields = [
            'id', 'usuario', 'usuario_data', 'email', 'nombre_usuario',
            'nombre_completo', 'especialidad', 'fecha_ingreso', 'estado'
        ]
        read_only_fields = ['fecha_ingreso']
