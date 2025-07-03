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
├── App.js                      # Main app with routing
└── index.js                    # React entry point
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

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=your_api_url_here
REACT_APP_INSTAGRAM_CLIENT_ID=your_instagram_client_id
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