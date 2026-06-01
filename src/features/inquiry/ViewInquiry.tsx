import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
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
  FaImage,
  FaPlus,
  FaExternalLinkAlt,
  FaCertificate,
  FaBoxes,
} from 'react-icons/fa'
import '../../styles/view_inquiry.css'
import { ROUTES } from '../../shared/constants'

// ── Dynamic B2B Sourcing Inquiry Generator ───────────────────────────────────
const getDetailedInquiry = (id: string) => {
  const numericId = parseInt(id.replace('INQ', '')) || 5001;
  const index = numericId - 5000;

  const statuses = ['New', 'Replied', 'Negotiation', 'Confirmed', 'Closed']
  const priorities = ['High', 'Medium', 'Low']
  const buyers = [
    { name: 'John Doe', company: 'Global Trade Corp', country: 'United States', code: 'US', trust: 'AA+ (Excellent)', transacted: '$420,000+', logo: 'G' },
    { name: 'Alice Smith', company: 'BuildRight Ltd', country: 'United Kingdom', code: 'GB', trust: 'AAA (Outstanding)', transacted: '$890,000+', logo: 'B' },
    { name: 'Robert Brown', company: 'Euro Electronics', country: 'Germany', code: 'DE', trust: 'A+ (Very Good)', transacted: '$150,000+', logo: 'E' },
    { name: 'Sarah Wilson', company: 'Logistics Pro', country: 'Canada', code: 'CA', trust: 'AA (Excellent)', transacted: '$310,000+', logo: 'L' },
    { name: 'David Chen', company: 'Asia Import Co', country: 'Singapore', code: 'SG', trust: 'AAA (Outstanding)', transacted: '$1,200,000+', logo: 'A' },
    { name: 'Maria Garcia', company: 'LatAm Supplies', country: 'Brazil', code: 'BR', trust: 'A (Good)', transacted: '$95,000+', logo: 'L' },
    { name: 'James Taylor', company: 'UK Wholesale Ltd', country: 'United Kingdom', code: 'GB', trust: 'AA+ (Excellent)', transacted: '$640,000+', logo: 'U' },
  ]
  const products = [
    'Industrial Safety Gloves', 'Heavy Duty Steel Pipe', 'LED High Bay Light',
    'Standard Pallets', 'Office Furniture Set', 'Wireless Keyboard Pack',
    'Conference Microphone', 'Premium Bond Paper', 'Safety Hard Hat',
  ]

  const buyer = buyers[index % buyers.length];
  const productName = products[index % products.length];
  const priority = priorities[index % priorities.length];
  const status = statuses[index % statuses.length];

  // Generate random stable details based on index
  const rawQty = ((index * 7) % 5) * 1000 + 500;
  const rawPrice = ((index * 3) % 7) * 4.5 + 1.25;
  const date = new Date(2026, (index * 5) % 12, (index % 28) + 1).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const platform = index % 3 === 0 ? 'alibaba' : index % 3 === 1 ? 'madeinchina' : 'unified';

  const lastMessages = [
    'Looking for a quote for bulk order.',
    'Can you offer a discount for 500+ units?',
    'Need samples before placing order.',
    'Please share updated price list.',
    'Interested in long-term supply contract.',
    'Payment has been initiated.',
    'Received the shipment, thanks.',
  ]
  const shortMsg = lastMessages[index % lastMessages.length];

  const detailedMessage = `Dear Sales Team,

We are writing to express our high interest in sourcing high-quality "${productName}" from your factory. Our company, ${buyer.company}, specializes in wholesale distribution across ${buyer.country} and neighboring territories.

We have a requirement from one of our major clients for approximately ${rawQty.toLocaleString()} units of "${productName}". 

Please review our specific sourcing requirements:
- Required Quantity: ${rawQty.toLocaleString()} units
- Target Specifications: Compliant with industry standards, custom color/branding option
- Shipping Destination: Main port of ${buyer.country}
- Target Shipping Terms: FOB Preferred
- Expected Delivery: Within 45 days of deposit

Could you please provide:
1. Best wholesale unit cost for ${rawQty.toLocaleString()} units.
2. Minimum order quantity (MOQ) and customization charge.
3. Cost and lead time for a pre-production custom sample.
4. Copy of compliance certificate or test report (such as ISO, CE, RoHS or SGS audit reports).

We hope to start with a sample, scale to a trial order, and establish a long-term trading partnership.

Best regards,
${buyer.name}
${buyer.company}`;

  return {
    id,
    date,
    status,
    priority,
    platform,
    product: {
      name: productName,
      sku: `PROD-${3000 + index}`,
      productId: ((index - 1) % 10) + 1,
      category: 'Industrial Supplies & Logistics',
      unit: index % 2 === 0 ? 'Units' : 'Sets',
    },
    buyer: {
      name: buyer.name,
      company: buyer.company,
      country: buyer.country,
      countryCode: buyer.code,
      industry: 'Import & Wholesale Distribution',
      verified: true,
      memberSince: `${2017 + (index % 6)}`,
      responseRate: `${93 + (index % 6)}%`,
      activeRfqsCount: (index % 5) + 2,
      trustScore: buyer.trust,
      totalTransacted: buyer.transacted,
      employees: `${50 + (index % 8) * 15}`,
      audited: index % 2 === 0 ? 'Verified by SGS Group' : 'Audited by TÜV Rheinland'
    },
    requirements: {
      quantity: `${rawQty.toLocaleString()} ${index % 2 === 0 ? 'Units' : 'Sets'}`,
      rawQty,
      targetPrice: `$${rawPrice.toFixed(2)} / ${index % 2 === 0 ? 'Unit' : 'Set'}`,
      rawPrice,
      sourcingType: 'Custom Logo Sourcing',
      destination: index % 2 === 0 ? 'Los Angeles Port, USA' : 'London Port, UK',
      shippingTerms: index % 2 === 0 ? 'FOB' : 'CIF',
      paymentTerms: 'T/T 30% deposit, 70% balance before shipment',
      timeline: '45 Days after receipt of deposit',
    },
    message: detailedMessage,
    timeline: [
      {
        id: 1,
        actor: `Buyer (${buyer.name})`,
        role: 'buyer',
        date: `${date} - 10:45 AM`,
        message: `Inquiry sent: "${shortMsg}"`,
      }
    ]
  };
}

