-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('estudiante', 'empresa');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('practica', 'pasantia', 'junior', 'medio', 'senior');

-- CreateEnum
CREATE TYPE "JobModality" AS ENUM ('remoto', 'presencial', 'hibrido');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('nuevo', 'en_revision', 'entrevista', 'oferta', 'rechazado');

-- CreateEnum
CREATE TYPE "ApplyType" AS ENUM ('interno', 'externo');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "picture" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'estudiante',
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "github_url" TEXT,
    "linkedin_url" TEXT,
    "portfolio_url" TEXT,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "bio" TEXT,
    "company_name" TEXT,
    "company_document" TEXT,
    "cv_file_path" TEXT,
    "certificate_files" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "degree_files" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'es',
    "has_spanish_subtitles" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT NOT NULL,
    "is_free" BOOLEAN NOT NULL DEFAULT true,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "organizer" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "event_date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "is_online" BOOLEAN NOT NULL DEFAULT true,
    "category" TEXT NOT NULL,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_vacancies" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "company_logo" TEXT,
    "location" TEXT NOT NULL,
    "job_type" "JobType" NOT NULL,
    "modality" "JobModality" NOT NULL,
    "salary_range" TEXT,
    "requirements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "responsibilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "benefits" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "apply_type" "ApplyType" NOT NULL,
    "external_url" TEXT,
    "posted_by_user_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "category" TEXT NOT NULL,
    "experience_years" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_vacancies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_items" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "item_type" TEXT NOT NULL,
    "course_id" TEXT,
    "event_id" TEXT,
    "job_vacancy_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_applications" (
    "id" TEXT NOT NULL,
    "job_vacancy_id" TEXT NOT NULL,
    "applicant_id" TEXT NOT NULL,
    "cover_letter" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'nuevo',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "career_advice" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "url" TEXT,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "career_advice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "saved_items_user_id_course_id_key" ON "saved_items"("user_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "saved_items_user_id_event_id_key" ON "saved_items"("user_id", "event_id");

-- CreateIndex
CREATE UNIQUE INDEX "saved_items_user_id_job_vacancy_id_key" ON "saved_items"("user_id", "job_vacancy_id");

-- CreateIndex
CREATE UNIQUE INDEX "job_applications_job_vacancy_id_applicant_id_key" ON "job_applications"("job_vacancy_id", "applicant_id");

-- AddForeignKey
ALTER TABLE "job_vacancies" ADD CONSTRAINT "job_vacancies_posted_by_user_id_fkey" FOREIGN KEY ("posted_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_items" ADD CONSTRAINT "saved_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_items" ADD CONSTRAINT "saved_items_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_items" ADD CONSTRAINT "saved_items_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_items" ADD CONSTRAINT "saved_items_job_vacancy_id_fkey" FOREIGN KEY ("job_vacancy_id") REFERENCES "job_vacancies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_vacancy_id_fkey" FOREIGN KEY ("job_vacancy_id") REFERENCES "job_vacancies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
