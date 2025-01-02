/*
  # Add is_public column to shared_images table

  1. Changes
    - Add `is_public` boolean column to `shared_images` table with default value true
    - Update RLS policies to handle public/private access

  2. Security
    - Public images can be viewed by anyone
    - Private images can only be viewed by their owners
*/

-- Add is_public column
ALTER TABLE shared_images 
ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT true;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Anyone can read public images" ON shared_images;
DROP POLICY IF EXISTS "Users can read own images" ON shared_images;

-- Create new RLS policies
CREATE POLICY "Users can read own images"
  ON shared_images
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read public images"
  ON shared_images
  FOR SELECT
  TO anon
  USING (is_public = true);

CREATE POLICY "Authenticated users can read public images"
  ON shared_images
  FOR SELECT
  TO authenticated
  USING (is_public = true OR auth.uid() = user_id);