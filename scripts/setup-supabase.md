# Supabase Database Setup Guide

## 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

## 2. Apply Database Schema
1. In your Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `database/enhanced-schema.sql`
3. Run the SQL script

## 3. Set Up Row Level Security (RLS)
The schema includes RLS policies, but you may need to:
1. Go to Authentication > Settings
2. Enable Row Level Security
3. Ensure the policies are applied correctly

## 4. Test Database Connection
1. In SQL Editor, run: `SELECT * FROM events;`
2. Should return empty result (no errors)
3. Run: `SELECT * FROM applications;`
4. Should return empty result (no errors)

## 5. Add Sample Data (Optional)
The schema includes sample data at the end. You can:
1. Run the INSERT statements from the schema
2. Or manually add test data through the Table Editor

## 6. Update Frontend Configuration
1. Replace the Supabase URL and key in `index.html`
2. Look for the `createClient` call in the JavaScript
3. Update with your project credentials

## 7. Test Admin Functions
The admin console requires these database functions:
- `get_user_events()`
- `get_event_participants()`
- `get_pending_applications()`

These are included in the schema.

## Common Issues

### Database Connection Errors
- Check your Supabase URL and anon key
- Ensure RLS policies allow anonymous access where needed
- Check browser console for specific error messages

### Admin Console Not Loading Data
- Verify the database schema is applied
- Check that sample data exists
- Ensure JavaScript console shows no errors

### Authentication Issues
- RLS policies may be blocking access
- Check if you need to authenticate before accessing admin features
- Consider temporarily disabling RLS for testing

## Testing Checklist
- [ ] Database schema applied successfully
- [ ] Sample data inserted
- [ ] Admin console loads without errors
- [ ] Dashboard shows statistics
- [ ] Applications section loads
- [ ] Members section loads
- [ ] Events section loads
- [ ] Modals open and close properly 