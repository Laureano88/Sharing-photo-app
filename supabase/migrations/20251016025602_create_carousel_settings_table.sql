/*
  # Create carousel_settings table for display configuration

  ## Overview
  Creates table to store carousel display settings with real-time updates.

  ## Tables Created
  
  ### `carousel_settings`
  Stores all configuration for the photo carousel display
  - `id` (uuid, primary key) - Unique identifier, auto-generated
  - `slide_interval` (integer) - Milliseconds between slides, default 5000
  - `photos_limit` (text) - Max photos to show, default '10'
  - `flash_enabled` (boolean) - Enable flash effect, default true
  - `flash_interval` (integer) - Milliseconds between flashes, default 15000
  - `emojis_enabled` (boolean) - Enable floating emojis, default true
  - `emoji_interval` (integer) - Milliseconds between emojis, default 3000
  - `selected_emojis` (text) - Comma-separated emoji list, default '👏,❤️,✨,🎉'
  - `confetti_enabled` (boolean) - Enable confetti effect, default true
  - `confetti_interval` (integer) - Milliseconds between confetti, default 20000
  - `created_at` (timestamptz) - Creation timestamp, auto-generated
  - `updated_at` (timestamptz) - Last update timestamp, auto-updated

  ## Security (RLS)
  
  Row Level Security is enabled with the following policies:
  
  1. **Public Read**: Anyone can view settings (for carousel display)
  2. **Authenticated Update**: Only authenticated admins can modify settings
  3. **Authenticated Insert**: Only authenticated admins can create settings
  4. **Authenticated Delete**: Only authenticated admins can delete settings

  ## Notes
  - Only one settings record should exist (single source of truth)
  - `updated_at` is automatically updated via trigger
  - Public read allows carousel page to fetch settings without auth
*/

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create carousel_settings table
CREATE TABLE IF NOT EXISTS carousel_settings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    slide_interval integer DEFAULT 5000,
    photos_limit text DEFAULT '10',
    flash_enabled boolean DEFAULT true,
    flash_interval integer DEFAULT 15000,
    emojis_enabled boolean DEFAULT true,
    emoji_interval integer DEFAULT 3000,
    selected_emojis text DEFAULT '👏,❤️,✨,🎉',
    confetti_enabled boolean DEFAULT true,
    confetti_interval integer DEFAULT 20000,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE carousel_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read carousel settings
CREATE POLICY "Allow read access for all users"
  ON carousel_settings
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can insert settings
CREATE POLICY "Authenticated users can insert settings"
  ON carousel_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Only authenticated users can update settings
CREATE POLICY "Authenticated users can update settings"
  ON carousel_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Only authenticated users can delete settings
CREATE POLICY "Authenticated users can delete settings"
  ON carousel_settings
  FOR DELETE
  TO authenticated
  USING (true);

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_carousel_settings_updated_at
    BEFORE UPDATE ON carousel_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default configuration
INSERT INTO carousel_settings (
    slide_interval,
    photos_limit,
    flash_enabled,
    flash_interval,
    emojis_enabled,
    emoji_interval,
    selected_emojis,
    confetti_enabled,
    confetti_interval
) VALUES (
    5000,
    '10',
    true,
    15000,
    true,
    3000,
    '👏,❤️,✨,🎉',
    true,
    20000
);