# ==============================================
# CONFIGURACIÓN COMPLETA PARA VERCEL
# ==============================================
# Estas son TODAS las variables que necesitas configurar en Vercel Dashboard
# Ve a: https://vercel.com/dashboard → upe-program → Settings → Environment Variables

# === CONFIGURACIÓN DEL SERVIDOR ===
NODE_ENV=production
PORT=8000

# === URL DEL FRONTEND (tu URL actual de Vercel) ===
FRONTEND_URL=https://upe-program-7d46x9eb8-gustavogamarra95s-projects.vercel.app

# === SEGURIDAD Y AUTENTICACIÓN ===
SESSION_SECRET=5e258624421477511cc03bfe0c64ad84b21d36b8dfd6baa1e53fcecedfa6c3b4
JWT_SECRET=15d7b2e210d3c86a8bba5e34ac8aed836afac8e09010fecdd19e02741de9d425
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
ENCRYPTION_KEY=4fc33ca3277942a52591527e6a0ec2d5bebee3686ec81a21a2a3d4883b7130df

# === BASE DE DATOS SUPABASE (ya configurada) ===
DATABASE_URL=postgresql://postgres.sisrhnrbjckqfydjpajx:postgres*123@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=10&pool_timeout=20

# === GOOGLE OAUTH (actualizado para producción) ===
GOOGLE_CLIENT_ID=464553454735-biknj79cjshpa4reegf95osiauah3scm.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=https://upe-program-7d46x9eb8-gustavogamarra95s-projects.vercel.app/api/auth/google/callback

# === CONFIGURACIÓN DE ARCHIVOS ===
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# ==============================================
# INSTRUCCIONES PASO A PASO:
# ==============================================

1. Ve a https://vercel.com/dashboard
2. Selecciona "upe-program"
3. Ve a Settings → Environment Variables
4. Copia y pega CADA variable de arriba (una por una)
5. Para cada variable:
   - Name: [nombre de la variable, ej: NODE_ENV]
   - Value: [valor de la variable, ej: production]
   - Apply to: Production, Preview, Development (marca todas)
6. Guarda cada variable

# ==============================================
# IMPORTANTE - GOOGLE OAUTH:
# ==============================================
Después de configurar las variables, ve a:
https://console.cloud.google.com

1. Busca tu proyecto OAuth
2. Ve a APIs & Services → Credentials
3. Edita tu OAuth 2.0 Client
4. En "Authorized redirect URIs" agrega:
   https://upe-program-7d46x9eb8-gustavogamarra95s-projects.vercel.app/api/auth/google/callback

# ==============================================
# DESPUÉS DE CONFIGURAR TODO:
# ==============================================
Ejecuta en terminal: vercel --prod

Tu aplicación estará lista en:
https://upe-program-7d46x9eb8-gustavogamarra95s-projects.vercel.app