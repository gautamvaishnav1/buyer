import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaBuilding, FaFileUpload, FaIdCard, FaGlobe, FaCertificate, FaShieldAlt, FaCheckCircle } from 'react-icons/fa'
import { ROUTES } from '../../shared/constants'
import '../../styles/supplier_profile.css'

const SupplierProfile = () => {
  const navigate = useNavigate()
  const [badgeStatus] = useState<'Approved' | 'Pending' | 'Rejected' | 'Expired'>('Pending')
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text })
    window.setTimeout(() => setToast(null), 3200)
  }

  const handleEdit = (section: string) =>
    showToast('success', `${section} editor will open in a future release.`)

  const handleViewDoc = (name: string) =>
    showToast('success', `Opening preview for ${name}…`)

  const handleUploadCert = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.jpg,.png'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) showToast('success', `"${file.name}" uploaded for review.`)
    }
    input.click()
  }

  const handleVerificationPayment = () => {
    showToast('success', 'Redirecting to secure verification checkout…')
    navigate(ROUTES.PAYMENTS)
  }

  return (
    <div className="supplier-profile">
      {toast && (
        <div
          className="inq-toast animate-fade-in"
          style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            zIndex: 1200,
            backgroundColor: toast.type === 'success' ? '#e8f5e9' : '#fce4ec',
            color: toast.type === 'success' ? '#2e7d32' : '#c62828',
            border: `1px solid ${toast.type === 'success' ? '#a5d6a7' : '#ff8a80'}`,
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
          role="status"
        >
          <FaCheckCircle /> {toast.text}
        </div>
      )}

      <div className="mgmt-header">
        <div className="header-text">
          <h1>Supplier Profile & Verification</h1>
          <p>Complete your profile to earn the Verified Supplier Badge and increase trust.</p>
        </div>
        <div className={`badge-status-large ${badgeStatus.toLowerCase()}`}>
          <FaShieldAlt /> {badgeStatus} Status
        </div>
      </div>

      <div className="profile-sections">
        <div className="profile-card">
          <div className="card-header">
            <h3><FaBuilding /> Company Information</h3>
            <button type="button" className="edit-link" onClick={() => handleEdit('Company information')}>
              Edit
            </button>
          </div>
          <div className="card-grid">
            <div className="info-group"><span>Company Name</span> <strong>Global Manufacturing Ltd</strong></div>
            <div className="info-group"><span>Business Type</span> <strong>Manufacturer / Trader</strong></div>
            <div className="info-group"><span>Established</span> <strong>2012</strong></div>
            <div className="info-group"><span>Employees</span> <strong>50 - 100</strong></div>
            <div className="info-group"><span>Website</span> <strong>www.globalmfg.com</strong></div>
          </div>
        </div>

        <div className="profile-card">
          <div className="card-header">
            <h3><FaGlobe /> Factory Information</h3>
            <button type="button" className="edit-link" onClick={() => handleEdit('Factory information')}>
              Edit
            </button>
          </div>
          <div className="card-grid">
            <div className="info-group"><span>Location</span> <strong>Industrial Area, Shenzhen, China</strong></div>
            <div className="info-group"><span>Factory Size</span> <strong>5000+ sqm</strong></div>
            <div className="info-group"><span>Production Lines</span> <strong>04</strong></div>
          </div>
        </div>

        <div className="profile-card docs-section">
          <div className="card-header">
            <h3><FaIdCard /> Required Documents</h3>
          </div>
          <div className="doc-list">
            <div className="doc-item uploaded">
              <div className="doc-info">
                 <FaCertificate className="doc-icon" />
                 <div className="text-wrap">
                    <span className="doc-name">Business License</span>
                    <span className="doc-status">Verified</span>
                 </div>
              </div>
              <button type="button" className="view-btn" onClick={() => handleViewDoc('Business License')}>
                View
              </button>
            </div>
            <div className="doc-item pending">
              <div className="doc-info">
                 <FaFileUpload className="doc-icon" />
                 <div className="text-wrap">
                    <span className="doc-name">Quality Certification (ISO)</span>
                    <span className="doc-status">Pending Review</span>
                 </div>
              </div>
              <button type="button" className="view-btn" onClick={() => handleViewDoc('Quality Certification (ISO)')}>
                View
              </button>
            </div>
          </div>
          <button type="button" className="upload-placeholder" onClick={handleUploadCert}>
            <FaFileUpload />
            <span>Upload additional certification</span>
          </button>
        </div>

        <div className="profile-card verification-fee">
          <div className="card-header">
             <h3>Verification Fee</h3>
          </div>
          <div className="fee-content">
             <div className="fee-amount">
                <span className="amount">$299</span>
                <span className="period">/ Year</span>
             </div>
             <p>The verification fee covers the cost of manual audit and background check by our third-party partner.</p>
             <button type="button" className="pay-btn" onClick={handleVerificationPayment}>
               Complete Verification Payment
             </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupplierProfile
