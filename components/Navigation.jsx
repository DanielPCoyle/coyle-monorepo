import React from 'react';
import Link from 'next/link';

// Recursive NavItem Component
const NavItem = ({ item }) => {
  return (
    <li>
      <Link href={item.url}>
        {item.title}
      </Link>
      {item.subLinks && item.subLinks.length > 0 && (
        <ul>
          {item.subLinks.map((subItem, index) => (
            <NavItem key={index} item={subItem} />
          ))}
        </ul>
      )}
    </li>
  );
};

// Main Navigation Component
const Navigation = ({ navData }) => {
  return (
    <nav>
      <div className="logo bootstrap">
        <Link href="/">
        <img className='logo' src="https://cdn.inksoft.com/images/publishers/19502/stores/philadelphiascreenprinting/img/header-logo.png?decache=638658398084130000" alt="Logo" />
        </Link>
      </div>
      <ul>
        {navData.map((item, index) => (
          <NavItem key={index} item={item} />
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;