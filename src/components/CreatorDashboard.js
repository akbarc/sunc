import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Calendar, 
  User, 
  LogOut, 
  Users, 
  Star, 
  Upload, 
  CheckCircle,
  AlertCircle,
  X,
  Instagram
} from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: #000000;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #333333;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const NavLink = styled.button`
  background: none;
  border: none;
  color: #ffffff;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &.active {
    background: #0066ff;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  background: #0066ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
`;

const MainContent = styled.main`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const EventCard = styled.div`
  background: #111111;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease;
  border: 1px solid #333333;

  &:hover {
    transform: translateY(-4px);
  }

  &.reserved {
    border-color: #0066ff;
  }

  &.completed {
    border-color: #00cc66;
  }

  &.full {
    opacity: 0.6;
    pointer-events: none;
  }
`;

const EventImage = styled.div`
  height: 200px;
  background: linear-gradient(45deg, #333333, #666666);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 600;
  font-size: 1.2rem;
`;

const EventContent = styled.div`
  padding: 1.5rem;
`;

const VenueName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const EventHook = styled.p`
  color: #cccccc;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

const CapacityMeter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CapacityText = styled.span`
  font-size: 0.9rem;
  color: #666666;
`;

const CapacityBar = styled.div`
  width: 100px;
  height: 6px;
  background: #333333;
  border-radius: 3px;
  overflow: hidden;
`;

const CapacityFill = styled.div`
  height: 100%;
  background: ${props => {
    const percentage = props.percentage;
    if (percentage >= 80) return '#ff4444';
    if (percentage >= 60) return '#ffaa00';
    return '#00cc66';
  }};
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

const EventButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &.join {
    background: #0066ff;
    color: #ffffff;

    &:hover {
      background: #0052cc;
    }
  }

  &.upload {
    background: #00cc66;
    color: #ffffff;

    &:hover {
      background: #00aa55;
    }
  }

  &.completed {
    background: #333333;
    color: #666666;
    cursor: not-allowed;
  }

  &:disabled {
    background: #666666;
    color: #999999;
    cursor: not-allowed;
  }
`;

const ProfilePanel = styled.div`
  background: #111111;
  border-radius: 12px;
  padding: 1.5rem;
  height: fit-content;
  border: 1px solid #333333;
`;

const ProfileTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const ProfileSection = styled.div`
  margin-bottom: 2rem;
`;

const ProfileLabel = styled.div`
  font-size: 0.9rem;
  color: #666666;
  margin-bottom: 0.5rem;
`;

const ProfileValue = styled.div`
  font-weight: 500;
  margin-bottom: 1rem;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 0.5rem;

  &.good {
    background: rgba(0, 204, 102, 0.2);
    color: #00cc66;
  }

  &.warning {
    background: rgba(255, 170, 0, 0.2);
    color: #ffaa00;
  }

  &.danger {
    background: rgba(255, 68, 68, 0.2);
    color: #ff4444;
  }
`;

const DeliverablesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DeliverableItem = styled.div`
  padding: 0.75rem;
  background: #000000;
  border-radius: 6px;
  border-left: 3px solid #0066ff;
  font-size: 0.9rem;
`;

// Modal Components
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const ModalContent = styled.div`
  background: #111111;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #666666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const GuidelinesList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem;
`;

const GuidelineItem = styled.li`
  padding: 1rem;
  background: #000000;
  border-radius: 6px;
  margin-bottom: 1rem;
  border-left: 3px solid #0066ff;
`;

const PenaltyClause = styled.div`
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid #ff4444;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  color: #ff4444;
  font-size: 0.9rem;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #0066ff;
`;

const ModalButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #0066ff;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #0052cc;
  }

  &:disabled {
    background: #666666;
    cursor: not-allowed;
  }
`;

// Mock data
const mockEvents = [
  {
    id: 1,
    venue: 'The Grand',
    hook: 'Craft cocktails & dim sum launch',
    capacity: 12,
    reserved: 7,
    image: 'The Grand',
    status: 'available'
  },
  {
    id: 2,
    venue: 'Skyline Lounge',
    hook: 'Sunset rooftop networking',
    capacity: 8,
    reserved: 8,
    image: 'Skyline Lounge',
    status: 'full'
  },
  {
    id: 3,
    venue: 'Underground',
    hook: 'Live jazz & art showcase',
    capacity: 15,
    reserved: 5,
    image: 'Underground',
    status: 'available'
  },
  {
    id: 4,
    venue: 'Rooftop 360',
    hook: 'Wine tasting & city views',
    capacity: 10,
    reserved: 10,
    image: 'Rooftop 360',
    status: 'completed'
  }
];

