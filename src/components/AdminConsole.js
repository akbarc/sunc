import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Users, 
  Calendar,
  X,
  Save,
  Ban,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminContainer = styled.div`
  min-height: 100vh;
  background: #000000;
  padding: 2rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #333333;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
`;

const AddEventButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #0066ff;
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #0052cc;
  }
`;

const EventsTable = styled.div`
  background: #111111;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #333333;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr auto;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #000000;
  border-bottom: 1px solid #333333;
  font-weight: 600;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr auto;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #333333;
  align-items: center;

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const CapacityPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;

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

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #666666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }

  &.danger:hover {
    background: rgba(255, 68, 68, 0.2);
    color: #ff4444;
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 0.5rem;
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
  max-width: 600px;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #ffffff;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #333333;
  border-radius: 6px;
  background: #000000;
  color: #ffffff;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0066ff;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #333333;
  border-radius: 6px;
  background: #000000;
  color: #ffffff;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0066ff;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #333333;
  border-radius: 6px;
  background: #000000;
  color: #ffffff;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0066ff;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ModalButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &.primary {
    background: #0066ff;
    color: #ffffff;

    &:hover {
      background: #0052cc;
    }
  }

  &.secondary {
    background: #333333;
    color: #ffffff;

    &:hover {
      background: #444444;
    }
  }
`;

// Roster Drawer
const RosterDrawer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
  background: #111111;
  border-left: 1px solid #333333;
  transform: translateX(${props => props.isOpen ? '0' : '100%'});
  transition: transform 0.3s ease;
  z-index: 1001;
  overflow-y: auto;
`;

const RosterHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #333333;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RosterTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
`;

const RosterContent = styled.div`
  padding: 1.5rem;
`;

const CreatorItem = styled.div`
  padding: 1rem;
  background: #000000;
  border-radius: 6px;
  margin-bottom: 1rem;
  border: 1px solid #333333;
`;

const CreatorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const CreatorName = styled.div`
  font-weight: 600;
`;

const CreatorHandle = styled.div`
  color: #666666;
  font-size: 0.9rem;
`;

const CreatorStatus = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const StatusTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;

  &.reserved {
    background: rgba(0, 102, 255, 0.2);
    color: #0066ff;
  }

  &.completed {
    background: rgba(0, 204, 102, 0.2);
    color: #00cc66;
  }

  &.no-show {
    background: rgba(255, 68, 68, 0.2);
    color: #ff4444;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #666666;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 68, 68, 0.2);
    color: #ff4444;
  }
`;

// Mock data
const mockEvents = [
  {
    id: 1,
    title: 'Craft cocktails & dim sum launch',
    venue: 'The Grand',
    date: '2024-01-15',
    time: '19:00',
    capacity: 12,
    reserved: 7,
    status: 'upcoming'
  },
  {
    id: 2,
    title: 'Sunset rooftop networking',
    venue: 'Skyline Lounge',
    date: '2024-01-18',
    time: '18:30',
    capacity: 8,
    reserved: 8,
    status: 'upcoming'
  },
  {
    id: 3,
    title: 'Live jazz & art showcase',
    venue: 'Underground',
    date: '2024-01-20',
    time: '20:00',
    capacity: 15,
    reserved: 5,
    status: 'upcoming'
  }
];

const mockRoster = [
  {
    id: 1,
    name: 'John Doe',
    handle: '@johndoe',
    status: 'reserved',
    followers: '24.5K'
  },
  {
    id: 2,
    name: 'Jane Smith',
    handle: '@janesmith',
    status: 'completed',
    followers: '18.2K'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    handle: '@mikejohnson',
    status: 'no-show',
    followers: '32.1K'
  }
];

