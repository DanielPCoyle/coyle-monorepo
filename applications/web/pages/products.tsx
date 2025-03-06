import React from "react";
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import { BuilderContent } from "@builder.io/sdk";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { GetServerSideProps } from "next";
import Navigation from "../components/layout/Navigation";
import navData from "../data/navData.json";
import { fetchProducts } from "../util/fetchProducts";
// Replace with your Public API Key
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

// Define a function that fetches the Builder
// content for a given page
export const getServerSideProps: GetServerSideProps = async () => {
  // Fetch the builder content for the given page
  const page = await builder
    .get("symbol", {
      query: {
        id: "bfdb4053842f44da9ab8b65c3aa78bf7",
      },
    })
    .toPromise();

  // Return the page content as props
  return {
    props: {
      page: page || null,
    },
  };
};

// Define the Page component
export default function Page({ page }: { page: BuilderContent | null }) {
  const isPreviewing = useIsPreviewing();

  const [results, setResults] = React.useState({ nbPages: 0 });
  const [loading, setLoading] = React.useState(false);
  const [filterFacets, setFilterFacets] = React.useState({});
  const [filters, setFilters] = React.useState([]);
  const [pageNumber, setPageNumber] = React.useState(0);

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

  React.useEffect(() => {
    fetchProducts({
      filters,
      pageNumber,
      setLoading,
      setResults,
      setPageNumber,
      setFilterFacets,
    });
  }, [filters, pageNumber]);
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
        data={{
          loading,
          filters,
          facets: filterFacets,
          results,
          functions,
        }}
        model="page"
        content={page || undefined}
      />
    </>
  );
}
