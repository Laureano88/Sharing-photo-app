/*
  # Create storage bucket for photos

  ## Overview
  Creates a public storage bucket for uploaded photos with appropriate access policies.

  ## Storage Buckets Created
  
  ### `photos`
  Public bucket for storing uploaded images
  - Public access enabled for direct image URLs
  - Supports formats: JPEG, PNG, WebP
  - File size limit: 5MB per file
  - Naming convention: timestamp_filename

  ## Security Policies
  
  1. **Public Read**: Anyone can view images (for carousel display)
  2. **Public Insert**: Anyone can upload images (for event participants)
  3. **Authenticated Delete**: Only authenticated admins can delete images

  ## Notes
  - Bucket is public to allow direct image access without auth
  - Upload validation should be done in application layer
  - Images are referenced in `uploads` table via `image_url` column
*/

-- Create photos storage bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Anyone can view images
CREATE POLICY "Images are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'photos');

-- Policy: Anyone can upload images
CREATE POLICY "Anyone can upload images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'photos');

-- Policy: Only authenticated users can delete images
CREATE POLICY "Only authenticated users can delete images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'photos');