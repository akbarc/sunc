# CURL Examples for Society Unlocked API

## Supabase REST API Examples

### Base Configuration
```bash
# Set your Supabase URL and API key
SUPABASE_URL="https://vdwarnobmgkljagpvttv.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkd2Fybm9ibWdrbGphZ3B2dHR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MDc5MDUsImV4cCI6MjA2NzA4MzkwNX0.xH0T_JtxngQjodqGxQlH-waRuNlFv4aXLY_glhwB8zQ"
```

### 1. Get All Events
```bash
curl -X GET \
  "${SUPABASE_URL}/rest/v1/events?select=*" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json"
```

### 2. Create New Event
```bash
curl -X POST \
  "${SUPABASE_URL}/rest/v1/events" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "venue": "The Grand",
    "hook": "Exclusive rooftop party with NYC influencers",
    "date": "2024-01-15T20:00:00Z",
    "capacity": 50,
    "status": "active",
    "description": "Join us for an exclusive evening of networking and celebration"
  }'
```

### 3. Update Event
```bash
curl -X PATCH \
  "${SUPABASE_URL}/rest/v1/events?id=eq.1" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "capacity": 75,
    "status": "full"
  }'
```

### 4. Delete Event
```bash
curl -X DELETE \
  "${SUPABASE_URL}/rest/v1/events?id=eq.1" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}"
```

### 5. Submit Application
```bash
curl -X POST \
  "${SUPABASE_URL}/rest/v1/applications" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "instagram": "@johndoe",
    "follower_count": 15000,
    "content_category": "lifestyle",
    "city": "New York",
    "motivation": "I want to connect with local venues and create authentic content",
    "best_content": "My rooftop sunset photos and restaurant reviews"
  }'
```

### 6. Get User Profile
```bash
curl -X GET \
  "${SUPABASE_URL}/rest/v1/profiles?select=*&id=eq.user-uuid" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json"
```

### 7. Join Event
```bash
curl -X POST \
  "${SUPABASE_URL}/rest/v1/event_participants" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "event_id": 1,
    "user_id": "user-uuid",
    "status": "joined",
    "joined_at": "2024-01-10T15:30:00Z"
  }'
```

### 8. Get Event Participants
```bash
curl -X GET \
  "${SUPABASE_URL}/rest/v1/event_participants?select=*,profiles(*),events(*)&event_id=eq.1" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json"
```

### 9. Filter Events by Status
```bash
curl -X GET \
  "${SUPABASE_URL}/rest/v1/events?select=*&status=eq.active" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json"
```

### 10. Search Events by Venue
```bash
curl -X GET \
  "${SUPABASE_URL}/rest/v1/events?select=*&venue=ilike.*Grand*" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json"
```

## PostgreSQL Direct Connection

### Using psql
```bash
psql "postgres://postgres.vdwarnobmgkljagpvttv:YyiPyKrDDtfrr79k@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require"
```

### Using Node.js pg
```bash
# Install pg package
npm install pg

# Connection string
DATABASE_URL="postgres://postgres.vdwarnobmgkljagpvttv:YyiPyKrDDtfrr79k@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require"
```

## Testing with HTTPie

### Install HTTPie
```bash
# macOS
brew install httpie

# Ubuntu/Debian
sudo apt install httpie
```

### Example with HTTPie
```bash
# Get events
http GET "${SUPABASE_URL}/rest/v1/events" \
  apikey:${SUPABASE_ANON_KEY} \
  Authorization:"Bearer ${SUPABASE_ANON_KEY}" \
  Content-Type:application/json

# Create event
http POST "${SUPABASE_URL}/rest/v1/events" \
  apikey:${SUPABASE_ANON_KEY} \
  Authorization:"Bearer ${SUPABASE_ANON_KEY}" \
  Content-Type:application/json \
  venue="The Grand" \
  hook="Exclusive rooftop party" \
  date="2024-01-15T20:00:00Z"
``` 