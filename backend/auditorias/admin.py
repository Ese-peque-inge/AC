from django.contrib import admin
from .models import AuditoriaInscripciones, AuditoriaCursos

@admin.register(AuditoriaInscripciones)
class AuditoriaInscripcionesAdmin(admin.ModelAdmin):
    list_display = ['inscripcion_id', 'alumno_id', 'curso_id', 'accion', 'fecha']
    list_filter = ['accion', 'fecha']
    search_fields = ['descripcion']

@admin.register(AuditoriaCursos)
class AuditoriaCursosAdmin(admin.ModelAdmin):
    list_display = ['curso_id', 'accion', 'fecha']
    list_filter = ['accion', 'fecha']
    search_fields = ['descripcion']
