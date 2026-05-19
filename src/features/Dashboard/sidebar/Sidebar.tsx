import { useState } from 'react'
import { 
  FaHome, 
   
  FaComments, 
  FaFileInvoiceDollar, 
  FaClipboardList, 
  FaCreditCard, 
  FaChartLine, 
  FaCheckCircle,
  FaSignOutAlt
} from 'react-icons/fa'

import { AiFillProduct } from "react-icons/ai";
import './sidebar.css'

// Module Components
import DashboardHome from '../DashboardHome'
import ProductManagement from '../ProductManagement/ProductManagement'
import InquiryManagement from '../InquiryManagement'
import SupplierProfile from '../SupplierProfile'

const ModulePlaceholder = ({ title }: { title: string }) => (
  <div className="module-placeholder">
    <div className="placeholder-content">
       <FaChartLine className="placeholder-icon" />
       <h2>{title} Module</h2>
       <p>This section is under development. Soon you will be able to manage your {title.toLowerCase()} here.</p>
       <button className="placeholder-btn">Learn More</button>
    </div>
  </div>
)

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  content?: React.ReactNode
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [activeItem, setActiveItem] = useState<string | null>('dashboard')

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaHome />, content: <DashboardHome /> },
    { id: 'products', label: 'Products', icon: <AiFillProduct />, content: <ProductManagement /> },
    { id: 'inquiries', label: 'Inquiries', icon: <FaComments />, content: <InquiryManagement /> },
    { id: 'rfq', label: 'RFQ', icon: <FaFileInvoiceDollar />, content: <ModulePlaceholder title="RFQ Responses" /> },
    { id: 'orders', label: 'Orders', icon: <FaClipboardList />, content: <ModulePlaceholder title="Order Management" /> },
    { id: 'payments', label: 'Payments', icon: <FaCreditCard />, content: <ModulePlaceholder title="Payment Tracking" /> },
    { id: 'analytics', label: 'Analytics', icon: <FaChartLine />, content: <ModulePlaceholder title="Analytics" /> },
    { id: 'verification', label: 'Verify', icon: <FaCheckCircle />, content: <SupplierProfile /> },
  ]

  const handleMenuClick = (itemId: string) => {
    setActiveItem(itemId)
    if (window.innerWidth <= 768) {
      onClose()
    }
  }

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'show' : ''}`} 
        onClick={onClose}
      ></div>

      <div className="sidebar-container">
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
          <div className="sidebar-logo">
            <img src="/logo.png" alt="Logo" className="sidebar-logo-img" />
          </div>
          <nav className="sidebar-nav">
            <ul className="sidebar-menu">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`sidebar-menu-item ${activeItem === item.id ? 'active' : ''}`}
                    onClick={() => handleMenuClick(item.id)}
                    title={item.label}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-text">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
            
            <div className="sidebar-bottom-menu">
               <button className="sidebar-menu-item logout" title="Logout">
                  <span className="menu-icon"><FaSignOutAlt /></span>
                  <span className="menu-text">Logout</span>
               </button>
            </div>
          </nav>
        </aside>

        <main className="sidebar-content">
          {activeItem && (
             <div className="content-body">
                {menuItems.find(item => item.id === activeItem)?.content}
             </div>
          )}
        </main>
      </div>
    </>
  )
}

export default Sidebar
