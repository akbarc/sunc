-- Clean migration to add missing columns and triggers only
-- This migration only adds what's missing, doesn't touch existing policies

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

-- Create missing indexes
CREATE INDEX IF NOT EXISTS idx_applications_reviewed_by ON applications(reviewed_by);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);
CREATE INDEX IF NOT EXISTS idx_event_participants_deliverables_status ON event_participants(deliverables_status);

-- Success message
SELECT 'Migration completed successfully! Added missing columns and triggers only.' as status; 