function CreatorDashboard() {
  const [events, setEvents] = useState(mockEvents);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [acceptedGuidelines, setAcceptedGuidelines] = useState(false);
  const [activeTab, setActiveTab] = useState('events');

  const handleJoinEvent = (event) => {
    setSelectedEvent(event);
    setShowJoinModal(true);
  };

  const handleConfirmJoin = () => {
    if (!acceptedGuidelines) return;

    setEvents(prev => prev.map(event => 
      event.id === selectedEvent.id 
        ? { ...event, status: 'reserved' }
        : event
    ));

    setShowJoinModal(false);
    setSelectedEvent(null);
    setAcceptedGuidelines(false);
    toast.success('Reserved. See you there!');
  };

  const handleUploadProof = (eventId) => {
    // Simulate upload process
    toast.success('Proof uploaded successfully!');
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, status: 'completed' }
        : event
    ));
  };

  const getEventButton = (event) => {
    if (event.status === 'completed') {
      return <EventButton className="completed" disabled>Completed</EventButton>;
    }
    
    if (event.status === 'reserved') {
      return <EventButton className="upload" onClick={() => handleUploadProof(event.id)}>
        Upload Proof
      </EventButton>;
    }

    if (event.status === 'full') {
      return <EventButton disabled>Full</EventButton>;
    }

    return <EventButton className="join" onClick={() => handleJoinEvent(event)}>
      Join
    </EventButton>;
  };

  return (
    <DashboardContainer>
      <Header>
        <Logo>Society Unlocked</Logo>
        <NavItems>
          <NavLink 
            className={activeTab === 'events' ? 'active' : ''}
            onClick={() => setActiveTab('events')}
          >
            Events
          </NavLink>
          <NavLink 
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </NavLink>
        </NavItems>
        <UserSection>
          <Avatar>JD</Avatar>
        </UserSection>
      </Header>

      <MainContent>
        <EventsGrid>
          {events.map(event => (
            <EventCard key={event.id} className={event.status}>
              <EventImage>{event.image}</EventImage>
              <EventContent>
                <VenueName>{event.venue}</VenueName>
                <EventHook>{event.hook}</EventHook>
                <CapacityMeter>
                  <CapacityText>{event.reserved}/{event.capacity} spots left</CapacityText>
                  <CapacityBar>
                    <CapacityFill percentage={(event.reserved / event.capacity) * 100} />
                  </CapacityBar>
                </CapacityMeter>
                {getEventButton(event)}
              </EventContent>
            </EventCard>
          ))}
        </EventsGrid>

        <ProfilePanel>
          <ProfileTitle>Creator Profile</ProfileTitle>
          
          <ProfileSection>
            <ProfileLabel>Follower Count</ProfileLabel>
            <ProfileValue>24.5K</ProfileValue>
            <StatusBadge className="good">
              <CheckCircle size={14} />
              Active Creator
            </StatusBadge>
          </ProfileSection>

          <ProfileSection>
            <ProfileLabel>Status</ProfileLabel>
            <StatusBadge className="good">
              <Star size={14} />
              0 no-shows
            </StatusBadge>
            <StatusBadge className="good">
              <Users size={14} />
              12 events attended
            </StatusBadge>
          </ProfileSection>

          <ProfileSection>
            <ProfileLabel>Recent Deliverables</ProfileLabel>
            <DeliverablesList>
              <DeliverableItem>
                <strong>The Grand</strong> - Posted 2 days ago
              </DeliverableItem>
              <DeliverableItem>
                <strong>Skyline Lounge</strong> - Posted 1 week ago
              </DeliverableItem>
              <DeliverableItem>
                <strong>Underground</strong> - Posted 2 weeks ago
              </DeliverableItem>
            </DeliverablesList>
          </ProfileSection>
        </ProfilePanel>
      </MainContent>

      {showJoinModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Join Event</ModalTitle>
              <CloseButton onClick={() => setShowJoinModal(false)}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            <div>
              <h3 style={{ marginBottom: '1rem' }}>{selectedEvent?.venue}</h3>
              <p style={{ color: '#cccccc', marginBottom: '1.5rem' }}>
                {selectedEvent?.hook}
              </p>

              <h4 style={{ marginBottom: '1rem' }}>Guidelines</h4>
              <GuidelinesList>
                <GuidelineItem>
                  Post at least one Instagram story during the event
                </GuidelineItem>
                <GuidelineItem>
                  Share a Google Review within 48 hours
                </GuidelineItem>
                <GuidelineItem>
                  Tag @SocietyUnlocked in your content
                </GuidelineItem>
              </GuidelinesList>

              <PenaltyClause>
                <strong>Penalty:</strong> No-shows or failure to complete deliverables 
                may result in suspension from future events.
              </PenaltyClause>

              <CheckboxContainer>
                <Checkbox 
                  type="checkbox" 
                  id="guidelines"
                  checked={acceptedGuidelines}
                  onChange={(e) => setAcceptedGuidelines(e.target.checked)}
                />
                <label htmlFor="guidelines">
                  I accept the guidelines and understand the penalty clause
                </label>
              </CheckboxContainer>

              <ModalButton 
                onClick={handleConfirmJoin}
                disabled={!acceptedGuidelines}
              >
                Accept & Reserve
              </ModalButton>
            </div>
          </ModalContent>
        </Modal>
      )}
    </DashboardContainer>
  );
}

export default CreatorDashboard; 