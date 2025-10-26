-- =====================================================
-- FIX SCHEMA PUBLIC PERMISSIONS
-- =====================================================
-- Este script soluciona el error "permission denied for schema public"

-- PASO 1: Otorgar permisos de uso del schema public al rol anon
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- PASO 2: Otorgar permisos de SELECT en la tabla career_advice
GRANT SELECT ON TABLE career_advice TO anon;
GRANT SELECT ON TABLE career_advice TO authenticated;

-- PASO 3: Verificar que RLS está habilitado
ALTER TABLE "career_advice" ENABLE ROW LEVEL SECURITY;

-- PASO 4: Eliminar la política anterior si existe (para evitar duplicados)
DROP POLICY IF EXISTS "career_advice_public_read" ON "career_advice";

-- PASO 5: Crear la política de acceso público
CREATE POLICY "career_advice_public_read" ON "career_advice"
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Verificar permisos del schema
SELECT
    nspname AS schema_name,
    nspacl AS permissions
FROM pg_namespace
WHERE nspname = 'public';

-- Verificar permisos de la tabla
SELECT
    grantee,
    privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public'
    AND table_name = 'career_advice'
ORDER BY grantee, privilege_type;

-- Verificar políticas
SELECT
    schemaname,
    tablename,
    policyname,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'career_advice';

-- Verificar que RLS está habilitado
SELECT
    schemaname,
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename = 'career_advice';