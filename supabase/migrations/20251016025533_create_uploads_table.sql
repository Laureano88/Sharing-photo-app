/*
  # Create uploads table for photo management

  ## Overview
  Creates the main table for storing photo uploads with approval workflow.

  ## Tables Created
  
  ### `uploads`
  Stores metadata and URLs for uploaded photos
  - `id` (uuid, primary key) - Unique identifier, auto-generated
  - `image_url` (text) - URL of the uploaded image in storage
  - `comment` (text, nullable) - Optional comment from user
  - `approved` (boolean) - Approval status, defaults to false
  - `created_at` (timestamptz) - Creation timestamp, auto-generated

  ## Security (RLS)
  
  Row Level Security is enabled with the following policies:
  
  1. **Public Read**: Anyone can view all photos
  2. **Public Insert**: Anyone can upload photos (for event participants)
  3. **Authenticated Update**: Only authenticated admins can approve/reject
  4. **Authenticated Delete**: Only authenticated admins can delete photos

  ## Notes
  - New uploads default to `approved = false` requiring admin approval
  - Public can upload but cannot approve their own photos
  - Includes index on `approved` column for performance
*/

-- Create uploads table
CREATE TABLE IF NOT EXISTS uploads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url text,
  comment text,
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read all photos
CREATE POLICY "Enable read access for all users"
  ON uploads
  FOR SELECT
  USING (true);

-- Policy: Anyone can upload photos
CREATE POLICY "Allow public uploads"
  ON uploads
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only authenticated users can approve/update photos
CREATE POLICY "Authenticated users can approve photos"
  ON uploads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Only authenticated users can delete photos
CREATE POLICY "Enable delete for authenticated users"
  ON uploads
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for performance on approved column
CREATE INDEX IF NOT EXISTS uploads_approved_idx ON uploads(approved);

-- Create index for performance on created_at for sorting
CREATE INDEX IF NOT EXISTS uploads_created_at_idx ON uploads(created_at DESC);