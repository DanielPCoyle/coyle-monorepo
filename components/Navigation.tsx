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
 
 <div style={{
  width:200,
  height:80,
  overflow:"hidden",
  position:"relative",
 }}>
        <div style={{ 
          position:"absolute",
          top:0,
          right:-100,
          width:1400, marginTop: -17,  overflow: 'hidden',  height: 80 }}>
          <iframe 
            src={ showCart && "https://shop.philaprints.com/philadelphiascreenprinting/shop/home?cartOnly=true"} 
            style={{
              width:1400
            }}
          />
        </div>
        </div>
        
      </nav>

    </>
  );
};

export default Navigation;
