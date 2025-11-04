# =====================================================
# VARIABLES DE ENTORNO PARA CONFIGURAR EN VERCEL
# =====================================================
# Ve a: https://vercel.com/dashboard → tu-proyecto → Settings → Environment Variables

# === VARIABLES CRÍTICAS (CONFIGURAR PRIMERO) ===

# 1. NODE_ENV
NODE_ENV=production

# 2. FRONTEND_URL (usar tu URL real de Vercel)
FRONTEND_URL=https://upe-program-43ibnwqdg-gustavogamarra95s-projects.vercel.app

# 3. SESSION_SECRET (generar una clave segura)
SESSION_SECRET=tu-super-secreto-de-sesion-minimo-32-caracteres-para-produccion

# 4. JWT_SECRET (generar una clave segura)
JWT_SECRET=tu-super-secreto-jwt-minimo-32-caracteres-para-produccion

# 5. ENCRYPTION_KEY (exactamente 32 caracteres)
ENCRYPTION_KEY=tu-clave-encriptacion-32-caracteres

# === AUTENTICACIÓN GOOGLE ===

# 6. GOOGLE_CLIENT_ID
GOOGLE_CLIENT_ID=464553454735-biknj79cjshpa4reegf95osiauah3scm.apps.googleusercontent.com

# 7. GOOGLE_CLIENT_SECRET
GOOGLE_CLIENT_SECRET=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

# 8. GOOGLE_REDIRECT_URI (actualizar con tu URL de Vercel)
GOOGLE_REDIRECT_URI=https://upe-program-43ibnwqdg-gustavogamarra95s-projects.vercel.app/api/auth/google/callback

# === JWT CONFIGURACIÓN ===

# 9. JWT_EXPIRES_IN
JWT_EXPIRES_IN=24h

# 10. JWT_REFRESH_EXPIRES_IN
JWT_REFRESH_EXPIRES_IN=7d

# === ARCHIVOS ===

# 11. MAX_FILE_SIZE
MAX_FILE_SIZE=10485760

# 12. UPLOAD_DIR
UPLOAD_DIR=./uploads

# === BASE DE DATOS (CRÍTICO - NECESITAS CONFIGURAR) ===

# 13. DATABASE_URL - ⚠️ DEBES CREAR UNA BASE DE DATOS EN PRODUCCIÓN
# Opciones recomendadas:
# - Supabase: https://supabase.com (GRATIS)
# - Railway: https://railway.app 
# - PlanetScale: https://planetscale.com
# - Neon: https://neon.tech

DATABASE_URL=postgresql://usuario:contraseña@host:puerto/nombre_db

# =====================================================
# INSTRUCCIONES PASO A PASO:
# =====================================================

# 1. CONFIGURAR EN VERCEL:
#    - Ve a https://vercel.com/dashboard
#    - Selecciona "upe-program"
#    - Settings → Environment Variables
#    - Agrega cada variable de arriba

# 2. GENERAR CLAVES SEGURAS:
#    Para SESSION_SECRET, JWT_SECRET, ENCRYPTION_KEY usa:
#    https://generate-secret.vercel.app/
#    O ejecuta: openssl rand -base64 32

# 3. CREAR BASE DE DATOS:
#    - Ve a Supabase.com
#    - Crea una cuenta gratis
#    - Crea un nuevo proyecto
#    - Copia la DATABASE_URL de Settings → Database
#    - Pégala en Vercel

# 4. CONFIGURAR GOOGLE OAUTH:
#    - Ve a Google Cloud Console
#    - Busca tu proyecto OAuth
#    - Agrega tu URL de Vercel a "Authorized redirect URIs"

# 5. REDEPLOY:
#    Después de configurar las variables, ejecuta:
#    vercel --prod

# =====================================================
# VARIABLES DE ENTORNO PARA EL FRONTEND:
# =====================================================
# Estas se configuran automáticamente desde .env.production
# Si necesitas cambiarlas, también agrégalas en Vercel:

REACT_APP_BACKEND_URL=https://upe-program-43ibnwqdg-gustavogamarra95s-projects.vercel.app
REACT_APP_API_URL=https://upe-program-43ibnwqdg-gustavogamarra95s-projects.vercel.app
REACT_APP_NODE_ENV=production
GENERATE_SOURCEMAP=false