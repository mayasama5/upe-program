-- =====================================================

-- =============================
-- INSTRUCCIONES DE EJECUCIÓN EN SUPABASE SQL WEB
-- =============================
-- 1. Ejecuta los CREATE TYPE (enums) solo si no existen:
--
-- CREATE TYPE "UserRole" AS ENUM ('estudiante', 'empresa');
-- CREATE TYPE "JobType" AS ENUM ('practica', 'pasantia', 'junior', 'medio', 'senior');
-- CREATE TYPE "JobModality" AS ENUM ('remoto', 'presencial', 'hibrido');
-- CREATE TYPE "ApplicationStatus" AS ENUM ('nuevo', 'en_revision', 'entrevista', 'oferta', 'rechazado');
-- CREATE TYPE "ApplyType" AS ENUM ('interno', 'externo');

-- 2. Ejecuta los CREATE TABLE en este orden (por dependencias):
--
-- CREATE TABLE "users" (...);
-- CREATE TABLE "courses" (...);
-- CREATE TABLE "events" (...);
-- CREATE TABLE "job_vacancies" (...);
-- CREATE TABLE "saved_items" (...);
-- CREATE TABLE "job_applications" (...);
-- CREATE TABLE "scholarships" (...);
-- CREATE TABLE "certifications" (...);
-- CREATE TABLE "companies" (...);
-- CREATE TABLE "career_advice" (...);
-- CREATE TABLE "stats" (...);

-- 3. Ejecuta los CREATE INDEX (puedes ejecutar todos juntos):
-- ...ya están listos más abajo...

-- 4. Ejecuta la función y triggers para updated_at (si los necesitas):
--
-- CREATE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER update_users_updated_at
--     BEFORE UPDATE ON "users"
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();

-- CREATE TRIGGER update_job_vacancies_updated_at
--     BEFORE UPDATE ON "job_vacancies"
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();

-- CREATE TRIGGER update_job_applications_updated_at
--     BEFORE UPDATE ON "job_applications"
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();

-- 5. Ejecuta los ALTER TABLE para RLS y las políticas (si los necesitas):
-- ...ya están listos más abajo...

-- 6. Ejecuta los INSERT para poblar las tablas con datos de ejemplo.

-- Sigue este orden y no tendrás errores de dependencias ni de relaciones inexistentes.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CREATE ENUMS
-- =====================================================
-- NOTA: El editor SQL web de Supabase no soporta --DO $$ ... $$
-- Ejecuta manualmente cada CREATE TYPE solo si no existe, o elimina la línea si ya existe.
-- Si el tipo ya existe, comenta la línea.
-- Si no existe, descomenta la línea y ejecútala.
-- Ejemplo:
-- CREATE TYPE "UserRole" AS ENUM ('estudiante', 'empresa');
-- CREATE TYPE "JobType" AS ENUM ('practica', 'pasantia', 'junior', 'medio', 'senior');
-- CREATE TYPE "JobModality" AS ENUM ('remoto', 'presencial', 'hibrido');
-- CREATE TYPE "ApplicationStatus" AS ENUM ('nuevo', 'en_revision', 'entrevista', 'oferta', 'rechazado');
-- CREATE TYPE "ApplyType" AS ENUM ('interno', 'externo');

-- =====================================================
-- CREATE TABLES
-- =====================================================

-- Users Table
-- Ejecuta manualmente CREATE TABLE solo si no existe, o elimina la línea si ya existe.
-- CREATE TABLE "users" (
--     "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
--     "email" TEXT NOT NULL UNIQUE,
--     "name" TEXT NOT NULL,
--     "picture" TEXT,
--     "role" "UserRole" NOT NULL DEFAULT 'estudiante',
--     "is_verified" BOOLEAN NOT NULL DEFAULT false,
--     "github_url" TEXT,
--     "linkedin_url" TEXT,
--     "portfolio_url" TEXT,
--     "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
--     "bio" TEXT,
--     "company_name" TEXT,
--     "company_document" TEXT,
--     "cv_file_path" TEXT,
--     "certificate_files" JSONB[] DEFAULT ARRAY[]::JSONB[],
--     "degree_files" JSONB[] DEFAULT ARRAY[]::JSONB[],
--     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );

