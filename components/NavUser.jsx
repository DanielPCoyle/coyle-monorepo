import React from 'react';
import Link from 'next/link';

const NavUser = () => {
  const [sessionToken, setSessionToken] = React.useState(false);

  React.useEffect(() => {
    const parseCookies = (cookieString) => {
      return cookieString.split(';').reduce((cookies, cookie) => {
        const [name, value] = cookie.split('=').map(c => c.trim());
        cookies[name] = value;
        return cookies;
      }, {});
    };

    const cookies = parseCookies(document.cookie);
    if (cookies.SessionToken) {
      setSessionToken(cookies.SessionToken);
    }
  }, []);

  return (
    <div className="navUser">
      <Link href={Boolean(sessionToken) ? "#" : "/login"} style={{ display: "flex" }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill={Boolean(sessionToken) ? "blue" : "currentColor"} className="bi bi-person-circle" viewBox="0 0 16 16">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
        </svg>
        {Boolean(sessionToken) ? <div>My Account</div> : <div>Login</div>}
      </Link>
      {sessionToken && (
        <ul className="dropDown">
          <li><Link href={"/account/designs"}>Designs</Link></li>
          <li><Link href={"/account/orders"}>Orders</Link></li>
          <li><Link href={"/account/profile"}>Profile</Link></li>
        </ul>
      )}
    </div>
  );
};

export default NavUser;
