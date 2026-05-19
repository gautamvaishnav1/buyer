// import { useState  } from "react"
import DataTable,{ type TableColumn } from 'react-data-table-component';
// import StarRating from "./StarRating"
// import TrustBadges from "./TrustBadges"
import MiniSparkline from "./MiniSparkline"
// import PerformancePanel from "./PerformancePanel"
import {
  // SUPPLIER,
  KPI_METRICS,
  // DASHBOARD_MODULES,
  // BADGE_STATUS_LABELS,
  RECENT_INQUIRIES,
  RECENT_PRODUCTS,
  RECENT_SELLING,
  // LEAD_STATUS_LABELS,
  // PAYMENT_STATUS_LABELS
} from "./dashboardData"
import {
  FaComments,
  FaClipboardList,
  FaBox,
 
  // FaChevronRight,
  
  // FaMapMarkerAlt,
  // FaTags,
  // FaShoppingCart
} from "react-icons/fa"
import { HiOutlineTrendingUp, HiOutlineTrendingDown } from "react-icons/hi"
interface RecentProduct {
  id: string
  name: string
  sku: string
  price: string
  moq: string
  listingStatus: "active" | "draft" | "low_stock"
  paymentStatus: "pending" | "paid" | "confirmed"
}

interface RecentInquiry {
  id: string
  buyer: string
  country: string
  subject: string
  quantity: string
  timeAgo: string
  leadStatus: "new" | "negotiation" | "confirmed" | "closed"
}

interface RecentSelling {
  id: string
  name: string
  unitsSold: number
  orderValue: string
  paymentStatus: "pending" | "paid" | "confirmed"
  timeAgo: string
}

const KPI_ICONS = {
  inquiries: FaComments,
  sales: FaClipboardList,
  products: FaBox,
} as const


const customTableStyles = {
  headRow: {
    style: {
      backgroundColor: 'var(--table-header-bg)',
      borderTopStyle: 'solid' as const,
      borderTopWidth: '1px',
      borderTopColor: 'var(--table-border)',
    },
  },
  headCells: {
    style: {
      color: 'var(--table-header-text)',
      fontSize: '11px',
      fontWeight: '700',
      textTransform: 'uppercase' as const,
      paddingLeft: '16px',
      paddingRight: '16px',
    },
  },
  cells: {
    style: {
      fontSize: '13px',
      color: 'var(--table-text)',
      paddingLeft: '16px',
      paddingRight: '16px',
      paddingTop: '12px',
      paddingBottom: '12px',
    },
  },
  rows: {
    style: {
      minHeight: '48px',
      '&:not(:last-of-type)': {
        borderBottomStyle: 'solid' as const,
        borderBottomWidth: '1px',
        borderBottomColor: 'var(--table-border)',
      },
    },
  },
};

