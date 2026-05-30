
import { Link, useParams } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaTimes, 
  FaEnvelope, 
  FaPaperPlane, 
  FaClock, 
  FaCalendarAlt, 
 
  FaBuilding, 
  FaGlobe, 
  FaCheckCircle, 
  FaFilePdf, 
  FaImage
} from 'react-icons/fa';
import '../../styles/view_rfq.css';
import { ROUTES } from '../../shared/constants';

export const ViewRFQ = () => {
  const { id } = useParams<{ id: string }>();
  console.log(id,"##########################################")
  // Mock data for a single RFQ
  const rfq = {
    id: id || 'RFQ2045',
    title: 'Looking for High-Grade Aluminum Extrusions for Automotive Frames',
    datePosted: 'Oct 24, 2024',
    deadline: 'Nov 10, 2024',
    timeLeft: '16 Days, 4 Hours',
    status: 'Open',
    category: 'Metals & Alloys > Aluminum',
    description: 'We are an automotive parts manufacturer seeking a reliable supplier for 6061-T6 aluminum alloy extrusions. The material must meet international aerospace/automotive standards. We require custom profiles as per our attached engineering drawings. Initial trial order will be 2 tons, scaling up to 15 tons monthly upon quality approval.',
    requirements: {
      quantity: '2 Metric Tons (Initial)',
      targetPrice: '$2,800 - $3,200 / Ton',
      sourcingType: 'Custom Manufacturing',
      destination: 'Hamburg Port, Germany',
      shippingTerms: 'CIF',
      paymentTerms: 'L/C or T/T (30% deposit)'
    },
    buyer: {
      company: 'AutoWerks GmbH',
      contact: 'Klaus Mueller',
      country: 'Germany',
      countryCode: 'DE',
      industry: 'Automotive Manufacturing',
      verified: true,
      memberSince: '2019',
      totalOrders: 142
    },
    attachments: [
      { name: 'Profile_Drawings_v2.pdf', size: '2.4 MB', type: 'pdf' },
      { name: 'Material_Specs.pdf', size: '845 KB', type: 'pdf' },
      { name: 'Reference_Part.jpg', size: '1.2 MB', type: 'image' }
    ]
  };

  return (
    <div className="rfq-view-container">
      
      {/* ── Action Bar ── */}
      <div className="rfq-actions-bar">
        <Link to={ROUTES.RFQ} className="rfq-back-link">
          <FaArrowLeft /> Back to RFQs
        </Link>
        <div className="rfq-action-buttons">
          <button className="btn-outline p-2 rounded-lg" >
            <FaTimes /> Decline
          </button>
          <button className="btn-outline p-2 rounded-lg">
            <FaEnvelope /> Message Buyer
          </button>
          <button className="btn-primary">
            <FaPaperPlane /> Submit Quote
          </button>
        </div>
      </div>

      <div className="rfq-main-content">
        
        {/* ── Left Column: RFQ Document ── */}
        <div className="rfq-document">
          
          {/* Header */}
          <div className="rfq-header">
            <div className="rfq-title-group">
              <h1>{rfq.title}</h1>
              <div className="rfq-meta">
                <span className="rfq-meta-item"><FaCalendarAlt /> Posted: {rfq.datePosted}</span>
                <span className="rfq-meta-item">ID: {rfq.id}</span>
                <span className="rfq-meta-item">Category: {rfq.category}</span>
              </div>
            </div>
            <div className="rfq-urgency">
              <span className="rfq-urgency-label">Time Remaining</span>
              <span className="rfq-urgency-time"><FaClock /> {rfq.timeLeft}</span>
            </div>
          </div>

          {/* Description Section */}
          <div className="rfq-section">
            <h2 className="rfq-section-title">Detailed Description</h2>
            <div className="rfq-description">
              {rfq.description}
            </div>
          </div>

          {/* Sourcing Requirements */}
          <div className="rfq-section">
            <h2 className="rfq-section-title">Sourcing Requirements</h2>
            <div className="rfq-req-grid">
              <div className="rfq-req-item">
                <span className="rfq-req-label">Required Quantity</span>
                <span className="rfq-req-value">{rfq.requirements.quantity}</span>
              </div>
              <div className="rfq-req-item">
                <span className="rfq-req-label">Target Price</span>
                <span className="rfq-req-value">{rfq.requirements.targetPrice}</span>
              </div>
              <div className="rfq-req-item">
                <span className="rfq-req-label">Sourcing Type</span>
                <span className="rfq-req-value">{rfq.requirements.sourcingType}</span>
              </div>
              <div className="rfq-req-item">
                <span className="rfq-req-label">Shipping Terms & Destination</span>
                <span className="rfq-req-value">{rfq.requirements.shippingTerms} — {rfq.requirements.destination}</span>
              </div>
              <div className="rfq-req-item">
                <span className="rfq-req-label">Preferred Payment Terms</span>
                <span className="rfq-req-value">{rfq.requirements.paymentTerms}</span>
              </div>
              <div className="rfq-req-item">
                <span className="rfq-req-label">Quotation Deadline</span>
                <span className="rfq-req-value">{rfq.deadline}</span>
              </div>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="rfq-section" style={{ borderBottom: 'none' }}>
            <h2 className="rfq-section-title">Attachments ({rfq.attachments.length})</h2>
            <div className="rfq-attachments">
              {rfq.attachments.map((doc, idx) => (
                <div key={idx} className="rfq-attachment-card">
                  <div className="rfq-attachment-icon">
                    {doc.type === 'pdf' ? <FaFilePdf /> : <FaImage />}
                  </div>
                  <div className="rfq-attachment-info">
                    <span className="rfq-attachment-name">{doc.name}</span>
                    <span className="rfq-attachment-size">{doc.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Right Column: Sidebar ── */}
        <div className="rfq-sidebar">
          
          {/* Action Card */}
          <div className="rfq-quote-card">
            <h3>Can you fulfill this request?</h3>
            <p>Submit a competitive quotation to win this B2B contract. Early quotes have a 40% higher chance of selection.</p>
            <button className="btn-quote-submit">
              <FaPaperPlane /> Quote Now
            </button>
          </div>

          {/* Buyer Information Card */}
          <div className="rfq-buyer-card">
            <div className="rfq-buyer-header">
              <div className="rfq-buyer-avatar">{rfq.buyer.company.charAt(0)}</div>
              <div className="rfq-buyer-info">
                <h3>{rfq.buyer.company}</h3>
                <p><FaGlobe /> {rfq.buyer.country}</p>
              </div>
            </div>
            
            <div className="rfq-buyer-stats">
              <div className="rfq-buyer-stat-row">
                <span className="label"><FaBuilding /> Industry</span>
                <span className="value">{rfq.buyer.industry}</span>
              </div>
              <div className="rfq-buyer-stat-row">
                <span className="label"><FaCalendarAlt /> Member Since</span>
                <span className="value">{rfq.buyer.memberSince}</span>
              </div>
              <div className="rfq-buyer-stat-row">
                <span className="label"><FaCheckCircle /> Total Orders on Platform</span>
                <span className="value">{rfq.buyer.totalOrders}</span>
              </div>
            </div>

            {rfq.buyer.verified && (
              <div className="rfq-verified-badge">
                <FaCheckCircle /> Verified Business Buyer
              </div>
            )}
            
            <button className="btn-outline p-2 rounded-lg" style={{ width: '100%', marginTop: '16px', justifyContent: 'center' }}>
              View Full Profile
            </button>
          </div>
          
        </div>
        
      </div>
    </div>
  );
};

export default ViewRFQ;
