#!/usr/bin/env node

// Database setup script for Society Unlocked
// Run with: node scripts/setup-database.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vdwarnobmgkljagpvttv.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkd2Fybm9ibWdrbGphZ3B2dHR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTUwNzkwNSwiZXhwIjoyMDY3MDgzOTA1fQ.E4V7QkIDBV3VcbL0iiFlALpkgQGPaydldbLj6gEsw6A';

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
    console.log('🚀 Setting up Society Unlocked database...\n');

    try {
        // Test connection
        console.log('1. Testing database connection...');
        const { data: testData, error: testError } = await supabase
            .from('events')
            .select('count')
            .limit(1);

        if (testError && testError.code === '42P01') {
            console.log('   ✅ Connection successful (tables need to be created)');
        } else if (testError) {
            console.log('   ❌ Connection failed:', testError.message);
            return;
        } else {
            console.log('   ✅ Connection successful (tables exist)');
        }

        // Read and execute schema
        console.log('\n2. Creating database schema...');
        const schemaPath = path.join(__dirname, '../database/schema.sql');
        
        if (!fs.existsSync(schemaPath)) {
            console.log('   ❌ Schema file not found. Please run this from the project root.');
            return;
        }

        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Split schema into individual statements
        const statements = schema
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

        console.log(`   📝 Executing ${statements.length} SQL statements...`);

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.trim()) {
                try {
                    const { error } = await supabase.rpc('exec_sql', { sql: statement });
                    if (error) {
                        console.log(`   ⚠️  Statement ${i + 1} had an issue:`, error.message);
                    }
                } catch (err) {
                    console.log(`   ⚠️  Statement ${i + 1} skipped:`, err.message);
                }
            }
        }

        // Test tables creation
        console.log('\n3. Verifying tables...');
        const tables = ['events', 'applications', 'profiles', 'event_participants', 'newsletter_subscribers'];
        
        for (const table of tables) {
            try {
                const { data, error } = await supabase
                    .from(table)
                    .select('*')
                    .limit(1);
                
                if (error) {
                    console.log(`   ❌ Table '${table}' not accessible:`, error.message);
                } else {
                    console.log(`   ✅ Table '${table}' created successfully`);
                }
            } catch (err) {
                console.log(`   ❌ Table '${table}' error:`, err.message);
            }
        }

        // Test sample data
        console.log('\n4. Testing sample data...');
        const { data: events, error: eventsError } = await supabase
            .from('events')
            .select('*');

        if (eventsError) {
            console.log('   ❌ Error fetching events:', eventsError.message);
        } else {
            console.log(`   ✅ Found ${events.length} events in database`);
            events.forEach(event => {
                console.log(`      - ${event.venue}: ${event.hook}`);
            });
        }

        console.log('\n🎉 Database setup completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('   1. Test the API endpoints with CURL');
        console.log('   2. Integrate with your frontend application');
        console.log('   3. Set up authentication if needed');

    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        process.exit(1);
    }
}

// Run the setup
setupDatabase(); 