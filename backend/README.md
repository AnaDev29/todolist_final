# Backend TodoList API

Backend API para la aplicación TodoList con autenticación JWT y MySQL.

## 🚀 Características

- ✅ Autenticación con JWT (Access Token y Refresh Token)
- ✅ CRUD completo de tareas
- ✅ Gestión de usuarios y perfiles
- ✅ Upload de fotos de perfil (Cloudinary)
- ✅ Base de datos MySQL con Sequelize ORM
- ✅ Seguridad con Helmet y Rate Limiting
- ✅ Validación de datos
- ✅ CORS configurado

## 📋 Requisitos Previos

- Node.js v18 o superior
- MySQL 8.0 o superior
- NPM o Yarn

## 🔧 Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar MySQL:**
   - Asegúrate de tener MySQL corriendo
   - Crea una base de datos llamada `todolist_db`:
     ```sql
     CREATE DATABASE todolist_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
     ```

3. **Configurar variables de entorno:**
   - Copia `.env.example` a `.env`:
     ```bash
     copy .env.example .env
     ```
   - Edita `.env` y configura:
     - `DB_PASSWORD`: Tu contraseña de MySQL
     - `JWT_SECRET` y `JWT_REFRESH_SECRET`: Cambia los valores por defecto
     - (Opcional) Credenciales de Cloudinary para upload de imágenes

4. **Ejecutar migraciones y seed:**
   ```bash
   npm run seed
   ```
   Esto creará las tablas y datos de prueba:
   - Usuario: `santi` / Contraseña: `santi123`
   - Usuario: `ana` / Contraseña: `ana123`

## 🏃‍♂️ Ejecutar

**Modo desarrollo (con hot reload):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará disponible en `http://localhost:5000`

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión (requiere auth)
- `POST /api/auth/refresh` - Refrescar access token
- `GET /api/auth/me` - Obtener usuario actual (requiere auth)

### Tareas
- `GET /api/tasks` - Obtener todas las tareas del usuario
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea
- `DELETE /api/tasks/completed/all` - Eliminar todas las tareas completadas

### Usuario
- `GET /api/users/profile` - Obtener perfil
- `PUT /api/users/profile` - Actualizar perfil
- `POST /api/users/upload-photo` - Subir foto de perfil
- `DELETE /api/users/photo` - Eliminar foto de perfil

## 🔐 Autenticación

Las peticiones protegidas requieren el header:
```
Authorization: Bearer {access_token}
```

## 📦 Deployment

### Railway / Render
1. Crear cuenta en Railway o Render
2. Crear nuevo proyecto MySQL
3. Configurar variables de entorno
4. Conectar repositorio GitHub
5. Deploy automático

### Variables de entorno en producción:
```env
NODE_ENV=production
DATABASE_URL=mysql://user:pass@host:port/dbname
JWT_SECRET=tu_secret_super_seguro
FRONTEND_URL=https://tu-frontend.vercel.app
```

## 🛠️ Tecnologías

- Express.js
- MySQL + Sequelize ORM
- JWT (jsonwebtoken)
- Bcrypt
- Cloudinary (upload de imágenes)
- Helmet (seguridad)
- CORS
- Express Rate Limit

## 👨‍💻 Autor

Santiago Hurtado