-- Courses Table
-- CREATE TABLE "courses" (
--     "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
--     "title" TEXT NOT NULL,
--     "description" TEXT NOT NULL,
--     "provider" TEXT NOT NULL,
--     "url" TEXT NOT NULL,
--     "language" TEXT NOT NULL DEFAULT 'es',
--     "has_spanish_subtitles" BOOLEAN NOT NULL DEFAULT false,
--     "category" TEXT NOT NULL,
--     "is_free" BOOLEAN NOT NULL DEFAULT true,
--     "image_url" TEXT,
--     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );

-- Events Table
-- CREATE TABLE "events" (
--     "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
--     "title" TEXT NOT NULL,
--     "description" TEXT NOT NULL,
--     "organizer" TEXT NOT NULL,
--     "url" TEXT NOT NULL,
--     "event_date" TIMESTAMP(3) NOT NULL,
--     "location" TEXT NOT NULL,
--     "is_online" BOOLEAN NOT NULL DEFAULT true,
--     "category" TEXT NOT NULL,
--     "image_url" TEXT,
--     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
-- );

-- Job Vacancies Table
-- CREATE TABLE "job_vacancies" (
--     "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
--     "title" TEXT NOT NULL,
--     "description" TEXT NOT NULL,
--     "company" TEXT NOT NULL,
--     "company_logo" TEXT,
--     "location" TEXT NOT NULL,
--     "job_type" "JobType" NOT NULL,
--     "modality" "JobModality" NOT NULL,
--     "salary_range" TEXT,
--     "requirements" TEXT[] DEFAULT ARRAY[]::TEXT[],
--     "responsibilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
--     "benefits" TEXT[] DEFAULT ARRAY[]::TEXT[],
--     "apply_type" "ApplyType" NOT NULL,
--     "external_url" TEXT,
--     "posted_by_user_id" TEXT,
--     "is_active" BOOLEAN NOT NULL DEFAULT true,
--     "category" TEXT NOT NULL,
--     "experience_years" INTEGER,
--     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT "job_vacancies_posted_by_user_id_fkey" FOREIGN KEY ("posted_by_user_id")
--         REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
-- );

-- Saved Items Table
-- CREATE TABLE "saved_items" (
--     "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
--     "user_id" TEXT NOT NULL,
--     "item_type" TEXT NOT NULL,
--     "course_id" TEXT,
--     "event_id" TEXT,
--     "job_vacancy_id" TEXT,
--     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT "saved_items_user_id_fkey" FOREIGN KEY ("user_id")
--         REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
--     CONSTRAINT "saved_items_course_id_fkey" FOREIGN KEY ("course_id")
--         REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE,
--     CONSTRAINT "saved_items_event_id_fkey" FOREIGN KEY ("event_id")
--         REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE,
--     CONSTRAINT "saved_items_job_vacancy_id_fkey" FOREIGN KEY ("job_vacancy_id")
--         REFERENCES "job_vacancies"("id") ON DELETE CASCADE ON UPDATE CASCADE
-- );

-- Job Applications Table
-- CREATE TABLE "job_applications" (
--     "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
--     "job_vacancy_id" TEXT NOT NULL,
--     "applicant_id" TEXT NOT NULL,
--     "cover_letter" TEXT,
--     "status" "ApplicationStatus" NOT NULL DEFAULT 'nuevo',
--     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT "job_applications_job_vacancy_id_fkey" FOREIGN KEY ("job_vacancy_id")
--         REFERENCES "job_vacancies"("id") ON DELETE CASCADE ON UPDATE CASCADE,
--     CONSTRAINT "job_applications_applicant_id_fkey" FOREIGN KEY ("applicant_id")
--         REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
-- );

-- Scholarships Table
CREATE TABLE "scholarships" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "provider" TEXT,
    "url" TEXT,
    "category" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Certifications Table
CREATE TABLE "certifications" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "provider" TEXT,
    "url" TEXT,
    "category" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Companies Table
CREATE TABLE "companies" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "website" TEXT,
    "logo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE "career_advice" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "author" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE "stats" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    "name" TEXT NOT NULL,
    "value" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CREATE INDEXES
-- =====================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users" ("role");

