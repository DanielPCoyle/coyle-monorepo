// pages/[...page].tsx
import React, { use, useEffect } from "react";
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
import {fetchProductsPageContent} from "../util/fetchProductsPageContent";
import { fetchLoginLogic } from "../util/fetchLoginLogic";
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import login from '../util/login';
import Footer from "../components/Footer";
import CartPage from "../components/Cart";
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
  facets?: any;
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
export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const { params,query } = context;
  const urlPath = `/${params?.page ? (params.page as string[]).join("/") : ""}`;
  const slug = urlPath.split("/").pop()!;
  const offset = 0;
  const limit = 10;

  let result;
  if (urlPath === "/login") {
    result = await fetchLoginLogic(urlPath);
  } else if(urlPath === "/products") {
    result = await fetchProductsPageContent(urlPath); 
  } else if (urlPath.includes("/post/")) {
    result = await fetchPostContent(urlPath);
  } else if (urlPath.includes("/products/")) {
    result = await fetchProductContent(slug,query);
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
  facets,
  contentType,
  seo
}) => {
  const router = useRouter();
  const isPreviewing = useIsPreviewing();
  const [filters, setFilters] = React.useState([]);
  const [pageNumber,setPageNumber] = React.useState(0);
  const [results, setResults] = React.useState([]);
  const [loading,setLoading] = React.useState(false);
  const [recordTotal, setRecordTotal] = React.useState(0);
  const [filterFacets,setFilterFacets] = React.useState(facets);

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


  const toggleManyFilter = (facet, filter) => {
    // Clone the current filters object to avoid direct state mutation
    setTimeout(() => {
    setPageNumber(0);

    let newFilters = { ...filters };
  
    // Check if the facet already exists in the filters object
    if (!newFilters[facet]) {
      // If it doesn't exist, initialize it as an empty array
      newFilters[facet] = [];
    }
  
    // Check if the filter already exists in the specific facet's filter array
    if (newFilters[facet].includes(filter)) {
      // If it exists, remove it from the array
      newFilters[facet] = newFilters[facet].filter(item => item !== filter);
  
      // If the facet array is empty after removal, delete the facet key
      if (newFilters[facet].length === 0) {
        delete newFilters[facet];
      }
    } else {
      // If it doesn't exist, add it to the facet array
      newFilters[facet].push(filter);
    }
  
    setFilters(newFilters);
    

  }, 500);    
  };


  const setSingleFilter = (facet, filter) => {
    setTimeout(() => {
      setPageNumber(0);
      const nFilters = { ...filters };
            nFilters[facet] = filter;
          setFilters(nFilters);
    
    }, 500);
  }
  
   // Function to call the backend API with current filters
   const fetchProducts = async () => {
    try {
      setLoading(true);
      NProgress.start()
      const queryParams = new URLSearchParams(filters);

      for (const [key, value] of queryParams.entries()) {
        if (!value) {
          queryParams.delete(key);
        }
      }

      queryParams.append('page', pageNumber.toString());

      const queryString = queryParams.toString();
      
      const response = await fetch(`/api/search?${queryString}`);
      const data = await response.json();
      setResults(data);
      setPageNumber(data.page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
      setLoading(false);
      },1000);
      NProgress.done()


    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters,pageNumber]);


  const nextSearchPage = () => {
    const maxPages = results.nbPages;
    if (pageNumber < maxPages) {
      setPageNumber(pageNumber + 1);
    } else {
      console.log('You have reached the last page.');
    }
  };

  
  const previousSearchPage = () => {
   const minPages = 0; // Define the minimum number of pages
    if (pageNumber > minPages) {
      setPageNumber(pageNumber - 1);
    } else {
      console.log('You are already on the first page.');
    }
  };


  const functions = {login,register,toggleManyFilter,setSingleFilter,nextSearchPage,previousSearchPage};
  
  return (
    <>
      <ToastContainer/>
      <SEOHeader seo={seo} productData={productData} />
      <div className='navContainer'>
        <Navigation navData={navData}  />
      </div>
      <ProgressBar />
      {/* {JSON.stringify(results)} */}
      <BuilderComponent
        renderLink={(props) => <Link href={props.href} {...props}>{props.children}</Link>}
        data={{ productData, filters, facets:filterFacets, blogData, pagination, categoryData, functions, results, pageNumber, loading }}
        model={model}
        content={page || undefined}
      />
      <Footer />
    </>
  );
};

export default Page;



