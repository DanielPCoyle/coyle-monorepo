// pages/[...page].tsx
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import { GetServerSideProps } from "next";
import { PagesProgressBar as ProgressBar } from "next-nprogress-bar";
import DefaultErrorPage from "next/error";
import Link from "next/link";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import SEOHeader from "../components/SEOHeader";
import navData from "../data/navData.json";
import { fetchCategoryPageContent } from "../util/fetchCategoryPageContent";
import { fetchGeneralPageContent } from "../util/fetchGeneralPageContent";
import { fetchPostContent } from "../util/fetchPostContent";
import { fetchProductsPageContent } from "../util/fetchProductsPageContent";

import "../components/builder-registry"; // Register custom components
import { fetchProducts } from "../util/fetchProducts";


export const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY!;
builder.init(apiKey);

// Type definitions for props
interface BlogData {
  [key: string]: any;
}

interface PageData {
  [key: string]: any;
}

interface Pagination {
  [key: string]: any;
}

interface ProductData {
  [key: string]: any;
}

interface Facets {
  [key: string]: any;
}

interface CategoryData {
  [key: string]: any;
}

interface SEO {
  title: string;
  description: string;
  keywords: string;
  image: string;
  Url: string;
}

interface PageProps {
  blogData?: BlogData;
  page?: PageData;
  model?: string;
  pagination?: Pagination;
  urlPath: string;
  productData?: ProductData;
  facets?: Facets;
  categoryData?: CategoryData;
  contentType?: string;
  seo: SEO;
}

// Main getServerSideProps function
export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context,
) => {
  const { params } = context;
  const urlPath = `/${params?.page ? (params.page as string[]).join('/') : ''}`;
  const slug = urlPath.split('/').pop()!;
  const offset = 0;
  const limit = 10;

  let result;
  if (urlPath === '/products') {
    result = await fetchProductsPageContent(urlPath);
  } else if (urlPath.includes('/post/')) {
    result = await fetchPostContent(urlPath);
  } else if (urlPath.includes('/category/')) {
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
        title: 'Philadelphia Screen Printing',
        description: '',
        keywords: '',
        image: 'https://cdn.inksoft.com/philadelphiascreenprinting/Assets/philadelphiascreenprinting-logo.png',
        url: `https://philadelphiascreenprinting.com${urlPath}`,
      },
      productData: result.productData || {
        Name: 'Default Name',
        Sku: 'Default Sku',
        ManufacturerSku: 'Default ManufacturerSku',
        Manufacturer: 'Default Manufacturer',
        UnitPrice: 0,
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
  productData = {
    Name: 'Default Name',
    Sku: 'Default Sku',
    ManufacturerSku: 'Default ManufacturerSku',
    Manufacturer: 'Default Manufacturer',
    UnitPrice: 0,
  },
  categoryData,
  facets,
  contentType,
  seo,
}) => {
  const router = useRouter();
  const isPreviewing = useIsPreviewing();
  const [filters, setFilters] = React.useState([]);
  const [pageNumber, setPageNumber] = React.useState(0);
  interface SearchResults {
    nbPages: number;
    [key: string]: any;
  }

  const [results, setResults] = React.useState<SearchResults>({ nbPages: 0 });
  const [loading, setLoading] = React.useState(false);
  const [recordTotal, setRecordTotal] = React.useState(0);
  const [filterFacets, setFilterFacets] = React.useState({});

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

  useEffect(() => {
    fetchProducts({
      filters,
      pageNumber,
      setLoading,
      setResults,
      setPageNumber,
      setFilterFacets,
    });
  }, [filters, pageNumber]);

  if (!page && !isPreviewing) {
    return <DefaultErrorPage statusCode={404} />;
  }

  if (urlPath === "/edit-symbol") {
    return (
      <BuilderComponent
        model="symbol"
        options={{
          enrich: true,
        }}
      />
    );
  }

  const toggleManyFilter = (facet, filter) => {
    // Clone the current filters object to avoid direct state mutation
    setPageNumber(0);

    const newFilters = { ...filters };

    // Check if the facet already exists in the filters object
    if (!newFilters[facet]) {
      // If it doesn't exist, initialize it as an empty array
      newFilters[facet] = [];
    }

    // Check if the filter already exists in the specific facet's filter array
    if (newFilters[facet].includes(filter)) {
      // If it exists, remove it from the array
      newFilters[facet] = newFilters[facet].filter((item) => item !== filter);

      // If the facet array is empty after removal, delete the facet key
      if (newFilters[facet].length === 0) {
        delete newFilters[facet];
      }
    } else {
      // If it doesn't exist, add it to the facet array
      newFilters[facet].push(filter);
    }

    setFilters(newFilters);
  };

  const setSingleFilter = (facet, filter) => {
    setPageNumber(0);
    const nFilters = { ...filters };
    nFilters[facet] = filter;
    setFilters(nFilters);
  };

  const nextSearchPage = () => {
    const maxPages = results.nbPages || 0;
    if (pageNumber < maxPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const previousSearchPage = () => {
    const minPages = 0; // Define the minimum number of pages
    if (pageNumber > minPages) {
      setPageNumber(pageNumber - 1);
    }
  };

  const functions = {
    toggleManyFilter,
    setSingleFilter,
    nextSearchPage,
    previousSearchPage,
  };

  return (
    <>
      <ToastContainer />
      <SEOHeader seo={seo} productData={productData} />
      <div className="navContainer">
        <Navigation navData={navData} />
      </div>
      <ProgressBar />
      <React.Suspense fallback={<div>Loading...</div>}>
        {typeof window !== "undefined" && (
          <BuilderComponent
            renderLink={(props) => (
              <Link href={props.href} {...props}>
                {props.children}
              </Link>
            )}
            data={{
              productData,
              filters,
              facets: filterFacets,
              blogData,
              pagination,
              categoryData,
              functions,
              results,
              pageNumber,
              loading,
            }}
            model={model}
            content={page || undefined}
          />
        )}
      </React.Suspense>
      <Footer />
    </>
  );
};

export default Page;
