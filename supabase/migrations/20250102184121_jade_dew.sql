/*
  # Create user downloads tracking table

  1. New Tables
    - `user_downloads`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `resolution` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `user_downloads` table
    - Add policy for authenticated users to read their own downloads
    - Add policy for authenticated users to insert their own downloads
*/

CREATE TABLE IF NOT EXISTS user_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  resolution text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own downloads"
  ON user_downloads
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own downloads"
  ON user_downloads
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);