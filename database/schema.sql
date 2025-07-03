-- Society Unlocked Database Schema
-- Run this in your Supabase SQL editor or via psql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    venue VARCHAR(255) NOT NULL,
    hook TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE,
    capacity INTEGER DEFAULT 50,
    current_participants INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table (extends Supabase auth.users)
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event participants table
CREATE TABLE IF NOT EXISTS event_participants (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'joined',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    proof_uploaded BOOLEAN DEFAULT FALSE,
    proof_url TEXT,
    proof_submitted_at TIMESTAMP WITH TIME ZONE,
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_event_participants_event_id ON event_participants(event_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_user_id ON event_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_event_participants_status ON event_participants(status);

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

-- Row Level Security (RLS) policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (true);
CREATE POLICY "Events can be created by authenticated users" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Events can be updated by authenticated users" ON events FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Events can be deleted by authenticated users" ON events FOR DELETE USING (auth.role() = 'authenticated');

-- Applications policies
CREATE POLICY "Applications can be created by everyone" ON applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Applications can be viewed by authenticated users" ON applications FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Applications can be updated by authenticated users" ON applications FOR UPDATE USING (auth.role() = 'authenticated');

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Event participants policies
CREATE POLICY "Event participants are viewable by everyone" ON event_participants FOR SELECT USING (true);
CREATE POLICY "Users can join events" ON event_participants FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own participation" ON event_participants FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own participation" ON event_participants FOR DELETE USING (auth.uid() = user_id);

-- Newsletter subscribers policies
CREATE POLICY "Newsletter subscribers can be created by everyone" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Newsletter subscribers can be viewed by authenticated users" ON newsletter_subscribers FOR SELECT USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO events (venue, hook, date, capacity, description) VALUES
('The Grand', 'Exclusive rooftop party with NYC influencers', '2024-01-15T20:00:00Z', 50, 'Join us for an exclusive evening of networking and celebration'),
('Skyline Lounge', 'Sunset cocktails and city views', '2024-01-20T18:00:00Z', 30, 'Experience the best sunset views in Manhattan'),
('Underground', 'Late night beats and underground vibes', '2024-01-25T22:00:00Z', 75, 'The hottest underground party in the city'),
('Rooftop 360', '360-degree city views and craft cocktails', '2024-01-30T19:00:00Z', 40, 'Panoramic views of the entire city skyline');

-- Create a function to get event statistics
CREATE OR REPLACE FUNCTION get_event_stats(event_id INTEGER)
RETURNS TABLE(
    total_capacity INTEGER,
    current_participants INTEGER,
    available_spots INTEGER,
    participation_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.capacity,
        e.current_participants,
        (e.capacity - e.current_participants) as available_spots,
        ROUND((e.current_participants::NUMERIC / e.capacity::NUMERIC) * 100, 2) as participation_rate
    FROM events e
    WHERE e.id = event_id;
END;
$$ LANGUAGE plpgsql; 