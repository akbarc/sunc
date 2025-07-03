# Society Unlocked - v0 Front-End

A modern React-based front-end application for Society Unlocked, a creator-focused platform that connects content creators with exclusive events and venues.

## 🎯 Overview

Society Unlocked is a platform that rewards creators for fueling culture. The v0 front-end includes:

- **Landing Page** - Hero section with application CTA and social proof
- **Application Flow** - Comprehensive creator application with validation
- **Creator Dashboard** - Event management and profile tracking
- **Admin Console** - Internal event and roster management
- **Authentication** - Email/password and Instagram login options

## 🚀 Features

### Public Pages
- **Landing Page** (`/`)
  - Full-bleed hero with nightlife imagery
  - "How It Works" section with three-step process
  - Auto-scrolling venue logos for social proof
  - Minimal footer with legal links

- **Application Page** (`/apply`)
  - Two-column layout with benefits reminder
  - 11-field application form with real-time validation
  - Submit button that greys out until all required fields are valid

- **Application Success** (`/apply/success`)
  - Center-aligned success confirmation
  - Instagram follow prompt
  - Return to home navigation

### Authenticated Areas
- **Creator Dashboard** (`/dashboard`)
  - Sticky header with navigation
  - Grid of event cards with capacity meters
  - Profile side panel with stats and deliverables history
  - Join confirmation modal with guidelines and penalty clause
  - Upload proof functionality for completed events

- **Admin Console** (`/admin`)
  - Event management table with capacity indicators
  - Add/edit event modal with form validation
  - Roster drawer showing creator status and management
  - Manual ban/unban functionality

## 🎨 Design System

### Brand Voice
- **Tone**: Confident, slightly rebellious, creator-centric
- **Micro-copy**: "Unlock your seat at the table" hover states
- **Typography**: Inter font family with bold modern sans for headlines

### Color Palette
- **Primary**: Matte black (#000000)
- **Secondary**: Off-white (#ffffff)
- **Accent**: Electric blue (#0066ff)
- **Success**: Green (#00cc66)
- **Warning**: Orange (#ffaa00)
- **Error**: Red (#ff4444)

### Components
- **Buttons**: Rounded corners, hover animations, disabled states
- **Cards**: Subtle borders, hover effects, status indicators
- **Forms**: Real-time validation, error states, loading states
- **Modals**: Backdrop blur, smooth animations, responsive design

## 🛠 Tech Stack

- **React 18** - Modern React with hooks
- **React Router 6** - Client-side routing
- **Styled Components** - CSS-in-JS styling
- **React Hook Form** - Form handling and validation
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library
- **Supabase** - PostgreSQL database and authentication
- **PostgreSQL** - Primary database

## 📁 Project Structure

```
src/
├── components/
│   ├── LandingPage.js          # Hero, benefits, social proof
│   ├── ApplicationPage.js      # Application form with validation
│   ├── ApplicationSuccess.js   # Success confirmation
│   ├── CreatorDashboard.js     # Event grid and profile panel
│   ├── AdminConsole.js         # Event and roster management
│   └── AuthModal.js            # Sign-in modal
├── config/
│   ├── database.js             # Supabase database configuration
│   └── supabase-cdn.js         # CDN database configuration
├── App.js                      # Main app with routing
└── index.js                    # React entry point
examples/
└── curl-examples.md            # CURL API examples
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Available Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🎯 User Flows

### Creator Journey
1. **Landing** → View hero and benefits
2. **Apply** → Fill out 11-field application
3. **Success** → Wait for approval
4. **Dashboard** → Browse and join events
5. **Join Event** → Accept guidelines and reserve spot
6. **Upload Proof** → Submit deliverables post-event

### Admin Journey
1. **Admin Console** → View all events and capacity
2. **Add Event** → Create new event with details
3. **View Roster** → See creator status and manage
4. **Edit Event** → Update event details
5. **Manage Creators** → Ban/unban creators as needed

## 🗄️ Database Setup

### Supabase Configuration

The application uses Supabase as the backend database. All credentials are configured in `.env.local`:

```bash
# Supabase PostgreSQL Configuration
POSTGRES_URL="postgres://postgres.vdwarnobmgkljagpvttv:YyiPyKrDDtfrr79k@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require"
SUPABASE_URL="https://vdwarnobmgkljagpvttv.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### Database Connection Methods

#### 1. Node.js (Recommended)
```javascript
// src/config/database.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
```

#### 2. CDN/Client-Side
```html
<!-- Add to your HTML -->
<script src="https://unpkg.com/@supabase/supabase-js@2"></script>
<script src="src/config/supabase-cdn.js"></script>
```

#### 3. CURL Examples
```bash
# Get all events
curl -X GET \
  "https://vdwarnobmgkljagpvttv.supabase.co/rest/v1/events?select=*" \
  -H "apikey: your-anon-key" \
  -H "Authorization: Bearer your-anon-key"
```

### Database Schema

The application expects the following tables in your Supabase database:

#### Events Table
```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  venue VARCHAR(255) NOT NULL,
  hook TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE,
  capacity INTEGER DEFAULT 50,
  status VARCHAR(50) DEFAULT 'active',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Applications Table
```sql
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  instagram VARCHAR(100),
  follower_count INTEGER,
  content_category VARCHAR(100),
  city VARCHAR(100),
  motivation TEXT,
  best_content TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Event Participants Table
```sql
CREATE TABLE event_participants (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id),
  user_id UUID REFERENCES auth.users(id),
  status VARCHAR(50) DEFAULT 'joined',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  proof_uploaded BOOLEAN DEFAULT FALSE
);
```

## 🔧 Configuration
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
POSTGRES_URL="postgres://postgres.vdwarnobmgkljagpvttv:YyiPyKrDDtfrr79k@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require"
SUPABASE_URL="https://vdwarnobmgkljagpvttv.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkd2Fybm9ibWdrbGphZ3B2dHR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MDc5MDUsImV4cCI6MjA2NzA4MzkwNX0.xH0T_JtxngQjodqGxQlH-waRuNlFv4aXLY_glhwB8zQ"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkd2Fybm9ibWdrbGphZ3B2dHR2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTUwNzkwNSwiZXhwIjoyMDY3MDgzOTA1fQ.E4V7QkIDBV3VcbL0iiFlALpkgQGPaydldbLj6gEsw6A"

# Application Configuration
NODE_ENV=development
PORT=3000
```

### Customization
- **Colors**: Update color variables in styled components
- **Typography**: Modify font imports in `public/index.html`
- **Images**: Replace placeholder images with actual venue photos
- **API**: Connect form submissions to your backend endpoints

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🔒 Security Considerations

- Form validation on both client and server side
- Password visibility toggle for better UX
- Instagram OAuth integration (placeholder)
- Admin-only routes for sensitive operations

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag and drop `build` folder
- **AWS S3**: Upload static files to S3 bucket
- **Firebase Hosting**: Use Firebase CLI for deployment

## 🔮 Future Enhancements

### v1 Features
- Real API integration
- Image upload functionality
- Push notifications
- Advanced analytics dashboard
- Mobile app development

### Technical Improvements
- TypeScript migration
- Unit and integration tests
- Performance optimization
- Accessibility improvements
- SEO optimization

## 📄 License

This project is proprietary to Society Unlocked.

## 🤝 Contributing

This is a v0 prototype. For production development, please contact the Society Unlocked team.

---

**Society Unlocked** - Creators fuel culture. Get rewarded for it. 