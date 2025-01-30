import React, { useState, useEffect } from 'react';
import Link from 'next/link';
interface NavItemType {
  title: string;
  url: string;
  subLinks?: NavItemType[];
}

interface NavItemProps {
  item: NavItemType;
}

const NavItem: React.FC<NavItemProps> = ({ item }) => (
  <li>
    <Link href={item.url}>
      {item.title}
    </Link>
    {item.subLinks && (
      <ul>
        {item.subLinks.map((subItem, index) => (
          <NavItem key={index} item={subItem} />
        ))}
      </ul>
    )}
  </li>
);

interface NavigationProps {
  navData: NavItemType[];
}

const Navigation: React.FC<NavigationProps> = ({ navData }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  React.useEffect(() => {
    setShowCart(true);
  },[])
  
  
  return (
    <>
      <nav>
        <div className="logo">
          <Link href="/">
            <img src="https://cdn.inksoft.com/images/publishers/19502/stores/philadelphiascreenprinting/img/header-logo.png?decache=638658398084130000" alt="Logo" />
          </Link>
        </div>
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <ul className={isMenuOpen ? 'open' : ''}>
          {navData.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </ul>
        <div>
        <Link className="phoneNumber" href="tel:215-771-9404">215-771-9404</Link>
        </div>
        <div className='signIn'>
        <svg style={{margin:"auto"}} xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill={"currentColor"} className="bi bi-person-circle" viewBox="0 0 16 16">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
        </svg>

        </div>
 
        <div style={{ marginTop: -8, overflow: 'hidden', width: 100, height: 80 }}>
          <iframe 
            src={ showCart && "https://shop.philaprints.com/philadelphiascreenprinting/shop/home?cartOnly=true"} 
            style={{ 
              zoom: .25,
              transform: 'scale(5)',
              transformOrigin: '270px 30px',
              overflow: 'hidden',
             }}
          />
          
        </div>
        
      </nav>

    </>
  );
};

export default Navigation;
