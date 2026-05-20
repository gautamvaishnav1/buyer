import { 
  FaHome,
  FaComments,
  FaFileInvoiceDollar,
  FaClipboardList,
  FaCreditCard,
  FaChartLine,
  FaCheckCircle,
  FaSignOutAlt
} from "react-icons/fa"

import { AiFillProduct } from "react-icons/ai"
import { NavLink } from "react-router-dom"

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

  const menuItems: MenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: <FaHome />, path: "/" },
    { id: "products", label: "Products", icon: <AiFillProduct />, path: "/products" },
    { id: "inquiries", label: "Inquiries", icon: <FaComments />, path: "/inquiries" },
    { id: "rfq", label: "RFQ", icon: <FaFileInvoiceDollar />, path: "/rfq" },
    { id: "orders", label: "Orders", icon: <FaClipboardList />, path: "/orders" },
    { id: "payments", label: "Payments", icon: <FaCreditCard />, path: "/payments" },
    { id: "analytics", label: "Analytics", icon: <FaChartLine />, path: "/analytics" },
    { id: "verification", label: "Verify", icon: <FaCheckCircle />, path: "/verification" },
  ]

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      ></div>

      <div className="sidebar-container">

        <aside className={`sidebar ${isOpen ? "open" : ""}`}>

          <div className="sidebar-logo">
            <img src="/logo.png" alt="Logo" className="sidebar-logo-img" />
          </div>

          <nav className="sidebar-nav">

            <ul className="sidebar-menu">

              {menuItems.map((item) => (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      ` sidebar-menu-item ${isActive ? "active" : ""}`
                    }
                    onClick={() => {
                      if (window.innerWidth <= 768) onClose()
                    }}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-text">{item.label}</span>
                  </NavLink>
                </li>
              ))}

            </ul>

            <div className="sidebar-bottom-menu">
              <button className="sidebar-menu-item logout" title="Logout">
                <span className="menu-icon">
                  <FaSignOutAlt />
                </span>
                <span className="menu-text">Logout</span>
              </button>
            </div>

          </nav>
        </aside>

      </div>
    </>
  )
}

export default Sidebar