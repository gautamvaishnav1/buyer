import { useState } from 'react'
import './header.css'
import { FaSearch, FaBell, FaUser, FaBars, FaTimes } from 'react-icons/fa'
import { MdOutlineHelpCenter } from "react-icons/md";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <header className="header">
        {/* Left Section - Logo and Brand (Desktop) */}
        <div className="header-left">
          <div className="logo">
            <img src="/logo.png" className='logo-text' alt="" />
          </div>
          <div className="brand-text">My Seller</div>
        </div>

        {/* Center Section - Search Bar (Desktop) */}
        <div className="header-center">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search" 
              className="search-input"
            />
            <button className="search-btn">
              <FaSearch />
            </button>
          </div>
        </div>

        {/* Right Section - User Actions */}
        <div className="header-right">
          <button className="header-btn">
            <FaUser /> <span>My Account</span>
          </button>
          <button className="header-btn">
            <MdOutlineHelpCenter /> <span>Help</span>
          </button>
          <button className="header-btn notification-btn">
            <FaBell /> <span>Notifications</span>
          </button>
          <select className="language-select">
            <option>English</option>
            <option>Español</option>
            <option>中文</option>
          </select>
        </div>

        {/* Hamburger Menu for Mobile - Left Side */}
        <button 
          className="hamburger-btn"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Logo Center (Only visible on mobile) */}
        <div className="header-logo-center">
          <div className="logo">
            <img src="/logo.png" className='logo-text' alt="" />
          </div>
          <div className="brand-text">My Seller</div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-search-container">
            <input 
              type="text" 
              placeholder="Search" 
              className="mobile-search-input"
            />
            <button className="mobile-search-btn">
              <FaSearch />
            </button>
          </div>
          <button className="mobile-menu-btn">
            <FaUser /> My Account
          </button>
          <button className="mobile-menu-btn">
            <MdOutlineHelpCenter /> Help
          </button>
          <button className="mobile-menu-btn">
            <FaBell /> Notifications
          </button>
          <select className="mobile-menu-select">
            <option>English</option>
            <option>Español</option>
            <option>中文</option>
          </select>
        </div>
      )}
    </>
  )
}

export default Header