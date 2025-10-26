-- =====================================================
-- VERIFICAR TODAS LAS TABLAS Y SUS DATOS
-- =====================================================

-- 1. Ver todas las tablas que existen
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Verificar datos en cada tabla
SELECT 'courses' AS tabla, COUNT(*) AS total FROM courses
UNION ALL
SELECT 'events', COUNT(*) FROM events
UNION ALL
SELECT 'job_vacancies', COUNT(*) FROM job_vacancies
UNION ALL
SELECT 'career_advice', COUNT(*) FROM career_advice
UNION ALL
SELECT 'scholarships', COUNT(*) FROM scholarships
UNION ALL
SELECT 'certifications', COUNT(*) FROM certifications
UNION ALL
SELECT 'companies', COUNT(*) FROM companies
UNION ALL
SELECT 'stats', COUNT(*) FROM stats
ORDER BY tabla;

-- 3. Verificar políticas RLS de todas las tablas
SELECT
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 4. Verificar qué tablas tienen RLS habilitado
SELECT
    schemaname,
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;