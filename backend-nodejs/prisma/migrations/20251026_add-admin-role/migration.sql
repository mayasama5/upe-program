-- Manual migration: add 'admin' to UserRole enum
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'admin';