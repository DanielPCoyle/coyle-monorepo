import { BuilderComponent, builder } from "@builder.io/react";
const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY!;
builder.init(apiKey);
export const EditSymbol = () => {
  return (
    <BuilderComponent
      model="symbol"
      options={{
        enrich: true,
      }}
    />
  );
};

export default EditSymbol;
