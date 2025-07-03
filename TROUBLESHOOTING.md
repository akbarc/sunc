# Troubleshooting Guide

## Current Issue: "Could not find the 'location_address' column"

### Problem
The Supabase database doesn't have the updated schema with the `location_address` column.

### Solution Options

#### Option 1: Run Migration Script (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database/migration-add-location-address.sql`
4. Run the migration script
5. This will safely add missing columns without affecting existing data

#### Option 2: Apply Full Enhanced Schema
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `database/enhanced-schema.sql`
4. Run the full schema (this will create tables if they don't exist)

### Verification Steps
After running the migration, you can verify the schema by running this query in Supabase SQL Editor:

```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'events' 
ORDER BY ordinal_position;
```

You should see these columns:
- id
- venue
- hook
- date
- capacity
- current_participants
- status
- description
- image_url
- location_address ← This should be present
- event_type
- created_by
- created_at
- updated_at

### Debug Information
The form validation has been enhanced with detailed logging. Check the browser console for:
- 🔍 Field validation details
- 📝 Form data being submitted
- 🚀 Event creation attempts
- ✅/❌ Success/error messages

### Next Steps
1. Run the migration script first
2. Try creating an event again
3. Check the browser console for detailed logs
4. If still having issues, check the Supabase project logs

### Common Issues
- **Database not updated**: Run the migration script
- **Form validation fails**: Check browser console for field-by-field validation
- **Network errors**: Check Supabase project URL and API key
- **Permission errors**: Ensure RLS policies are correctly set up 