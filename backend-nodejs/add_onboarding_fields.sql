-- Migración para agregar campos de onboarding separados para estudiantes y empresas
-- Fecha: 2025-10-26

-- Agregar campos para estudiantes
ALTER TABLE users ADD COLUMN IF NOT EXISTS education VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS career VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);

-- Agregar campos para empresas
ALTER TABLE users ADD COLUMN IF NOT EXISTS industry VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_size VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS website VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Paraguay';
ALTER TABLE users ADD COLUMN IF NOT EXISTS benefits TEXT;

-- Comentarios para documentación
COMMENT ON COLUMN users.education IS 'Institución educativa del estudiante';
COMMENT ON COLUMN users.career IS 'Carrera o área de estudio del estudiante';
COMMENT ON COLUMN users.phone IS 'Teléfono de contacto (estudiante o empresa)';
COMMENT ON COLUMN users.industry IS 'Industria o sector de la empresa';
COMMENT ON COLUMN users.company_size IS 'Tamaño de la empresa (ej: 1-10, 11-50)';
COMMENT ON COLUMN users.website IS 'Sitio web de la empresa';
COMMENT ON COLUMN users.address IS 'Dirección física de la empresa';
COMMENT ON COLUMN users.city IS 'Ciudad de la empresa';
COMMENT ON COLUMN users.country IS 'País de la empresa';
COMMENT ON COLUMN users.benefits IS 'Beneficios que ofrece la empresa a empleados';

-- Verificar la estructura actualizada
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;
