import { useState } from 'react'
import '../../styles/header.css'
import { MdVerified } from "react-icons/md";
import { FaSearch, FaBell, FaBars } from 'react-icons/fa'
import StarRating from '../../features/Dashboard/StarRating';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="header">
        <div className='logo'><img src="/public/logo.png" className='width-100 h-100' alt="" /></div>
      <div className="header-left">
        <button className="hamburger-btn" onClick={onMenuClick}>
          <FaBars />
        </button>
      
        <div className="header-brand">
          <span className="header-company-name">B2B SELLER</span>
        </div>
      </div>

      <div className="header-search">
        <div className="search-container">
          <span className="search-icon-left">
            <FaSearch />
          </span>
          <input 
            type="text" 
            placeholder="Search for employees or actions" 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="header-actions">

        <StarRating rating={4.5} size={18} />

<MdVerified size={24} color="#22c55e" />
             <button className="header-btn notification-btn">
          <FaBell />
          <span className="notification-badge">3</span>
        </button>
        <Link to={ROUTES.PROFILE} className="header-btn profile-btn">
          <div className="profile-avatar">
            <img 
               src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
               alt="User" 
               className="profile-avatar-img" 
            />
          </div>
        </Link>
      </div>
    </header>
  )
}

export default Header