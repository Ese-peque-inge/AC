#!/bin/bash

# Script para crear el superusuario administrador

echo "=================================================="
echo "  Creando Superusuario Administrador"
echo "=================================================="

# Activar entorno virtual si existe
if [ -d "../venv" ]; then
    source ../venv/bin/activate
fi

# Ejecutar el script de Python
python manage.py shell < scripts/crear_superusuario.py

echo ""
echo "✅ Proceso completado!"
echo ""
echo "Puedes hacer login con:"
echo "  Username: admin"
echo "  Password: admin123"
echo ""
echo "⚠️  RECUERDA: Cambia la contraseña en producción!"
