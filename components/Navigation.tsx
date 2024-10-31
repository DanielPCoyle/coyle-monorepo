import React from 'react';
import Link from 'next/link';

// Define types for nav items
interface NavItemType {
  title: string;
  url: string;
  subLinks?: NavItemType[]; // Optional array for nested items
}

// Props type for NavItem component
interface NavItemProps {
  item: NavItemType;
}

// Recursive NavItem Component
const NavItem: React.FC<NavItemProps> = ({ item }) => {
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

// Props type for Navigation component
interface NavigationProps {
  navData: NavItemType[];
}

// Main Navigation Component
const Navigation: React.FC<NavigationProps> = ({ navData }) => {
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
