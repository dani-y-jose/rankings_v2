-- Row Level Security Policies
-- Run this AFTER schema.sql in Supabase SQL Editor

-- Enable RLS on both tables
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Places policies: all authenticated users can read, only owner can write
CREATE POLICY "Auth read" ON places FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert" ON places FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth update" ON places FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Auth delete" ON places FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Product reviews policies: all authenticated users can read, only owner can write
CREATE POLICY "Auth read" ON product_reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth insert" ON product_reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth update" ON product_reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Auth delete" ON product_reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);
