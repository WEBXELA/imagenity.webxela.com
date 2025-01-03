/*
  # Create shared images table

  1. New Tables
    - `shared_images`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `image_url` (text)
      - `public_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS
    - Add policies for user access
*/

CREATE TABLE IF NOT EXISTS shared_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  image_url text NOT NULL,
  public_url text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE shared_images ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own images
CREATE POLICY "Users can read own images"
  ON shared_images
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to insert their own images
CREATE POLICY "Users can insert own images"
  ON shared_images
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow public access to images via public_url
CREATE POLICY "Anyone can read public images"
  ON shared_images
  FOR SELECT
  TO anon
  USING (true);