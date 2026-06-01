import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
  FaImage,
  FaDownload,
} from 'react-icons/fa'
import '../../styles/view_rfq.css'
import { ROUTES } from '../../shared/constants'
import { getRfqById } from './rfqDetailData'

const ViewRFQ = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const rfqId = id ?? 'RFQ2001'

  const rfq = useMemo(() => getRfqById(rfqId), [rfqId])

  const [declined, setDeclined] = useState(false)
  const [toast, setToast] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text })
    window.setTimeout(() => setToast(null), 4000)
  }

  const replyPath = ROUTES.REPLY_RFQ.replace(':id', rfqId)

  const goToReply = () => {
    if (declined) {
      showToast('error', 'This RFQ was declined. Re-open from the list to quote again.')
      return
    }
    navigate(replyPath)
  }

  const handleDecline = () => {
    if (declined) return
    const ok = window.confirm(
      'Decline this RFQ? You will not be able to submit a quotation unless you revisit it from the list.'
    )
    if (ok) {
      setDeclined(true)
      showToast('success', 'RFQ declined. Buyer will be notified.')
    }
  }

  const handleMessageBuyer = () => {
    navigate(ROUTES.MESSAGE)
    showToast('success', 'Opening messages — start a chat with the buyer.')
  }

  const handleViewProfile = () => {
    navigate(ROUTES.MESSAGE)
    showToast('success', `Opening conversation context for ${rfq?.buyer.company ?? 'buyer'}.`)
  }

  const handleDownloadAttachment = (fileName: string) => {
    showToast('success', `Downloading ${fileName}…`)
  }

  if (!rfq) {
    return (
      <div className="rfq-view-container">
        <div className="rfq-not-found">
          <h2>RFQ not found</h2>
          <p>No request exists for ID {rfqId}.</p>
          <Link to={ROUTES.RFQ} className="rfq-btn-primary">
            <FaArrowLeft /> Back to RFQs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="rfq-view-container">
      {toast && (
        <div
          className={`rfq-toast rfq-toast--${toast.type}`}
          role="status"
        >
          <FaCheckCircle /> {toast.text}
        </div>
      )}

      <div className="rfq-actions-bar">
        <Link to={ROUTES.RFQ} className="rfq-back-link">
          <FaArrowLeft /> Back to RFQs
        </Link>
        <div className="rfq-action-buttons">
          <button
            type="button"
            className="rfq-btn-outline rfq-btn-decline"
            onClick={handleDecline}
            disabled={declined}
          >
            <FaTimes /> {declined ? 'Declined' : 'Decline'}
          </button>
          <button
            type="button"
            className="rfq-btn-outline"
            onClick={handleMessageBuyer}
          >
            <FaEnvelope /> Message Buyer
          </button>
          <button
            type="button"
            className="rfq-btn-primary"
            onClick={goToReply}
            disabled={declined}
          >
            <FaPaperPlane /> Submit Quote
          </button>
        </div>
      </div>

      {declined && (
        <div className="rfq-declined-banner" role="alert">
          You declined this RFQ. Submit Quote is disabled.
        </div>
      )}

      <div className="rfq-main-content">
        <div className="rfq-document">
          <div className="rfq-header">
            <div className="rfq-title-group">
              <h1>{rfq.title}</h1>
              <div className="rfq-meta">
                <span className="rfq-meta-item">
                  <FaCalendarAlt /> Posted: {rfq.datePosted}
                </span>
                <span className="rfq-meta-item">ID: {rfq.id}</span>
                <span className="rfq-meta-item">Category: {rfq.category}</span>
                <span className="rfq-meta-item">Status: {rfq.status}</span>
              </div>
            </div>
            <div className="rfq-urgency">
              <span className="rfq-urgency-label">Time Remaining</span>
              <span className="rfq-urgency-time">
                <FaClock /> {rfq.timeLeft}
              </span>
            </div>
          </div>

          <div className="rfq-section">
            <h2 className="rfq-section-title">Detailed Description</h2>
            <div className="rfq-description">{rfq.description}</div>
          </div>

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
                <span className="rfq-req-value">
                  {rfq.requirements.shippingTerms} — {rfq.requirements.destination}
                </span>
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

          <div className="rfq-section rfq-section--last">
            <h2 className="rfq-section-title">
              Attachments ({rfq.attachments.length})
            </h2>
            <div className="rfq-attachments">
              {rfq.attachments.map((doc) => (
                <button
                  key={doc.name}
                  type="button"
                  className="rfq-attachment-card rfq-attachment-card--btn"
                  onClick={() => handleDownloadAttachment(doc.name)}
                >
                  <div className="rfq-attachment-icon">
                    {doc.type === 'pdf' ? <FaFilePdf /> : <FaImage />}
                  </div>
                  <div className="rfq-attachment-info">
                    <span className="rfq-attachment-name">{doc.name}</span>
                    <span className="rfq-attachment-size">{doc.size}</span>
                  </div>
                  <FaDownload className="rfq-attachment-dl" aria-hidden />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rfq-sidebar">
          <div className="rfq-quote-card">
            <h3>Can you fulfill this request?</h3>
            <p>
              Submit a competitive quotation to win this B2B contract. Early quotes
              have a higher chance of selection.
            </p>
            <button
              type="button"
              className="btn-quote-submit"
              onClick={goToReply}
              disabled={declined}
            >
              <FaPaperPlane /> Quote Now
            </button>
          </div>

          <div className="rfq-buyer-card">
            <div className="rfq-buyer-header">
              <div className="rfq-buyer-avatar">
                {rfq.buyer.company.charAt(0)}
              </div>
              <div className="rfq-buyer-info">
                <h3>{rfq.buyer.company}</h3>
                <p>
                  <FaGlobe /> {rfq.buyer.country}
                </p>
              </div>
            </div>

            <div className="rfq-buyer-stats">
              <div className="rfq-buyer-stat-row">
                <span className="label">
                  <FaBuilding /> Industry
                </span>
                <span className="value">{rfq.buyer.industry}</span>
              </div>
              <div className="rfq-buyer-stat-row">
                <span className="label">
                  <FaCalendarAlt /> Member Since
                </span>
                <span className="value">{rfq.buyer.memberSince}</span>
              </div>
              <div className="rfq-buyer-stat-row">
                <span className="label">
                  <FaCheckCircle /> Total Orders on Platform
                </span>
                <span className="value">{rfq.buyer.totalOrders}</span>
              </div>
            </div>

            {rfq.buyer.verified && (
              <div className="rfq-verified-badge">
                <FaCheckCircle /> Verified Business Buyer
              </div>
            )}

            <button
              type="button"
              className="rfq-btn-outline rfq-btn-full"
              onClick={handleViewProfile}
            >
              View Full Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewRFQ
export { ViewRFQ }
