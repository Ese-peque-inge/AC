#!/bin/bash

echo "==================================="
echo "Configuración Frontend - Academia de Música"
echo "==================================="

# Instalar Node.js si no está instalado
if ! command -v node &> /dev/null
then
    echo "Node.js no está instalado. Instalando..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Verificar instalación
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Instalar dependencias
echo "Instalando dependencias..."
npm install

# Crear archivo .env
echo "Creando archivo .env..."
cat > .env << EOL
REACT_APP_API_URL=http://localhost:8000/api
EOL

echo "==================================="
echo "¡Configuración completada!"
echo "==================================="
echo ""
echo "Para iniciar el servidor de desarrollo:"
echo "npm start"
