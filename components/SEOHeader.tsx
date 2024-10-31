import Head from "next/head";

interface SEOProps {
  seo: {
    title: string;
    description: string;
    keywords: string;
    image: string;
    Url: string;
    contentType?: string;
  };
  productData?: {
    Name: string;
    Sku: string;
    ManufacturerSku: string;
    Manufacturer: string;
    UnitPrice: number;
  };
}

const SEOHeader: React.FC<SEOProps> = ({ seo, productData }) => {
  return (
    <Head>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {/* Open Graph Meta Tags for social sharing */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:keywords" content={seo.keywords} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.Url} />
      <meta property="og:site_name" content="Brand Name" />
      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      <meta name="twitter:site" content="@TwitterHandle" />
      <link rel="canonical" href={seo.Url} />
      {/* Structured Data */}
      {seo.contentType === "product" && productData && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: productData.Name,
            image: [seo.image],
            description: seo.description,
            sku: productData.Sku,
            mpn: productData.ManufacturerSku,
            brand: {
              "@type": "Brand",
              name: productData.Manufacturer,
            },
            offers: {
              "@type": "Offer",
              url: seo.Url,
              priceCurrency: "USD", // Replace with your currency code
              price: productData.UnitPrice,
              itemCondition: "https://schema.org/NewCondition",
              availability: "https://schema.org/InStock", // Use appropriate availability status
              seller: {
                "@type": "Organization",
                name: productData.Manufacturer,
              },
            },
            // "aggregateRating": {
            //   "@type": "AggregateRating",
            //   "ratingValue": "4.5", // Example rating
            //   "reviewCount": "89"
            // },
            // "review": [
            //   {
            //     "@type": "Review",
            //     "author": "Customer Name",
            //     "datePublished": "2023-10-15",
            //     "reviewBody": "This product is amazing!",
            //     "name": "Amazing product!",
            //     "reviewRating": {
            //       "@type": "Rating",
            //       "bestRating": "5",
            //       "ratingValue": "5",
            //       "worstRating": "1"
            //     }
            //   }
            // ]
          })}
        </script>
      )}
    </Head>
  );
};

export default SEOHeader;
