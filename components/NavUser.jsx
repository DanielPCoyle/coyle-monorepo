import React from 'react';
import Link from 'next/link';
import logout from '../util/logout';

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
        {Boolean(sessionToken) ? <div>My Account</div> : <div>Login / Register</div>}
      </Link>
      {sessionToken && (
        <ul className="dropDown">
          <li><Link href={"/account/designs"}>Designs</Link></li>
          <li><Link href={"/account/orders"}>Orders</Link></li>
          <li><Link href={"/account/profile"}>Profile</Link></li>
          <hr/>
          <li>
          <Link href={"#"} style={{display:"flex",margin:"auto"}} onClick={()=>{
            logout();
            setSessionToken(null);
          }}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{marginRight:5, marginLeft:-15}} width="26" height="26" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
  <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
</svg>
          Logout</Link></li>
        </ul>
      )}
    </div>
  );
};

export default NavUser;
