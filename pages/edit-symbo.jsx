import { BuilderComponent, builder } from '@builder.io/react';

// Replace with your Public API Key.
builder.init("4836aef3221441d0b11452a63e08992e");

export default function Page() {
  return <BuilderComponent model="symbol" />
}