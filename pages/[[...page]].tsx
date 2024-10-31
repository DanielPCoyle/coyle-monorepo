// pages/[...page].tsx
import React, { useEffect } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import DefaultErrorPage from "next/error";
// import { split } from "postcss/lib/list";
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
import '../components/builder-registry'; // Register custom components

export const apiKey = process.env.BUILDERIO_API_KEY!;
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

// Main getStaticProps function
export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const urlPath = `/${params?.page ? (params.page as string[]).join("/") : ""}`;
  const slug = urlPath.split("/").pop()!;
  const offset = 0;
  const limit = 10;

  let result;
  if (urlPath.includes("/post/")) {
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
    revalidate: 5,
  };
};

// Define the static paths
export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await builder.getAll("page", {
    fields: "data.url",
    options: { noTargeting: true },
  });
  return {
    paths: pages.map((page) => page.data?.url).filter(url => url !== '/'),
    fallback: 'blocking',
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

  if (!page && !isPreviewing) {
    return <DefaultErrorPage statusCode={404} />;
  }

  if (urlPath === "/edit-symbol") {
    return <BuilderComponent model="symbol" />
  }

  return (
    <>
      <SEOHeader seo={seo} productData={productData} />
      <div className='navContainer'>
        <Navigation navData={navData} />
      </div>
      <ProgressBar />
      <BuilderComponent
        renderLink={(props) => <Link href={props.href} {...props}>{props.children}</Link>}
        data={{ productData, blogData, pagination, categoryData }}
        model={model}
        content={page || undefined}
      />
    </>
  );
};

export default Page;