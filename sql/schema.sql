-- Food Ranking App v2 — Database Schema
-- Run this in Supabase SQL Editor

-- Places table
CREATE TABLE places (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  address     TEXT,
  description TEXT,
  user_id     UUID NOT NULL REFERENCES auth.users(id),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Product reviews table
CREATE TABLE product_reviews (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id       UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  product_name   TEXT NOT NULL,
  quality_rating REAL NOT NULL CHECK (quality_rating >= 0 AND quality_rating <= 5),
  price_rating   REAL NOT NULL CHECK (price_rating >= 0 AND price_rating <= 5),
  service_rating REAL NOT NULL CHECK (service_rating >= 0 AND service_rating <= 5),
  overall_rating REAL GENERATED ALWAYS AS (
    (quality_rating + price_rating + service_rating) / 3.0
  ) STORED,
  comments       TEXT,
  user_id        UUID NOT NULL REFERENCES auth.users(id),
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for common queries
CREATE INDEX idx_product_reviews_place_id ON product_reviews(place_id);
CREATE INDEX idx_places_user_id ON places(user_id);
CREATE INDEX idx_product_reviews_user_id ON product_reviews(user_id);
