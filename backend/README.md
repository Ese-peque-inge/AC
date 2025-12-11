# Backend - Academia de Música

Sistema de gestión para academia de música desarrollado con Django y Django REST Framework.

## Requisitos

- Python 3.10 o superior
- pip
- virtualenv

## Instalación en Kali Linux

### 1. Instalar dependencias del sistema

\`\`\`bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
\`\`\`

### 2. Configurar el proyecto

\`\`\`bash
# Dar permisos de ejecución al script de setup
chmod +x setup.sh

# Ejecutar script de configuración
./setup.sh
\`\`\`

### 3. Crear superusuario

\`\`\`bash
# Activar entorno virtual
source venv/bin/activate

# Crear superusuario
python manage.py createsuperuser
\`\`\`

### 4. Iniciar servidor

\`\`\`bash
# Con entorno virtual activado
python manage.py runserver
\`\`\`

El servidor estará disponible en: `http://127.0.0.1:8000`

## Estructura de Módulos

### usuarios
- Gestión de autenticación y usuarios
- Login, registro, perfiles
- JWT para autenticación

### alumnos
- CRUD de alumnos
- Perfiles de estudiantes

### instructores
- CRUD de instructores
- Gestión de especialidades

### cursos
- CRUD de cursos
- Categorías: Teclado, Guitarra, Batería, Violín
- Control de cupos

### inscripciones
- Registro de inscripciones
- Métodos de pago
- Detalles de inscripciones

### auditorias
- Registro de cambios en cursos
- Registro de cambios en inscripciones

### alertas
- Sistema de notificaciones
- Alertas de cupos llenos

## API Endpoints

### Autenticación
- `POST /api/auth/registro/alumno/` - Registro de alumno
- `POST /api/auth/registro/instructor/` - Registro de instructor
- `POST /api/auth/login/` - Iniciar sesión
- `POST /api/auth/logout/` - Cerrar sesión
- `GET /api/auth/perfil/` - Obtener perfil

### Alumnos
- `GET /api/alumnos/` - Listar alumnos
- `POST /api/alumnos/` - Crear alumno
- `GET /api/alumnos/{id}/` - Obtener alumno
- `PUT /api/alumnos/{id}/` - Actualizar alumno
- `DELETE /api/alumnos/{id}/` - Eliminar alumno

### Instructores
- `GET /api/instructores/` - Listar instructores
- `POST /api/instructores/` - Crear instructor
- `GET /api/instructores/{id}/` - Obtener instructor
- `PUT /api/instructores/{id}/` - Actualizar instructor
- `DELETE /api/instructores/{id}/` - Eliminar instructor

### Cursos
- `GET /api/cursos/` - Listar cursos
- `POST /api/cursos/` - Crear curso
- `GET /api/cursos/{id}/` - Obtener curso
- `PUT /api/cursos/{id}/` - Actualizar curso
- `DELETE /api/cursos/{id}/` - Eliminar curso
- `GET /api/cursos/publicos/` - Cursos activos (público)
- `GET /api/cursos/por_categoria/` - Cursos por categoría

### Inscripciones
- `GET /api/inscripciones/` - Listar inscripciones
- `POST /api/inscripciones/` - Crear inscripción
- `GET /api/inscripciones/{id}/` - Obtener inscripción
- `PUT /api/inscripciones/{id}/` - Actualizar inscripción
- `DELETE /api/inscripciones/{id}/` - Eliminar inscripción

### Alertas
- `GET /api/alertas/` - Listar alertas
- `GET /api/alertas/pendientes/` - Alertas pendientes
- `POST /api/alertas/{id}/marcar_atendida/` - Marcar como atendida

## Librerías Utilizadas

| Librería | Versión | Propósito |
|----------|---------|-----------|
| Django | 5.0.0 | Framework web |
| djangorestframework | 3.14.0 | API REST |
| django-cors-headers | 4.3.1 | CORS para React |
| djangorestframework-simplejwt | 5.3.1 | Autenticación JWT |
| Pillow | 10.2.0 | Manejo de imágenes |
| python-dotenv | 1.0.0 | Variables de entorno |

## Comandos Útiles

\`\`\`bash
# Activar entorno virtual
source venv/bin/activate

# Desactivar entorno virtual
deactivate

# Crear nuevas migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver

# Iniciar shell de Django
python manage.py shell
\`\`\`

## Notas de Seguridad

- Cambiar `SECRET_KEY` en producción
- Configurar `DEBUG = False` en producción
- Configurar `ALLOWED_HOSTS` apropiadamente
- Usar variables de entorno para datos sensibles
- Configurar base de datos PostgreSQL para producción
