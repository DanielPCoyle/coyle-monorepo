# Coyle Mono Repo Web

Last updated: 4/3/2025

> **Warning**: This web application is intended as a starting point and may not fully meet your specific requirements. It is highly recommended to review and modify the codebase to suit your needs before deploying it to production.

This project is an e-commerce website developed for philaprints.com using **Builder.io**, **Next.js**, and **Inksoft**. The goal of this project is to provide a highly customizable, SEO-friendly platform for managing product listings, categories, and blog posts through **Builder.io**, an API-driven content management system. Inksoft integration allows for real-time product data and design customization options, enhancing the user experience for screen printing services.

## Overview

The application integrates **Builder.io** for dynamic content management, allowing non-technical users to control page content, SEO, and custom design components. **Next.js** powers the front-end with server-side rendering for better performance and SEO. **Inksoft** serves as the back-end API, providing product data, pricing, and inventory management.

### Key Technologies

- **Builder.io**: Used for content management, such as blog posts, categories, and product pages.
- **Next.js**: Handles server-side rendering and static generation for optimized performance and SEO.
- **Inksoft**: Provides product data and integrates a design studio for custom product creation.
- **Algolia**: Handles search calls and indexing of products for search.
- **nodemailer**: Handles emails (connected via gmail)
- **OpenAI**: Handles automated writing of blog post

## Installation

1. Install dependencies using Yarn:

   ```bash
   yarn install
   ```

2. Create a `.env` file at the root and add your **Builder.io** API key:

   ```env
   NEXT_PUBLIC_BUILDER_API_KEY=your_builder_io_api_key
   ```

3. Run the development server:

   ```bash
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Directory Structure

```
.
├── components
│   ├── layout
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── __tests__
├── data
│   ├── navData.json
│   ├── slugIds.json
├── middlewares
│   ├── auth.ts
│   ├── handleCors.ts
├── pages
│   ├── api
│   │   └── post
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── [...page].tsx
│   ├── blog.tsx
│   ├── chat.tsx
│   ├── edit-symbol.tsx
│   ├── products.tsx
├── public
├── styles
│   ├── blog.css
│   ├── FilePreview.css
│   ├── globals.scss
```

## API Integrations

### Builder.io

Builder.io is used for managing page content, blog posts, and custom components. By creating reusable components and using Builder.io's **API**, the platform offers non-technical users flexibility to update content dynamically.

- **Dynamic Routing**: The `pages/[...page].tsx` file handles all routes configured within Builder.io, fetching appropriate content using the page's URL path.
- **SEO Management**: The `SEOHeader` component reads metadata from Builder.io, supporting Open Graph, Twitter Card, and structured data tags for better SEO.

### Inksoft

Inksoft is integrated to provide product data, pricing, and a customizable design studio for products. The `InksoftEmbed` component includes the Inksoft API, allowing users to design custom products directly on the website.

- **Product Data**: Product information is retrieved using the Inksoft API, including category and price details.
- **Design Studio**: `InksoftEmbed.tsx` initiates an embedded design studio for users to personalize products in real-time.

## Key Features

1. **Dynamic Content with Builder.io**:

   - **Pages**: General pages are fetched using `fetchGeneralPageContent`, allowing for a wide range of layouts and content managed directly through Builder.io.
   - **Blog Support**: The blog system fetches posts based on URL paths and can display lists of articles with `fetchPostContent`.
   - **Categories**: Category pages use `fetchCategoryPageContent` to display lists of products for specific categories.

2. **Inksoft Product Integration**:

   - **Product Listings**: Product data is fetched with `fetchProductContent` based on the URL slug. Products are displayed with live pricing and design options from Inksoft.
   - **Embedded Design Studio**: Users can customize products through an embedded design studio powered by Inksoft, allowing for a more interactive and engaging shopping experience.

3. **SEO Optimization**:

   - **SEO Headers**: The `SEOHeader` component manages SEO metadata, including Open Graph and Twitter tags.
   - **Structured Data**: Product pages include structured data to improve search engine ranking and enhance visibility in Google search results.

4. **Utilities**:
   - **Reading Time Calculator**: Blog posts show estimated reading time using the `calculateReadingTime` utility.
   - **Slug Mapping**: `friendly_urls.ts` maps user-friendly slugs to product IDs for quick reference and API requests.

## Code Example

A simple example of how product data is fetched from Inksoft and displayed on the product page:

```typescript
import { fetchProductContent } from "../util/fetchProductContent";

export async function getStaticProps({ params }) {
  const slug = params.slug;
  const productData = await fetchProductContent(slug);

  return {
    props: {
      productData,
    },
  };
}
```

This allows products to be dynamically generated based on URL slugs, with data directly sourced from Inksoft.

## Development Notes

- **Environment Variables**: The Builder.io API key should be stored securely in `.env.local`.
- **TypeScript**: The project is fully typed with TypeScript, ensuring type safety and better development experience.
- **Error Handling**: API fetches use try-catch blocks to log errors without disrupting the user experience.
