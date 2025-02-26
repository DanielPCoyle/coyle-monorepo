import Link from "next/link";
import React, { useState } from "react";

const NavCart: React.FC = () => {
  const [cartData, setCartData] = useState(null);
  const [totalQuantity, setTotalQuantity] = useState(0);

  React.useEffect(() => {
    const parseCookies = (cookieString) => {
      return cookieString.split(";").reduce((cookies, cookie) => {
        const [name, value] = cookie.split("=").map((c) => c.trim());
        cookies[name] = value;
        return cookies;
      }, {});
    };

    const cookies = parseCookies(document.cookie);
    const sessionToken = cookies.SessionToken;
    if (!sessionToken) return;
    const url =
      "http://getastore.philadelphiascreenprinting.com/get_a_store/SalesDoc/GetSalesDocCart?SessionToken=" +
      sessionToken +
      "&ValidateCart=true";

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCartData(data.Data.SalesDoc);
        const totalQty = data.Data.SalesDoc.Items.reduce(
          (sum, item) => sum + item.Quantity,
          0,
        );
        setTotalQuantity(totalQty);
      });
  }, []);
  return (
    <Link href={"/cart"} className="navCart">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        fill="currentColor"
        className="bi bi-cart"
        viewBox="0 0 16 16"
      >
        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
      </svg>
      {cartData?.Items?.length > 0 && (
        <div style={{ margin: "auto", paddingLeft: "5px" }}>
          {" "}
          <span className="cartTotal"> {totalQuantity} </span>{" "}
          <small>items</small>
        </div>
      )}
    </Link>
  );
};

export default NavCart;
