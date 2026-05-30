import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaEnvelope,  FaTimes, 
  FaGlobe, FaBuilding, FaCalendarAlt, FaClock, FaBoxes, 
  FaShieldAlt, FaPaperPlane, FaUpload, FaTrashAlt, FaCheckCircle, 
  FaFilePdf, FaCertificate, FaExclamationCircle
} from 'react-icons/fa';
import dummyRFQs from '../../core/storage/DummyRFQs.json';
import '../../styles/reply_rfq.css';
import { ROUTES } from '../../shared/constants';

// Types
interface AttachmentFile {
  id: string;
  name: string;
  size: string;
  date: string;
}

export const ReplyRFQ = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const rfqId = id || 'RFQ2001';

  // Fetch / Generate RFQ Data
  const getRFQDetails = () => {
    const basicRfq = dummyRFQs.find((r: any) => r.id === rfqId);

    const dateVal = basicRfq ? basicRfq.date : '10/15/2024';
    const buyerName = basicRfq ? basicRfq.buyer : 'Acme Corp';
    const categoryVal = basicRfq ? basicRfq.category : 'Electronics';
    const quantityVal = basicRfq ? basicRfq.quantity : 500;
    const initialStatus = basicRfq ? basicRfq.status : 'Open';

    let budgetVal = 5000.00;
    if (basicRfq) {
      budgetVal = parseFloat(basicRfq.budget.replace('$', '').replace(',', ''));
    }

    const parsedUnitPrice = parseFloat((budgetVal / quantityVal).toFixed(2)) || 10.00;
    const numericId = parseInt(rfqId.replace('RFQ', '')) || 2001;

    const detailedDescription = `Dear Supplier,

We are seeking competitive quotations for "${categoryVal}" products in bulk. Our company requires ${quantityVal.toLocaleString()} units for our upcoming procurement cycle.

Key Requirements:
- Product Category: ${categoryVal}
- Quantity: ${quantityVal.toLocaleString()} units
- Target Budget: $${budgetVal.toLocaleString()} USD
- Delivery: Within 30-45 days after order confirmation
- Quality Standards: ISO 9001 / CE certified products preferred

Please provide your best pricing, lead times, and any minimum order quantity (MOQ) requirements.

Best regards,
Procurement Team, ${buyerName}`;

    return {
      id: rfqId,
      date: dateVal,
      buyer: buyerName,
      category: categoryVal,
      quantity: quantityVal,
      budget: budgetVal,
      unitPrice: parsedUnitPrice,
      status: initialStatus,
      description: detailedDescription,
      deadline: 'Nov 10, 2024',
      timeLeft: `${16 + (numericId % 10)} Days, ${(numericId % 23) + 1} Hours`,
      buyerDetails: {
        country: numericId % 2 === 0 ? 'United States' : 'Germany',
        countryCode: numericId % 2 === 0 ? 'US' : 'DE',
        industry: numericId % 3 === 0 ? 'Automotive Manufacturing' : numericId % 3 === 1 ? 'Import & Wholesale Distribution' : 'IT & Electronics',
        memberSince: String(2018 + (numericId % 5)),
        responseRate: `${90 + (numericId % 9)}%`,
        totalOrders: 42 + (numericId % 100),
        trustScore: numericId % 3 === 0 ? 'AAA (Outstanding)' : 'AA+ (Excellent)',
        totalTransacted: numericId % 2 === 0 ? '$520,000+' : '$210,000+',
        verified: true
      },
      requirements: {
        sourcingType: numericId % 2 === 0 ? 'Custom Manufacturing' : 'Standard Catalog',
        destination: numericId % 2 === 0 ? 'Port of Long Beach, USA' : 'Port of Hamburg, Germany',
        shippingTerms: numericId % 2 === 0 ? 'CIF' : 'FOB',
        paymentTerms: 'T/T 30% deposit, 70% balance before shipment',
        timeline: '45 Days after receipt of deposit'
      }
    };
  };

  const rfq = getRFQDetails();

  // Tab State
  const [activeTab, setActiveTab] = useState<'quotation' | 'message' | 'attachments'>('message');

  // Quotation form state (used in template strings)
  const quotedQty = rfq.quantity.toString();
  const leadTimeDays = '30';

  // Email state
  const [subjectLine, setSubjectLine] = useState(`[Quotation] ${rfq.category} Supply - Ref: ${rfq.id}`);
  const [emailText, setEmailText] = useState('');

  // Attachments State
  const [attachments, setAttachments] = useState<AttachmentFile[]>([
    {
      id: '1',
      name: 'PRODUCT_CATALOG_2024.pdf',
      size: '3.2 MB',
      date: rfq.date
    }
  ]);

  // Toast State
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const triggerToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  // Quick response templates
  const handleApplyTemplate = (type: 'competitive' | 'catalog' | 'sample') => {
    let msg = '';
    if (type === 'competitive') {
      msg = `Dear ${rfq.buyer},

Thank you for your RFQ regarding "${rfq.category}" products. We are pleased to submit our competitive quotation for your consideration.

We have been manufacturing and exporting ${rfq.category} items for over 10 years, maintaining full ISO 9001, CE, and SGS certifications. Our production capacity can comfortably handle your requirement of ${parseInt(quotedQty).toLocaleString()} units.

Key Highlights of Our Offer:
1. Competitive FOB unit pricing with volume-based discounts
2. Production lead time: ${leadTimeDays} calendar days from deposit confirmation
3. Full quality inspection reports (AQL 2.5) provided before shipment
4. Free pre-production samples available

Please review the attached Proforma Invoice for detailed pricing. We look forward to establishing a long-term business relationship.

Best regards,
Sales Department`;
    } else if (type === 'catalog') {
      msg = `Dear ${rfq.buyer},

Thank you for your interest in our ${rfq.category} product range. Please find attached our complete e-catalog with full specifications, certifications, and pricing tiers.

Our Minimum Order Quantity (MOQ) starts at 100 units for standard products and 500 units for custom-branded items. We offer the following customization options:
- Custom logo printing / laser etching
- Custom packaging and labeling
- OEM specifications per your engineering drawings

We can ship samples to ${rfq.buyerDetails.country} via DHL/FedEx within 3-5 business days for your physical inspection.

Best regards,
Sales Department`;
    } else if (type === 'sample') {
      msg = `Dear ${rfq.buyer},

We would be happy to provide product samples for your evaluation before you proceed with a bulk order.

Sample Options:
- Standard Catalog Sample: Free of charge. Buyer covers express shipping ($40 USD via DHL).
- Custom Sample with Logo: $75 USD per unit (refundable upon bulk order ≥ 1,000 units).
- Full Technical Sample Pack: Includes test reports, material certificates, and 3 product variants — $150 USD.

Please confirm your preferred sample type along with your shipping address, and we will dispatch within 48 hours.

Best regards,
Sales Department`;
    }
    setEmailText(msg);
    triggerToast('success', 'Email template applied successfully!');
  };

  // Submit email
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailText.trim()) {
      triggerToast('error', 'Message body cannot be empty.');
      return;
    }
    triggerToast('success', `Response dispatched to ${rfq.buyer}!`);
    setEmailText('');
    setTimeout(() => navigate('/supplier-dashboard/rfq'), 2000);
  };

  // File upload
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

  // PI preview calculations removed — only used in commented quotation tab

  return (
    <div className="reply-rfq-container">
      
      {/* ── Toast Notifications ── */}
      {toast && (
        <div className={`rfq-toast ${toast.type}`}>
          {toast.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* ── Action bar ── */}
      <div className="rfq-reply-action-bar">
        <Link to={ROUTES.RFQ} className="rfq-reply-back-link">
          <FaArrowLeft /> Back to RFQs
        </Link>
        <div className="rfq-reply-action-btns">
          <button 
            className="rfq-btn-decline"
            onClick={() => {
              if (window.confirm('Are you sure you want to decline this RFQ?')) {
                triggerToast('success', 'RFQ declined. Buyer has been notified.');
                setTimeout(() => navigate('/supplier-dashboard/rfq'), 1500);
              }
            }}
          >
            <FaTimes /> Decline RFQ
          </button>
        </div>
      </div>

      {/* ── Main content layout ── */}
      <div className="rfq-reply-content-grid">
        
        {/* Workspace Column (Left) */}
        <div className="rfq-workspace-column">
          <div className="rfq-reply-card">
            
            {/* Tabs Header */}
            <div className="rfq-workspace-tabs">
              {/* <button 
                className={`rfq-tab-btn ${activeTab === 'quotation' ? 'active' : ''}`}
                onClick={() => setActiveTab('quotation')}
              >
                <FaFileInvoice /> Draft Proforma Invoice (PI)
              </button> */}
              <button 
                className={`rfq-tab-btn ${activeTab === 'message' ? 'active' : ''}`}
                onClick={() => setActiveTab('message')}
              >
                <FaEnvelope /> Write Email Response
              </button>
              <button 
                className={`rfq-tab-btn ${activeTab === 'attachments' ? 'active' : ''}`}
                onClick={() => setActiveTab('attachments')}
              >
                <FaUpload /> Attach Documents
              </button>
            </div>

            {/* Tab 1: Quotation Builder */}
            {/* {activeTab === 'quotation' && (
              <form onSubmit={handleSendQuotation} className="rfq-quote-form">
                <div className="rfq-form-row">
                  <div className="rfq-form-group">
                    <label>Quoted Unit Price (USD)</label>
                    <input 
                      type="number" 
                      className="rfq-form-control"
                      step="0.01"
                      value={quotedUnitPrice}
                      onChange={e => setQuotedUnitPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="rfq-form-group">
                    <label>Quoted Quantity (Units)</label>
                    <input 
                      type="number" 
                      className="rfq-form-control"
                      value={quotedQty}
                      onChange={e => setQuotedQty(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="rfq-form-row">
                  <div className="rfq-form-group">
                    <label>Freight / Logistics Cost (USD)</label>
                    <input 
                      type="number" 
                      className="rfq-form-control"
                      step="0.01"
                      value={freightCost}
                      onChange={e => setFreightCost(e.target.value)}
                      required
                    />
                  </div>
                  <div className="rfq-form-group">
                    <label>Lead Time (Calendar Days)</label>
                    <input 
                      type="number" 
                      className="rfq-form-control"
                      value={leadTimeDays}
                      onChange={e => setLeadTimeDays(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="rfq-form-row">
                  <div className="rfq-form-group">
                    <label>Payment Terms</label>
                    <input 
                      type="text" 
                      className="rfq-form-control"
                      value={paymentTerms}
                      onChange={e => setPaymentTerms(e.target.value)}
                      required
                    />
                  </div>
                  <div className="rfq-form-group">
                    <label>Quote Validity (Days)</label>
                    <input 
                      type="number" 
                      className="rfq-form-control"
                      value={validityDays}
                      onChange={e => setValidityDays(e.target.value)}
                      required
                    />
                  </div>
                </div> */}

                {/* Live PI Preview */}
                {/* <div className="rfq-quote-preview">
                  <div className="rfq-quote-preview-title">Live Proforma Invoice Preview</div>
                  <div className="rfq-invoice-sheet">
                    <div className="rfq-invoice-header-row">
                      <span className="rfq-invoice-logo">YOUR COMPANY</span>
                      <span className="rfq-invoice-type">Proforma Invoice</span>
                    </div>
                    <div className="rfq-invoice-meta">
                      <div className="rfq-invoice-meta-row">
                        <span>RFQ Ref: {rfq.id}</span>
                        <span>Date: {new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="rfq-invoice-meta-row">
                        <span>Buyer: {rfq.buyer}</span>
                        <span>Validity: {validityDays} Days</span>
                      </div>
                    </div>
                    <table className="rfq-invoice-table">
                      <thead>
                        <tr>
                          <th>Product / Category</th>
                          <th>Qty</th>
                          <th className="right">Unit Price</th>
                          <th className="right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{rfq.category} — Custom Supply</td>
                          <td>{parseInt(quotedQty).toLocaleString()}</td>
                          <td className="right">${parsedUnitPrice.toFixed(2)}</td>
                          <td className="right">${itemsSubtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="rfq-invoice-calculations">
                      <div className="rfq-invoice-calc-row">
                        <span>Items Subtotal:</span>
                        <span>${itemsSubtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                      </div>
                      <div className="rfq-invoice-calc-row">
                        <span>Freight ({rfq.requirements.shippingTerms}):</span>
                        <span>${parsedFreight.toFixed(2)}</span>
                      </div>
                      <div className="rfq-invoice-calc-row">
                        <span>V.A.T (5%):</span>
                        <span>${customsTax.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                      </div>
                      <div className="rfq-invoice-calc-row grand-total">
                        <span>Grand Total (USD):</span>
                        <span>${grandContractTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', gap: '12px' }}>
                  <button type="submit" className="rfq-btn-primary">
                    <FaPaperPlane /> Submit Quotation
                  </button>
                </div>
              </form>
            )} */}

            {/* Tab 2: Email Editor */}
            {activeTab === 'message' && (
              <form onSubmit={handleSendEmail} className="rfq-editor-group">
                <div className="rfq-templates-section">
                  <div className="rfq-templates-title">Quick Response Templates</div>
                  <div className="rfq-template-chips">
                    <button type="button" className="rfq-template-chip" onClick={() => handleApplyTemplate('competitive')}>
                      Competitive Quote Response
                    </button>
                    <button type="button" className="rfq-template-chip" onClick={() => handleApplyTemplate('catalog')}>
                      Share E-Catalog & MOQ Details
                    </button>
                    <button type="button" className="rfq-template-chip" onClick={() => handleApplyTemplate('sample')}>
                      Sample Dispatch Agreement
                    </button>
                  </div>
                </div>

                <div className="rfq-form-group">
                  <label>Email Subject</label>
                  <input 
                    type="text" 
                    className="rfq-subject-input"
                    value={subjectLine}
                    onChange={e => setSubjectLine(e.target.value)}
                    required
                  />
                </div>

                <div className="rfq-form-group">
                  <label>Message Content</label>
                  <textarea 
                    className="rfq-message-textarea"
                    placeholder={`Write a professional response to ${rfq.buyer}...`}
                    value={emailText}
                    onChange={e => setEmailText(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button type="submit" className="rfq-btn-primary">
                    <FaPaperPlane /> Dispatch Email Response
                  </button>
                </div>
              </form>
            )}

            {/* Tab 3: Attachments */}
            {activeTab === 'attachments' && (
              <div className="rfq-attachments-zone">
                <div className="rfq-dropzone-container" onClick={triggerFileUpload}>
                  <FaUpload />
                  <div className="rfq-dropzone-title">Upload RFQ Response Attachments</div>
                  <div className="rfq-dropzone-sub">Attach catalogs, technical specifications, or compliance certificates (PDF, PNG up to 10MB)</div>
                </div>

                <div className="rfq-attached-files-list">
                  <span className="text-xs font-bold text-heading uppercase">Files Attached ({attachments.length})</span>
                  {attachments.map(file => (
                    <div key={file.id} className="rfq-file-item">
                      <div className="rfq-file-info">
                        <FaFilePdf className="rfq-file-icon" />
                        <div className="rfq-file-details">
                          <span className="rfq-file-name">{file.name}</span>
                          <span className="rfq-file-size">{file.size} • Attached {file.date}</span>
                        </div>
                      </div>
                      <button 
                        className="rfq-file-delete-btn" 
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
        <div className="rfq-context-column">
          
          {/* Card 1: Buyer Intel */}
          <div className="rfq-reply-card">
            <div className="rfq-card-title-bar">
              <h3>
                <FaCertificate style={{ color: 'var(--primary-red)' }} />
                Buyer Profile Intel
              </h3>
              <span className={`rfq-status-badge ${rfq.status.toLowerCase()}`}>{rfq.status}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div className="rfq-buyer-avatar-circle">
                {rfq.buyer.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="font-bold text-heading" style={{ fontSize: '12px' }}>{rfq.buyer}</span>
                <span style={{ fontSize: '10px', color: 'var(--text-gray)' }}>{rfq.buyerDetails.industry}</span>
              </div>
            </div>

            <div className="rfq-buyer-stats-box">
              <div className="rfq-buyer-stat-row">
                <label><FaGlobe /> Sourcing Region</label>
                <span>{rfq.buyerDetails.country} ({rfq.buyerDetails.countryCode})</span>
              </div>
              <div className="rfq-buyer-stat-row">
                <label><FaBuilding /> Industry</label>
                <span>{rfq.buyerDetails.industry}</span>
              </div>
              <div className="rfq-buyer-stat-row">
                <label><FaCalendarAlt /> Member Since</label>
                <span>{rfq.buyerDetails.memberSince}</span>
              </div>
              <div className="rfq-buyer-stat-row">
                <label>Response Rate</label>
                <span style={{ color: 'var(--text-success)' }}>{rfq.buyerDetails.responseRate}</span>
              </div>
              <div className="rfq-buyer-stat-row">
                <label>Total Platform Orders</label>
                <span>{rfq.buyerDetails.totalOrders}</span>
              </div>
              <div className="rfq-buyer-stat-row">
                <label>Trust Score</label>
                <span>{rfq.buyerDetails.trustScore}</span>
              </div>
              <div className="rfq-buyer-stat-row">
                <label>Transacted Volume</label>
                <span>{rfq.buyerDetails.totalTransacted}</span>
              </div>
            </div>

            {rfq.buyerDetails.verified && (
              <div className="rfq-verified-seal">
                <FaShieldAlt /> Verified Business Buyer
              </div>
            )}
          </div>

          {/* Card 2: RFQ Specifications */}
          <div className="rfq-reply-card">
            <div className="rfq-card-title-bar">
              <h3>
                <FaBoxes style={{ color: 'var(--primary-red)' }} />
                RFQ Specifications & Terms
              </h3>
            </div>

            {/* Urgency */}
            <div className="rfq-urgency-box" style={{ marginBottom: '16px' }}>
              <span className="rfq-urgency-label">Quotation Deadline</span>
              <span className="rfq-urgency-time"><FaClock /> {rfq.timeLeft}</span>
            </div>

            <div className="rfq-specs-checklist">
              <div className="rfq-spec-check-item">
                <label>Product Category</label>
                <span>{rfq.category}</span>
              </div>
              <div className="rfq-spec-check-item">
                <label>Required Quantity</label>
                <span style={{ color: 'var(--text-heading)', fontWeight: 700 }}>{rfq.quantity.toLocaleString()} units</span>
              </div>
              <div className="rfq-spec-check-item">
                <label>Buyer Target Budget</label>
                <span style={{ color: 'var(--primary-red)', fontWeight: 700 }}>${rfq.budget.toLocaleString(undefined, {minimumFractionDigits: 2})} USD</span>
              </div>
              <div className="rfq-spec-check-item">
                <label>Sourcing Type</label>
                <span>{rfq.requirements.sourcingType}</span>
              </div>
              <div className="rfq-spec-check-item">
                <label>Destination</label>
                <span>{rfq.requirements.destination}</span>
              </div>
              <div className="rfq-spec-check-item">
                <label>Shipping Terms</label>
                <span>{rfq.requirements.shippingTerms}</span>
              </div>
              <div className="rfq-spec-check-item">
                <label>Payment Terms</label>
                <span style={{ fontSize: '10px', textAlign: 'right' }}>{rfq.requirements.paymentTerms}</span>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <div className="rfq-templates-title" style={{ marginBottom: '8px' }}>Buyer's RFQ Description</div>
              <div className="rfq-buyer-msg-card">{rfq.description}</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ReplyRFQ;
