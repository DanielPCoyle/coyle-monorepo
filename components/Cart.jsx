import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export const CartPage = () => {
    const router = useRouter();
    const [sessionToken, setSessionToken] = React.useState(null);
    // get SessionToken from cookie
    React.useEffect(() => {
      const parseCookies = (cookieString) => {
        return cookieString.split(';').reduce((cookies, cookie) => {
          const [name, value] = cookie.split('=').map(c => c.trim());
          cookies[name] = value;
          return cookies;
        }, {});
      };
  
      const cookies = parseCookies(document.cookie);
      setSessionToken(cookies.SessionToken);
    }, []);
  
  
  
    return <div className="container">
    <Link href={"#"} className="cartBackButton" onClick={()=>{
      router.back();
    }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" className="bi bi-arrow-up-left-circle" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-5.904 2.803a.5.5 0 1 0 .707-.707L6.707 6h2.768a.5.5 0 1 0 0-1H5.5a.5.5 0 0 0-.5.5v3.975a.5.5 0 0 0 1 0V6.707z"/>
      </svg>
      <div>Continue Shopping</div>
    </Link>
    {sessionToken && <iframe src={"https://getastore.philadelphiascreenprinting.com/get_a_store/shop/cart?SessionToken="+sessionToken} style={{width: "100%", height: "95vh", border:'none'}}></iframe> }
    </div>
  }

  export default CartPage;