const ViewInquiry = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const inquiryId = id || 'INQ5001'

  // Fetch / Generate Inquiry Data
  const [inquiry, setInquiry] = useState<any>(null)
  
  // Skins State: 'unified' | 'alibaba' | 'madeinchina'
  // const [themeSkin, setThemeSkin] = useState<string>('unified')

  // Tabs for interactive reply box
  const [replyTab, setReplyTab] = useState<string>('message') // 'message' | 'quotation' | 'meeting'

  // Text inputs & form state
  const [replyText, setReplyText] = useState<string>('')
  
  // Conversation history
  const [timelineItems, setTimelineItems] = useState<any[]>([])

  // Notifications
  const [alertMsg, setAlertMsg] = useState<{ type: string; text: string } | null>(null)

  useEffect(() => {
    const data = getDetailedInquiry(inquiryId)
    setInquiry(data)
    // setThemeSkin(data.platform)
    setTimelineItems(data.timeline)
  }, [inquiryId])

  if (!inquiry) {
    return (
      <div className="inquiry-view-container inquiry-view-loading">
        Loading inquiry details…
      </div>
    )
  }

  // Calculate totals for Quote Form (used in commented quotation tab)

  const triggerAlert = (type: string, text: string) => {
    setAlertMsg({ type, text })
    setTimeout(() => {
      setAlertMsg(null)
    }, 4000)
  }

  // Handlers
  const handleApplyTemplate = (templateType: string) => {
    let msg = ''
    if (templateType === 'ack') {
      msg = `Dear ${inquiry.buyer.name},

Thank you very much for your inquiry regarding our "${inquiry.product.name}". We appreciate your interest in our products and distribution capabilities.

We have received your request for ${inquiry.requirements.quantity} units and we are currently drafting a formal pricing quote, taking into account the OEM brand customizations you requested.

Could you please share your logo design file (preferably vector format PDF/AI) so that our design team can draft a product mockup for you?

Best regards,
Sales Team`
    } else if (templateType === 'catalog') {
      msg = `Dear ${inquiry.buyer.name},

Please find attached our latest e-catalog for "${inquiry.product.name}" and related items. We have been manufacturing safety equipment for over 10 years, and all products are fully ISO 9001 and CE certified.

We can customize printing on both the products and wholesale packaging containers. Our minimum trial order starts at 500 units.

Please review the catalogs and let me know if you would like me to ship some standard physical samples to your corporate address in ${inquiry.buyer.country}.

Best regards,
Sales Team`
    } else if (templateType === 'sample') {
      msg = `Dear ${inquiry.buyer.name},

We would be pleased to arrange pre-production samples for your quality review.

Our sample policy is as follows:
- Standard samples (no custom logo): FREE of charge. You only cover shipping courier cost ($35 USD via DHL).
- Customized samples (with custom printed cuff logo): $50 USD per sample (fully refundable on your first bulk order of 2,000+ units).

Please reply with:
1. Your preferred sample type (standard or customized).
2. Your detailed shipping address, recipient contact name, and phone number.
3. Your DHL/FedEx courier account if you prefer freight collect.

Best regards,
Sales Team`
    }
    setReplyText(msg)
    triggerAlert('success', 'Email template applied!')
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) {
      triggerAlert('error', 'Reply text cannot be empty!')
      return
    }

    const newItem = {
      id: timelineItems.length + 1,
      actor: 'Supplier (You)',
      role: 'supplier',
      date: new Date().toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      message: replyText
    }

    setTimelineItems([newItem, ...timelineItems])
    setReplyText('')
    triggerAlert('success', 'Message reply sent to buyer!')
  }

  // handleSendQuote removed — used only in commented-out quotation tab

  const handleDecline = () => {
    const confirmation = window.confirm("Are you sure you want to decline this inquiry?")
    if (confirmation) {
      triggerAlert('success', 'Inquiry marked as declined.')
      window.setTimeout(() => navigate(ROUTES.INQUIRIES), 1500)
    }
  }

  return (
    <div className={`inquiry-view-container  platform-red`}>
      
      {/* ── Dynamic Toast Banner ── */}
      {alertMsg && (
        <div
          className="inq-toast animate-fade-in"
          style={{
            backgroundColor: alertMsg.type === 'success' ? '#e8f5e9' : '#fce4ec',
            color: alertMsg.type === 'success' ? '#2e7d32' : '#c62828',
            border: `1px solid ${alertMsg.type === 'success' ? '#a5d6a7' : '#ff8a80'}`
          }}
        >
          <FaCheckCircle /> {alertMsg.text}
        </div>
      )}

      {/* ── Interactive B2B Theme Switcher (Alibaba, Made-In-China, Modern) ── */}
      {/* <div className="theme-selector-bar">
        <div className="selector-title">
          <FaBoxes /> Switch Origin Portal Layout Design:
        </div>
        <div className="theme-options">
          {/* <button 
            className={`theme-btn ${themeSkin === 'unified' ? 'active' : ''}`}
            onClick={() => setThemeSkin('unified')}
          >
            <FaAward /> Modern Unified Premium
          </button> */}
          {/* <button 
            className={`theme-btn ${themeSkin === 'alibaba' ? 'active' : ''}`}
            onClick={() => setThemeSkin('alibaba')}
            style={{ borderColor: themeSkin === 'alibaba' ? '#ff6a00' : '' }}
          >
            <FaExternalLinkAlt /> Alibaba Gold Skin
          </button> */}
          {/* <button 
            className={`theme-btn ${themeSkin === 'madeinchina' ? 'active' : ''}`}
            onClick={() => setThemeSkin('madeinchina')}
            style={{ borderColor: themeSkin === 'madeinchina' ? '#e60012' : '' }}
          >
            <FaCertificate /> Made-in-China Skin
          </button> */}
        {/* </div>
      </div>  */}

      {/* ── Action/Nav Bar ── */}
      <div className="inq-actions-bar">
        <Link to={ROUTES.INQUIRIES} className="inq-back-link">
          <FaArrowLeft /> Back to Inquiry Management
        </Link>
        <div className="inq-action-buttons">
          <button
            type="button"
            onClick={() => navigate(ROUTES.MESSAGE)}
            className="btn-secondary"
          >
            <FaEnvelope /> Message Buyer
          </button>
          <Link
            to={ROUTES.REPLY_INQUIRY.replace(':id', inquiryId)}
            className="btn-brand"
          >
            <FaPlus /> Submit Quote
          </Link>
          <button type="button" onClick={handleDecline} className="btn-secondary" style={{ color: '#e60012' }}>
            <FaTimes /> Decline Sourcing
          </button>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="inq-main-content">
        
        {/* Left Column: Core Sourcing Document */}
        <div className="inq-document">
          
          {/* Header Section */}
          <div className="inq-header">
            <div className="inq-title-group">
              {/* <div className="platform-watermark">
                {themeSkin === 'alibaba' && 'Alibaba B2B Sourcing Network'}
                {themeSkin === 'madeinchina' && 'Made-in-China Audited Buyer Request'}
                {themeSkin === 'unified' && 'Unified Multi-Channel Lead Pipeline'}
              </div> */}
              <h1>Detailed Sourcing Inquiry for {inquiry.product.name}</h1>
              <div className="inq-meta">
                <span className="inq-meta-item"><FaCalendarAlt /> Date Received: {inquiry.date}</span>
                <span className="inq-meta-item">ID: <strong>{inquiry.id}</strong></span>
                <span className="inq-meta-item">
                  Channel: 
                  {/* <span className={`inq-platform-badge ${themeSkin}`}>
                    {themeSkin}
                  </span> */}
                </span>
                <span className="inq-meta-item">
                  Status: 
                  <span 
                    className="status-tag rounded-sm text-xs px-2 py-0.5"
                    style={{
                      backgroundColor: inquiry.status === 'New' ? '#e3f2fd' : '#e8f5e9',
                      color: inquiry.status === 'New' ? '#1976d2' : '#2e7d32'
                    }}
                  >
                    {inquiry.status}
                  </span>
                </span>
              </div>
            </div>
            
            <div className="inq-urgency">
              <span className="inq-urgency-label">Estimated Decision Period</span>
              <span className="inq-urgency-time"><FaClock /> Fast (3-5 Days)</span>
            </div>
          </div>

          {/* Reference Product Card */}
          <div className="inq-section">
            <h2 className="inq-section-title">Product Reference Link</h2>
            <div className="inq-product-card">
              <div className="inq-product-placeholder">
                <FaBoxes />
              </div>
              <div className="inq-product-details">
                <h3>{inquiry.product.name}</h3>
                <p>SKU Reference: <strong>{inquiry.product.sku}</strong> | Category: {inquiry.product.category}</p>
                <p style={{ marginTop: '4px' }}>
                  <Link to={ROUTES.VIEW_PRODUCT.replace(':id', String(inquiry.product.productId))} style={{ color: 'var(--primary-brand)', fontSize: '11px', textDecoration: 'none', fontWeight: 600 }}>
                    View Product Specs Catalog <FaExternalLinkAlt style={{ fontSize: '9px' }} />
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Sourcing specifications */}
          <div className="inq-section">
            <h2 className="inq-section-title">Required Specifications & Terms</h2>
            <div className="inq-req-grid">
              <div className="inq-req-item">
                <span className="inq-req-label">Quantity Needed</span>
                <span className="inq-req-value">{inquiry.requirements.quantity}</span>
              </div>
              <div className="inq-req-item">
                <span className="inq-req-label">Target Unit Budget</span>
                <span className="inq-req-value">{inquiry.requirements.targetPrice}</span>
              </div>
              <div className="inq-req-item">
                <span className="inq-req-label">Sourcing Type</span>
                <span className="inq-req-value">{inquiry.requirements.sourcingType}</span>
              </div>
              <div className="inq-req-item">
                <span className="inq-req-label">Destination Port / Delivery Address</span>
                <span className="inq-req-value">{inquiry.requirements.destination}</span>
              </div>
              <div className="inq-req-item">
                <span className="inq-req-label">Preferred Logistics / Shipping Terms</span>
                <span className="inq-req-value">{inquiry.requirements.shippingTerms} (FOB Destination)</span>
              </div>
              <div className="inq-req-item">
                <span className="inq-req-label">Preferred Payment Method</span>
                <span className="inq-req-value">{inquiry.requirements.paymentTerms}</span>
              </div>
            </div>
          </div>

          {/* Sourcing Message */}
          <div className="inq-section no-border">
            <h2 className="inq-section-title">Buyer Message Body</h2>
            <div className="inq-description">
              {inquiry.message}
            </div>
          </div>

        </div>

        {/* Right Column: Buyer intelligence Sidebar */}
        <div className="inq-sidebar">
          
          {/* Buyer Trust Profile Card */}
          <div className="inq-buyer-card">
            <div className="inq-buyer-header">
              <div className="inq-buyer-avatar">{inquiry.buyer.logo}</div>
              <div className="inq-buyer-info">
                <h3>{inquiry.buyer.company}</h3>
                <p><FaGlobe /> {inquiry.buyer.country} ({inquiry.buyer.countryCode})</p>
              </div>
            </div>
            
            <div className="inq-buyer-stats">
              <div className="inq-buyer-stat-row">
                <span className="label"><FaBuilding /> Primary Industry</span>
                <span className="value">{inquiry.buyer.industry}</span>
              </div>
              <div className="inq-buyer-stat-row">
                <span className="label"><FaCalendarAlt /> Member Since</span>
                <span className="value">{inquiry.buyer.memberSince}</span>
              </div>
              <div className="inq-buyer-stat-row">
                <span className="label"><FaEnvelope /> Response Rate</span>
                <span className="value" style={{ color: '#2e7d32' }}>{inquiry.buyer.responseRate}</span>
              </div>
              <div className="inq-buyer-stat-row">
                <span className="label"><FaPlus /> Active RFQs This Month</span>
                <span className="value">{inquiry.buyer.activeRfqsCount} RFQs</span>
              </div>
              
              {/* Alibaba/Made-in-China specific metrics */}
              {/* <div className="inq-buyer-stat-row" style={{ borderTop: '1px solid #f1f3f5', paddingTop: '10px', marginTop: '4px' }}>
                <span className="label">
                  {themeSkin === 'alibaba' ? 'Alibaba Trust Index' : 'MIC Audit Seal'}
                </span>
                <span className="value" style={{ color: 'var(--primary-brand)' }}>
                  {inquiry.buyer.trustScore}
                </span>
              </div> */}
              <div className="inq-buyer-stat-row">
                <span className="label">Total Sourcing Vol</span>
                <span className="value">{inquiry.buyer.totalTransacted}</span>
              </div>
            </div>

            {/* Platform Badges */}
            <div className="inq-verified-badge">
              <FaCheckCircle /> verified business buyer
            </div>

            <div className="inq-platform-seal">
              <div className="seal-header">
                <FaCertificate /> SGS Verification
              </div>
              <div>{inquiry.buyer.audited}</div>
              <div style={{ color: '#7f8c8d', fontSize: '9px', marginTop: '2px' }}>
                Audit reports checked on-site. Legal entity active, registered capital verified.
              </div>
            </div>
          </div>

          {/* Platform Sourcing Comparison Card */}
          {/* <div className="inq-platform-info-card">
            <h3>B2B Channel Sourcing Tips</h3>
            <div className="platform-feature-list">
              <div className="platform-feature-item">
                <FaAward />
                <div>
                  <strong>Fee Guarantee:</strong> Alibaba orders undergo Trade Assurance with a 2% protection coverage fee.
                </div>
              </div>
              <div className="platform-feature-item">
                <FaCertificate />
                <div>
                  <strong>Audit Status:</strong> Made-in-China buyers are certified through third-party SGS audits. Check report details before issuing CIF credit.
                </div>
              </div>
              <div className="platform-feature-item">
                <FaCreditCard />
                <div>
                  <strong>Payment Routing:</strong> We recommend L/C at sight for large orders above $10,000 to mitigate trade risks.
                </div>
              </div>
            </div>
          </div> */}

        </div>

      </div>

      {/* ── Interactive Reply / Quotation System ── */}
      <div className="reply-portal">
        <div className="reply-tabs">
          <button
            type="button"
            className={`reply-tab-btn ${replyTab === 'message' ? 'active' : ''}`}
            onClick={() => setReplyTab('message')}
          >
            <FaEnvelope /> Write Message / Email Reply
          </button>
        </div>

        <div className="reply-body">
          
          {/* Tab 1: Normal Message Reply */}
          {replyTab === 'message' && (
            <form onSubmit={handleSendMessage} className="animate-fade-in">
              {/* Quick response templates selection */}
              <div className="quick-templates">
                <div className="quick-templates-title">Insert Quick Supplier Response Templates:</div>
                <div className="template-chips">
                  <button type="button" className="template-chip" onClick={() => handleApplyTemplate('ack')}>
                    Acknowledge Sourcing Request
                  </button>
                  <button type="button" className="template-chip" onClick={() => handleApplyTemplate('catalog')}>
                    Share Product E-Catalog
                  </button>
                  <button type="button" className="template-chip" onClick={() => handleApplyTemplate('sample')}>
                    Send Custom Sample Guidelines
                  </button>
                </div>
              </div>

              <div className="textarea-wrapper">
                <textarea 
                  className="reply-textarea"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Write your professional B2B message reply to ${inquiry.buyer.name}...`}
                />
              </div>

              <div className="reply-actions">
                <button type="button" className="attachment-trigger" onClick={() => triggerAlert('success', 'File attached!')}>
                  <FaImage /> Add Catalog PDF or Sample Images
                </button>
                <button type="submit" className="btn-brand">
                  <FaPaperPlane /> Send Reply Message
                </button>
              </div>
            </form>
          )}

          {/* Tab 2: Draft Proforma Invoice (PI) / B2B Quote */}
          {/* {replyTab === 'quotation' && (
            <div className="quote-creator-grid animate-fade-in"> */}
              {/* Left Side: Inputs */}
              {/* <form onSubmit={handleSendQuote} className="quote-inputs-panel">
                <div className="form-group">
                  <label>Quoted Unit Price ($ USD)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="form-input" 
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Quantity ({inquiry.product.unit})</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Logistics & Shipping Cost ($ USD)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={shippingCost}
                    onChange={(e) => setShippingCost(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Estimated Manufacturing Lead Time (Days)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={leadTime}
                    onChange={(e) => setLeadTime(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Terms of Payment</label>
                  <select 
                    className="form-input" 
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="T/T (Bank Transfer)">T/T (Bank Transfer)</option>
                    <option value="L/C at Sight (Letter of Credit)">L/C at Sight</option>
                    <option value="Alibaba Trade Assurance">Alibaba Trade Assurance</option>
                    <option value="Net 30 Account Credit">Net 30 Account Credit</option>
                  </select>
                </div>
                <button type="submit" className="btn-brand" style={{ marginTop: '10px' }}>
                  <FaFileInvoice /> Issue Formal Quotation PI
                </button>
              </form> */}

              {/* Right Side: Beautiful dynamic preview */}
              {/* <div className="quote-preview-panel">
                <h4 style={{ fontSize: '12px', color: 'var(--text-gray)', marginBottom: '10px', textTransform: 'uppercase', fontWeight: 700 }}>
                  Real-time Invoice Sheet Preview:
                </h4> */}
                
                {/* <div className="invoice-preview-card"> */}
                  {/* <div className="invoice-stamp">PI DRAFT</div> */}
                  {/* <div className="invoice-header">
                    <span className="invoice-logo">INVOICE GATEWAY</span>
                    <span className="invoice-title">PROFORMA INVOICE</span>
                  </div> */}

                  {/* <div className="invoice-details-list">
                    <div className="invoice-row">
                      <span style={{ color: 'var(--text-gray)' }}>B2B Client:</span>
                      <strong style={{ color: 'var(--text-heading)' }}>{inquiry.buyer.company}</strong>
                    </div>
                    <div className="invoice-row">
                      <span style={{ color: 'var(--text-gray)' }}>Item SKU:</span>
                      <strong>{inquiry.product.sku}</strong>
                    </div>
                    <div className="invoice-row">
                      <span style={{ color: 'var(--text-gray)' }}>Quantity:</span>
                      <strong>{parsedQty.toLocaleString()} Units</strong>
                    </div>
                    <div className="invoice-row">
                      <span style={{ color: 'var(--text-gray)' }}>Unit Cost:</span>
                      <strong>${parsedPrice.toFixed(2)}</strong>
                    </div>
                    <div className="invoice-row" style={{ borderTop: '1px solid #f1f3f5', paddingTop: '6px', marginTop: '2px' }}>
                      <span>Subtotal:</span>
                      <strong>${subTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                    </div>
                    <div className="invoice-row">
                      <span>Freight & Handling:</span>
                      <strong>${parsedShipping.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                    </div>
                    <div className="invoice-row total-row">
                      <span>GRAND CONTRACT VALUE:</span>
                      <span style={{ color: 'var(--primary-brand)' }}>
                        ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="invoice-row" style={{ borderTop: '1px dashed #eee', paddingTop: '6px', marginTop: '6px', fontSize: '9px', color: '#7f8c8d' }}>
                      <span>Lead Time: {leadTime} Days | Method: {paymentMethod}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )} */}

          {/* Tab 3: Schedule Factory Tour */}
          {/* {replyTab === 'meeting' && (
            <div className="animate-fade-in text-center p-6" style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <FaVideo style={{ fontSize: '48px', color: 'var(--primary-brand)', marginBottom: '16px' }} />
              <h3 style={{ fontSize: 'var(--fs-sm)', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '8px' }}>
                Schedule Live Video Meeting or Virtual Factory Tour
              </h3>
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-gray)', maxWidth: '500px', margin: '0 auto 20px' }}>
                Conduct live product inspections or schedule an audit walkthrough with the buyer via Alibaba Live / WeChat Work / Zoom. Live tours increase checkout confirmation speed by up to 60%!
              </p>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button 
                  type="button" 
                  className="btn-brand" 
                  onClick={() => triggerAlert('success', 'Meeting invite sent for Tomorrow 10:00 AM UTC!')}
                >
                  <FaVideo /> Propose Video Call Tomorrow
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => triggerAlert('success', 'VR Factory tour link shared with buyer!')}
                >
                  <FaGlobe /> Share VR Factory Tour Link
                </button>
              </div>
            </div>
          )} */}

        </div>
      </div>

      {/* ── Reply Log History / Sourcing Timeline ── */}
      <div className="timeline-section">
        <h2 className="timeline-title">
          <FaCalendarAlt /> Transaction History & Message Logs
        </h2>
        <div className="timeline-list">
          {timelineItems.map((log) => (
            <div key={log.id} className={`timeline-item ${log.role}`}>
              <div className="timeline-marker" />
              <div className="timeline-meta">
                <span className="timeline-actor">{log.actor}</span>
                <span>{log.date}</span>
              </div>
              <div className="timeline-message">
                {log.message}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default ViewInquiry
