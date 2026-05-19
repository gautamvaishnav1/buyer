import { useState } from 'react'
import { FaReply, FaFilter, FaSearch, FaHistory, FaEllipsisV } from 'react-icons/fa'
import '../../styles/inquiry_management.css'

interface Inquiry {
  id: string;
  buyerName: string;
  company: string;
  product: string;
  date: string;
  status: 'New' | 'Negotiation' | 'Confirmed' | 'Closed';
  lastMessage: string;
}

const InquiryManagement = () => {
  const [inquiries] = useState<Inquiry[]>([
    { id: '101', buyerName: 'John Doe', company: 'Global Trade Corp', product: 'Industrial Safety Gloves', date: 'Oct 24, 2023', status: 'New', lastMessage: 'Looking for a quote for 5000 pairs.' },
    { id: '102', buyerName: 'Alice Smith', company: 'BuildRight Ltd', product: 'Heavy Duty Steel Pipe', date: 'Oct 22, 2023', status: 'Negotiation', lastMessage: 'Can you offer a discount for 500 units?' },
    { id: '103', buyerName: 'Robert Brown', company: 'Euro Electronics', product: 'LED High Bay Light', date: 'Oct 20, 2023', status: 'Confirmed', lastMessage: 'Payment has been initiated.' },
    { id: '104', buyerName: 'Sarah Wilson', company: 'Logistics Pro', product: 'Standard Pallets', date: 'Oct 18, 2023', status: 'Closed', lastMessage: 'Received the shipment, thanks.' },
  ])

  return (
    <div className="inquiry-mgmt">
      <div className="mgmt-header">
        <div className="header-text">
          <h1>Inquiry & Lead Management</h1>
          <p>Track and reply to potential buyers and manage your sales leads.</p>
        </div>
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search inquiries or buyers..." />
        </div>
      </div>

      <div className="lead-filters">
        <button className="filter-tab active">All Leads (24)</button>
        <button className="filter-tab">New (05)</button>
        <button className="filter-tab">Negotiation (12)</button>
        <button className="filter-tab">Confirmed (04)</button>
        <button className="filter-tab">Closed (03)</button>
        <button className="filter-btn ml-auto"><FaFilter /> More Filters</button>
      </div>

      <div className="inquiry-list">
        {inquiries.map(inquiry => (
          <div key={inquiry.id} className="inquiry-card">
            <div className="card-main">
              <div className="buyer-avatar">
                {inquiry.buyerName.charAt(0)}
              </div>
              <div className="inquiry-details">
                <div className="details-top">
                  <span className="buyer-name">{inquiry.buyerName}</span>
                  <span className="company-name">({inquiry.company})</span>
                  <span className={`status-tag ${inquiry.status.toLowerCase()}`}>{inquiry.status}</span>
                </div>
                <div className="details-mid">
                  <span className="product-interest">Interested in: <strong>{inquiry.product}</strong></span>
                  <span className="inquiry-date">{inquiry.date}</span>
                </div>
                <div className="details-bottom">
                  <p className="last-message">"{inquiry.lastMessage}"</p>
                </div>
              </div>
            </div>
            <div className="card-actions">
              <button className="action-btn reply"><FaReply /> Reply</button>
              <button className="action-btn history" title="Negotiation History"><FaHistory /></button>
              <button className="action-btn more"><FaEllipsisV /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InquiryManagement
