-- Migration to add location_address column to events table
-- Run this in your Supabase SQL editor if the column doesn't exist

-- Check if the column exists and add it if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'location_address'
    ) THEN
        ALTER TABLE events ADD COLUMN location_address TEXT;
        RAISE NOTICE 'Added location_address column to events table';
    ELSE
        RAISE NOTICE 'location_address column already exists in events table';
    END IF;
END $$;

-- Also ensure other missing columns exist
DO $$
BEGIN
    -- Add event_type if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'event_type'
    ) THEN
        ALTER TABLE events ADD COLUMN event_type VARCHAR(100) DEFAULT 'social';
        RAISE NOTICE 'Added event_type column to events table';
    END IF;
    
    -- Add created_by if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'created_by'
    ) THEN
        ALTER TABLE events ADD COLUMN created_by UUID;
        RAISE NOTICE 'Added created_by column to events table';
    END IF;
    
    -- Add created_at if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE events ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added created_at column to events table';
    END IF;
    
    -- Add updated_at if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE events ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added updated_at column to events table';
    END IF;
END $$; 