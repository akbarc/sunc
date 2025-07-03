// Supabase CDN Configuration for Society Unlocked
// This file is for use in HTML files without build tools

// Supabase configuration
const SUPABASE_URL = 'https://vdwarnobmgkljagpvttv.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkd2Fybm9ibWdrbGphZ3B2dHR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MDc5MDUsImV4cCI6MjA2NzA4MzkwNX0.xH0T_JtxngQjodqGxQlH-waRuNlFv4aXLY_glhwB8zQ'

// Initialize Supabase client (requires Supabase CDN script)
let supabase = null

// Function to initialize Supabase when CDN is loaded
function initSupabase() {
    if (typeof supabase !== 'undefined') {
        supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
        console.log('Supabase client initialized')
        return supabase
    } else {
        console.error('Supabase CDN not loaded')
        return null
    }
}

// Database operations for client-side use
const clientDbOperations = {
    // Get all events
    async getEvents() {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('created_at', { ascending: false })
            
            if (error) throw error
            return data
        } catch (error) {
            console.error('Error fetching events:', error)
            return []
        }
    },

    // Get user profile
    async getUserProfile(userId) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()
            
            if (error) throw error
            return data
        } catch (error) {
            console.error('Error fetching user profile:', error)
            return null
        }
    },

    // Create new event
    async createEvent(eventData) {
        try {
            const { data, error } = await supabase
                .from('events')
                .insert([eventData])
                .select()
            
            if (error) throw error
            return data[0]
        } catch (error) {
            console.error('Error creating event:', error)
            throw error
        }
    },

    // Update event
    async updateEvent(eventId, updates) {
        try {
            const { data, error } = await supabase
                .from('events')
                .update(updates)
                .eq('id', eventId)
                .select()
            
            if (error) throw error
            return data[0]
        } catch (error) {
            console.error('Error updating event:', error)
            throw error
        }
    },

    // Delete event
    async deleteEvent(eventId) {
        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', eventId)
            
            if (error) throw error
            return true
        } catch (error) {
            console.error('Error deleting event:', error)
            throw error
        }
    },

    // Submit application
    async submitApplication(applicationData) {
        try {
            const { data, error } = await supabase
                .from('applications')
                .insert([applicationData])
                .select()
            
            if (error) throw error
            return data[0]
        } catch (error) {
            console.error('Error submitting application:', error)
            throw error
        }
    },

    // Join event
    async joinEvent(eventId, userId) {
        try {
            const { data, error } = await supabase
                .from('event_participants')
                .insert([{
                    event_id: eventId,
                    user_id: userId,
                    status: 'joined',
                    joined_at: new Date().toISOString()
                }])
                .select()
            
            if (error) throw error
            return data[0]
        } catch (error) {
            console.error('Error joining event:', error)
            throw error
        }
    }
}

// Export for use in HTML
window.SocietyUnlockedDB = {
    initSupabase,
    operations: clientDbOperations,
    config: {
        url: SUPABASE_URL,
        anonKey: SUPABASE_ANON_KEY
    }
} 