-- Fix job_applications table structure
-- First, let's check the current structure
\d job_applications;

-- Add missing columns if they don't exist
-- contact_info column
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_applications' AND column_name = 'contact_info') THEN
        ALTER TABLE job_applications ADD COLUMN contact_info JSONB DEFAULT '{}' NOT NULL;
    END IF;
END $$;

-- experience_summary column
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_applications' AND column_name = 'experience_summary') THEN
        ALTER TABLE job_applications ADD COLUMN experience_summary TEXT;
    END IF;
END $$;

-- availability column
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_applications' AND column_name = 'availability') THEN
        ALTER TABLE job_applications ADD COLUMN availability VARCHAR(20) DEFAULT 'inmediata' NOT NULL;
    END IF;
END $$;

-- additional_info column
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_applications' AND column_name = 'additional_info') THEN
        ALTER TABLE job_applications ADD COLUMN additional_info JSONB DEFAULT '{}' NOT NULL;
    END IF;
END $$;

-- cover_letter column (in case it doesn't exist)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_applications' AND column_name = 'cover_letter') THEN
        ALTER TABLE job_applications ADD COLUMN cover_letter TEXT;
    END IF;
END $$;

-- status column with enum (in case it doesn't exist)
DO $$ 
BEGIN 
    -- First create the enum type if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ApplicationStatus') THEN
        CREATE TYPE "ApplicationStatus" AS ENUM ('nuevo', 'en_revision', 'entrevista', 'oferta', 'rechazado');
    END IF;
    
    -- Then add the column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_applications' AND column_name = 'status') THEN
        ALTER TABLE job_applications ADD COLUMN status "ApplicationStatus" DEFAULT 'nuevo' NOT NULL;
    END IF;
END $$;

-- Add timestamps if they don't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_applications' AND column_name = 'created_at') THEN
        ALTER TABLE job_applications ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL;
    END IF;
END $$;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_applications' AND column_name = 'updated_at') THEN
        ALTER TABLE job_applications ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL;
    END IF;
END $$;

-- Add comments to document the fields
COMMENT ON COLUMN job_applications.contact_info IS 'Contact information including phone, email, linkedin, portfolio';
COMMENT ON COLUMN job_applications.experience_summary IS 'Summary of relevant work experience';
COMMENT ON COLUMN job_applications.availability IS 'When the applicant can start working';
COMMENT ON COLUMN job_applications.additional_info IS 'Additional application information including motivation, skills, and salary expectations';

-- Verify the final structure
\d job_applications;

-- Show all columns
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'job_applications' 
ORDER BY ordinal_position;