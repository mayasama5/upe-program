-- Migration to add missing fields to match schema.prisma
-- Execute this SQL in your Supabase/PostgreSQL database

-- Add missing fields to job_applications table
ALTER TABLE job_applications
ADD COLUMN IF NOT EXISTS contact_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS experience_summary TEXT,
ADD COLUMN IF NOT EXISTS availability TEXT DEFAULT 'inmediata',
ADD COLUMN IF NOT EXISTS additional_info JSONB DEFAULT '{}';

-- Add missing fields to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS password TEXT,
ADD COLUMN IF NOT EXISTS contact_name TEXT,
ADD COLUMN IF NOT EXISTS education TEXT,
ADD COLUMN IF NOT EXISTS career TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS company_size TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS benefits TEXT;

-- Create system_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    maintenance_mode BOOLEAN NOT NULL DEFAULT false,
    maintenance_message TEXT,
    university_logo TEXT,
    faculty_logo TEXT,
    techhub_logo TEXT,
    updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create a trigger to update updated_at timestamp for system_settings
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_system_settings_updated_at ON system_settings;
CREATE TRIGGER update_system_settings_updated_at
BEFORE UPDATE ON system_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert default system settings if none exist
INSERT INTO system_settings (id, maintenance_mode)
SELECT gen_random_uuid(), false
WHERE NOT EXISTS (SELECT 1 FROM system_settings LIMIT 1);
