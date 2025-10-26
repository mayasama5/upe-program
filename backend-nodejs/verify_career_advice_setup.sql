-- =====================================================
-- VERIFICACIÓN COMPLETA DE CAREER_ADVICE
-- =====================================================
-- Ejecuta este script completo en el SQL Editor de Supabase

-- 1. Verificar que la tabla existe
SELECT 'Tabla career_advice existe: ' || CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'career_advice'
) THEN '✓ SÍ' ELSE '✗ NO' END AS resultado;

-- 2. Verificar que RLS está habilitado
SELECT
    tablename,
    CASE WHEN rowsecurity THEN '✓ RLS Habilitado' ELSE '✗ RLS Deshabilitado' END AS rls_status
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'career_advice';

-- 3. Verificar las políticas de acceso
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd AS comando,
    qual AS condicion
FROM pg_policies
WHERE tablename = 'career_advice'
ORDER BY policyname;

-- 4. Verificar cuántos registros hay en la tabla
SELECT 'Total de registros en career_advice: ' || COUNT(*)::text AS resultado
FROM career_advice;

-- 5. Mostrar todos los registros (si hay pocos)
SELECT id, title, author, created_at
FROM career_advice
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================
-- RESULTADO ESPERADO
-- =====================================================
-- Deberías ver:
-- 1. "Tabla career_advice existe: ✓ SÍ"
-- 2. "✓ RLS Habilitado"
-- 3. Una política llamada "career_advice_public_read" con cmd = "SELECT"
-- 4. El total de registros (debería ser > 0)
-- 5. Una lista de los consejos de carrera