// builder-register.ts
import { Builder } from "@builder.io/react";
import DesignerEmbed from "./InksoftEmbed";
import PriceRange from "./PriceRange";

// Register the component with Builder.io
Builder.registerComponent(DesignerEmbed, {
  name: "DesignerEmbed",
  inputs: [
    {
      name: "productId",
      type: "number",
      defaultValue: 0,
      required: true,
      helperText: "The product ID for the Inksoft embed",
    },
    {
      name: "designId",
      type: "number",
      defaultValue: 0,
      required: false,
      helperText: "The design ID for the Inksoft embed",
    },
    {
      name: "styleId",
      type: "number",
      defaultValue: 0,
      required: false,
      helperText: "The style ID for the Inksoft embed",
    },
  ],
});



Builder.registerComponent(PriceRange, {
  name: "PriceRange",
  inputs: [],
});
