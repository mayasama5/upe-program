# UPE Program - Guía de Desarrollo

## 🚀 Inicio Rápido

### Opción 1: Inicio Completo (Recomendado)
```bash
npm run start:full
```
Este comando:
- ✅ Verifica que Docker esté corriendo
- ✅ Inicia MongoDB automáticamente
- ✅ Espera que MongoDB esté listo
- ✅ Inicia tanto el backend como el frontend

### Opción 2: Inicio Manual
```bash
# 1. Iniciar MongoDB
npm run mongodb:start

# 2. Iniciar frontend y backend
npm start
```

### Opción 3: Solo Backend o Frontend
```bash
# Solo backend
npm run start:backend

# Solo frontend  
npm run start:frontend
```

## 📦 Instalación de Dependencias

```bash
# Instalar todas las dependencias (raíz, backend y frontend)
npm run install:all
```

## 🔧 Scripts Disponibles

- `npm start` - Inicia frontend y backend simultáneamente
- `npm run start:full` - Inicia MongoDB + frontend + backend (todo el entorno)
- `npm run dev` - Modo desarrollo con nodemon en backend
- `npm run build` - Construye el frontend para producción
- `npm test` - Ejecuta tests en frontend y backend
- `npm run mongodb:start` - Inicia contenedor MongoDB
- `npm run mongodb:stop` - Detiene contenedor MongoDB
- `npm run mongodb:clean` - Detiene y elimina contenedor MongoDB

## 🌐 URLs de Desarrollo

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Health Check**: http://localhost:8000/health
- **API Docs**: http://localhost:8000/api

## 📋 Requisitos

- ✅ Node.js 18+
- ✅ Docker
- ✅ npm

## 🛠️ Solución de Problemas

### Error: "CORS request did not succeed"
✅ **Solucionado**: El backend ya está configurado para permitir solicitudes desde `http://localhost:3000`

### Error: "MongoDB connection failed"
```bash
# Verificar que MongoDB esté corriendo
docker ps | grep mongodb-dev

# Si no está corriendo, iniciarlo
npm run mongodb:start
```

### Error: "Port already in use"
```bash
# Verificar qué está usando el puerto
lsof -i :8000  # para backend
lsof -i :3000  # para frontend

# Detener procesos si es necesario
```

## 🔄 Flujo de Desarrollo Típico

1. **Primera vez**:
   ```bash
   npm run install:all
   npm run start:full
   ```

2. **Días siguientes**:
   ```bash
   npm run start:full
   ```

3. **Solo desarrollo frontend**:
   ```bash
   npm run start:backend  # en una terminal
   npm run start:frontend # en otra terminal
   ```

¡Listo para desarrollar! 🎉
