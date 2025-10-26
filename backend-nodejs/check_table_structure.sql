-- Verificar la estructura de las tablas
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'courses'
ORDER BY ordinal_position;

SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'events'
ORDER BY ordinal_position;

SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'job_vacancies'
ORDER BY ordinal_position;