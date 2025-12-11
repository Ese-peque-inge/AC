from django.db import models
from alumnos.models import Alumno
from cursos.models import Curso
from instructores.models import Instructor


class Inscripcion(models.Model):
    ESTADOS = [
        ('Activa', 'Activa'),
        ('Cancelada', 'Cancelada'),
        ('Finalizada', 'Finalizada'),
    ]
    
    METODOS_PAGO = [
        ('Efectivo', 'Efectivo'),
        ('Tarjeta', 'Tarjeta'),
        ('Transferencia', 'Transferencia'),
    ]
    
    alumno = models.ForeignKey(Alumno, on_delete=models.CASCADE, related_name='inscripciones')
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE, related_name='inscripciones')
    instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE, related_name='inscripciones')
    fecha_inscripcion = models.DateField(auto_now_add=True)
    metodo_pago = models.CharField(max_length=30, choices=METODOS_PAGO)
    estado_inscripcion = models.CharField(max_length=20, choices=ESTADOS, default='Activa')
    total_pago = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Inscripción #{self.id} - {self.alumno.nombre_completo}"

    class Meta:
        db_table = 'inscripciones'
        verbose_name = 'Inscripción'
        verbose_name_plural = 'Inscripciones'


class DetalleInscripcion(models.Model):
    inscripcion = models.ForeignKey(Inscripcion, on_delete=models.CASCADE, related_name='detalles')
    concepto = models.CharField(max_length=50)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.concepto} (${self.subtotal})"

    class Meta:
        db_table = 'detalle_inscripciones'
        verbose_name = 'Detalle de Inscripción'
        verbose_name_plural = 'Detalles de Inscripciones'
