// Database configuration for Society Unlocked
import { createClient } from '@supabase/supabase-js'

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vdwarnobmgkljagpvttv.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkd2Fybm9ibWdrbGphZ3B2dHR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MDc5MDUsImV4cCI6MjA2NzA4MzkwNX0.xH0T_JtxngQjodqGxQlH-waRuNlFv4aXLY_glhwB8zQ'

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// PostgreSQL connection configuration (for direct database access)
export const dbConfig = {
  host: process.env.POSTGRES_HOST || 'db.vdwarnobmgkljagpvttv.supabase.co',
  port: 5432,
  database: process.env.POSTGRES_DATABASE || 'postgres',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'YyiPyKrDDtfrr79k',
  ssl: {
    rejectUnauthorized: false
  }
}

// Connection URL for Prisma or other ORMs
export const DATABASE_URL = process.env.POSTGRES_PRISMA_URL || 
  'postgres://postgres.vdwarnobmgkljagpvttv:YyiPyKrDDtfrr79k@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true'

// Example database operations
export const dbOperations = {
  // Get all events
  async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

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

  // Create new event
  async createEvent(eventData) {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Update event
  async updateEvent(eventId, updates) {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Delete event
  async deleteEvent(eventId) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)
    
    if (error) throw error
    return true
  }
}

export default supabase 