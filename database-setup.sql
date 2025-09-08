-- Run this SQL in your Supabase SQL Editor to create the products table

CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('furniture', 'properties', 'auto')),
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on category for faster queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Create an index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a simple e-commerce site)
-- Allow everyone to read products
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

-- Allow everyone to insert products (for admin functionality)
-- Note: In production, you should restrict this to authenticated admin users
CREATE POLICY "Enable insert for all users" ON products
    FOR INSERT WITH CHECK (true);

-- Allow everyone to update products
CREATE POLICY "Enable update for all users" ON products
    FOR UPDATE USING (true);

-- Allow everyone to delete products
CREATE POLICY "Enable delete for all users" ON products
    FOR DELETE USING (true);

-- Optional: Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();