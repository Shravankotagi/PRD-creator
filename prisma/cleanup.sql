-- SQL Script to clean up unnecessary columns from the database
-- Run this in your Supabase SQL Editor:

ALTER TABLE "User" DROP COLUMN IF EXISTS "clerkId";
ALTER TABLE "User" DROP COLUMN IF EXISTS "image";
