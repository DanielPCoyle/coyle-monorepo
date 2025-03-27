import { builder, BuilderComponent } from "@builder.io/react";

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);

export default function EditSymbolPage() {
    return <BuilderComponent model ="symbol"  />
}