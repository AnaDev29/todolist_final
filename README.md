# TodoList Full Stack Application

Aplicación completa de gestión de tareas (TodoList) con autenticación, perfiles de usuario y carga de imágenes.

## Estructura del Proyecto

```
Todolist/
├── backend/          # API REST con Node.js, Express y MySQL
├── final_react/      # Frontend con React y Vite
└── README.md         # Este archivo
```

## Requisitos Previos

- Node.js 18 o superior
- MySQL 8.0 o superior
- Git
- Cuenta en GitHub
- Cuenta en Railway (para backend y base de datos)
- Cuenta en Vercel (para frontend)

## Instalación Local

### 1. Clonar el Repositorio

```bash
git clone https://github.com/SantiagoDev28/todolist.git
cd todolist
```

### 2. Configurar Base de Datos MySQL

Crear la base de datos:

```sql
CREATE DATABASE todolist_db;
USE todolist_db;
```

Ejecutar el script SQL ubicado en `backend/src/database/database.sql` para crear las tablas.

### 3. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env` en la carpeta `backend/`:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=todolist_db
DB_USER=root
DB_PASSWORD=

JWT_SECRET=tu_secreto_jwt_seguro_aqui
JWT_REFRESH_SECRET=tu_refresh_secret_seguro_aqui
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

FRONTEND_URL=http://localhost:5173
```

Poblar base de datos con datos de prueba (opcional):

```bash
npm run seed
```

Iniciar servidor de desarrollo:

```bash
npm run dev
```

El backend estará disponible en `http://localhost:5000`

### 4. Configurar Frontend

```bash
cd final_react
npm install
```

Crear archivo `.env` en la carpeta `final_react/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Iniciar aplicación de desarrollo:

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

### 5. Acceder a la Aplicación

Abrir navegador en `http://localhost:5173`

Usuarios de prueba (si ejecutaste el seed):
- Usuario: `santi` / Contraseña: `santi123`
- Usuario: `ana` / Contraseña: `ana123`

## Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **MySQL** - Base de datos relacional
- **Sequelize** - ORM para MySQL
- **JWT (jsonwebtoken)** - Autenticación basada en tokens
- **Bcrypt** - Encriptación de contraseñas
- **Multer** - Manejo de archivos
- **Cloudinary** - Almacenamiento de imágenes
- **Helmet** - Seguridad HTTP
- **CORS** - Control de acceso
- **Express Rate Limit** - Limitación de peticiones

### Frontend
- **React 19** - Librería UI
- **Vite** - Build tool y dev server
- **React Router DOM** - Navegación
- **TailwindCSS** - Framework CSS
- **Axios** - Cliente HTTP
- **React Toastify** - Notificaciones

## Funcionalidades

### Autenticación
- Registro de nuevos usuarios
- Inicio de sesión con validación
- Tokens JWT con refresh tokens
- Protección de rutas privadas
- Cierre de sesión

### Gestión de Tareas
- Crear nuevas tareas
- Listar todas las tareas del usuario
- Editar tareas existentes
- Eliminar tareas
- Marcar tareas como completadas/pendientes
- Buscar tareas por texto

### Perfil de Usuario
- Ver información del perfil
- Editar nombre y email
- Subir foto de perfil
- Eliminar foto de perfil
- Validación de imágenes (tipo y tamaño)

### Seguridad
- Contraseñas encriptadas con bcrypt
- Validación de datos en backend
- Tokens JWT seguros
- Rate limiting para prevenir ataques
- Headers de seguridad con Helmet
- Validación de tipos de archivo

## Estructura de la Base de Datos

### Tabla Users
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- nombre (VARCHAR 100)
- alias (VARCHAR 50, UNIQUE)
- email (VARCHAR 100, UNIQUE)
- contraseña (VARCHAR 255)
- foto (VARCHAR 500)
- refreshToken (TEXT)
- createdAt (DATETIME)
- updatedAt (DATETIME)
```

### Tabla Tasks
```sql
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- text (TEXT)
- completed (BOOLEAN)
- userId (INT, FOREIGN KEY)
- createdAt (DATETIME)
- updatedAt (DATETIME)
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Refrescar token
- `POST /api/auth/logout` - Cerrar sesión

### Tareas
- `GET /api/tasks` - Obtener todas las tareas
- `POST /api/tasks` - Crear tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

### Usuario
- `GET /api/users/profile` - Obtener perfil
- `PUT /api/users/profile` - Actualizar perfil
- `POST /api/users/upload-photo` - Subir foto
- `DELETE /api/users/photo` - Eliminar foto

## Deployment en Producción

### Backend en Railway

1. Crear cuenta en Railway.app
2. Crear nuevo proyecto desde GitHub
3. Agregar servicio MySQL Database
4. Configurar variables de entorno en Railway:
   ```
   NODE_ENV=production
   DB_HOST=[Railway MySQL Host]
   DB_PORT=[Railway MySQL Port]
   DB_NAME=[Railway MySQL Database]
   DB_USER=[Railway MySQL User]
   DB_PASSWORD=[Railway MySQL Password]
   JWT_SECRET=[Tu secreto seguro]
   JWT_REFRESH_SECRET=[Tu refresh secret seguro]
   CLOUDINARY_CLOUD_NAME=[Tu Cloudinary name]
   CLOUDINARY_API_KEY=[Tu Cloudinary key]
   CLOUDINARY_API_SECRET=[Tu Cloudinary secret]
   FRONTEND_URL=[URL de Vercel]
   ```
5. Railway desplegará automáticamente
6. Ejecutar migraciones/seed si es necesario

### Frontend en Vercel

1. Crear cuenta en Vercel.com
2. Importar proyecto desde GitHub
3. Configurar Framework Preset: Vite
4. Agregar variable de entorno:
   ```
   VITE_API_URL=[URL de Railway]/api
   ```
5. Deploy automático

### Configuración Post-Deployment

1. Actualizar CORS en backend con URL de Vercel
2. Actualizar FRONTEND_URL en Railway
3. Ejecutar script SQL para crear tablas en MySQL de Railway
4. Opcional: Ejecutar seed para datos de prueba

## Scripts Disponibles

### Backend
```bash
npm run dev          # Desarrollo con nodemon
npm start            # Producción
npm run seed         # Poblar base de datos
```

### Frontend
```bash
npm run dev          # Desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
```

## Solución de Problemas Comunes

### Error de conexión a base de datos
- Verificar que MySQL esté corriendo
- Comprobar credenciales en .env
- Verificar que la base de datos existe

### Error CORS
- Verificar FRONTEND_URL en .env del backend
- Comprobar configuración CORS en server.js

### Tokens inválidos
- Verificar JWT_SECRET en .env
- Limpiar localStorage del navegador
- Reiniciar sesión

### Imágenes no se suben
- Verificar credenciales de Cloudinary
- Comprobar tamaño de archivo (máximo 5MB)
- Verificar tipo de archivo (solo imágenes)

## Contribución

1. Fork el proyecto
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## Autor

Ana Sanchez - [AnaDev29](https://github.com/AnaDev29?tab=repositories)


