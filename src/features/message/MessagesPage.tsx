import { useState } from 'react';
import '../../styles/Buyer-dashboard.css'
// Real person images mapping removed — unused

// Fallback function to get any random real person image
const getRandomPersonImage = (name: string): string => {
  // Using randomuser.me for real-looking person images
  // These are actual photos of real people (stock photos)
  const womenImages = [
    'https://randomuser.me/api/portraits/women/1.jpg',
    'https://randomuser.me/api/portraits/women/2.jpg',
    'https://randomuser.me/api/portraits/women/3.jpg',
    'https://randomuser.me/api/portraits/women/4.jpg',
    'https://randomuser.me/api/portraits/women/5.jpg',
    'https://randomuser.me/api/portraits/women/6.jpg',
    'https://randomuser.me/api/portraits/women/7.jpg',
    'https://randomuser.me/api/portraits/women/8.jpg',
    'https://randomuser.me/api/portraits/women/9.jpg',
    'https://randomuser.me/api/portraits/women/10.jpg',
    'https://randomuser.me/api/portraits/women/11.jpg',
    'https://randomuser.me/api/portraits/women/12.jpg',
    'https://randomuser.me/api/portraits/women/13.jpg',
    'https://randomuser.me/api/portraits/women/14.jpg',
    'https://randomuser.me/api/portraits/women/15.jpg',
    'https://randomuser.me/api/portraits/women/16.jpg',
    'https://randomuser.me/api/portraits/women/17.jpg',
    'https://randomuser.me/api/portraits/women/18.jpg',
    'https://randomuser.me/api/portraits/women/19.jpg',
    'https://randomuser.me/api/portraits/women/20.jpg',
    'https://randomuser.me/api/portraits/women/21.jpg',
    'https://randomuser.me/api/portraits/women/22.jpg',
    'https://randomuser.me/api/portraits/women/23.jpg',
    'https://randomuser.me/api/portraits/women/24.jpg',
    'https://randomuser.me/api/portraits/women/25.jpg',
    'https://randomuser.me/api/portraits/women/26.jpg',
    'https://randomuser.me/api/portraits/women/27.jpg',
    'https://randomuser.me/api/portraits/women/28.jpg',
    'https://randomuser.me/api/portraits/women/29.jpg',
    'https://randomuser.me/api/portraits/women/30.jpg',
    'https://randomuser.me/api/portraits/women/31.jpg',
    'https://randomuser.me/api/portraits/women/32.jpg',
    'https://randomuser.me/api/portraits/women/33.jpg',
    'https://randomuser.me/api/portraits/women/34.jpg',
    'https://randomuser.me/api/portraits/women/35.jpg',
    'https://randomuser.me/api/portraits/women/36.jpg',
    'https://randomuser.me/api/portraits/women/37.jpg',
    'https://randomuser.me/api/portraits/women/38.jpg',
    'https://randomuser.me/api/portraits/women/39.jpg',
    'https://randomuser.me/api/portraits/women/40.jpg',
  ];
  
  const menImages = [
    'https://randomuser.me/api/portraits/men/1.jpg',
    'https://randomuser.me/api/portraits/men/2.jpg',
    'https://randomuser.me/api/portraits/men/3.jpg',
    'https://randomuser.me/api/portraits/men/4.jpg',
    'https://randomuser.me/api/portraits/men/5.jpg',
    'https://randomuser.me/api/portraits/men/6.jpg',
    'https://randomuser.me/api/portraits/men/7.jpg',
    'https://randomuser.me/api/portraits/men/8.jpg',
    'https://randomuser.me/api/portraits/men/9.jpg',
    'https://randomuser.me/api/portraits/men/10.jpg',
    'https://randomuser.me/api/portraits/men/11.jpg',
    'https://randomuser.me/api/portraits/men/12.jpg',
    'https://randomuser.me/api/portraits/men/13.jpg',
    'https://randomuser.me/api/portraits/men/14.jpg',
    'https://randomuser.me/api/portraits/men/15.jpg',
    'https://randomuser.me/api/portraits/men/16.jpg',
    'https://randomuser.me/api/portraits/men/17.jpg',
    'https://randomuser.me/api/portraits/men/18.jpg',
    'https://randomuser.me/api/portraits/men/19.jpg',
    'https://randomuser.me/api/portraits/men/20.jpg',
    'https://randomuser.me/api/portraits/men/21.jpg',
    'https://randomuser.me/api/portraits/men/22.jpg',
    'https://randomuser.me/api/portraits/men/23.jpg',
    'https://randomuser.me/api/portraits/men/24.jpg',
    'https://randomuser.me/api/portraits/men/25.jpg',
    'https://randomuser.me/api/portraits/men/26.jpg',
    'https://randomuser.me/api/portraits/men/27.jpg',
    'https://randomuser.me/api/portraits/men/28.jpg',
    'https://randomuser.me/api/portraits/men/29.jpg',
    'https://randomuser.me/api/portraits/men/30.jpg',
    'https://randomuser.me/api/portraits/men/31.jpg',
    'https://randomuser.me/api/portraits/men/32.jpg',
    'https://randomuser.me/api/portraits/men/33.jpg',
    'https://randomuser.me/api/portraits/men/34.jpg',
    'https://randomuser.me/api/portraits/men/35.jpg',
    'https://randomuser.me/api/portraits/men/36.jpg',
    'https://randomuser.me/api/portraits/men/37.jpg',
    'https://randomuser.me/api/portraits/men/38.jpg',
    'https://randomuser.me/api/portraits/men/39.jpg',
    'https://randomuser.me/api/portraits/men/40.jpg',
  ];
  
  // Simple hash to get consistent image for same name
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Determine gender based on name (simple heuristic)
  const femaleNames = ['Khushi', 'Priya', 'Kavita', 'Sunita', 'Rekha', 'Meera', 'Anjali', 'Pooja', 'Neha', 'Richa'];
  const isFemale = femaleNames.some(fn => name.includes(fn));
  
  const images = isFemale ? womenImages : menImages;
  const index = hash % images.length;
  
  return images[index];
};

