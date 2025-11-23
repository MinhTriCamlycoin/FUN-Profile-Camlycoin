-- Add chain_id column to transactions table
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS chain_id INTEGER NOT NULL DEFAULT 1;