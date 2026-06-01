import { useState } from 'react'
import '../../styles/header.css'
import { MdVerified } from "react-icons/md";
import { FaSearch, FaBell, FaBars, FaTimes } from 'react-icons/fa'
import StarRating from '../../features/Dashboard/StarRating';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';

interface HeaderProps {
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
}

const Header = ({ onMenuClick, isSidebarOpen }: HeaderProps) => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  return (
    <header
      className={`header${mobileSearchOpen ? ' header--search-open' : ''}`}
    >

      {/* Logo — desktop only (hidden on mobile, shown inside sidebar on mobile) */}
      <div className="header-logo-block">
        <img src="/logo.png" className="header-logo-img" alt="logo" />
      </div>

      {/* Left: hamburger (mobile) + brand name */}
      <div className="header-left">
        <button
          type="button"
          className="hamburger-btn"
          onClick={(e) => {
            e.stopPropagation()
            onMenuClick?.()
          }}
          aria-label="Toggle menu"
          aria-expanded={isSidebarOpen ?? false}
        >
          <FaBars />
        </button>
        <span className="header-company-name">B2B SELLER</span>
      </div>

      {/* Search bar — desktop always visible, mobile via toggle */}
      <div className={`header-search${mobileSearchOpen ? ' header-search--open' : ''}`}>
        <div className="search-container">
          <span className="search-icon-left"><FaSearch /></span>
          <input
            type="text"
            placeholder="Search products, orders, inquiries…"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {mobileSearchOpen && (
            <button
              className="search-close-btn"
              onClick={() => setMobileSearchOpen(false)}
              aria-label="Close search"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Right actions */}
      <div className="header-actions">

        {/* Search toggle — mobile only */}
        <button
          className="header-btn header-search-toggle"
          onClick={() => setMobileSearchOpen(v => !v)}
          aria-label="Open search"
        >
          <FaSearch />
        </button>

        {/* Desktop-only extras */}
        <span className="header-desktop-only">
          <StarRating rating={4.5} size={18} />
        </span>
        <span className="header-desktop-only">
          <MdVerified size={22} color="#4e19c1" />
        </span>

        <button
          type="button"
          className="header-btn"
          aria-label="Notifications"
          onClick={() => navigate(ROUTES.MESSAGE)}
        >
          <FaBell />
          <span className="notification-badge">3</span>
        </button>

        <NavLink
          to={ROUTES.PROFILE}
          className="header-btn"
          aria-label="Profile"
        >
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="User"
            className="header-avatar"
          />
        </NavLink>

      </div>
    </header>
  )
}

export default Header