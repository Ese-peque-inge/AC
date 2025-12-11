from django.db import models
from django.contrib.auth.models import AbstractUser


# ==============================
# 1. USUARIOS (login centralizado)
# ==============================
class Usuario(AbstractUser):
    TIPO_USUARIO_CHOICES = [
        ('Administrador', 'Administrador'),
        ('Instructor', 'Instructor'),
        ('Alumno', 'Alumno'),
    ]
    
    ESTADO_CHOICES = [
        ('Activo', 'Activo'),
        ('Inactivo', 'Inactivo'),
    ]

    tipo_usuario = models.CharField(max_length=20, choices=TIPO_USUARIO_CHOICES)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='Activo')
    fecha_registro = models.DateField(auto_now_add=True)

    # username, password y email ya vienen de AbstractUser

    def __str__(self):
        return f"{self.username} ({self.tipo_usuario})"


# ==============================
# 2. RECUPERAR CONTRASEÑA
# ==============================
class RecuperarContrasena(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    fecha_solicitud = models.DateTimeField(auto_now_add=True)
    fecha_expiracion = models.DateTimeField()
    usado = models.BooleanField(default=False)

    def __str__(self):
        return f"Token de {self.usuario.username} - {'Usado' if self.usado else 'Válido'}"


# ==============================
# 3. ALUMNOS
# ==============================
class Alumno(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    nombre_completo = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.CharField(max_length=150, blank=True, null=True)
    tipo_documento = models.CharField(max_length=20, blank=True, null=True)
    numero_documento = models.CharField(max_length=30, blank=True, null=True)
    fecha_registro = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.nombre_completo


# ==============================
# 4. INSTRUCTORES
# ==============================
class Instructor(models.Model):
    ESTADO_CHOICES = [
        ('Activo', 'Activo'),
        ('Inactivo', 'Inactivo'),
    ]
    
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    nombre_completo = models.CharField(max_length=100)
    especialidad = models.CharField(max_length=50)
    fecha_ingreso = models.DateField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='Activo')

    def __str__(self):
        return self.nombre_completo


# ==============================
# 5. ADMINISTRADORES
# ==============================
class Administrador(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    nombre_completo = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre_completo


# ==============================
# 6. CURSOS
# ==============================
class Curso(models.Model):
    ESTADO_CURSO_CHOICES = [
        ('Activo', 'Activo'),
        ('Finalizado', 'Finalizado'),
        ('Cancelado', 'Cancelado'),
    ]
    
    nombre_curso = models.CharField(max_length=100)
    nivel = models.CharField(max_length=30)
    duracion_semanas = models.IntegerField()
    costo = models.DecimalField(max_digits=10, decimal_places=2)
    estado_curso = models.CharField(max_length=20, choices=ESTADO_CURSO_CHOICES, default='Activo')
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    cupo_maximo = models.IntegerField(default=20)
    inscritos_actuales = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.nombre_curso} - {self.nivel}"


# ==============================
# 7. INSCRIPCIONES
# ==============================
class Inscripcion(models.Model):
    alumno = models.ForeignKey(Alumno, on_delete=models.CASCADE)
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE)
    instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE)
    fecha_inscripcion = models.DateField(auto_now_add=True)
    metodo_pago = models.CharField(max_length=30)
    estado_inscripcion = models.CharField(max_length=20, default='Activa')
    total_pago = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Inscripción #{self.id} - {self.alumno.nombre_completo}"


# ==============================
# 8. DETALLE DE INSCRIPCIONES
# ==============================
class DetalleInscripcion(models.Model):
    inscripcion = models.ForeignKey(Inscripcion, on_delete=models.CASCADE, related_name='detalles')
    concepto = models.CharField(max_length=50)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.concepto} (${self.subtotal})"


# ==============================
# 9. AUDITORÍA INSCRIPCIONES
# ==============================
class AuditoriaInscripciones(models.Model):
    inscripcion_id = models.IntegerField()
    alumno_id = models.IntegerField()
    curso_id = models.IntegerField()
    accion = models.CharField(max_length=20)
    fecha = models.DateTimeField(auto_now_add=True)
    descripcion = models.TextField(blank=True, null=True)


# ==============================
# 10. AUDITORÍA CURSOS
# ==============================
class AuditoriaCursos(models.Model):
    curso_id = models.IntegerField()
    accion = models.CharField(max_length=20)
    fecha = models.DateTimeField(auto_now_add=True)
    descripcion = models.TextField(blank=True, null=True)


# ==============================
# 11. ALERTAS
# ==============================
class Alerta(models.Model):
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE)
    tipo_alerta = models.CharField(max_length=50)
    mensaje = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)
    atendida = models.BooleanField(default=False)

    def __str__(self):
        return f"[{self.tipo_alerta}] {self.curso.nombre_curso}"
