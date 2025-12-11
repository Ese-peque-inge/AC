from django.contrib import admin
from .models import Instructor

@admin.register(Instructor)
class InstructorAdmin(admin.ModelAdmin):
    list_display = ['nombre_completo', 'especialidad', 'estado', 'fecha_ingreso']
    search_fields = ['nombre_completo', 'especialidad']
    list_filter = ['estado', 'fecha_ingreso']
