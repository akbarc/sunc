-- Migration to add missing columns for admin functionality
-- Run this in your Supabase SQL editor

-- Add review_notes column to applications table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'applications' AND column_name = 'review_notes'
    ) THEN
        ALTER TABLE applications ADD COLUMN review_notes TEXT;
        RAISE NOTICE 'Added review_notes column to applications table';
    ELSE
        RAISE NOTICE 'review_notes column already exists in applications table';
    END IF;
END $$;

-- Add is_admin column to profiles table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added is_admin column to profiles table';
    ELSE
        RAISE NOTICE 'is_admin column already exists in profiles table';
    END IF;
END $$;

-- Add other missing columns from enhanced schema
DO $$
BEGIN
    -- Add location_address to events if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'location_address'
    ) THEN
        ALTER TABLE events ADD COLUMN location_address TEXT;
        RAISE NOTICE 'Added location_address column to events table';
    END IF;
    
    -- Add event_type to events if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'event_type'
    ) THEN
        ALTER TABLE events ADD COLUMN event_type VARCHAR(100) DEFAULT 'social';
        RAISE NOTICE 'Added event_type column to events table';
    END IF;
    
    -- Add created_by to events if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'events' AND column_name = 'created_by'
    ) THEN
        ALTER TABLE events ADD COLUMN created_by UUID;
        RAISE NOTICE 'Added created_by column to events table';
    END IF;
    
    -- Add missing columns to profiles
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'last_visit'
    ) THEN
        ALTER TABLE profiles ADD COLUMN last_visit TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Added last_visit column to profiles table';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'total_events_attended'
    ) THEN
        ALTER TABLE profiles ADD COLUMN total_events_attended INTEGER DEFAULT 0;
        RAISE NOTICE 'Added total_events_attended column to profiles table';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'total_deliverables_completed'
    ) THEN
        ALTER TABLE profiles ADD COLUMN total_deliverables_completed INTEGER DEFAULT 0;
        RAISE NOTICE 'Added total_deliverables_completed column to profiles table';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'no_shows'
    ) THEN
        ALTER TABLE profiles ADD COLUMN no_shows INTEGER DEFAULT 0;
        RAISE NOTICE 'Added no_shows column to profiles table';
    END IF;
    
    -- Add missing columns to event_participants
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'event_participants' AND column_name = 'confirmed_at'
    ) THEN
        ALTER TABLE event_participants ADD COLUMN confirmed_at TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Added confirmed_at column to event_participants table';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'event_participants' AND column_name = 'attended_at'
    ) THEN
        ALTER TABLE event_participants ADD COLUMN attended_at TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Added attended_at column to event_participants table';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'event_participants' AND column_name = 'deliverables_status'
    ) THEN
        ALTER TABLE event_participants ADD COLUMN deliverables_status VARCHAR(50) DEFAULT 'pending';
        RAISE NOTICE 'Added deliverables_status column to event_participants table';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'event_participants' AND column_name = 'notes'
    ) THEN
        ALTER TABLE event_participants ADD COLUMN notes TEXT;
        RAISE NOTICE 'Added notes column to event_participants table';
    END IF;
END $$;

-- Create missing indexes
CREATE INDEX IF NOT EXISTS idx_applications_reviewed_by ON applications(reviewed_by);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);
CREATE INDEX IF NOT EXISTS idx_event_participants_deliverables_status ON event_participants(deliverables_status);

-- Update RLS policies to use admin checks
DROP POLICY IF EXISTS "Applications can be updated by authenticated users" ON applications;
CREATE POLICY "Applications can be updated by admins" ON applications FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

DROP POLICY IF EXISTS "Events can be created by authenticated users" ON events;
CREATE POLICY "Events can be created by admins" ON events FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

DROP POLICY IF EXISTS "Events can be updated by authenticated users" ON events;
CREATE POLICY "Events can be updated by admins" ON events FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

DROP POLICY IF EXISTS "Events can be deleted by authenticated users" ON events;
CREATE POLICY "Events can be deleted by admins" ON events FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Add admin policy for profiles
CREATE POLICY "Admins can update any profile" ON profiles FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Add admin policy for event participants
CREATE POLICY "Admins can manage all participants" ON event_participants FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Add admin policy for newsletter subscribers
CREATE POLICY "Newsletter subscribers can be viewed by admins" ON newsletter_subscribers FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Migration completed successfully!
SELECT 'Migration completed successfully!' as status;

-- Add missing columns to existing tables
ALTER TABLE events ADD COLUMN IF NOT EXISTS current_participants INTEGER DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS location_address TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE applications ADD COLUMN IF NOT EXISTS review_notes TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_visit TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_events_attended INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_deliverables_completed INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS no_shows INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE event_participants ADD COLUMN IF NOT EXISTS proof_uploaded BOOLEAN DEFAULT FALSE;
ALTER TABLE event_participants ADD COLUMN IF NOT EXISTS proof_url TEXT;
ALTER TABLE event_participants ADD COLUMN IF NOT EXISTS proof_submitted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE event_participants ADD COLUMN IF NOT EXISTS deliverables_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE event_participants ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create function to update event participant count
CREATE OR REPLACE FUNCTION update_event_participant_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE events 
        SET current_participants = current_participants + 1
        WHERE id = NEW.event_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE events 
        SET current_participants = current_participants - 1
        WHERE id = OLD.event_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating participant count (drop if exists first)
DROP TRIGGER IF EXISTS update_participant_count ON event_participants;
CREATE TRIGGER update_participant_count
    AFTER INSERT OR DELETE ON event_participants
    FOR EACH ROW EXECUTE FUNCTION update_event_participant_count();

-- Update RLS policies to include admin checks (only if they don't exist)
DROP POLICY IF EXISTS "Events can be created by authenticated users" ON events;
DROP POLICY IF EXISTS "Events can be updated by authenticated users" ON events;
DROP POLICY IF EXISTS "Events can be deleted by authenticated users" ON events;

CREATE POLICY IF NOT EXISTS "Events can be created by admins" ON events FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY IF NOT EXISTS "Events can be updated by admins" ON events FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY IF NOT EXISTS "Events can be deleted by admins" ON events FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Update applications policies (only if they don't exist)
DROP POLICY IF EXISTS "Applications can be viewed by authenticated users" ON applications;
DROP POLICY IF EXISTS "Applications can be updated by authenticated users" ON applications;

CREATE POLICY IF NOT EXISTS "Applications can be viewed by admins" ON applications FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY IF NOT EXISTS "Applications can be updated by admins" ON applications FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Add admin policy for profiles (only if it doesn't exist)
CREATE POLICY IF NOT EXISTS "Admins can update any profile" ON profiles FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Add admin policy for event participants (only if it doesn't exist)
CREATE POLICY IF NOT EXISTS "Admins can manage all participants" ON event_participants FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Notify completion
SELECT 'Migration completed successfully! All missing columns and triggers have been added.' as status; 