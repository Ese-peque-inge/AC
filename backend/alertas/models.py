from django.db import models
from cursos.models import Curso


class Alerta(models.Model):
    TIPOS = [
        ('Cupo Lleno', 'Cupo Lleno'),
        ('Curso Iniciando', 'Curso Iniciando'),
        ('Curso Finalizado', 'Curso Finalizado'),
    ]
    
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE, related_name='alertas')
    tipo_alerta = models.CharField(max_length=50, choices=TIPOS)
    mensaje = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)
    atendida = models.BooleanField(default=False)

    def __str__(self):
        return f"[{self.tipo_alerta}] {self.curso.nombre_curso}"

    class Meta:
        db_table = 'alertas'
        verbose_name = 'Alerta'
        verbose_name_plural = 'Alertas'
        ordering = ['-fecha']
