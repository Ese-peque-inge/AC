# Frontend - Academia de Música

Aplicación React para la gestión de la academia de música.

## Requisitos

- Node.js 16 o superior
- NPM 8 o superior

## Instalación en Kali Linux

### 1. Instalar Node.js

\`\`\`bash
# Instalar Node.js desde el repositorio oficial
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node -v
npm -v
\`\`\`

### 2. Configurar el proyecto

\`\`\`bash
# Dar permisos de ejecución al script
chmod +x setup.sh

# Ejecutar script de configuración
./setup.sh
\`\`\`

### 3. Iniciar servidor de desarrollo

\`\`\`bash
npm start
\`\`\`

La aplicación estará disponible en: `http://localhost:3000`

## Estructura del Proyecto

\`\`\`
frontend/
├── public/               # Archivos estáticos
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── context/         # Context API (AuthContext)
│   ├── pages/           # Páginas de la aplicación
│   │   ├── auth/        # Login y registro
│   │   ├── public/      # Landing page
│   │   ├── admin/       # Dashboard administrador
│   │   ├── instructor/  # Dashboard instructor
│   │   └── alumno/      # Dashboard alumno
│   ├── services/        # Servicios API
│   ├── config/          # Configuración (axios)
│   ├── App.js           # Componente principal
│   └── index.js         # Punto de entrada
└── package.json         # Dependencias
\`\`\`

## Características Implementadas

### Autenticación
- Login con validación de credenciales
- Registro de alumnos e instructores
- Manejo de tokens JWT
- Refresh token automático
- Protección de rutas según rol

### Rutas
- **Públicas**: Landing page, Login, Registro
- **Protegidas por rol**: Dashboards específicos para cada tipo de usuario

### Context API
- AuthContext para gestión global de autenticación
- Estado de usuario persistente en localStorage

### Servicios
- Axios configurado con interceptores
- Manejo automático de tokens
- Gestión de errores centralizada

## Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

\`\`\`env
REACT_APP_API_URL=http://localhost:8000/api
\`\`\`

## Librerías Utilizadas

| Librería | Versión | Propósito |
|----------|---------|-----------|
| react | 18.2.0 | Framework UI |
| react-router-dom | 6.20.0 | Enrutamiento |
| axios | 1.6.2 | Cliente HTTP |
| react-scripts | 5.0.1 | Scripts de desarrollo |

## Scripts Disponibles

\`\`\`bash
# Iniciar servidor de desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar tests
npm test
\`\`\`

## Flujo de Autenticación

1. Usuario ingresa credenciales en `/login`
2. Frontend envía petición a `/api/auth/login/`
3. Backend valida y retorna tokens + datos de usuario
4. Frontend guarda tokens en localStorage
5. Redirige al dashboard según rol
6. Todas las peticiones subsecuentes incluyen token en headers
7. Si token expira, se refresca automáticamente

## Roles y Permisos

- **Administrador**: Acceso completo a gestión de alumnos, instructores, cursos e inscripciones
- **Instructor**: Acceso a sus cursos asignados
- **Alumno**: Acceso a sus inscripciones y cursos

## Conexión con Backend

Asegúrate de que el backend esté corriendo en `http://localhost:8000` antes de iniciar el frontend.

## Troubleshooting

### Error de CORS
Verificar que django-cors-headers esté configurado correctamente en el backend.

### Error de conexión
Verificar que la variable `REACT_APP_API_URL` apunte al backend correcto.

### Token expirado
El sistema refresca automáticamente el token. Si persiste el error, hacer logout y login nuevamente.
\`\`\`
