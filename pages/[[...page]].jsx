// pages/[...page].tsx
import React from "react";
import { useRouter } from "next/router";
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import { BuilderContent } from "@builder.io/sdk";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { GetStaticProps } from "next";
import { split } from "postcss/lib/list";
import '@/components/builder-registry'; // Register custom components
import friendlyUrl from '@/data/friendly_urls';
import Navigation from "@/components/Navigation";
import navData from '@/data/navData.json'; // Assuming JSON file is named navData.json
import SEOHeader from "@/components/SEOHeader";
import Link from "next/link";
import NProgress from "nprogress";
import { PagesProgressBar as ProgressBar } from 'next-nprogress-bar';

// Replace with your Public API Key
const apiKey = "4836aef3221441d0b11452a63e08992e";
builder.init("4836aef3221441d0b11452a63e08992e");

// Define a function that fetches the Builder
// content for a given page
export const getStaticProps = async ({ params }) => {
  // Fetch the builder content for the given page
  const urlPath = `/${params.page ? params.page.join("/") : ""}`; 
  let page, model, seoDescription, seoKeywords, slug, productData, seoImage, seoUrl, contentType, blogData;
  let offset = 0;
  const limit = 10;
  let seoTitle = "Philadelphia Screen Printing";
  seoDescription = ""
  seoKeywords = ""
  seoUrl = `https://philadelphiascreenprinting.com${urlPath}`
  seoImage = 'https://cdn.inksoft.com/philadelphiascreenprinting/Assets/philadelphiascreenprinting-logo.png'
  blogData = null;
  const splitUp = split(urlPath, "/")
  slug = splitUp[splitUp.length - 1];
  if(urlPath.includes("/post/")){
    productData = null;
    contentType = "post";
    model = "symbol";
    page = await builder
    .get(model, {
      query: {
        id:"7a9ae2a603a24f58971a9f137a337ab8",
      },
    }).toPromise();
    const path = "/"+urlPath.split("/post/")[1];
    blogData = await fetch(`https://cdn.builder.io/api/v2/content/blog?apiKey=${apiKey}&query.data.slug=${path}&limit=1`).then(res => res.json());
    blogData = blogData.results[0];
  }
  else if(urlPath.includes("/products/")){
    contentType = "product";
    model = "symbol";
    page = await builder
    .get(model, {
      query: {
        id:"56104fbf9c904a7082180b3de37ff1f0",
      },
    }).toPromise();

    // get last part of the url
   
    const productId = friendlyUrl[slug];

    const productDataStream = await fetch(`https://cdn.inksoft.com/philadelphiascreenprinting/Api2/GetProduct?ProductId=${productId}&IncludeQuantityPacks=true&IncludePricing=true&StoreVersion=1730304704667`)
    productData = await productDataStream.json();
    productData = productData.Data;
    seoTitle = productData.Name;
    if(productData.Name.length < 40){
      seoTitle = productData.Name+" | Philadelphia Screen Printing";
    }
  } else {
    model = "page";
    contentType = "WebPage";
    page = await builder
    .get(model, {
      userAttributes: {
        urlPath: urlPath.includes("/blog") ? "/blog" : urlPath,
      },
    })
    .toPromise();
    
    seoTitle = page?.data?.title || "Philadelphia Screen Printing";
    seoDescription = page?.data?.description || "Philadelphia Screen Printing";
    seoImage = page?.data?.featuredImage || null;
    

    if(urlPath.includes("/blog")){
      if(slug === "blog"){
        offset = 0;
      } else {
        offset = parseInt(slug);
      }
      try {
        const response = await fetch(`https://cdn.builder.io/api/v3/content/blog?apiKey=${apiKey}&offset=${offset*limit}&limit=${limit}`);
        blogData = await response.json();
        blogData = blogData.results;
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    }

}

  
  return {
    props: {
      page: page || null,
      model: model || null,
      urlPath: urlPath || null,
      productData: productData || null,
      seo:{
        title: seoTitle,
        description: seoDescription,
        keywords: seoKeywords,
        image: seoImage,
        url: seoUrl,
        contentType
      },
      contentType,
      blogData,
      pagination: {
        offset,
        limit
      }
    },
    // Revalidate the content every 5 seconds
    revalidate: 5,
  };
};

// Define a function that generates the
// static paths for all pages in Builder
export async function getStaticPaths() {
  // Get a list of all pages in Builder
  const pages = await builder.getAll("page", {
    // We only need the URL field
    fields: "data.url",
    options: { noTargeting: true },
  });

  // Generate the static paths for all pages in Builder
  return {
    paths: pages.map((page) => page.data?.url).filter(url => url !== '/'),
    fallback: 'blocking',
  };
}

// Define the Page component
export default function Page({blogData, page,model, pagination, urlPath, productData,  contentType, seo }) {
  const router = useRouter();
  const isPreviewing = useIsPreviewing();

  if (!page && !isPreviewing) {
    return <DefaultErrorPage statusCode={404} />;
  }

  if(urlPath === "/edit-symbol"){
    return <BuilderComponent model="symbol" />;
  }


  React.useEffect(() => {
    const handleRouteChangeStart = () => {
      NProgress.start()
    };
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

  return (
    <>
      <SEOHeader seo={seo} productData={productData}  />
      <div className='navContainer'>
        <Navigation  navData={navData} />
      </div>
      <ProgressBar/>
      <BuilderComponent
      renderLink={props => {
        return <Link href={props.href} {...props}>
            {props.children}
          </Link>
          }
        }
      data={{productData,blogData, pagination}} model={model} content={page || undefined} />
    </>
  );
}