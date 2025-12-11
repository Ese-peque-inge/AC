from django.db import models


class AuditoriaInscripciones(models.Model):
    inscripcion_id = models.IntegerField()
    alumno_id = models.IntegerField()
    curso_id = models.IntegerField()
    accion = models.CharField(max_length=20)
    fecha = models.DateTimeField(auto_now_add=True)
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'auditoria_inscripciones'
        verbose_name = 'Auditoría de Inscripción'
        verbose_name_plural = 'Auditorías de Inscripciones'
        ordering = ['-fecha']


class AuditoriaCursos(models.Model):
    curso_id = models.IntegerField()
    accion = models.CharField(max_length=20)
    fecha = models.DateTimeField(auto_now_add=True)
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'auditoria_cursos'
        verbose_name = 'Auditoría de Curso'
        verbose_name_plural = 'Auditorías de Cursos'
        ordering = ['-fecha']
