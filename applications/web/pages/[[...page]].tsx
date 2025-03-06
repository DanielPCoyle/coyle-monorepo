// pages/[...page].tsx
import React from "react";
// import { useRouter } from "next/router";
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import { BuilderContent } from "@builder.io/sdk";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { GetStaticProps } from "next";
import Navigation from "../components/layout/Navigation";
import Footer from "../components/layout/Footer";

import navData from "../data/navData.json";

// Replace with your Public API Key
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

// Define a function that fetches the Builder
// content for a given page
export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Fetch the builder content for the given page
  const page = await builder
    .get("page", {
      userAttributes: {
        urlPath: "/" + ((params?.page as string[])?.join("/") || ""),
      },
    })
    .toPromise();

    const productsCall = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/search/search`);
    const products = await productsCall.json();
  // Return the page content as props
  return {
    props: {
      page: page || null,
      products
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
    paths: pages.map((page) => page.data?.url).filter((url) => url !== "/"),
    fallback: "blocking",
  };
}

// Define the Page component
export default function Page({ page, products }: { page: BuilderContent | null, products: unknown[] }) {
  // const router = useRouter();
  const isPreviewing = useIsPreviewing();

  // If the page content is not available
  // and not in preview mode, show a 404 error page
  if (!page && !isPreviewing) {
    return <DefaultErrorPage statusCode={404} />;
  }

  // If the page content is available, render
  // the BuilderComponent with the page content
  return (
    <>
      <Head>
        <title>{page?.data?.title}</title>
      </Head>
      {/* Render the Builder page */}
      <div className="navContainer">
        <Navigation navData={navData} />
      </div>
      <BuilderComponent data={{products}} model="page" content={page || undefined} />
      <Footer />
    </>
  );
}
