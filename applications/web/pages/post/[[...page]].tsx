// pages/[...page].tsx
import React from "react";
// import { useRouter } from "next/router";
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import { BuilderContent } from "@builder.io/sdk";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { GetStaticProps } from "next";
import Navigation from "../../components/layout/Navigation";
import navData from "../../data/navData.json";

// Replace with your Public API Key
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

// Define a function that fetches the Builder
// content for a given page
export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Fetch the builder content for the given page
  const page = await builder
    .get("symbol", {
      query: {
        id: "7a9ae2a603a24f58971a9f137a337ab8",
      },
    })
    .toPromise();

  const blogData = await builder.get("blog", {
    query: {
      data: {
        slug: "/" + ((params?.page as string[])?.join("/") || ""),
      },
    },
  });

  // Return the page content as props
  return {
    props: {
      page: page || null,
      blogData,
    },
    // Revalidate the content every 5 seconds
    revalidate: 5,
  };
};

// Define a function that generates the
// static paths for all pages in Builder
export async function getStaticPaths() {
  // Get a list of all pages in Builder
  const pages = await builder.getAll("blog", {
    // We only need the URL field
    fields: "data.slug",
    options: { noTargeting: true },
  });

  // Generate the static paths for all pages in Builder
  return {
    paths: pages
      .map((page) => "/post" + page.data?.slug)
      .filter((url) => url !== "/"),
    fallback: "blocking",
  };
}

// Define the Page component
export default function Page({
  page,
  blogData,
}: {
  page: BuilderContent | null;
  blogData: unknown;
}) {
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
      <BuilderComponent
        model="page"
        data={{ blogData }}
        content={page || undefined}
      />
    </>
  );
}
