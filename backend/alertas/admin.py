from django.contrib import admin
from .models import Alerta

@admin.register(Alerta)
class AlertaAdmin(admin.ModelAdmin):
    list_display = ['curso', 'tipo_alerta', 'fecha', 'atendida']
    list_filter = ['tipo_alerta', 'atendida', 'fecha']
    search_fields = ['mensaje']
