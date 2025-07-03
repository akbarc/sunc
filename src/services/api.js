// Society Unlocked API Service
// Complete backend integration with Supabase

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vdwarnobmgkljagpvttv.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkd2Fybm9ibWdrbGphZ3B2dHR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MDc5MDUsImV4cCI6MjA2NzA4MzkwNX0.xH0T_JtxngQjodqGxQlH-waRuNlFv4aXLY_glhwB8zQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Authentication Services
export const authService = {
    // Sign up with email and password
    async signUp(email, password, userData) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: userData
            }
        })
        
        if (error) throw error
        
        // Create profile if signup successful
        if (data.user) {
            await this.createProfile(data.user.id, userData)
        }
        
        return data
    },

    // Sign in with email and password
    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        
        if (error) throw error
        
        // Update last visit
        if (data.user) {
            await this.updateLastVisit(data.user.id)
        }
        
        return data
    },

    // Sign out
    async signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        return true
    },

    // Get current user
    async getCurrentUser() {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        return user
    },

    // Create user profile
    async createProfile(userId, userData) {
        const { error } = await supabase
            .from('profiles')
            .insert([{
                id: userId,
                full_name: userData.full_name,
                instagram_handle: userData.instagram,
                follower_count: userData.follower_count,
                content_category: userData.content_category,
                city: userData.city,
                is_admin: userData.email === 'hello@societyunlocked.com'
            }])
        
        if (error) throw error
        return true
    },

    // Update last visit
    async updateLastVisit(userId) {
        const { error } = await supabase
            .from('profiles')
            .update({ last_visit: new Date().toISOString() })
            .eq('id', userId)
        
        if (error) throw error
        return true
    }
}

// Application Services
export const applicationService = {
    // Submit new application
    async submitApplication(applicationData) {
        const { data, error } = await supabase
            .from('applications')
            .insert([applicationData])
            .select()
        
        if (error) throw error
        return data[0]
    },

    // Get all applications (admin only)
    async getAllApplications() {
        const { data, error } = await supabase
            .from('applications')
            .select('*')
            .order('created_at', { ascending: false })
        
        if (error) throw error
        return data
    },

    // Get pending applications
    async getPendingApplications() {
        const { data, error } = await supabase
            .rpc('get_pending_applications')
        
        if (error) throw error
        return data
    },

    // Review application (approve/deny)
    async reviewApplication(applicationId, status, reviewNotes = null) {
        const { data, error } = await supabase
            .from('applications')
            .update({
                status,
                review_notes: reviewNotes,
                reviewed_at: new Date().toISOString()
            })
            .eq('id', applicationId)
            .select()
        
        if (error) throw error
        return data[0]
    }
}

// Event Services
export const eventService = {
    // Get all events
    async getAllEvents() {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('date', { ascending: true })
        
        if (error) throw error
        return data
    },

    // Get active events
    async getActiveEvents() {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('status', 'active')
            .gte('date', new Date().toISOString())
            .order('date', { ascending: true })
        
        if (error) throw error
        return data
    },

    // Create new event (admin only)
    async createEvent(eventData) {
        const { data, error } = await supabase
            .from('events')
            .insert([eventData])
            .select()
        
        if (error) throw error
        return data[0]
    },

    // Update event (admin only)
    async updateEvent(eventId, updates) {
        const { data, error } = await supabase
            .from('events')
            .update(updates)
            .eq('id', eventId)
            .select()
        
        if (error) throw error
        return data[0]
    },

    // Delete event (admin only)
    async deleteEvent(eventId) {
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', eventId)
        
        if (error) throw error
        return true
    },

    // Get event details
    async getEvent(eventId) {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', eventId)
            .single()
        
        if (error) throw error
        return data
    }
}

// Event Participation Services
export const participationService = {
    // Join event
    async joinEvent(eventId, userId) {
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
    },

    // Leave event
    async leaveEvent(eventId, userId) {
        const { error } = await supabase
            .from('event_participants')
            .delete()
            .eq('event_id', eventId)
            .eq('user_id', userId)
        
        if (error) throw error
        return true
    },

    // Get user's events
    async getUserEvents(userId) {
        const { data, error } = await supabase
            .rpc('get_user_events', { user_uuid: userId })
        
        if (error) throw error
        return data
    },

    // Get event participants (admin only)
    async getEventParticipants(eventId) {
        const { data, error } = await supabase
            .rpc('get_event_participants', { event_id_param: eventId })
        
        if (error) throw error
        return data
    },

    // Update participation status
    async updateParticipationStatus(participationId, status) {
        const { data, error } = await supabase
            .from('event_participants')
            .update({ status })
            .eq('id', participationId)
            .select()
        
        if (error) throw error
        return data[0]
    },

    // Upload proof
    async uploadProof(participationId, proofUrl) {
        const { data, error } = await supabase
            .from('event_participants')
            .update({
                proof_uploaded: true,
                proof_url: proofUrl,
                proof_submitted_at: new Date().toISOString(),
                deliverables_status: 'submitted'
            })
            .eq('id', participationId)
            .select()
        
        if (error) throw error
        return data[0]
    }
}

// Profile Services
export const profileService = {
    // Get user profile
    async getUserProfile(userId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()
        
        if (error) throw error
        return data
    },

    // Update user profile
    async updateProfile(userId, updates) {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
        
        if (error) throw error
        return data[0]
    },

    // Get all members (admin only)
    async getAllMembers() {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })
        
        if (error) throw error
        return data
    },

    // Ban/unban user (admin only)
    async toggleUserBan(userId, isBanned) {
        const { data, error } = await supabase
            .from('profiles')
            .update({ is_banned: isBanned })
            .eq('id', userId)
            .select()
        
        if (error) throw error
        return data[0]
    }
}

// Newsletter Services
export const newsletterService = {
    // Subscribe to newsletter
    async subscribe(email) {
        const { data, error } = await supabase
            .from('newsletter_subscribers')
            .insert([{ email }])
            .select()
        
        if (error) throw error
        return data[0]
    },

    // Get all subscribers (admin only)
    async getAllSubscribers() {
        const { data, error } = await supabase
            .from('newsletter_subscribers')
            .select('*')
            .order('subscribed_at', { ascending: false })
        
        if (error) throw error
        return data
    }
}

// Admin Services
export const adminService = {
    // Get admin dashboard stats
    async getDashboardStats() {
        const [
            { count: totalEvents },
            { count: totalApplications },
            { count: totalMembers },
            { count: pendingApplications }
        ] = await Promise.all([
            supabase.from('events').select('*', { count: 'exact', head: true }),
            supabase.from('applications').select('*', { count: 'exact', head: true }),
            supabase.from('profiles').select('*', { count: 'exact', head: true }),
            supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'pending')
        ])

        return {
            totalEvents,
            totalApplications,
            totalMembers,
            pendingApplications
        }
    },

    // Get admin logs
    async getAdminLogs() {
        const { data, error } = await supabase
            .from('admin_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100)
        
        if (error) throw error
        return data
    }
}

// Utility function to handle errors
export const handleApiError = (error) => {
    console.error('API Error:', error)
    
    if (error.code === 'PGRST116') {
        return 'You do not have permission to perform this action'
    }
    
    if (error.code === '23505') {
        return 'This record already exists'
    }
    
    return error.message || 'An unexpected error occurred'
}

export default {
    auth: authService,
    applications: applicationService,
    events: eventService,
    participation: participationService,
    profiles: profileService,
    newsletter: newsletterService,
    admin: adminService,
    handleError: handleApiError
} 