// Avatar component with fallback
const Avatar = ({ 
  name, 
  imageUrl, 
  size = 48 
}: { 
  name: string; 
  imageUrl?: string; 
  size?: number;
}) => {
  const [imgError, setImgError] = useState(false);
  
  // Use provided image URL or generate one
  const finalImageUrl = imageUrl || getRandomPersonImage(name);
  
  // Get initials for fallback
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  if (imgError) {
    return (
      <div 
        className="avatar-fallback"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, #e64545, #ff6b6b)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontSize: size * 0.4,
          textTransform: 'uppercase',
        }}
      >
        {initials}
      </div>
    );
  }
  
  return (
    <img
      src={finalImageUrl}
      alt={name}
      className="avatar-image"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover',
      }}
      onError={() => setImgError(true)}
    />
  );
};

interface Conversation {
  id: string;
  supplierName: string;
  supplierCompany: string;
  supplierAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  orderId?: string;
  productName?: string;
  messages: ThreadMessage[];
}

interface ThreadMessage {
  id: string;
  sender: 'buyer' | 'supplier';
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

// Mock data with real person images
const mockConversations: Conversation[] = [
  {
    id: '1',
    supplierName: 'Khushi Yadav',
    supplierCompany: 'Guangdong Electronics Co.',
    supplierAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    lastMessage: 'The samples will be shipped by tomorrow morning.',
    lastMessageTime: '2024-01-15T10:30:00',
    unreadCount: 2,
    orderId: '#ORD-1001',
    productName: 'Smart LED Display',
    messages: [
      {
        id: 'm1',
        sender: 'supplier',
        senderName: 'Khushi Yadav',
        content: 'Hello, I wanted to confirm the specifications for the LED displays.',
        timestamp: '2024-01-15T09:00:00',
        isRead: true,
      },
      {
        id: 'm2',
        sender: 'buyer',
        senderName: 'You',
        content: 'Yes, we need the 55-inch model with 4K resolution.',
        timestamp: '2024-01-15T09:45:00',
        isRead: true,
      },
      {
        id: 'm3',
        sender: 'supplier',
        senderName: 'Khushi Yadav',
        content: 'Perfect. The samples will be shipped by tomorrow morning.',
        timestamp: '2024-01-15T10:30:00',
        isRead: false,
      },
    ],
  },
  {
    id: '2',
    supplierName: 'Priya Shnakla',
    supplierCompany: 'Mumbai Textile Mills',
    supplierAvatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    lastMessage: 'Thanks for your order! We\'ll start production next week.',
    lastMessageTime: '2024-01-14T16:20:00',
    unreadCount: 0,
    orderId: '#ORD-1002',
    productName: 'Cotton Fabric Rolls',
    messages: [
      {
        id: 'm4',
        sender: 'buyer',
        senderName: 'You',
        content: 'I\'d like to place an order for 5000 meters of cotton fabric.',
        timestamp: '2024-01-14T14:00:00',
        isRead: true,
      },
      {
        id: 'm5',
        sender: 'supplier',
        senderName: 'Priya Shnakla',
        content: 'Thanks for your order! We\'ll start production next week.',
        timestamp: '2024-01-14T16:20:00',
        isRead: true,
      },
    ],
  },
  {
    id: '3',
    supplierName: 'Chen Li',
    supplierCompany: 'Shanghai Packaging Solutions',
    supplierAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    lastMessage: 'Can you confirm the shipping address?',
    lastMessageTime: '2024-01-13T09:15:00',
    unreadCount: 1,
    messages: [
      {
        id: 'm6',
        sender: 'supplier',
        senderName: 'Chen Li',
        content: 'Can you confirm the shipping address?',
        timestamp: '2024-01-13T09:15:00',
        isRead: false,
      },
    ],
  },
];

const MessagesPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  const filteredConversations = conversations
    .filter(conv => {
      const matchesSearch = conv.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           conv.supplierCompany.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || (filter === 'unread' && conv.unreadCount > 0);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    if (conversation.unreadCount > 0) {
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversation.id
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
    }
  };

  const handleSendMessage = () => {
    if (!replyMessage.trim() || !selectedConversation) return;

    const newMsg: ThreadMessage = {
      id: Date.now().toString(),
      sender: 'buyer',
      senderName: 'You',
      content: replyMessage,
      timestamp: new Date().toISOString(),
      isRead: true,
    };

    const updatedConversation = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMsg],
      lastMessage: replyMessage,
      lastMessageTime: new Date().toISOString(),
    };

