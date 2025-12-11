from django.contrib import admin
from .models import Curso

@admin.register(Curso)
class CursoAdmin(admin.ModelAdmin):
    list_display = ['nombre_curso', 'categoria', 'nivel', 'costo', 'estado_curso', 'inscritos_actuales', 'cupo_maximo']
    search_fields = ['nombre_curso', 'nivel']
    list_filter = ['categoria', 'estado_curso', 'nivel']
