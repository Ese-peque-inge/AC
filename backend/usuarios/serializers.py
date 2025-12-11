from rest_framework import serializers
from .models import Usuario, Alumno, Instructor, Curso, Inscripcion, DetalleInscripcion, Alerta


# ==============================
# USUARIO SERIALIZERS
# ==============================
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'tipo_usuario', 'fecha_registro', 'is_active']
        read_only_fields = ['fecha_registro']


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


# ==============================
# ALUMNO SERIALIZERS
# ==============================
class AlumnoSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    
    class Meta:
        model = Alumno
        fields = '__all__'


class RegistroAlumnoSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    nombre_completo = serializers.CharField(max_length=100)
    telefono = serializers.CharField(max_length=20, required=False, allow_blank=True)
    direccion = serializers.CharField(max_length=150, required=False, allow_blank=True)
    tipo_documento = serializers.CharField(max_length=20, required=False, allow_blank=True)
    numero_documento = serializers.CharField(max_length=30, required=False, allow_blank=True)

    def create(self, validated_data):
        # Crear usuario con tipo_usuario correcto
        usuario = Usuario.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            tipo_usuario='Alumno'   # <-- CORRECTO
        )
        
        # Crear perfil de alumno
        alumno = Alumno.objects.create(
            usuario=usuario,
            nombre_completo=validated_data['nombre_completo'],
            telefono=validated_data.get('telefono', ''),
            direccion=validated_data.get('direccion', ''),
            tipo_documento=validated_data.get('tipo_documento', ''),
            numero_documento=validated_data.get('numero_documento', '')
        )
        
        return usuario


# ==============================
# INSTRUCTOR SERIALIZERS
# ==============================
class InstructorSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer(read_only=True)
    
    class Meta:
        model = Instructor
        fields = '__all__'


class RegistroInstructorSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    nombre_completo = serializers.CharField(max_length=100)
    especialidad = serializers.CharField(max_length=50)

    def create(self, validated_data):
        # Crear usuario con tipo_usuario correcto
        usuario = Usuario.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            tipo_usuario='Instructor'  # <-- CORRECTO
        )
        
        # Crear perfil de instructor
        instructor = Instructor.objects.create(
            usuario=usuario,
            nombre_completo=validated_data['nombre_completo'],
            especialidad=validated_data['especialidad']
        )
        
        return usuario


# ==============================
# CURSO SERIALIZERS
# ==============================
class CursoSerializer(serializers.ModelSerializer):
    cupos_disponibles = serializers.SerializerMethodField()
    
    class Meta:
        model = Curso
        fields = '__all__'
    
    def get_cupos_disponibles(self, obj):
        return obj.cupo_maximo - obj.inscritos_actuales


# ==============================
# INSCRIPCION SERIALIZERS
# ==============================
class InscripcionSerializer(serializers.ModelSerializer):
    alumno_nombre = serializers.CharField(source='alumno.nombre_completo', read_only=True)
    curso_nombre = serializers.CharField(source='curso.nombre_curso', read_only=True)
    instructor_nombre = serializers.CharField(source='instructor.nombre_completo', read_only=True)
    
    class Meta:
        model = Inscripcion
        fields = '__all__'


# ==============================
# DETALLE INSCRIPCION SERIALIZERS
# ==============================
class DetalleInscripcionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleInscripcion
        fields = '__all__'


# ==============================
# ALERTA SERIALIZERS
# ==============================
class AlertaSerializer(serializers.ModelSerializer):
    curso_nombre = serializers.CharField(source='curso.nombre_curso', read_only=True)
    
    class Meta:
        model = Alerta
        fields = '__all__'
