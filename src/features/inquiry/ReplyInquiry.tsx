import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaEnvelope, FaTimes, 
  FaGlobe, FaBuilding, FaCalendarAlt, FaBoxes, 
  FaShieldAlt, FaPaperPlane, FaUpload, FaTrashAlt, FaCheckCircle, 
  FaFilePdf, FaCertificate, FaExclamationCircle
} from 'react-icons/fa';
import dummyInquiries from '../../core/storage/DummyInquiries.json';
import '../../styles/reply_inquiry.css';
import { ROUTES } from '../../shared/constants';

// Types
interface AttachmentFile {
  id: string;
  name: string;
  size: string;
  date: string;
}

export const ReplyInquiry = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const inquiryId = id || 'INQ5001';

  // Fetch / Generate Inquiry Data
  const getInquiryDetails = () => {
    const basicInq = dummyInquiries.find(inq => inq.id === inquiryId);
    
    const quantityVal = basicInq ? basicInq.quantity : 500;
    const dateVal = basicInq ? basicInq.date : '10/15/2024';
    const buyerName = basicInq ? basicInq.buyerName : 'Sarah Connor';
    const companyName = basicInq ? basicInq.company : 'TechDyne Solutions';
    const productName = basicInq ? basicInq.product : 'Industrial Safety Goggles';
    const initialStatus = basicInq ? basicInq.status : 'New';
    const priorityVal = basicInq ? basicInq.priority : 'Medium';
    
    // Convert budget string to float (e.g. "$13,149.20" -> 13149.20)
    let budgetVal = 5000.00;
    if (basicInq) {
      budgetVal = parseFloat(basicInq.budget.replace('$', '').replace(',', ''));
    }
    
    const parsedUnitPrice = parseFloat((budgetVal / quantityVal).toFixed(2)) || 10.00;

    // Detailed description fallback based on company and product
    const detailedMessage = `Dear Sales Team,
    
We are interested in sourcing wholesale "${productName}" for our supply chain logistics operation. We have reviewed your manufacturer certifications on the portal and would like to obtain a formal quotation for a trial volume of ${quantityVal.toLocaleString()} units.

Please review our specific guidelines:
- Logo Customization: Required on the product casing and outer box.
- Standard Shipping: FOB Ningbo preferred.
- Target Specs: CE, SGS verified test reports required.
- Delivery Date: Within 30-45 days after deposit validation.

Please provide your best FOB unit cost, custom tooling costs, and lead times.

Best regards,
${buyerName}
Sourcing Manager, ${companyName}`;

    // Index calculation for pseudo-random but stable details
    const numericId = parseInt(inquiryId.replace('INQ', '')) || 5001;

    return {
      id: inquiryId,
      date: dateVal,
      buyerName,
      company: companyName,
      product: productName,
      quantity: quantityVal,
      budget: budgetVal,
      unitPrice: parsedUnitPrice,
      priority: priorityVal,
      status: initialStatus,
      message: detailedMessage,
      buyerDetails: {
        country: numericId % 2 === 0 ? 'United States' : 'Germany',
        countryCode: numericId % 2 === 0 ? 'US' : 'DE',
        industry: 'Import & Wholesale Distribution',
        memberSince: String(2018 + (numericId % 5)),
        responseRate: `${92 + (numericId % 7)}%`,
        activeRfqsCount: (numericId % 4) + 1,
        trustScore: numericId % 3 === 0 ? 'AAA (Outstanding)' : 'AA+ (Excellent)',
        totalTransacted: numericId % 2 === 0 ? '$420,000+' : '$180,000+',
        audited: numericId % 2 === 0 ? 'Verified by SGS Group' : 'Audited by TÜV Rheinland'
      },
      requirements: {
        sourcingType: 'Custom Logo Sourcing',
        destination: numericId % 2 === 0 ? 'Port of Long Beach, USA' : 'Port of Hamburg, Germany',
        shippingTerms: 'FOB',
        paymentTerms: 'T/T 30% deposit, 70% balance before shipment',
        timeline: '45 Days after receipt of deposit'
      }
    };
  };

  const inq = getInquiryDetails();

  // Tab State: 'message' | 'quotation' | 'attachments'
  const [activeTab, setActiveTab] = useState<'message' | 'quotation' | 'attachments'>('message');

  // Email state
  const [subjectLine, setSubjectLine] = useState(`[Quote Response] Sourcing ${inq.product} - Ref: ${inq.id}`);
  const [emailText, setEmailText] = useState('');

  // Attachments State
  const [attachments, setAttachments] = useState<AttachmentFile[]>([
    {
      id: '1',
      name: 'FACTORY_CAPABILITY_BROCHURE.pdf',
      size: '2.4 MB',
      date: inq.date
    }
  ]);

  // Toast State
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Trigger toast notifications
  const triggerToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Quick response templates helper
  const handleApplyTemplate = (type: 'ack' | 'catalog' | 'sample') => {
    let msg = '';
    if (type === 'ack') {
      msg = `Dear ${inq.buyerName},

Thank you very much for your sourcing inquiry regarding our "${inq.product}". We appreciate the opportunity to collaborate with ${inq.company}.

We have received your requirements for ${inq.quantity.toLocaleString()} units. We are currently preparing our production schedules and checking materials availability.

To help us refine the quote, could you please provide:
1. Vector artwork files (PDF, AI, or EPS) of your logo.
2. Specific packing preferences (standard shipping cartons or custom pallets).

I will send over our formal Proforma Invoice (PI) shortly.

Best regards,
Sales Team`;
    } else if (type === 'catalog') {
      msg = `Dear ${inq.buyerName},

Thank you for contacting us. We have been manufacturing ${inq.product} items for over 8 years, holding full ISO 9001 and CE certifications.

Please find attached our latest e-catalog demonstrating our product lines, customization configurations, and testing reports. Our minimum order quantity for logo customization starts at 500 units.

We would be glad to ship standard physical samples to your address in ${inq.buyerDetails.country} for physical testing. Let me know if you have an active FedEx/DHL account to arrange shipping.

Best regards,
Sales Team`;
    } else if (type === 'sample') {
      msg = `Dear ${inq.buyerName},

Thank you for your sourcing request. We would be pleased to provide pre-production samples of "${inq.product}" for your quality inspection.

Our sample options are:
- Standard Catalog Sample: Free of charge. Buyer covers express air courier shipping ($35 USD via DHL).
- Custom Logo Mockup Sample: $50 USD per unit (fully refundable upon placing a bulk order exceeding 2,000 units).

Please reply with your preferred option, along with your delivery address, recipient contact name, and phone details.

Best regards,
Sales Team`;
    }
    setEmailText(msg);
    triggerToast('success', 'Email template applied successfully!');
  };

  // Submit email response
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailText.trim()) {
      triggerToast('error', 'Message body cannot be empty.');
      return;
    }

    triggerToast('success', `Response message dispatched to ${inq.buyerName}!`);
    setEmailText('');
    
    // Return to inquiry dashboard
    setTimeout(() => {
      navigate('/inquiries');
    }, 2000);
  };

  // Handle local mock uploader
  const triggerFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const newFile: AttachmentFile = {
          id: String(attachments.length + 1),
          name: file.name.toUpperCase().replace(/\s+/g, '_'),
          size: `${Math.round(file.size / 1024)} KB`,
          date: new Date().toLocaleDateString()
        };
        setAttachments([...attachments, newFile]);
        triggerToast('success', `File "${file.name}" attached successfully!`);
      }
    };
    input.click();
  };

  // Remove attachment
  const handleDeleteAttachment = (fileId: string) => {
    setAttachments(attachments.filter(f => f.id !== fileId));
    triggerToast('success', 'Attachment removed.');
  };

  return (
    <div className="reply-inquiry-container">
      
      {/* ── Toast Notifications ── */}
      {toast && (
        <div className={`inq-toast ${toast.type}`}>
          {toast.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* ── Action bar ── */}
      <div className="inq-action-bar">
        <Link to={ROUTES.INQUIRIES} className="back-link">
          <FaArrowLeft /> Back to Inquiries
        </Link>
        <div className="action-buttons">
          <button 
            className="btn-decline"
            onClick={() => {
              if (window.confirm('Are you sure you want to decline this sourcing inquiry?')) {
                triggerToast('success', 'Lead declined. Sourcing closed.');
                setTimeout(() => navigate('/inquiries'), 1500);
              }
            }}
          >
            <FaTimes /> Decline Inquiry
          </button>
          
        </div>
      </div>

      {/* ── Main content layout ── */}
      <div className="reply-content-grid">
        
        {/* Workspace Column (Left) */}
        <div className="workspace-column">
          <div className="reply-card">
            
            {/* Tabs Header */}
            <div className="workspace-tabs">
              <button 
                className={`tab-btn ${activeTab === 'message' ? 'active' : ''}`}
                onClick={() => setActiveTab('message')}
              >
                <FaEnvelope /> Write Email Response
              </button>
              {/* <button 
                className={`tab-btn ${activeTab === 'quotation' ? 'active' : ''}`}
                onClick={() => setActiveTab('quotation')}
              >
                <FaFileInvoice /> Draft Proforma Invoice (PI)
              </button> */}
              <button 
                className={`tab-btn ${activeTab === 'attachments' ? 'active' : ''}`}
                onClick={() => setActiveTab('attachments')}
              >
                <FaUpload /> Attach Specifications & Certificates
              </button>
            </div>

            {/* Tab 1: Email Editor */}
            {activeTab === 'message' && (
              <form onSubmit={handleSendEmail} className="editor-group">
                {/* Templates Selector */}
                <div className="templates-section">
                  <div className="templates-title">Quick Response Templates</div>
                  <div className="template-chips">
                    <button type="button" className="template-chip" onClick={() => handleApplyTemplate('ack')}>
                      Acknowledge Sourcing Lead
                    </button>
                    <button type="button" className="template-chip" onClick={() => handleApplyTemplate('catalog')}>
                      Share E-Catalog & Compliance
                    </button>
                    <button type="button" className="template-chip" onClick={() => handleApplyTemplate('sample')}>
                      Sample Ship Agreement
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Subject</label>
                  <input 
                    type="text" 
                    className="subject-input"
                    value={subjectLine}
                    onChange={e => setSubjectLine(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Message Content</label>
                  <textarea 
                    className="message-textarea"
                    placeholder={`Write a professional response to ${inq.buyerName}...`}
                    value={emailText}
                    onChange={e => setEmailText(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button type="submit" className="btn-primary">
                    <FaPaperPlane /> Dispatch Email Response
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: Quotation Builder */}
          

            {/* Tab 3: Attachments */}
            {activeTab === 'attachments' && (
              <div className="attachments-zone">
                <div className="dropzone-container" onClick={triggerFileUpload}>
                  <FaUpload />
                  <div className="dropzone-title">Upload B2B Sourcing Attachments</div>
                  <div className="dropzone-sub">Attach catalogs, technical drawings, or SGS audit reports (PDF, PNG up to 10MB)</div>
                </div>

                <div className="attached-files-list">
                  <span className="text-xs font-bold text-heading uppercase">Files Attached ({attachments.length})</span>
                  {attachments.map(file => (
                    <div key={file.id} className="file-item">
                      <div className="file-info">
                        <FaFilePdf className="file-icon" />
                        <div className="file-details">
                          <span className="file-name">{file.name}</span>
                          <span className="file-size">{file.size} • Attached {file.date}</span>
                        </div>
                      </div>
                      <button 
                        className="file-delete-btn" 
                        onClick={() => handleDeleteAttachment(file.id)}
                        title="Remove file"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Context Column (Right) */}
        <div className="context-column">
          
          {/* Card 1: Buyer Intel */}
          <div className="reply-card">
            <div className="card-title-bar">
              <h3>
                <FaCertificate style={{ color: 'var(--header-bg)' }} />
                Buyer Profile Intel
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div className="buyer-avatar-circle">
                {inq.buyerName.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="font-bold text-heading" style={{ fontSize: '12px' }}>{inq.company}</span>
                <span style={{ fontSize: '10px', color: 'var(--text-gray)' }}>Contact: {inq.buyerName}</span>
              </div>
            </div>

            <div className="buyer-stats-box">
              <div className="buyer-stat-row">
                <label><FaGlobe /> Sourcing Region</label>
                <span>{inq.buyerDetails.country} ({inq.buyerDetails.countryCode})</span>
              </div>
              <div className="buyer-stat-row">
                <label><FaBuilding /> Industry Segment</label>
                <span>{inq.buyerDetails.industry}</span>
              </div>
              <div className="buyer-stat-row">
                <label><FaCalendarAlt /> Portal Member</label>
                <span>Since {inq.buyerDetails.memberSince}</span>
              </div>
              <div className="buyer-stat-row">
                <label>Buyer Response Rate</label>
                <span style={{ color: 'var(--text-success)' }}>{inq.buyerDetails.responseRate}</span>
              </div>
              <div className="buyer-stat-row">
                <label>Active Sourcing RFQs</label>
                <span>{inq.buyerDetails.activeRfqsCount} leads</span>
              </div>
              <div className="buyer-stat-row">
                <label>Transacted Sourcing Vol</label>
                <span>{inq.buyerDetails.totalTransacted}</span>
              </div>
            </div>

            <div className="verified-seal">
              <FaShieldAlt /> Gold Tier Verified Buyer
            </div>

            <div className="audited-box">
              <div className="audited-header">
                <FaCertificate /> Sourced Verification Check
              </div>
              <p style={{ margin: 0, color: 'var(--text-dark)' }}>{inq.buyerDetails.audited}</p>
              <div style={{ color: 'var(--text-gray)', fontSize: '9px', marginTop: '4px' }}>
                Business license and address audits completed by independent inspection agencies.
              </div>
            </div>
          </div>

          {/* Card 2: Original Specifications */}
          <div className="reply-card">
            <div className="card-title-bar">
              <h3>
                <FaBoxes style={{ color: 'var(--primary-red)' }} />
                Requested Specs & Terms
              </h3>
            </div>

            <div className="specs-checklist">
              <div className="spec-check-item">
                <label>Product Sourced</label>
                <span>{inq.product}</span>
              </div>
              <div className="spec-check-item">
                <label>Required Quantity</label>
                <span style={{ color: 'var(--text-heading)', fontWeight: 700 }}>{inq.quantity.toLocaleString()} units</span>
              </div>
              <div className="spec-check-item">
                <label>Client Target Budget</label>
                <span style={{ color: '', fontWeight: 700 }}>${inq.budget.toLocaleString(undefined, {minimumFractionDigits: 2})} USD</span>
              </div>
              <div className="spec-check-item">
                <label>Sourcing Type</label>
                <span>{inq.requirements.sourcingType}</span>
              </div>
              <div className="spec-check-item">
                <label>Destination Harbor</label>
                <span>{inq.requirements.destination}</span>
              </div>
              <div className="spec-check-item">
                <label>Requested Incoterms</label>
                <span>{inq.requirements.shippingTerms}</span>
              </div>
              <div className="spec-check-item">
                <label>Client Payment Terms</label>
                <span style={{ fontSize: '10px', textAlign: 'right' }}>{inq.requirements.paymentTerms}</span>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <div className="templates-title" style={{ marginBottom: '8px' }}>Buyer Inquiry Text</div>
              <div className="buyer-msg-card">{inq.message}</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
