# ================================================
# VARIABLES DE ENTORNO PARA VERCEL
# ================================================
# Estas variables deben configurarse en el dashboard de Vercel
# Ve a: https://vercel.com/dashboard -> tu proyecto -> Settings -> Environment Variables

# === CONFIGURACIÓN DEL SERVIDOR ===
NODE_ENV=production
PORT=8000

# === URL DEL FRONTEND ===
# Reemplaza con tu URL real de Vercel después del deploy
FRONTEND_URL=https://upe-program-nktm2bmtb-gustavogamarra95s-projects.vercel.app

# === SEGURIDAD Y AUTENTICACIÓN ===
# CRÍTICO: Genera claves seguras para producción
SESSION_SECRET=tu-clave-super-secreta-de-sesion-cambiar-en-produccion-minimo-32-caracteres
JWT_SECRET=tu-clave-super-secreta-jwt-minimo-32-caracteres-cambiar-en-produccion
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
ENCRYPTION_KEY=tu-clave-de-encriptacion-32-caracteres

# === BASE DE DATOS ===
# Configura tu base de datos PostgreSQL en producción
# Opciones recomendadas: Supabase, PlanetScale, Railway, o Neon
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/nombre_db

# === GOOGLE OAUTH ===
# Actualiza las URLs de redirect para producción
GOOGLE_CLIENT_ID=464553454735-biknj79cjshpa4reegf95osiauah3scm.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=https://upe-program-nktm2bmtb-gustavogamarra95s-projects.vercel.app/api/auth/google/callback

# === CONFIGURACIÓN DE ARCHIVOS ===
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# ================================================
# INSTRUCCIONES:
# ================================================
# 1. Ve a https://vercel.com/dashboard
# 2. Selecciona tu proyecto "upe-program"
# 3. Ve a Settings -> Environment Variables
# 4. Agrega cada variable de arriba
# 5. IMPORTANTE: Genera claves seguras para:
#    - SESSION_SECRET
#    - JWT_SECRET  
#    - ENCRYPTION_KEY
# 6. Configura una base de datos PostgreSQL en producción
# 7. Actualiza GOOGLE_REDIRECT_URI con tu URL real
# 8. Redeploy después de configurar las variables