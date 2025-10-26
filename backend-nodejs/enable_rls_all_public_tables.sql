-- =====================================================
-- HABILITAR RLS Y PERMISOS PARA TODAS LAS TABLAS PÚBLICAS
-- =====================================================

-- PASO 1: Otorgar permisos al schema public
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- =====================================================
-- PASO 2: COURSES - Habilitar RLS y permisos
-- =====================================================

-- Habilitar RLS
ALTER TABLE "courses" ENABLE ROW LEVEL SECURITY;

-- Otorgar permisos
GRANT SELECT ON TABLE courses TO anon;
GRANT SELECT ON TABLE courses TO authenticated;

-- Crear política de acceso público
DROP POLICY IF EXISTS "Enable read access for all users" ON "courses";
CREATE POLICY "Enable read access for all users" ON "courses"
    FOR SELECT
    USING (true);

-- =====================================================
-- PASO 3: EVENTS - Habilitar RLS y permisos
-- =====================================================

-- Habilitar RLS
ALTER TABLE "events" ENABLE ROW LEVEL SECURITY;

-- Otorgar permisos
GRANT SELECT ON TABLE events TO anon;
GRANT SELECT ON TABLE events TO authenticated;

-- Crear política de acceso público
DROP POLICY IF EXISTS "Enable read access for all users" ON "events";
CREATE POLICY "Enable read access for all users" ON "events"
    FOR SELECT
    USING (true);

-- =====================================================
-- PASO 4: JOB_VACANCIES - Habilitar RLS y permisos
-- =====================================================

-- Habilitar RLS
ALTER TABLE "job_vacancies" ENABLE ROW LEVEL SECURITY;

-- Otorgar permisos
GRANT SELECT ON TABLE job_vacancies TO anon;
GRANT SELECT ON TABLE job_vacancies TO authenticated;

-- Crear política de acceso público (solo vacantes activas)
DROP POLICY IF EXISTS "Enable read access for active jobs" ON "job_vacancies";
CREATE POLICY "Enable read access for active jobs" ON "job_vacancies"
    FOR SELECT
    USING (is_active = true);

-- =====================================================
-- PASO 5: USERS - Configurar permisos seguros
-- =====================================================

-- Habilitar RLS
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;

-- Otorgar permisos
GRANT SELECT ON TABLE users TO authenticated;

-- Los usuarios solo pueden ver su propia información
DROP POLICY IF EXISTS "Users can view own data" ON "users";
CREATE POLICY "Users can view own data" ON "users"
    FOR SELECT
    TO authenticated
    USING (id = current_setting('request.jwt.claims', true)::json->>'sub');

-- =====================================================
-- PASO 6: SAVED_ITEMS - Configurar permisos seguros
-- =====================================================

-- Habilitar RLS
ALTER TABLE "saved_items" ENABLE ROW LEVEL SECURITY;

-- Otorgar permisos
GRANT SELECT, INSERT, DELETE ON TABLE saved_items TO authenticated;

-- Los usuarios solo pueden ver/crear/eliminar sus propios items guardados
DROP POLICY IF EXISTS "Users can view own saved items" ON "saved_items";
DROP POLICY IF EXISTS "Users can insert own saved items" ON "saved_items";
DROP POLICY IF EXISTS "Users can delete own saved items" ON "saved_items";

CREATE POLICY "Users can view own saved items" ON "saved_items"
    FOR SELECT
    TO authenticated
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own saved items" ON "saved_items"
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can delete own saved items" ON "saved_items"
    FOR DELETE
    TO authenticated
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

-- 1. Verificar RLS habilitado
SELECT
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN ('courses', 'events', 'job_vacancies', 'career_advice', 'users', 'saved_items')
ORDER BY tablename;

-- 2. Verificar políticas creadas
SELECT
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 3. Verificar permisos otorgados
SELECT
    grantee,
    table_name,
    privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public'
    AND table_name IN ('courses', 'events', 'job_vacancies', 'career_advice')
    AND grantee IN ('anon', 'authenticated')
ORDER BY table_name, grantee, privilege_type;

-- 4. Probar consulta como usuario anónimo
SET ROLE anon;
SELECT 'courses' AS tabla, COUNT(*) AS total FROM courses
UNION ALL
SELECT 'events', COUNT(*) FROM events
UNION ALL
SELECT 'job_vacancies', COUNT(*) FROM job_vacancies WHERE is_active = true
UNION ALL
SELECT 'career_advice', COUNT(*) FROM career_advice;
RESET ROLE;

-- =====================================================
-- RESULTADO ESPERADO
-- =====================================================
-- Deberías ver:
-- 1. RLS habilitado en todas las tablas
-- 2. Políticas creadas para cada tabla
-- 3. Permisos SELECT otorgados a 'anon' y 'authenticated'
-- 4. Las consultas como usuario anónimo deberían funcionar sin error