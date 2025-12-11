#!/bin/bash

echo "==================================="
echo "Configuración Backend - Academia de Música"
echo "==================================="

# Crear entorno virtual
echo "Creando entorno virtual..."
python3 -m venv venv

# Activar entorno virtual
echo "Activando entorno virtual..."
source venv/bin/activate

# Instalar dependencias
echo "Instalando dependencias..."
pip install -r requirements.txt

# Crear migraciones
echo "Creando migraciones..."
python manage.py makemigrations

# Aplicar migraciones
echo "Aplicando migraciones..."
python manage.py migrate

# Crear directorios para archivos media
echo "Creando directorios..."
mkdir -p media/cursos

echo "==================================="
echo "¡Configuración completada!"
echo "==================================="
echo ""
echo "Para iniciar el servidor:"
echo "1. Activar entorno virtual: source venv/bin/activate"
echo "2. Crear superusuario: python manage.py createsuperuser"
echo "3. Iniciar servidor: python manage.py runserver"
