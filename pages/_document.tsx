import { Html, Head, Main, NextScript } from "next/document";
import type { DocumentProps } from 'next/document';

export default function Document(props: DocumentProps) {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
