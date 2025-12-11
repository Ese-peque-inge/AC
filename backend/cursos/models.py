from django.db import models


class Curso(models.Model):
    ESTADOS = [
        ('Activo', 'Activo'),
        ('Inactivo', 'Inactivo'),
        ('Finalizado', 'Finalizado'),
    ]
    
    CATEGORIAS = [
        ('Teclado', 'Teclado'),
        ('Guitarra', 'Guitarra'),
        ('Bateria', 'Bateria'),
        ('Violin', 'Violin'),
    ]
    
    nombre_curso = models.CharField(max_length=100)
    categoria = models.CharField(max_length=30, choices=CATEGORIAS, default='Guitarra')
    nivel = models.CharField(max_length=30)
    duracion_semanas = models.IntegerField()
    costo = models.DecimalField(max_digits=10, decimal_places=2)
    estado_curso = models.CharField(max_length=20, choices=ESTADOS, default='Activo')
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    cupo_maximo = models.IntegerField()
    inscritos_actuales = models.IntegerField(default=0)
    imagen = models.ImageField(upload_to='cursos/', blank=True, null=True)
    descripcion = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.nombre_curso} - {self.nivel}"

    class Meta:
        db_table = 'cursos'
        verbose_name = 'Curso'
        verbose_name_plural = 'Cursos'
