import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  FaArrowLeft,
  FaDownload,
  FaEnvelope,
  FaShieldAlt,
  FaFilePdf,
  FaCheckCircle,
  FaUndo,
  FaGlobe,
  FaHandshake,
} from 'react-icons/fa'
import { ROUTES } from '../../shared/constants'
import { getPaymentById } from './paymentDetailData'
import '../../styles/view_payment_detail.css'
import './view_payment.css'

const statusClass = (status: string) =>
  status.toLowerCase().replace(/\s+/g, '-')

const ViewPayment = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const payment = getPaymentById(id)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text })
    window.setTimeout(() => setToast(null), 3200)
  }

  // const handleReceipt = () => showToast('success', 'Receipt download started.')
  // const handlePrint = () => window.print()
  const handleContactBuyer = () => {
    showToast('success', 'Opening messages with buyer.')
    navigate(ROUTES.MESSAGE)
  }
  const handleRefund = () => {
    if (window.confirm('Issue a refund for this transaction?')) {
      showToast('success', 'Refund request submitted for review.')
    }
  }
  const handleConfirmReceipt = () => {
    if (window.confirm('Confirm that payment has been received?')) {
      showToast('success', 'Payment marked as received.')
    }
  }
  const handleDocDownload = (name: string) =>
    showToast('success', `Downloading ${name}…`)

  if (!payment) {
    return (
      <div className="payment-detail-container">
        <div className="payment-not-found">
          <h2>Payment not found</h2>
          <p>
            No transaction exists for ID <strong>{id ?? '—'}</strong>. Return to
            the payments list to select a valid record.
          </p>
          <Link to={ROUTES.PAYMENTS} className="payment-btn-primary">
            <FaArrowLeft /> Back to payments
          </Link>
        </div>
      </div>
    )
  }

  const buyerInitials = payment.buyer
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="payment-detail-container">
      {toast && (
        <div className={`payment-toast ${toast.type}`} role="status">
          <FaCheckCircle /> {toast.text}
        </div>
      )}
      <nav className="payment-view-breadcrumb" aria-label="Breadcrumb">
        <Link to={ROUTES.PAYMENTS}>Payments</Link>
        <span className="sep">/</span>
        <span className="current">Transaction {payment.id}</span>
      </nav>

      <div className="payment-trust-strip">
        <span className="payment-trust-pill highlight">
          <FaShieldAlt /> Trade Assurance protected
        </span>
        <span className="payment-trust-pill">
          <FaCheckCircle /> Verified B2B checkout
        </span>
        <span className="payment-trust-pill">
          <FaHandshake /> {payment.incoterms} · {payment.paymentTerms}
        </span>
      </div>

      <div className="payment-actions-bar">
        <Link to={ROUTES.PAYMENTS} className="payment-back-link">
          <FaArrowLeft /> Back to payments
        </Link>
        <div className="payment-action-btns">
          {/* <button type="button" className="payment-btn-outline" onClick={handleReceipt}>
            <FaDownload /> Receipt
          </button>
          <button type="button" className="payment-btn-outline" onClick={handlePrint}>
            <FaPrint /> Print
          </button> */}
          <button type="button" className="payment-btn-outline" onClick={handleContactBuyer}>
            <FaEnvelope /> Contact buyer
          </button>
          {payment.status === 'Completed' && (
            <button type="button" className="payment-btn-outline" onClick={handleRefund}>
              <FaUndo /> Issue refund
            </button>
          )}
          {payment.status === 'Pending' && (
            <button type="button" className="payment-btn-primary" onClick={handleConfirmReceipt}>
              Confirm receipt
            </button>
          )}
        </div>
      </div>

      <section className="payment-summary-banner">
        <div className="payment-banner-content">
          <div className="payment-banner-item">
            <span className="label">Payment ID</span>
            <span className="value">{payment.id}</span>
          </div>
          <div className="payment-banner-item">
            <span className="label">Order reference</span>
            <span className="value">
              <Link
                to={ROUTES.ORDER_DETAILS.replace(':id', payment.orderId)}
              >
                {payment.orderId}
              </Link>
            </span>
          </div>
          <div className="payment-banner-item">
            <span className="label">Amount ({payment.currency})</span>
            <span className="value amount">{payment.total}</span>
          </div>
          <div className="payment-banner-item">
            <span className="label">Status</span>
            <span
              className={`payment-status-badge ${statusClass(payment.status)}`}
            >
              {payment.status}
            </span>
          </div>
        </div>
      </section>

      <div className="payment-content-grid">
        <div className="payment-main-column">
          <article className="payment-card">
            <div className="payment-card-title-bar">
              <h3>Transaction details</h3>
              <span className="payment-status-badge completed">Secure</span>
            </div>
            <div className="payment-info-grid">
              <div className="payment-info-item">
                <label>Transaction date</label>
                <span>{payment.date}</span>
              </div>
              <div className="payment-info-item">
                <label>Payment method</label>
                <span>{payment.method}</span>
              </div>
              <div className="payment-info-item">
                <label>Transaction reference</label>
                <span>{payment.transactionRef}</span>
              </div>
              <div className="payment-info-item">
                <label>Invoice number</label>
                <span>{payment.invoiceNo}</span>
              </div>
              <div className="payment-info-item">
                <label>Incoterms</label>
                <span>{payment.incoterms}</span>
              </div>
              <div className="payment-info-item">
                <label>Payment terms</label>
                <span>{payment.paymentTerms}</span>
              </div>
            </div>
          </article>

          <article className="payment-card">
            <div className="payment-card-title-bar">
              <h3>Order line items</h3>
            </div>
            <div className="payment-line-items-table-wrap">
              <table className="payment-line-items-table">
                <thead>
                  <tr>
                    <th>SKU / Description</th>
                    <th>Qty</th>
                    <th>Unit price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {payment.lineItems.map((row) => (
                    <tr key={row.sku}>
                      <td>
                        <div className="sku">{row.sku}</div>
                        {row.description}
                      </td>
                      <td>{row.qty.toLocaleString()}</td>
                      <td>{row.unitPrice}</td>
                      <td>{row.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="payment-card">
            <div className="payment-card-title-bar">
              <h3>Payment activity</h3>
            </div>
            <div className="payment-timeline">
              {payment.timeline.map((event) => (
                <div
                  key={event.id}
                  className={`payment-timeline-item ${event.state}`}
                >
                  <span className="payment-timeline-title">{event.title}</span>
                  <span className="payment-timeline-date">{event.date}</span>
                  <p className="payment-timeline-desc">{event.description}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="payment-card">
            <div className="payment-card-title-bar">
              <h3>Trade terms & notes</h3>
            </div>
            <div className="payment-terms-box">
              <p>
                <strong>Settlement:</strong> Funds are processed per platform
                trade assurance. Seller payout is released after buyer
                confirmation or per agreed Net terms.
              </p>
              <p style={{ marginTop: 'var(--sp-3)' }}>
                <strong>Dispute window:</strong> 15 business days from shipment
                confirmation. Contact your account manager for L/C or T/T
                discrepancies.
              </p>
            </div>
          </article>
        </div>

        <aside className="payment-side-column">
          <article className="payment-card">
            <div className="payment-card-title-bar">
              <h3>Buyer information</h3>
            </div>
            <div className="payment-buyer-profile">
              <div className="payment-buyer-avatar">{buyerInitials}</div>
              <div className="payment-buyer-basic">
                <span className="payment-buyer-company">{payment.buyer}</span>
                <span className="payment-buyer-contact">
                  {payment.buyerContact}
                </span>
              </div>
            </div>
            <div className="payment-buyer-fields">
              <div className="payment-buyer-field">
                <label>Email</label>
                <span>{payment.buyerEmail}</span>
              </div>
              <div className="payment-buyer-field">
                <label>
                  <FaGlobe /> Country
                </label>
                <span>{payment.buyerCountry}</span>
              </div>
              <div className="payment-buyer-field">
                <label>Member since</label>
                <span>{payment.memberSince}</span>
              </div>
            </div>
            {payment.buyerVerified && (
              <div className="payment-verified-badge">
                <FaCheckCircle /> Verified buyer
              </div>
            )}
          </article>

          <article className="payment-card">
            <div className="payment-card-title-bar">
              <h3>Amount breakdown</h3>
            </div>
            <div className="payment-receipt-breakdown">
              <div className="payment-receipt-row">
                <span>Subtotal</span>
                <span>{payment.subtotal}</span>
              </div>
              <div className="payment-receipt-row">
                <span>Shipping & logistics</span>
                <span>{payment.shippingFee}</span>
              </div>
              <div className="payment-receipt-row">
                <span>Platform service fee</span>
                <span>{payment.platformFee}</span>
              </div>
              <div className="payment-receipt-row">
                <span>Tax / duties (est.)</span>
                <span>{payment.tax}</span>
              </div>
              <div className="payment-receipt-row total">
                <span>Total paid</span>
                <span>{payment.total}</span>
              </div>
            </div>
          </article>

          <article className="payment-card">
            <div className="payment-card-title-bar">
              <h3>Documents</h3>
            </div>
            {payment.documents.map((doc) => (
              <div key={doc.name} className="payment-doc-item">
                <div className="payment-doc-info">
                  <FaFilePdf className="payment-doc-icon" />
                  <div className="payment-doc-details">
                    <span className="payment-doc-name">{doc.name}</span>
                    <span className="payment-doc-size">{doc.size}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="payment-doc-download"
                  aria-label={`Download ${doc.name}`}
                  onClick={() => handleDocDownload(doc.name)}
                >
                  <FaDownload />
                </button>
              </div>
            ))}
          </article>
        </aside>
      </div>
    </div>
  )
}

export default ViewPayment
