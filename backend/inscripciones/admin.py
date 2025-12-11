from django.contrib import admin
from .models import Inscripcion, DetalleInscripcion

class DetalleInscripcionInline(admin.TabularInline):
    model = DetalleInscripcion
    extra = 1

@admin.register(Inscripcion)
class InscripcionAdmin(admin.ModelAdmin):
    list_display = ['id', 'alumno', 'curso', 'instructor', 'fecha_inscripcion', 'estado_inscripcion', 'total_pago']
    search_fields = ['alumno__nombre_completo', 'curso__nombre_curso']
    list_filter = ['estado_inscripcion', 'fecha_inscripcion']
    inlines = [DetalleInscripcionInline]
