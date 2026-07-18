-- ============================================================
-- S_Library — Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- ─── 1. Categories ───
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 2. Tags ───
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

-- ─── 3. Posts ───
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT DEFAULT '',
  cover_image_url TEXT,
  type TEXT NOT NULL CHECK (type IN ('lab', 'investigation', 'project', 'note')),
  platform TEXT,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard', 'Insane', NULL)),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reading_time INT DEFAULT 1,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 4. Post-Tag Join Table ───
CREATE TABLE IF NOT EXISTS post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- ─── 5. Contact Messages ───
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

-- Posts: public read for published, admin-only write
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published posts"
  ON posts FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can view all posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authenticated users can update their posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Authenticated users can delete their posts"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Categories: public read, admin write
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Tags: public read, admin write
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view tags"
  ON tags FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage tags"
  ON tags FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Post Tags: public read, admin write
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view post_tags"
  ON post_tags FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage post_tags"
  ON post_tags FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Contact Messages: public insert, admin read
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- Storage Bucket for Post Images
-- ============================================================
-- Create this bucket manually in Dashboard > Storage, or run:
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: anyone can view, authenticated can upload
CREATE POLICY "Public can view post images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'post-images');

CREATE POLICY "Authenticated users can upload post images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'post-images');

CREATE POLICY "Authenticated users can delete post images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'post-images');

-- ============================================================
-- Seed Data: Default Categories
-- ============================================================
INSERT INTO categories (name, slug) VALUES
  ('Web Security', 'web-security'),
  ('Network Security', 'network-security'),
  ('Malware Analysis', 'malware-analysis'),
  ('Digital Forensics', 'digital-forensics'),
  ('Incident Response', 'incident-response'),
  ('Privilege Escalation', 'privilege-escalation'),
  ('Enumeration', 'enumeration'),
  ('Exploitation', 'exploitation'),
  ('OSINT', 'osint'),
  ('Cryptography', 'cryptography')
ON CONFLICT (name) DO NOTHING;

-- Seed Data: Default Tags
INSERT INTO tags (name, slug) VALUES
  ('linux', 'linux'),
  ('windows', 'windows'),
  ('nmap', 'nmap'),
  ('burpsuite', 'burpsuite'),
  ('wireshark', 'wireshark'),
  ('python', 'python'),
  ('bash', 'bash'),
  ('sql-injection', 'sql-injection'),
  ('xss', 'xss'),
  ('phishing', 'phishing'),
  ('privilege-escalation', 'privilege-escalation'),
  ('reverse-engineering', 'reverse-engineering'),
  ('active-directory', 'active-directory'),
  ('splunk', 'splunk'),
  ('siem', 'siem')
ON CONFLICT (name) DO NOTHING;