-- Courses indexes
CREATE INDEX IF NOT EXISTS "courses_category_idx" ON "courses" ("category");
CREATE INDEX IF NOT EXISTS "courses_is_free_idx" ON "courses" ("is_free");

-- Events indexes
CREATE INDEX IF NOT EXISTS "events_category_idx" ON "events" ("category");
CREATE INDEX IF NOT EXISTS "events_event_date_idx" ON "events" ("event_date");
CREATE INDEX IF NOT EXISTS "events_is_online_idx" ON "events" ("is_online");

-- Job Vacancies indexes
CREATE INDEX IF NOT EXISTS "job_vacancies_category_idx" ON "job_vacancies" ("category");
CREATE INDEX IF NOT EXISTS "job_vacancies_is_active_idx" ON "job_vacancies" ("is_active");
CREATE INDEX IF NOT EXISTS "job_vacancies_posted_by_user_id_idx" ON "job_vacancies" ("posted_by_user_id");

-- Saved Items indexes
CREATE UNIQUE INDEX IF NOT EXISTS "saved_items_user_id_course_id_key" ON "saved_items" ("user_id", "course_id") WHERE "course_id" IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "saved_items_user_id_event_id_key" ON "saved_items" ("user_id", "event_id") WHERE "event_id" IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "saved_items_user_id_job_vacancy_id_key" ON "saved_items" ("user_id", "job_vacancy_id") WHERE "job_vacancy_id" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "saved_items_user_id_idx" ON "saved_items" ("user_id");

-- Job Applications indexes
CREATE UNIQUE INDEX IF NOT EXISTS "job_applications_job_vacancy_id_applicant_id_key" ON "job_applications" ("job_vacancy_id", "applicant_id");
CREATE INDEX IF NOT EXISTS "job_applications_applicant_id_idx" ON "job_applications" ("applicant_id");
CREATE INDEX IF NOT EXISTS "job_applications_status_idx" ON "job_applications" ("status");

-- =====================================================
-- CREATE TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
-- Ejecuta manualmente solo si no existe:
-- CREATE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     NEW.updated_at = CURRENT_TIMESTAMP;
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- Triggers for tables with updated_at
-- Ejecuta manualmente solo si no existe:
-- CREATE TRIGGER update_users_updated_at
--     BEFORE UPDATE ON "users"
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();

-- CREATE TRIGGER update_job_vacancies_updated_at
--     BEFORE UPDATE ON "job_vacancies"
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();

-- CREATE TRIGGER update_job_applications_updated_at
--     BEFORE UPDATE ON "job_applications"
--     FOR EACH ROW
--     EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ENABLE ROW LEVEL SECURITY (RLS) - OPTIONAL
-- =====================================================

-- Enable RLS on all tables
-- Ejecuta manualmente solo si no existe:
-- ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "courses" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "events" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "job_vacancies" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "saved_items" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "job_applications" ENABLE ROW LEVEL SECURITY;

-- Public read access for courses, events, and job vacancies
-- Ejecuta manualmente solo si no existe:
-- CREATE POLICY "Public courses are viewable by everyone" ON "courses"
--     FOR SELECT USING (true);
-- CREATE POLICY "Public events are viewable by everyone" ON "events"
--     FOR SELECT USING (true);
-- CREATE POLICY "Active job vacancies are viewable by everyone" ON "job_vacancies"
--     FOR SELECT USING ("is_active" = true);

-- Users can read their own data
-- Ejecuta manualmente solo si no existe:
-- CREATE POLICY "Users can view own data" ON "users"
--     FOR SELECT USING (auth.uid()::text = id);
-- CREATE POLICY "Users can update own data" ON "users"
--     FOR UPDATE USING (auth.uid()::text = id);

-- Saved items policies
-- Ejecuta manualmente solo si no existe:
-- CREATE POLICY "Users can view own saved items" ON "saved_items"
--     FOR SELECT USING (auth.uid()::text = user_id);
-- CREATE POLICY "Users can insert own saved items" ON "saved_items"
--     FOR INSERT WITH CHECK (auth.uid()::text = user_id);
-- CREATE POLICY "Users can delete own saved items" ON "saved_items"
--     FOR DELETE USING (auth.uid()::text = user_id);

