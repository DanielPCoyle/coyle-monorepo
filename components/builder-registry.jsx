// builder-register.js
import { Builder } from '@builder.io/react';
import DesignerEmbed from './InksoftEmbed';

// Register the component with Builder.io
Builder.registerComponent(DesignerEmbed, {
  name: 'DesignerEmbed',
  inputs: [
    {
      name: 'productId',
      type: 'number',
      defaultValue: 0,
      required: true,
      helperText: 'The product ID for the Inksoft embed',
    },
    {
      name: 'designId',
      type: 'number',
      defaultValue: 0,
      required: false,
      helperText: 'The design ID for the Inksoft embed',
    },
  ],
});