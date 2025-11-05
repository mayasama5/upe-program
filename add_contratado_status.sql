-- Migration to add 'contratado' status to ApplicationStatus enum
-- Execute this SQL in your Supabase/PostgreSQL database

-- Add 'contratado' value to ApplicationStatus enum (if it doesn't exist)
ALTER TYPE "ApplicationStatus" ADD VALUE IF NOT EXISTS 'contratado';

-- Note: In PostgreSQL, you cannot specify the position when adding an enum value
-- The new value will be added at the end of the enum
-- If you need a specific order, you would need to recreate the enum

-- To verify the enum values, run:
-- SELECT enumlabel FROM pg_enum WHERE enumtypid = 'ApplicationStatus'::regtype ORDER BY enumsortorder;