-- Job applications policies
-- Ejecuta manualmente solo si no existe:
-- CREATE POLICY "Users can view own applications" ON "job_applications"
--     FOR SELECT USING (auth.uid()::text = applicant_id);
-- CREATE POLICY "Users can create applications" ON "job_applications"
--     FOR INSERT WITH CHECK (auth.uid()::text = applicant_id);
-- CREATE POLICY "Companies can view applications for their jobs" ON "job_applications"
--     FOR SELECT USING (
--         EXISTS (
--             SELECT 1 FROM "job_vacancies"
--             WHERE "job_vacancies"."id" = "job_applications"."job_vacancy_id"
--             AND "job_vacancies"."posted_by_user_id" = auth.uid()::text
--         )
--     );

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check all tables were created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check all enums were created
SELECT typname
FROM pg_type
WHERE typtype = 'e'
ORDER BY typname;

-- =====================================================
-- POPULATE TABLES WITH SAMPLE DATA
-- =====================================================

-- Scholarships
INSERT INTO "scholarships" (title, description, provider, url, category)
SELECT 'Beca UPE', 'Beca completa para estudiantes destacados', 'UPE', 'https://upe.com/becas', 'Educación'
WHERE NOT EXISTS (
    SELECT 1 FROM "scholarships" WHERE title = 'Beca UPE'
);

INSERT INTO "scholarships" (title, description, provider, url, category)
SELECT 'Beca Internacional', 'Beca para estudios en el extranjero', 'UPE', 'https://upe.com/internacional', 'Educación'
WHERE NOT EXISTS (
    SELECT 1 FROM "scholarships" WHERE title = 'Beca Internacional'
);

-- Certifications
INSERT INTO "certifications" (title, description, provider, url, category)
SELECT 'Certificado React', 'Certificación oficial de React', 'UPE', 'https://upe.com/react-cert', 'Tecnología'
WHERE NOT EXISTS (
    SELECT 1 FROM "certifications" WHERE title = 'Certificado React'
);

INSERT INTO "certifications" (title, description, provider, url, category)
SELECT 'Certificado Node.js', 'Certificación oficial de Node.js', 'UPE', 'https://upe.com/node-cert', 'Tecnología'
WHERE NOT EXISTS (
    SELECT 1 FROM "certifications" WHERE title = 'Certificado Node.js'
);

-- Companies
INSERT INTO "companies" (name, description, website, logo_url)
SELECT 'TechCorp', 'Empresa líder en tecnología', 'https://techcorp.com', 'https://techcorp.com/logo.png'
WHERE NOT EXISTS (
    SELECT 1 FROM "companies" WHERE name = 'TechCorp'
);

INSERT INTO "companies" (name, description, website, logo_url)
SELECT 'Innovate S.A.', 'Soluciones innovadoras para empresas', 'https://innovate.com', 'https://innovate.com/logo.png'
WHERE NOT EXISTS (
    SELECT 1 FROM "companies" WHERE name = 'Innovate S.A.'
);

-- Career Advice
INSERT INTO "career_advice" (title, content, author)
SELECT 'Cómo preparar tu CV', 'Consejos para crear un CV profesional.', 'Equipo UPE'
WHERE NOT EXISTS (
    SELECT 1 FROM "career_advice" WHERE title = 'Cómo preparar tu CV'
);

INSERT INTO "career_advice" (title, content, author)
SELECT 'Entrevista de trabajo', 'Tips para destacar en entrevistas laborales.', 'Equipo UPE'
WHERE NOT EXISTS (
    SELECT 1 FROM "career_advice" WHERE title = 'Entrevista de trabajo'
);

-- Stats
INSERT INTO "stats" (name, value)
SELECT 'Usuarios registrados', 1200
WHERE NOT EXISTS (
    SELECT 1 FROM "stats" WHERE name = 'Usuarios registrados'
);

INSERT INTO "stats" (name, value)
SELECT 'Cursos publicados', 35
WHERE NOT EXISTS (
    SELECT 1 FROM "stats" WHERE name = 'Cursos publicados'
);

INSERT INTO "stats" (name, value)
SELECT 'Eventos realizados', 12
WHERE NOT EXISTS (
    SELECT 1 FROM "stats" WHERE name = 'Eventos realizados'
);