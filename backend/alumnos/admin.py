from django.contrib import admin
from .models import Alumno

@admin.register(Alumno)
class AlumnoAdmin(admin.ModelAdmin):
    list_display = ['nombre_completo', 'telefono', 'tipo_documento', 'numero_documento', 'fecha_registro']
    search_fields = ['nombre_completo', 'numero_documento']
    list_filter = ['fecha_registro']
