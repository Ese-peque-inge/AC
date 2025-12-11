from django.db import models
from usuarios.models import Usuario


class Instructor(models.Model):
    ESTADOS = [
        ('Activo', 'Activo'),
        ('Inactivo', 'Inactivo'),
    ]
    
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='perfil_instructor')
    nombre_completo = models.CharField(max_length=100)
    especialidad = models.CharField(max_length=50)
    fecha_ingreso = models.DateField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Activo')

    def __str__(self):
        return self.nombre_completo

    class Meta:
        db_table = 'instructores'
        verbose_name = 'Instructor'
        verbose_name_plural = 'Instructores'
