from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import (
    Usuario, Alumno, Instructor, Curso, 
    Inscripcion, DetalleInscripcion, Alerta
)
from .serializers import (
    UsuarioSerializer, AlumnoSerializer, InstructorSerializer,
    CursoSerializer, InscripcionSerializer, DetalleInscripcionSerializer,
    AlertaSerializer, RegistroAlumnoSerializer, RegistroInstructorSerializer,
    LoginSerializer
)


# ==============================
# AUTH VIEWS
# ==============================
@api_view(['POST'])
@permission_classes([AllowAny])
def registro_alumno(request):
    """Registro de nuevo alumno"""
    serializer = RegistroAlumnoSerializer(data=request.data)
    if serializer.is_valid():
        usuario = serializer.save()
        refresh = RefreshToken.for_user(usuario)
        
        return Response({
            'message': 'Alumno registrado exitosamente',
            'usuario': UsuarioSerializer(usuario).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def registro_instructor(request):
    """Registro de nuevo instructor"""
    serializer = RegistroInstructorSerializer(data=request.data)
    if serializer.is_valid():
        usuario = serializer.save()
        refresh = RefreshToken.for_user(usuario)
        
        return Response({
            'message': 'Instructor registrado exitosamente',
            'usuario': UsuarioSerializer(usuario).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Login de usuario"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        # Autenticar usuario
        user = authenticate(request, username=username, password=password)
        
        if user is None:
            return Response({
                'error': 'Usuario o contraseña incorrecta'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Generar tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Login exitoso',
            'usuario': UsuarioSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def perfil_usuario(request):
    """Obtener perfil del usuario autenticado"""
    serializer = UsuarioSerializer(request.user)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """Logout de usuario"""
    return Response({'message': 'Logout exitoso'}, status=status.HTTP_200_OK)


# ==============================
# ALUMNO VIEWSET
# ==============================
class AlumnoViewSet(viewsets.ModelViewSet):
    queryset = Alumno.objects.all()
    serializer_class = AlumnoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Alumno.objects.all()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(nombre_completo__icontains=search)
        return queryset


# ==============================
# INSTRUCTOR VIEWSET
# ==============================
class InstructorViewSet(viewsets.ModelViewSet):
    queryset = Instructor.objects.all()
    serializer_class = InstructorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Instructor.objects.all()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(nombre_completo__icontains=search)
        return queryset


# ==============================
# CURSO VIEWSET
# ==============================
class CursoViewSet(viewsets.ModelViewSet):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        queryset = Curso.objects.all()
        search = self.request.query_params.get('search', None)
        nivel = self.request.query_params.get('nivel', None)
        estado = self.request.query_params.get('estado', None)
        
        if search:
            queryset = queryset.filter(nombre_curso__icontains=search)
        if nivel:
            queryset = queryset.filter(nivel=nivel)
        if estado:
            queryset = queryset.filter(estado_curso=estado)
            
        return queryset

    @action(detail=False, methods=['get'])
    def publicos(self, request):
        """Obtener cursos activos para página pública"""
        cursos = Curso.objects.filter(estado_curso='Activo')
        serializer = self.get_serializer(cursos, many=True)
        return Response(serializer.data)


# ==============================
# INSCRIPCION VIEWSET
# ==============================
class InscripcionViewSet(viewsets.ModelViewSet):
    queryset = Inscripcion.objects.all()
    serializer_class = InscripcionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Inscripcion.objects.all()
        alumno_id = self.request.query_params.get('alumno', None)
        curso_id = self.request.query_params.get('curso', None)
        
        if alumno_id:
            queryset = queryset.filter(alumno_id=alumno_id)
        if curso_id:
            queryset = queryset.filter(curso_id=curso_id)
            
        return queryset

    def create(self, request, *args, **kwargs):
        # Verificar cupos disponibles
        curso_id = request.data.get('curso')
        try:
            curso = Curso.objects.get(id=curso_id)
            if curso.inscritos_actuales >= curso.cupo_maximo:
                return Response({
                    'error': 'No hay cupos disponibles'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Crear inscripción
            response = super().create(request, *args, **kwargs)
            
            # Incrementar inscritos_actuales
            curso.inscritos_actuales += 1
            curso.save()
            
            return response
        except Curso.DoesNotExist:
            return Response({
                'error': 'Curso no encontrado'
            }, status=status.HTTP_404_NOT_FOUND)


# ==============================
# DETALLE INSCRIPCION VIEWSET
# ==============================
class DetalleInscripcionViewSet(viewsets.ModelViewSet):
    queryset = DetalleInscripcion.objects.all()
    serializer_class = DetalleInscripcionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = DetalleInscripcion.objects.all()
        inscripcion_id = self.request.query_params.get('inscripcion', None)
        
        if inscripcion_id:
            queryset = queryset.filter(inscripcion_id=inscripcion_id)
            
        return queryset


# ==============================
# ALERTA VIEWSET
# ==============================
class AlertaViewSet(viewsets.ModelViewSet):
    queryset = Alerta.objects.all()
    serializer_class = AlertaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Alerta.objects.all()
        atendida = self.request.query_params.get('atendida', None)
        
        if atendida is not None:
            atendida_bool = atendida.lower() == 'true'
            queryset = queryset.filter(atendida=atendida_bool)
            
        return queryset.order_by('-fecha')