function AdminConsole() {
  const [events, setEvents] = useState(mockEvents);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showRoster, setShowRoster] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [roster, setRoster] = useState(mockRoster);

  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowEventModal(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEventModal(true);
  };

  const handleSaveEvent = (eventData) => {
    if (editingEvent) {
      setEvents(prev => prev.map(event => 
        event.id === editingEvent.id ? { ...event, ...eventData } : event
      ));
      toast.success('Event updated successfully!');
    } else {
      const newEvent = {
        id: Date.now(),
        ...eventData,
        reserved: 0,
        status: 'upcoming'
      };
      setEvents(prev => [...prev, newEvent]);
      toast.success('Event created successfully!');
    }
    setShowEventModal(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    toast.success('Event deleted successfully!');
  };

  const handleViewRoster = (event) => {
    setSelectedEvent(event);
    setShowRoster(true);
  };

  const handleToggleBan = (creatorId) => {
    setRoster(prev => prev.map(creator => 
      creator.id === creatorId 
        ? { ...creator, status: creator.status === 'banned' ? 'reserved' : 'banned' }
        : creator
    ));
    toast.success('Creator status updated!');
  };

  const getCapacityStatus = (reserved, capacity) => {
    const percentage = (reserved / capacity) * 100;
    if (percentage >= 80) return 'danger';
    if (percentage >= 60) return 'warning';
    return 'good';
  };

  return (
    <AdminContainer>
      <Header>
        <PageTitle>Admin Console</PageTitle>
        <AddEventButton onClick={handleAddEvent}>
          <Plus size={16} />
          Add Event
        </AddEventButton>
      </Header>

      <EventsTable>
        <TableHeader>
          <div>Event</div>
          <div>Venue</div>
          <div>Date</div>
          <div>Capacity</div>
          <div>Status</div>
          <div>Actions</div>
        </TableHeader>
        
        {events.map(event => (
          <TableRow key={event.id}>
            <div>
              <div style={{ fontWeight: 600 }}>{event.title}</div>
              <div style={{ color: '#666666', fontSize: '0.9rem' }}>
                {event.time}
              </div>
            </div>
            <div>{event.venue}</div>
            <div>{new Date(event.date).toLocaleDateString()}</div>
            <div>
              <CapacityPill className={getCapacityStatus(event.reserved, event.capacity)}>
                <Users size={12} />
                {event.reserved}/{event.capacity}
              </CapacityPill>
            </div>
            <div>
              <span style={{ 
                color: event.status === 'upcoming' ? '#00cc66' : '#ffaa00',
                fontWeight: 500 
              }}>
                {event.status}
              </span>
            </div>
            <ActionGroup>
              <ActionButton onClick={() => handleViewRoster(event)}>
                <Eye size={16} />
              </ActionButton>
              <ActionButton onClick={() => handleEditEvent(event)}>
                <Edit size={16} />
              </ActionButton>
              <ActionButton 
                className="danger" 
                onClick={() => handleDeleteEvent(event.id)}
              >
                <Trash2 size={16} />
              </ActionButton>
            </ActionGroup>
          </TableRow>
        ))}
      </EventsTable>

      {/* Event Modal */}
      {showEventModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </ModalTitle>
              <CloseButton onClick={() => setShowEventModal(false)}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            <Form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleSaveEvent({
                title: formData.get('title'),
                venue: formData.get('venue'),
                date: formData.get('date'),
                time: formData.get('time'),
                capacity: parseInt(formData.get('capacity')),
                description: formData.get('description')
              });
            }}>
              <FormGroup>
                <Label>Event Title</Label>
                <Input 
                  name="title" 
                  defaultValue={editingEvent?.title}
                  required 
                />
              </FormGroup>

              <FormGroup>
                <Label>Venue</Label>
                <Input 
                  name="venue" 
                  defaultValue={editingEvent?.venue}
                  required 
                />
              </FormGroup>

              <FormGroup>
                <Label>Date</Label>
                <Input 
                  type="date" 
                  name="date" 
                  defaultValue={editingEvent?.date}
                  required 
                />
              </FormGroup>

              <FormGroup>
                <Label>Time</Label>
                <Input 
                  type="time" 
                  name="time" 
                  defaultValue={editingEvent?.time}
                  required 
                />
              </FormGroup>

              <FormGroup>
                <Label>Capacity</Label>
                <Input 
                  type="number" 
                  name="capacity" 
                  defaultValue={editingEvent?.capacity}
                  min="1"
                  required 
                />
              </FormGroup>

              <FormGroup>
                <Label>Description</Label>
                <TextArea 
                  name="description" 
                  defaultValue={editingEvent?.description}
                  placeholder="Event description..."
                />
              </FormGroup>

              <ButtonGroup>
                <ModalButton type="submit" className="primary">
                  <Save size={16} />
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </ModalButton>
                <ModalButton 
                  type="button" 
                  className="secondary"
                  onClick={() => setShowEventModal(false)}
                >
                  Cancel
                </ModalButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {/* Roster Drawer */}
      <RosterDrawer isOpen={showRoster}>
        <RosterHeader>
          <RosterTitle>
            {selectedEvent?.venue} - Roster
          </RosterTitle>
          <CloseButton onClick={() => setShowRoster(false)}>
            <X size={20} />
          </CloseButton>
        </RosterHeader>

        <RosterContent>
          {roster.map(creator => (
            <CreatorItem key={creator.id}>
              <CreatorHeader>
                <div>
                  <CreatorName>{creator.name}</CreatorName>
                  <CreatorHandle>{creator.handle}</CreatorHandle>
                </div>
                <ToggleButton 
                  onClick={() => handleToggleBan(creator.id)}
                  title={creator.status === 'banned' ? 'Unban' : 'Ban'}
                >
                  <Ban size={16} />
                </ToggleButton>
              </CreatorHeader>
              
              <CreatorStatus>
                <StatusTag className={creator.status}>
                  {creator.status === 'reserved' && <AlertCircle size={12} />}
                  {creator.status === 'completed' && <CheckCircle size={12} />}
                  {creator.status === 'no-show' && <X size={12} />}
                  {creator.status}
                </StatusTag>
                <span style={{ color: '#666666', fontSize: '0.8rem' }}>
                  {creator.followers} followers
                </span>
              </CreatorStatus>
            </CreatorItem>
          ))}
        </RosterContent>
      </RosterDrawer>
    </AdminContainer>
  );
}

export default AdminConsole; 