    setSelectedConversation(updatedConversation);
    
    // Update in conversations list
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation.id ? updatedConversation : conv
      )
    );

    setReplyMessage('');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="buyer-dashboard-messages">
      {/* Messages Header */}
      <div className="messages-header">
        <div>
          <h1 className="messages-title">Messages</h1>
          <p className="messages-subtitle">Communicate with your suppliers</p>
        </div>
        <button
          className="compose-btn"
          onClick={() => setIsComposeOpen(true)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Compose
        </button>
      </div>

      {/* Messages Grid */}
      <div className="messages-grid">
        {/* Conversation List Sidebar */}
        <div className="conversations-sidebar">
          <div className="conversations-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="conversations-filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Messages
            </button>
            <button
              className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              Unread
            </button>
          </div>

          <div className="conversations-list">
            {filteredConversations.length === 0 ? (
              <div className="no-conversations">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <p>No conversations found</p>
              </div>
            ) : (
              filteredConversations.map(conv => (
                <div
                  key={conv.id}
                  className={`conversation-item ${selectedConversation?.id === conv.id ? 'active' : ''} ${conv.unreadCount > 0 ? 'unread' : ''}`}
                  onClick={() => handleSelectConversation(conv)}
                >
                  <div className="conversation-avatar">
                    <Avatar 
                      name={conv.supplierName} 
                      imageUrl={conv.supplierAvatar}
                      size={48}
                    />
                    {conv.unreadCount > 0 && (
                      <span className="unread-badge">{conv.unreadCount}</span>
                    )}
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-header">
                      <span className="supplier-name">{conv.supplierName}</span>
                      <span className="message-time">{formatTime(conv.lastMessageTime)}</span>
                    </div>
                    <div className="supplier-company">{conv.supplierCompany}</div>
                    <div className="message-preview">
                      {conv.lastMessage.length > 50 
                        ? conv.lastMessage.substring(0, 50) + '...' 
                        : conv.lastMessage}
                    </div>
                    {conv.orderId && (
                      <div className="order-ref">
                        Order: {conv.orderId}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Thread Area */}
        <div className="message-thread-area">
          {selectedConversation ? (
            <>
              {/* Thread Header */}
              <div className="thread-header">
                <div className="thread-supplier-info">
                  <Avatar 
                    name={selectedConversation.supplierName} 
                    imageUrl={selectedConversation.supplierAvatar}
                    size={44}
                  />
                  <div>
                    <h3>{selectedConversation.supplierName}</h3>
                    <p>{selectedConversation.supplierCompany}</p>
                  </div>
                </div>
                {selectedConversation.orderId && (
                  <div className="order-badge">
                    Order {selectedConversation.orderId}
                  </div>
                )}
              </div>

              {/* Messages Container */}
              <div className="messages-container">
                {selectedConversation.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`message-bubble ${msg.sender === 'buyer' ? 'outgoing' : 'incoming'}`}
                  >
                    <div className="message-sender">
                      {msg.senderName}
                      <span className="message-time">{formatTime(msg.timestamp)}</span>
                    </div>
                    <div className="message-content">{msg.content}</div>
                  </div>
                ))}
              </div>

              {/* Reply Input Area */}
              <div className="reply-area">
                <textarea
                  placeholder="Type your message..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  className="send-btn"
                  onClick={handleSendMessage}
                  disabled={!replyMessage.trim()}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="no-conversation-selected">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <h3>No conversation selected</h3>
              <p>Choose a conversation from the list or start a new one</p>
              <button
                className="compose-new-btn"
                onClick={() => setIsComposeOpen(true)}
              >
                Compose New Message
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {isComposeOpen && (
        <ComposeModal onClose={() => setIsComposeOpen(false)} />
      )}
    </div>
  );
};

// Compose Modal Component
const ComposeModal = ({ onClose }: { onClose: () => void }) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    console.log({ to, subject, message });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="compose-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>New Message</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>To (Supplier)</label>
            <input
              type="text"
              placeholder="Search or enter supplier name..."
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea
              rows={6}
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="send-message-btn" onClick={handleSend}>Send Message</button>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;