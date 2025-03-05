import React from "react";
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import { BuilderContent } from "@builder.io/sdk";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { GetServerSideProps } from "next";
import Navigation from "../components/layout/Navigation";
import navData from "../data/navData.json";

// Replace with your Public API Key
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

// Define a function that fetches the Builder
// content for a given page
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
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
            <BuilderComponent model="page" content={page || undefined} />
        </>
    );
}
