import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import NavUser from './NavUser';
import NavCart from './NavCart';
import {useRouter} from 'next/router';
import {Search} from './Search/Search';
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
  user: any;
}

const Navigation: React.FC<NavigationProps> = ({ navData, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');
  const navSearchContainerRef = useRef<HTMLDivElement>(null);
  const route = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    if (showSearch) {
      document.getElementById('navSearch')?.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navSearchContainerRef.current && !navSearchContainerRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    };

    if (showSearch) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSearch]);

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
        <NavUser user={user} />
        <NavCart />
        <button className="searchButton" onClick={() => setShowSearch(!showSearch)}>
          {showSearch ? 
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
            </svg>
            : 
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
            </svg>
          }
        </button>
      </nav>
      {showSearch && (<Search />)}

    </>
  );
};

export default Navigation;
