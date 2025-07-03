-- Enhanced Society Unlocked Database Schema
-- Complete backend system with all features

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Events table (enhanced)
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    venue VARCHAR(255) NOT NULL,
    hook TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    capacity INTEGER DEFAULT 50,
    current_participants INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    description TEXT,
    image_url TEXT,
    location_address TEXT,
    event_type VARCHAR(100) DEFAULT 'social',
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table (enhanced)
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    instagram VARCHAR(100),
    follower_count INTEGER,
    content_category VARCHAR(100),
    city VARCHAR(100),
    motivation TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    reviewed_by UUID,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table (enhanced)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    instagram_handle VARCHAR(100),
    follower_count INTEGER DEFAULT 0,
    content_category VARCHAR(100),
    city VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    is_banned BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    last_visit TIMESTAMP WITH TIME ZONE,
    total_events_attended INTEGER DEFAULT 0,
    total_deliverables_completed INTEGER DEFAULT 0,
    no_shows INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event participants table (enhanced)
CREATE TABLE IF NOT EXISTS event_participants (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'joined',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    attended_at TIMESTAMP WITH TIME ZONE,
    proof_uploaded BOOLEAN DEFAULT FALSE,
    proof_url TEXT,
    proof_submitted_at TIMESTAMP WITH TIME ZONE,
    deliverables_status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Event deliverables tracking
CREATE TABLE IF NOT EXISTS event_deliverables (
    id SERIAL PRIMARY KEY,
    event_participant_id INTEGER REFERENCES event_participants(id) ON DELETE CASCADE,
    deliverable_type VARCHAR(50) NOT NULL, -- 'instagram_story', 'google_review', 'photo'
    status VARCHAR(50) DEFAULT 'pending',
    submitted_at TIMESTAMP WITH TIME ZONE,
    content_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin activity log
CREATE TABLE IF NOT EXISTS admin_logs (
    id SERIAL PRIMARY KEY,
    admin_id UUID REFERENCES auth.users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INTEGER,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_reviewed_by ON applications(reviewed_by);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_is_verified ON profiles(is_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);
CREATE INDEX IF NOT EXISTS idx_event_participants_event_id ON event_participants(event_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_user_id ON event_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_status ON event_participants(status);
CREATE INDEX IF NOT EXISTS idx_event_participants_deliverables_status ON event_participants(deliverables_status);
CREATE INDEX IF NOT EXISTS idx_event_deliverables_participant_id ON event_deliverables(event_participant_id);
CREATE INDEX IF NOT EXISTS idx_event_deliverables_status ON event_deliverables(status);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update event participant count
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

-- Trigger for updating participant count
CREATE TRIGGER update_participant_count
    AFTER INSERT OR DELETE ON event_participants
    FOR EACH ROW EXECUTE FUNCTION update_event_participant_count();

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO admin_logs (admin_id, action, table_name, record_id, details)
    VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        jsonb_build_object(
            'old', to_jsonb(OLD),
            'new', to_jsonb(NEW)
        )
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (true);
CREATE POLICY "Events can be created by admins" ON events FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Events can be updated by admins" ON events FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Events can be deleted by admins" ON events FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Applications policies
CREATE POLICY "Applications can be created by everyone" ON applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Applications can be viewed by admins" ON applications FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Applications can be updated by admins" ON applications FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can update any profile" ON profiles FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Event participants policies
CREATE POLICY "Event participants are viewable by everyone" ON event_participants FOR SELECT USING (true);
CREATE POLICY "Users can join events" ON event_participants FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own participation" ON event_participants FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own participation" ON event_participants FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all participants" ON event_participants FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Newsletter subscribers policies
CREATE POLICY "Newsletter subscribers can be created by everyone" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Newsletter subscribers can be viewed by admins" ON newsletter_subscribers FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Event deliverables policies
CREATE POLICY "Deliverables are viewable by participants and admins" ON event_deliverables FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM event_participants ep 
        WHERE ep.id = event_deliverables.event_participant_id 
        AND ep.user_id = auth.uid()
    ) OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Users can update their own deliverables" ON event_deliverables FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM event_participants ep 
        WHERE ep.id = event_deliverables.event_participant_id 
        AND ep.user_id = auth.uid()
    )
);
CREATE POLICY "Admins can manage all deliverables" ON event_deliverables FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Admin logs policies
CREATE POLICY "Admin logs are viewable by admins only" ON admin_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Insert sample data
INSERT INTO events (venue, hook, date, capacity, description, event_type) VALUES
('The Grand', 'Exclusive rooftop party with NYC influencers', '2024-01-15T20:00:00Z', 50, 'Join us for an exclusive evening of networking and celebration', 'social'),
('Skyline Lounge', 'Sunset cocktails and city views', '2024-01-20T18:00:00Z', 30, 'Experience the best sunset views in Manhattan', 'social'),
('Underground', 'Late night beats and underground vibes', '2024-01-25T22:00:00Z', 75, 'The hottest underground party in the city', 'social'),
('Rooftop 360', '360-degree city views and craft cocktails', '2024-01-30T19:00:00Z', 40, 'Panoramic views of the entire city skyline', 'social');

-- Create admin user profile (will be linked when user signs up)
INSERT INTO profiles (id, full_name, instagram_handle, is_admin, is_verified) VALUES
('00000000-0000-0000-0000-000000000000', 'Society Unlocked Admin', '@societyunlocked', true, true);

-- Create functions for common operations
CREATE OR REPLACE FUNCTION get_user_events(user_uuid UUID)
RETURNS TABLE(
    event_id INTEGER,
    venue VARCHAR(255),
    hook TEXT,
    date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50),
    deliverables_status VARCHAR(50),
    proof_uploaded BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.venue,
        e.hook,
        e.date,
        ep.status,
        ep.deliverables_status,
        ep.proof_uploaded
    FROM events e
    JOIN event_participants ep ON e.id = ep.event_id
    WHERE ep.user_id = user_uuid
    ORDER BY e.date DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_event_participants(event_id_param INTEGER)
RETURNS TABLE(
    user_id UUID,
    full_name VARCHAR(255),
    instagram_handle VARCHAR(100),
    status VARCHAR(50),
    joined_at TIMESTAMP WITH TIME ZONE,
    proof_uploaded BOOLEAN,
    deliverables_status VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.full_name,
        p.instagram_handle,
        ep.status,
        ep.joined_at,
        ep.proof_uploaded,
        ep.deliverables_status
    FROM event_participants ep
    JOIN profiles p ON ep.user_id = p.id
    WHERE ep.event_id = event_id_param
    ORDER BY ep.joined_at;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_pending_applications()
RETURNS TABLE(
    id INTEGER,
    full_name VARCHAR(255),
    email VARCHAR(255),
    instagram VARCHAR(100),
    follower_count INTEGER,
    content_category VARCHAR(100),
    city VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.full_name,
        a.email,
        a.instagram,
        a.follower_count,
        a.content_category,
        a.city,
        a.created_at
    FROM applications a
    WHERE a.status = 'pending'
    ORDER BY a.created_at DESC;
END;
$$ LANGUAGE plpgsql; 