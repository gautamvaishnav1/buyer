import { useState } from 'react'
import { FaBuilding, FaFileUpload, FaIdCard, FaGlobe, FaCertificate, FaShieldAlt } from 'react-icons/fa'
import '../../styles/supplier_profile.css'

const SupplierProfile = () => {
  const [badgeStatus] = useState<'Approved' | 'Pending' | 'Rejected' | 'Expired'>('Pending')

  return (
    <div className="supplier-profile">
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
            <button className="edit-link">Edit</button>
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
            <button className="edit-link">Edit</button>
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
              <button className="view-btn">View</button>
            </div>
            <div className="doc-item pending">
              <div className="doc-info">
                 <FaFileUpload className="doc-icon" />
                 <div className="text-wrap">
                    <span className="doc-name">Quality Certification (ISO)</span>
                    <span className="doc-status">Pending Review</span>
                 </div>
              </div>
              <button className="view-btn">View</button>
            </div>
          </div>
          <div className="upload-placeholder">
            <FaFileUpload />
            <span>Upload additional certification</span>
          </div>
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
             <button className="pay-btn">Complete Verification Payment</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupplierProfile
