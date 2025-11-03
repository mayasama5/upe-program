-- Migration: Add additional_info field to job_applications table
-- This field will store additional application information like motivation, skills, and salary expectations

ALTER TABLE job_applications 
ADD COLUMN additional_info JSONB DEFAULT '{}' NOT NULL;

-- Add a comment to document the field purpose
COMMENT ON COLUMN job_applications.additional_info IS 'Additional application information including motivation, skills, and salary expectations';

-- Verify the column was added successfully
\d job_applications;