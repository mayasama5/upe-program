-- =====================================================
-- LIMPIAR Y CORREGIR POLÍTICAS DE CAREER_ADVICE
-- =====================================================

-- PASO 1: Eliminar TODAS las políticas existentes (duplicadas)
DROP POLICY IF EXISTS "Public career advice is viewable by everyone" ON "career_advice";
DROP POLICY IF EXISTS "career_advice" ON "career_advice";
DROP POLICY IF EXISTS "career_advice_public_read" ON "career_advice";

-- PASO 2: Otorgar permisos explícitos al schema y tabla
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON TABLE career_advice TO anon;
GRANT SELECT ON TABLE career_advice TO authenticated;

-- PASO 3: Asegurar que RLS está habilitado
ALTER TABLE "career_advice" ENABLE ROW LEVEL SECURITY;

-- PASO 4: Crear UNA SOLA política correcta
CREATE POLICY "Enable read access for all users" ON "career_advice"
    FOR SELECT
    USING (true);

-- =====================================================
-- VERIFICACIÓN FINAL
-- =====================================================

-- 1. Verificar que solo hay UNA política
SELECT
    policyname,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'career_advice';

-- 2. Verificar permisos de la tabla
SELECT
    grantee,
    privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public'
    AND table_name = 'career_advice'
    AND grantee IN ('anon', 'authenticated')
ORDER BY grantee, privilege_type;

-- 3. Probar consulta como usuario anónimo
SET ROLE anon;
SELECT COUNT(*) as total_records FROM career_advice;
SELECT id, title FROM career_advice LIMIT 3;
RESET ROLE;

-- =====================================================
-- RESULTADO ESPERADO
-- =====================================================
-- Deberías ver:
-- 1. Solo UNA política: "Enable read access for all users"
-- 2. Permisos SELECT para 'anon' y 'authenticated'
-- 3. La consulta como anon debería mostrar los registros sin error