const DashboardOverview = () => {
  const columnsRecentInquires:TableColumn<RecentInquiry>[] = [{
  name:'#',
  selector: (_, index) => (index ?? 0) + 1,
  width: '50px',
},{
  name:'NAME',
  selector: (row) => row.buyer,
  sortable: true,
},{
  name:'STATUS',
  selector: (row) => row.leadStatus,
  sortable: true,
}]

const columnsRecentProducts:TableColumn<RecentProduct>[] = [{
  name:'#',
  selector: (_, index) => (index ?? 0) + 1,
  width: '50px',
},{
  name:'PRODUCT NAME',
  selector: (row) => row.name,
  sortable: true,
},{
  name:'STATUS',
  selector: (row) => row.listingStatus,
  sortable: true,
}]

const columnsRecentSelling:TableColumn<RecentSelling>[] = [{
  name:'#',
  selector: (_, index) => (index ?? 0) + 1,
  width: '50px',
},{
  name:'SOLD PRODUCT',
  selector: (row) => row.name,
  sortable: true,
},{
  name:'TIME',
  selector: (row) => row.timeAgo,
  sortable: true,
}]
  // const [currentTime, setCurrentTime] = useState(new Date())
  // const [activeTab, setActiveTab] = useState<"inquiries" | "products" | "sales">("inquiries")

  // useEffect(() => {
  //   const timer = setInterval(() => setCurrentTime(new Date()), 1000)
  //   return () => clearInterval(timer)
  // }, [])

  // const timeLabel = currentTime.toLocaleTimeString([], {
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   hour12: true,
  // })

  return (
    <div className="dashboard-wrapper">
      {/* Unified Professional Header */}
      {/* <header className="dashboard-header-unified">
        <div className="header-left-cluster">
          <div className="score-summary-mini">
            <div className="score-circle-mini">
              <span className="score-val-mini">{SUPPLIER.rating}</span>
            </div>
            <StarRating rating={SUPPLIER.rating} size={14} />
          </div>
          <div className="header-divider-v" />
          <div className="trust-badges-mini">
            <TrustBadges activeTier={SUPPLIER.verificationTier} compact />
            <span className={`status-pill-mini ${SUPPLIER.badgeStatus}`}>
               <FaCheckCircle /> {BADGE_STATUS_LABELS[SUPPLIER.badgeStatus]}
            </span>
          </div>
        </div>

        <div className="header-right-cluster">
          <div className="live-clock-mini">
            <FaRegClock />
            <span>{timeLabel}</span>
          </div>
          <div className="header-divider-v" />
          <div className="user-profile-mini">
            <div className="user-info-mini text-right">
              <h1>{SUPPLIER.contactName}</h1>
              <p>{SUPPLIER.companyName}</p>
            </div>
            <FaUserCircle className="user-avatar-mini" />
          </div>
        </div>
      </header> */}

      <div className="dashboard-content-integrated">
        {/* Main Intelligence Row */}
        <section className="intel-row-integrated">
          <div className="section-title-integrated">
             <h2>Business</h2>
          </div>
          <div className="stats-cards-horizontal">
            {KPI_METRICS.map((metric) => {
              const Icon = KPI_ICONS[metric.variant]
              const isUp = metric.trend === "up"
              return (
                <div key={metric.id} className="stat-card-slim">
                  <div className="stat-card-top-slim">
                    <div className={`icon-box-slim ${metric.variant}`}>
                      <Icon />
                    </div>
                    <div className="stat-titles-slim">
                      <span className="stat-label-slim">{metric.title}</span>
                      <h2 className="stat-value-slim">{metric.value}</h2>
                    </div>
                  </div>
                  <div className="stat-card-bottom-slim">
                    <div className={`trend-pill-slim ${isUp ? 'up' : 'down'}`}>
                      {isUp ? <HiOutlineTrendingUp /> : <HiOutlineTrendingDown />}
                      <span>{Math.abs(metric.delta)}%</span>
                    </div>
                    <MiniSparkline data={metric.sparkline} positive={isUp} width={60} height={24} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

              {/* Data table section */}
              <section className="table-grid-layout">
                <div className="table-card">
                  <div className="table-card-header">
                    <h3 className="table-card-title">Recent Inquiries</h3>
                    <span className="table-card-subtitle">Manage your latest buyer leads</span>
                  </div>
                  <DataTable 
                    columns={columnsRecentInquires} 
                    data={RECENT_INQUIRIES}
                    customStyles={customTableStyles}
                    noHeader
                  />
                </div>

                <div className="table-card">
                  <div className="table-card-header">
                    <h3 className="table-card-title">Recent Products</h3>
                    <span className="table-card-subtitle">Track your inventory status</span>
                  </div>
                  <DataTable 
                    columns={columnsRecentProducts} 
                    data={RECENT_PRODUCTS}
                    customStyles={customTableStyles}
                    noHeader
                  />
                </div>

                <div className="table-card">
                  <div className="table-card-header">
                    <h3 className="table-card-title">Selling Analytics</h3>
                    <span className="table-card-subtitle">Overview of your recent sales</span>
                  </div>
                  <DataTable 
                    columns={columnsRecentSelling} 
                    data={RECENT_SELLING}
                    customStyles={customTableStyles}
                    noHeader
                  />
                </div>
              </section>


        {/* Professional Data Hub Section */}
        {/* <section className="data-hub-section"> */}
          {/* <div className="hub-header">
            <div className="hub-tabs">
              <button 
                className={`hub-tab-btn ${activeTab === "inquiries" ? "active" : ""}`}
                onClick={() => setActiveTab("inquiries")}
              >
                <FaComments /> Recent Inquiries
              </button>
              <button 
                className={`hub-tab-btn ${activeTab === "products" ? "active" : ""}`}
                onClick={() => setActiveTab("products")}
              >
                <FaTags /> Recent Products
              </button>
              <button 
                className={`hub-tab-btn ${activeTab === "sales" ? "active" : ""}`}
                onClick={() => setActiveTab("sales")}
              >
                <FaShoppingCart /> Selling Analytics
              </button>
            </div>
            <button className="view-all-link">View All <FaChevronRight /></button>
          </div> */}

          {/* <div className="table-container-integrated"> */}
            {/* {activeTab === "inquiries" && ( */}
              {/* <table className="dashboard-table-pro anim-fade-in">
                <thead>
                  <tr>
                    <th>Buyer</th> */}
                    {/* <th>Region</th>
                    <th>Inquiry Details</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Time</th> */}
                    {/* <th>Action</th>
                  </tr>
                </thead>
                <tbody> */}
                  {/* {RECENT_INQUIRIES.map((inquiry) => (
                    <tr key={inquiry.id}>
                      <td><span className="bold-text">{inquiry.buyer}</span></td> */}
                      {/* <td><span className="country-cell"><FaMapMarkerAlt /> {inquiry.country}</span></td>
                      <td className="subject-cell">{inquiry.subject}</td>
                      <td><span className="qty-badge">{inquiry.quantity}</span></td>
                      <td>
                        <span className={`status-label-pro ${inquiry.leadStatus}`}>
                          {LEAD_STATUS_LABELS[inquiry.leadStatus]}
                        </span>
                      </td>
                      <td className="time-cell">{inquiry.timeAgo}</td> */}
                      {/* <td><button className="table-action-link">Reply</button></td>
                    </tr>
                  ))}
                </tbody>
              </table> */}
            {/* )} */}

            {/* {activeTab === "products" && ( */}
              {/* <table className="dashboard-table-pro anim-fade-in">
                <thead>
                  <tr>
                    <th>Product Name</th> */}
                    {/* <th>SKU</th>
                    <th>Price</th>
                    <th>MOQ</th>
                    <th>Listing Status</th>
                    <th>Payment</th> */}
                    {/* <th>Action</th>
                  </tr>
                </thead>
                <tbody> */}
                  {/* {RECENT_PRODUCTS.map((prod) => (
                    <tr key={prod.id}>
                      <td><span className="bold-text">{prod.name}</span></td> */}
                      {/* <td><span className="sku-code">{prod.sku}</span></td>
                      <td><span className="price-tag">{prod.price}</span></td>
                      <td>{prod.moq}</td>
                      <td>
                        <span className={`status-label-pro ${prod.listingStatus}`}>
                          {prod.listingStatus.replace("_", " ")}
                        </span>
                      </td>
                      <td>
                        <span className={`status-label-pro ${prod.paymentStatus}`}>
                          {PAYMENT_STATUS_LABELS[prod.paymentStatus]}
                        </span>
                      </td> */}
                      {/* <td><button className="table-action-link">Edit</button></td>
                    </tr>
                  ))}
                </tbody>
              </table> */}
            {/* )} */}

            {/* {activeTab === "sales" && ( */}
              {/* <table className="dashboard-table-pro anim-fade-in">
                <thead>
                  <tr>
                    <th>Sold Product</th> */}
                    {/* <th>Units Sold</th>
                    <th>Order Value</th>
                    <th>Payment</th>
                    <th>Last Order</th> */}
                    {/* <th>Action</th>
                  </tr>
                </thead>
                <tbody> */}
                  {/* {RECENT_SELLING.map((sale) => (
                    <tr key={sale.id}>
                      <td><span className="bold-text">{sale.name}</span></td> */}
                      {/* <td><span className="qty-badge">{sale.unitsSold} units</span></td>
                      <td><span className="value-high">{sale.orderValue}</span></td>
                      <td>
                        <span className={`status-label-pro ${sale.paymentStatus}`}>
                          {PAYMENT_STATUS_LABELS[sale.paymentStatus]}
                        </span>
                      </td>
                      <td className="time-cell">{sale.timeAgo}</td> */}
                      {/* <td><button className="table-action-link">Details</button></td>
                    </tr>
                  ))}
                </tbody>
              </table> */}
            {/* )} */}
          {/* </div>
        </section> */}

        {/* <div className="dashboard-secondary-layout">
          <section className="performance-container-integrated">
            <PerformancePanel />
          </section>
          
          <section className="modules-container-integrated">
            <div className="section-title-integrated">
              <h2>Quick Management</h2>
            </div>
            <div className="modules-list-integrated">
              {DASHBOARD_MODULES.map((mod) => (
                <button key={mod.id} className="module-item-integrated">
                  <div className="module-icon-integrated">
                    <FaChevronRight />
                  </div>
                  <div className="module-text-integrated">
                    <span className="module-title-integrated">{mod.label}</span>
                    <span className="module-desc-integrated">{mod.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div> */}
      </div>
    </div>
  )
}

export default DashboardOverview
