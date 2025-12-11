from rest_framework import serializers
from .models import Alumno
from usuarios.serializers import UsuarioSerializer


class AlumnoSerializer(serializers.ModelSerializer):
    usuario_data = UsuarioSerializer(source='usuario', read_only=True)
    email = serializers.EmailField(source='usuario.email', read_only=True)
    nombre_usuario = serializers.CharField(source='usuario.nombre_usuario', read_only=True)
    
    class Meta:
        model = Alumno
        fields = [
            'id', 'usuario', 'usuario_data', 'email', 'nombre_usuario',
            'nombre_completo', 'telefono', 'direccion', 
            'tipo_documento', 'numero_documento', 'fecha_registro'
        ]
        read_only_fields = ['fecha_registro']
