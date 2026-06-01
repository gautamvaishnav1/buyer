import { 
  FaHome,
  FaComments,
  FaFileInvoiceDollar,
  FaClipboardList,
  FaCreditCard,
  FaChartLine,
  FaCheckCircle,
  FaSignOutAlt,
  FaTimes
} from "react-icons/fa"

import { AiFillProduct } from "react-icons/ai"
import { NavLink, useNavigate } from "react-router-dom"
import { ROUTES } from "../../../shared/constants"

import "./sidebar.css"

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  path: string
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    if (window.confirm('Sign out of your seller account?')) {
      onClose()
      navigate(ROUTES.HOME)
    }
  }

  const menuItems: MenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: <FaHome />, path: "/" },
    { id: "products", label: "Products", icon: <AiFillProduct />, path: "/seller/products" },
    { id: "inquiries", label: "Inquiries", icon: <FaComments />, path: "/seller/inquiries" },
    { id: "rfq", label: "RFQ", icon: <FaFileInvoiceDollar />, path: "/seller/rfq" },
    { id: "orders", label: "Orders", icon: <FaClipboardList />, path: "/seller/orders" },
    { id: "payments", label: "Payments", icon: <FaCreditCard />, path: "/seller/payments" },
    { id: "analytics", label: "Analytics", icon: <FaChartLine />, path: "/seller/analytics" },
    { id: "verification", label: "Verify", icon: <FaCheckCircle />, path: "/seller/verification" },
  ]

  return (
    <>
      {/* Dark overlay — mobile only */}
      <div
        className={`sidebar-overlay${isOpen ? ' show' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar${isOpen ? ' open' : ''}`}>

        {/* Logo inside sidebar — visible on mobile only */}
        <div className="sidebar-logo-mobile">
          <img src="/logo.png" alt="Logo" className="sidebar-logo-img" />
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">
            <FaTimes />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-menu-item${isActive ? ' active' : ''}`
                  }
                  onClick={() => {
                    if (window.innerWidth < 768) onClose()
                  }}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-text">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="sidebar-bottom-menu">
            <button type="button" className="sidebar-menu-item logout" title="Logout" onClick={handleLogout}>
              <span className="menu-icon"><FaSignOutAlt /></span>
              <span className="menu-text">Logout</span>
            </button>
          </div>
        </nav>

      </aside>
    </>
  )
}

export default Sidebar