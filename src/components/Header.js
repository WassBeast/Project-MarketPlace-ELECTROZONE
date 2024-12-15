import React, { useState } from "react";
import marketplaceImage from "../assets/images/marketplace.png";
import profileIcon from "../assets/images/profile.png";
import shippingIcon from "../assets/images/shipping.png";
import { getAuth } from "firebase/auth";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from "react-toastify";

const Header = () => {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null); // Simplified submenu state

  const handleSearch = (e) => {
    e.preventDefault();
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error('You need to sign in to search!');
    } else if (searchText.trim()) {
      navigate(`/search/${searchText}`);
    }
  };

  const handleSubmenuOpen = (submenu) => {
    setOpenSubmenu(submenu);
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#fc0845', padding: '20px 0' }} aria-label="Main Navigation">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src={marketplaceImage} alt="Electronics marketplace" style={{ height: '60px' }} />
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <form className="d-flex mx-auto" style={{ width: '60%' }} onSubmit={handleSearch}>
              <label htmlFor="searchInput" className="visually-hidden">Search for products</label>
              <input
                id="searchInput"
                name="search"
                className="form-control me-2"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                type="search"
                placeholder="Search for products..."
                aria-label="Search"
                style={{ height: '50px', fontSize: '16px' }}
              />
              <button className="btn" type="submit" style={{ height: '50px', color: 'white', backgroundColor: '#fc0845', borderColor: 'white', borderWidth: '2px' }}>Search</button>
            </form>

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
              <li className="nav-item d-flex align-items-center me-3">
                <Link className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`} to="/profile">
                  <img src={profileIcon} alt="Profile" style={{ height: '50px' }} loading="lazy" />
                  <span className="ms-2" style={{ color: 'white' }}>Profile</span>
                </Link>
              </li>
              <li className="nav-item d-flex align-items-center">
                <Link className={`nav-link ${location.pathname === '/shopping' ? 'active' : ''}`} to="/shopping">
                  <img src={shippingIcon} alt="Shipping" style={{ height: '50px' }} loading="lazy" />
                  <span className="ms-2" style={{ color: 'white' }}>Shopping</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="dropdown" style={{ position: 'relative', marginTop: '20px', left: '0' }} onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
          <button className="btn btn-light" type="button" id="productsDropdown" aria-haspopup="true" aria-expanded={dropdownOpen ? "true" : "false"} style={{ fontSize: '20px', padding: '15px 30px', color: '#fc0845', border: '1px solid white' }}>
            All Products
          </button>
          {dropdownOpen && (
            <ul className="dropdown-menu" aria-labelledby="productsDropdown" style={{ position: 'absolute', left: '0', top: '100%', zIndex: '9999' }}>
              <li><Link className="dropdown-item" to="/tv" onClick={() => handleSubmenuOpen('tv')} style={{ color: '#fc0845' }}>TVs</Link></li>
              <li><Link className="dropdown-item" to="/laptop" onClick={() => handleSubmenuOpen('laptop')} style={{ color: '#fc0845' }}>Laptops</Link></li>
              <li><Link className="dropdown-item" to="/climatiseur" onClick={() => handleSubmenuOpen('climatiseur')} style={{ color: '#fc0845' }}>Climatiseurs</Link></li>
            </ul>
          )}
        </div>
      </div>
      <style>{`
        .dropdown-menu {
          display: none;
          position: absolute;
          background-color: white;
          border: 1px solid #ccc;
          z-index: 1000;
          font-size: 18px;
        }

        .dropdown:hover > .dropdown-menu {
          display: block;
        }

        .dropdown-submenu:hover > .dropdown-menu {
          display: block;
        }

        .dropdown-submenu {
          position: relative;
        }

        .dropdown-submenu .dropdown-menu {
          top: 0;
          left: 100%;
          margin-top: -1px;
        }

        .dropdown-item {
          padding: 15px 30px;
          display: flex;
          align-items: center;
        }

        .dropdown-item img {
          margin-right: 15px;
        }

        .dropdown-item:hover {
          background-color: #f1f1f1;
        }
      `}</style>
    </header>
  );
};

export default Header;
