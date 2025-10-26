-- =====================================================
-- FIX CAREER_ADVICE PERMISSIONS
-- =====================================================
-- Este script soluciona el error 401 (Unauthorized) y
-- "permission denied for schema public" para la tabla career_advice

-- PASO 1: Primero verifica qué tablas existen
-- Ejecuta esta consulta para ver todas tus tablas:
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- =====================================================
-- PASO 2: Configurar RLS para career_advice (OBLIGATORIO)
-- =====================================================

-- 1. Habilitar Row Level Security en career_advice
ALTER TABLE "career_advice" ENABLE ROW LEVEL SECURITY;

-- 2. Crear política para permitir lectura pública
CREATE POLICY "career_advice_public_read" ON "career_advice"
    FOR SELECT USING (true);

-- =====================================================
-- PASO 3: OPCIONAL - Solo ejecuta estas líneas SI las tablas existen
-- =====================================================
-- Descomenta y ejecuta las líneas correspondientes a las tablas que SÍ existen en tu base de datos

-- Para scholarships (solo si existe):
-- ALTER TABLE "scholarships" ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "scholarships_public_read" ON "scholarships" FOR SELECT USING (true);

-- Para certifications (solo si existe):
-- ALTER TABLE "certifications" ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "certifications_public_read" ON "certifications" FOR SELECT USING (true);

-- Para companies (solo si existe):
-- ALTER TABLE "companies" ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "companies_public_read" ON "companies" FOR SELECT USING (true);

-- Para stats (solo si existe):
-- ALTER TABLE "stats" ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "stats_public_read" ON "stats" FOR SELECT USING (true);

-- =====================================================
-- VERIFICACIÓN
-- =====================================================
-- Verifica que las políticas se crearon correctamente:
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'career_advice'
ORDER BY tablename, policyname;