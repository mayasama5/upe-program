-- Add additional fields to job_applications table
ALTER TABLE "public"."job_applications" 
ADD COLUMN "contact_info" JSONB DEFAULT '{}',
ADD COLUMN "experience_summary" TEXT,
ADD COLUMN "availability" TEXT DEFAULT 'inmediata';

-- Update existing records to have empty contact_info if null
UPDATE "public"."job_applications" 
SET "contact_info" = '{}' 
WHERE "contact_info" IS NULL;