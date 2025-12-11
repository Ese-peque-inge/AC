from django.contrib import admin
from .models import (
    Usuario, Alumno, Instructor, Curso, 
    Inscripcion, DetalleInscripcion, 
    AuditoriaInscripciones, AuditoriaCursos, Alerta
)

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'tipo_usuario', 'is_active', 'fecha_registro']
    list_filter = ['tipo_usuario', 'is_active', 'fecha_registro']
    search_fields = ['username', 'email']
    ordering = ['-fecha_registro']


@admin.register(Alumno)
class AlumnoAdmin(admin.ModelAdmin):
    list_display = ['nombre_completo', 'telefono', 'tipo_documento', 'numero_documento', 'fecha_registro']
    list_filter = ['fecha_registro']
    search_fields = ['nombre_completo', 'numero_documento', 'telefono']
    ordering = ['-fecha_registro']


@admin.register(Instructor)
class InstructorAdmin(admin.ModelAdmin):
    list_display = ['nombre_completo', 'especialidad', 'estado', 'fecha_ingreso']
    list_filter = ['estado', 'especialidad', 'fecha_ingreso']
    search_fields = ['nombre_completo', 'especialidad']
    ordering = ['-fecha_ingreso']


@admin.register(Curso)
class CursoAdmin(admin.ModelAdmin):
    list_display = ['nombre_curso', 'nivel', 'duracion_semanas', 'costo', 'estado_curso', 'inscritos_actuales', 'cupo_maximo']
    list_filter = ['estado_curso', 'nivel', 'fecha_inicio']
    search_fields = ['nombre_curso', 'nivel']
    ordering = ['-fecha_inicio']


@admin.register(Inscripcion)
class InscripcionAdmin(admin.ModelAdmin):
    list_display = ['id', 'alumno', 'curso', 'instructor', 'fecha_inscripcion', 'estado_inscripcion', 'total_pago']
    list_filter = ['estado_inscripcion', 'metodo_pago', 'fecha_inscripcion']
    search_fields = ['alumno__nombre_completo', 'curso__nombre_curso']
    ordering = ['-fecha_inscripcion']


@admin.register(DetalleInscripcion)
class DetalleInscripcionAdmin(admin.ModelAdmin):
    list_display = ['inscripcion', 'concepto', 'cantidad', 'precio_unitario', 'subtotal']
    list_filter = ['concepto']
    search_fields = ['concepto', 'inscripcion__id']


@admin.register(AuditoriaInscripciones)
class AuditoriaInscripcionesAdmin(admin.ModelAdmin):
    list_display = ['inscripcion_id', 'alumno_id', 'curso_id', 'accion', 'fecha']
    list_filter = ['accion', 'fecha']
    search_fields = ['inscripcion_id', 'alumno_id', 'curso_id', 'descripcion']
    ordering = ['-fecha']


@admin.register(AuditoriaCursos)
class AuditoriaCursosAdmin(admin.ModelAdmin):
    list_display = ['curso_id', 'accion', 'fecha']
    list_filter = ['accion', 'fecha']
    search_fields = ['curso_id', 'descripcion']
    ordering = ['-fecha']


@admin.register(Alerta)
class AlertaAdmin(admin.ModelAdmin):
    list_display = ['curso', 'tipo_alerta', 'fecha', 'atendida']
    list_filter = ['tipo_alerta', 'atendida', 'fecha']
    search_fields = ['curso__nombre_curso', 'tipo_alerta', 'mensaje']
    ordering = ['-fecha']
