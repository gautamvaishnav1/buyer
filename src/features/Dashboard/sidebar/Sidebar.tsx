
import { useState } from 'react'
import { TiLocationArrowOutline } from 'react-icons/ti'
import { FaHome, FaShoppingBag, FaBox, FaComments, FaChartBar, FaUsers, FaBullhorn, FaClipboardList, FaQuestionCircle, FaEllipsisH, FaChevronRight, FaBars, FaTimes } from 'react-icons/fa'
import './sidebar.css'

import DashboardHome from '../DashboardHome'
import DashboardShop from '../DashboardShop'
import ProductCatalog from '../ProductCatalog'
import Alerts from '../Alerts'
import Analytics from '../Analytics'
import ContactManagement from '../ContactManagement'
import CampaignTool from '../CampaignTool'
import OrderDetail from '../OrderDetail'

import QuickEntry from '../QuickEntry'
import HelpCenter from '../HelpCenter'

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  active?: boolean
  hasIndicator?: boolean
  content?: React.ReactNode
}

const Sidebar = () => {
  const [openPanel, setOpenPanel] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const togglePanel = (itemId: string) => { 
    setOpenPanel(openPanel === itemId ? null : itemId)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const menuItems: MenuItem[] = [
    {id: 'quick-entry', label: 'Quick Entry', icon: <TiLocationArrowOutline />, content: <QuickEntry />},
    { id: 'home', label: 'Home', icon: <FaHome />, active: true, hasIndicator: true, content: <DashboardHome/> },
    { id: 'shop', label: 'Shop', icon: <FaShoppingBag />, content: <DashboardShop/> },
    { id: 'products', label: 'Products', icon: <FaBox />, hasIndicator: true, content: <ProductCatalog/> },
    // { id: 'communications', label: 'Communications', icon: <FaComments />, content: <Alerts/> },
    { id: 'analytics', label: 'Analytics', icon: <FaChartBar />, hasIndicator: true, content: <Analytics/> },
    { id: 'contacts', label: 'Contacts', icon: <FaUsers />, content: <ContactManagement/> },
    { id: 'campaigns', label: 'Campaigns', icon: <FaBullhorn />, content: <CampaignTool/> },
    { id: 'orders', label: 'Orders', icon: <FaClipboardList />, hasIndicator: true, content: <OrderDetail/> },
    { id: 'help-center', label: 'Help Center', icon: <FaQuestionCircle />, content: <HelpCenter/> },
  ]

  return (
    <div className="sidebar-container">
      {/* Mobile Hamburger Button */}
      <button 
        className="sidebar-hamburger"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="sidebar-overlay"
          onClick={toggleMobileMenu}
        ></div>
      )}

      <aside className={`sidebar ${isMobileMenuOpen ? 'sidebar-open' : ''}`}>
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.id} className={`sidebar-menu-item ${openPanel === item.id ? 'active' : ''}`}>
                <div className="sidebar-menu-row">
                  <button className="sidebar-menu-btn" onClick={() => togglePanel(item.id)}>
                    <span className="sidebar-menu-icon">{item.icon}</span>
                    <span className="sidebar-menu-label">{item.label}</span>
                    {/* {item.hasIndicator && <span className="sidebar-indicator"></span>} */}
                  </button>
                  {item.content && (
                    <button 
                      className={`sidebar-arrow-btn ${openPanel === item.id ? 'open' : ''}`}
                      onClick={() => togglePanel(item.id)}
                    >
                      {/* <FaChevronRight /> */}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-bottom">
          <button className="sidebar-menu-btn">
            <span className="sidebar-menu-icon"><FaEllipsisH /></span>
            <span className="sidebar-menu-label">More Function</span>
            <span className="sidebar-indicator"></span>
          </button>
        </div>
      </aside>

      {openPanel && (
        <div className="sidebar-panel">
          {openPanel === 'quick-entry' ? (
            <QuickEntry />
          ) : (
            <div className="sidebar-panel-content">
              <h3 className="sidebar-panel-title">
                {menuItems.find(item => item.id === openPanel)?.label}
              </h3>
              <div className="sidebar-panel-body">
                {menuItems.find(item => item.id === openPanel)?.content}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Sidebar
