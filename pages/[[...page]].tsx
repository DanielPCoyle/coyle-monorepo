// pages/[...page].tsx
import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import DefaultErrorPage from "next/error";
import Navigation from "../components/Navigation";
import navData from '../data/navData.json';
import SEOHeader from "../components/SEOHeader";
import Link from "next/link";
import NProgress from "nprogress";
import { PagesProgressBar as ProgressBar } from 'next-nprogress-bar';
import { fetchGeneralPageContent } from "../util/fetchGeneralPageContent";
import { fetchPostContent } from "../util/fetchPostContent";
import { fetchProductContent } from "../util/fetchProductContent";
import { fetchCategoryPageContent } from "../util/fetchCategoryPageContent";
import { fetchLoginLogic } from "../util/fetchLoginLogic";
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import login from '../util/login';
import Footer from "../components/Footer";
import {createUserWithEmailAndPassword, getAuth, updateProfile, onAuthStateChanged} from '../util/firebase';
import Cookies from 'js-cookie'; 
import 'animate.css';
import 'react-toastify/dist/ReactToastify.css';
import '../components/builder-registry'; // Register custom components

export const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY!;
builder.init(apiKey);

// Type definitions for props
interface PageProps {
  blogData?: any;
  page?: any;
  model?: string;
  pagination?: any;
  urlPath: string;
  productData?: any;
  categoryData?: any;
  contentType?: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
    image: string;
    Url: string;
  };
}

// Main getServerSideProps function
export const getServerSideProps: GetServerSideProps<PageProps> = async ({ params }) => {
  const urlPath = `/${params?.page ? (params.page as string[]).join("/") : ""}`;
  const slug = urlPath.split("/").pop()!;
  const offset = 0;
  const limit = 10;

  let result;
  if (urlPath === "/login") {
    result = await fetchLoginLogic(urlPath);
  } else if (urlPath.includes("/post/")) {
    result = await fetchPostContent(urlPath);
  } else if (urlPath.includes("/products/")) {
    result = await fetchProductContent(slug);
  } else if (urlPath.includes("/category/")) {
    result = await fetchCategoryPageContent(urlPath);
  } else {
    result = await fetchGeneralPageContent(urlPath, slug, offset, limit);
  }

  return {
    props: {
      ...result,
      urlPath,
      page: result.page || null,
      seo: result.seo || {
        title: "Philadelphia Screen Printing",
        description: "",
        keywords: "",
        image: "https://cdn.inksoft.com/philadelphiascreenprinting/Assets/philadelphiascreenprinting-logo.png",
        url: `https://philadelphiascreenprinting.com${urlPath}`,
      },
    },
  };
};

// Main Page component
const Page: React.FC<PageProps> = ({
  blogData,
  page,
  model,
  pagination,
  urlPath,
  productData,
  categoryData,
  contentType,
  seo
}) => {
  const router = useRouter();
  const isPreviewing = useIsPreviewing();

  useEffect(() => {
 
    const handleRouteChangeStart = () => NProgress.start();
    const handleRouteChangeComplete = () => NProgress.done();
    const handleRouteChangeError = () => NProgress.done();

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeError);
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteChangeError);
    };
  }, [router.events]);

  if (urlPath === "/cart") {
    return <CartPage />
  }

  if (!page && !isPreviewing) {
    return <DefaultErrorPage statusCode={404} />;
  }

  if (urlPath === "/edit-symbol") {
    return <BuilderComponent model="symbol"  options={
      {
        enrich: true,
      }
    } />
  }

  const register = (props) => {
    const { email, password, first_name, last_name, confirm_password } = props;

    console.log({
      thing: "Register",
      props,
    });

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
        .then((response) => {
            const user = response.user;
            // Update the user's display name
            updateProfile(user, {
                displayName: `${first_name} ${last_name}`,
            }).then(() => {
                console.log("User display name updated successfully");
            }).catch((error) => {
                console.error("Error updating user profile", error);
            });

            // Save user info in first-party cookies (e.g., user ID and display name)
            Cookies.set('user_id', user.uid, { expires: 7 }); // expires in 7 days
            Cookies.set('user_name', `${first_name} ${last_name}`, { expires: 7 });
            Cookies.set('user_email', email, { expires: 7 });
            console.log("User registered and cookies set successfully");
        })
        .catch((error) => {
            console.error({ error });
        });
  };


  const functions = {login,register};

  return (
    <>
      <ToastContainer/>
      <SEOHeader seo={seo} productData={productData} />
      <div className='navContainer'>
        <Navigation navData={navData}  />
      </div>
      <ProgressBar />
      {/* {JSON.stringify(productData)} */}
      <BuilderComponent
        renderLink={(props) => <Link href={props.href} {...props}>{props.children}</Link>}
        data={{ productData, blogData, pagination, categoryData, functions }}
        model={model}
        content={page || undefined}
      />
      <Footer />
    </>
  );
};

export default Page;



const CartPage = () => {
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
  SESSION TOKEN:{sessionToken}
  {sessionToken && <iframe src={"https://getastore.philadelphiascreenprinting.com/get_a_store/shop/cart?SessionToken="+sessionToken} style={{width: "100%", height: "95vh", border:'none'}}></iframe> }
  </div>
}