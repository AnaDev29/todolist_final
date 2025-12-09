# Railway Deployment Guide

## 🚂 Desplegar Backend en Railway

### 1. Preparar el proyecto

Asegúrate de que tu proyecto esté en un repositorio de GitHub.

### 2. Crear cuenta en Railway

- Ve a [railway.app](https://railway.app/)
- Regístrate con GitHub

### 3. Crear nuevo proyecto

1. Click en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Conecta tu repositorio
4. Selecciona la carpeta `backend`

### 4. Agregar base de datos MySQL

1. En tu proyecto, click en "New"
2. Selecciona "Database" → "MySQL"
3. Railway creará automáticamente la base de datos

### 5. Configurar variables de entorno

En la configuración del servicio backend, agrega:

```env
NODE_ENV=production
PORT=5000

# Railway proporciona DATABASE_URL automáticamente si agregaste MySQL
# Pero también puedes usar variables individuales:
DB_HOST=containers-us-west-xxx.railway.app
DB_PORT=3306
DB_NAME=railway
DB_USER=root
DB_PASSWORD=xxx

JWT_SECRET=tu_secreto_super_seguro_produccion
JWT_REFRESH_SECRET=tu_refresh_secret_super_seguro_produccion
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Cloudinary (opcional)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# URL del frontend (después de deployar en Vercel)
FRONTEND_URL=https://tu-app.vercel.app
```

### 6. Deploy

Railway detectará automáticamente que es un proyecto Node.js y:
- Ejecutará `npm install`
- Ejecutará `npm start`

### 7. Obtener la URL

Railway te dará una URL pública como:
```
https://tu-backend-production.up.railway.app
```

### 8. Ejecutar seed (opcional)

En la terminal de Railway, ejecuta:
```bash
npm run seed
```

O configura un "Custom Start Command" temporal:
```
npm run seed && npm start
```

## 🔧 Troubleshooting

### Error de conexión a MySQL

Verifica que las variables de entorno estén correctas:
```bash
railway run env
```

### Ver logs

```bash
railway logs
```

### Reiniciar servicio

En el dashboard de Railway, click en "Restart"

## 📝 Notas

- Railway proporciona $5 USD gratis al mes
- La base de datos MySQL tiene límites en el plan gratuito
- Considera usar Railway para backend y Vercel para frontend
- Puedes usar dominios personalizados

## 🔗 URLs útiles

- Dashboard: https://railway.app/dashboard
- Documentación: https://docs.railway.app/
- Pricing: https://railway.app/pricing
