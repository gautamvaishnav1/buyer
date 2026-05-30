// import { FaBox, FaChevronRight } from "react-icons/fa"
import DashboardOverview from "./DashboardOverview"
// import {
//   RECENT_PRODUCTS,
//   RECENT_INQUIRIES,
//   RECENT_SELLING,
//   LEAD_STATUS_LABELS,
//   PAYMENT_STATUS_LABELS,
// } from "./dashboardData"
// import type { LeadStatus, PaymentStatus, ProductListingStatus } from "./dashboardData"
import "../../styles/dashboard_home.css"

// const LISTING_STATUS: Record<ProductListingStatus, { label: string; className: string }> = {
//   active: { label: "Active", className: "status-active" },
//   draft: { label: "Draft", className: "status-draft" },
//   low_stock: { label: "Low stock", className: "status-warning" },
// }

// const LEAD_CLASS: Record<LeadStatus, string> = {
//   new: "lead-new",
//   negotiation: "lead-negotiation",
//   confirmed: "lead-confirmed",
//   closed: "lead-closed",
// }

// const PAYMENT_CLASS: Record<PaymentStatus, string> = {
//   pending: "pay-pending",
//   paid: "pay-paid",
//   confirmed: "pay-confirmed",
// }

const DashboardHome = () => {
  return (
    // <div className="dashboard-container b2b-seller-hub">
    <>
      <DashboardOverview />

      {/* Wireframe row 3: Recent products | Recent inquiries | Recent selling */}
      {/* <div className="diagram-main-grid"> */}
        {/* <section className="grid-box">
          <div className="box-header">
            <div>
              <h3>Recent 5 products in tables</h3>
              <p className="panel-sub">Product management · specs, MOQ & pricing</p>
            </div>
            <button type="button" className="text-btn">
              View all
              <FaChevronRight aria-hidden />
            </button>
          </div>
          <div className="panel-table-wrap">
            <table className="b2b-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>MOQ</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_PRODUCTS.map((product) => {
                  const listing = LISTING_STATUS[product.listingStatus]
                  return (
                    <tr key={product.id}>
                      <td>
                        <div className="product-cell">
                          <span className="product-thumb" aria-hidden>
                            <FaBox />
                          </span>
                          <div>
                            <span className="product-name">{product.name}</span>
                            <span className="product-sku">{product.sku}</span>
                            <span className={`status-pill ${listing.className}`}>{listing.label}</span>
                          </div>
                        </div>
                      </td>
                      <td className="price-cell">{product.price}</td>
                      <td className="moq-cell">{product.moq}</td>
                      <td>
                        <span className={`status-pill ${PAYMENT_CLASS[product.paymentStatus]}`}>
                          {PAYMENT_STATUS_LABELS[product.paymentStatus]}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section> */}

        {/* <section className="grid-box">
          <div className="box-header">
            <div>
              <h3>5 recent inquiries</h3>
              <p className="panel-sub">Inquiry & lead management</p>
            </div>
            <button type="button" className="text-btn">
              Manage
              <FaChevronRight aria-hidden />
            </button>
          </div>
          <ul className="inquiry-list">
            {RECENT_INQUIRIES.map((inq) => (
              <li key={inq.id}>
                <button type="button" className="inquiry-item">
                  <div className="inquiry-main">
                    <div className="inquiry-top">
                      <span className="inquiry-buyer">{inq.buyer}</span>
                      <span className="country-tag">{inq.country}</span>
                      <span className={`status-pill ${LEAD_CLASS[inq.leadStatus]}`}>
                        {LEAD_STATUS_LABELS[inq.leadStatus]}
                      </span>
                    </div>
                    <p className="inquiry-subject">{inq.subject}</p>
                    <span className="inquiry-qty">{inq.quantity}</span>
                  </div>
                  <span className="inquiry-time">{inq.timeAgo}</span>
                </button>
              </li>
            ))}
          </ul>
        </section> */}

        {/* <section className="grid-box">
          <div className="box-header">
            <div>
              <h3>5 recent selling products</h3>
              <p className="panel-sub">Orders & payment tracking</p>
            </div>
            <button type="button" className="text-btn">
              Details
              <FaChevronRight aria-hidden />
            </button>
          </div>
          <ul className="selling-list">
            {RECENT_SELLING.map((item) => (
              <li key={item.id} className="selling-row">
                <div className="selling-thumb" aria-hidden>
                  <FaBox />
                </div>
                <div className="selling-info">
                  <span className="selling-name">{item.name}</span>
                  <span className="selling-meta">
                    {item.unitsSold.toLocaleString()} units · {item.timeAgo}
                  </span>
                </div>
                <div className="selling-right">
                  <span className="selling-value">{item.orderValue}</span>
                  <span className={`status-pill ${PAYMENT_CLASS[item.paymentStatus]}`}>
                    {PAYMENT_STATUS_LABELS[item.paymentStatus]}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section> */}
      {/* // </div> */}
    {/* // </div> */}



    </>
  )
}

export default DashboardHome
