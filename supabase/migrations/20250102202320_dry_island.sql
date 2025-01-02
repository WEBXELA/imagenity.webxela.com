/*
  # Add storage bucket for shared images
  
  1. Changes
    - Create storage bucket for shared images
    - Set up RLS policies for the bucket
  
  2. Security
    - Enable RLS on bucket
    - Allow authenticated users to upload to their own folder
    - Allow public read access to shared images
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('shared-images', 'shared-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'shared-images');

CREATE POLICY "Allow authenticated users to upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'shared-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);