import { createClient } from "@supabase/supabase-js";

export const uploadFileToSupabase = async (file) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing env variables for Supabase");
    return;
  }
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const filePath = `public/${uniqueSuffix}-${file.name}`;
  const { error } = await supabase.storage
    .from("messages") // Replace with your bucket name
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Error uploading file:", error);
    return null;
  }

  const { data: publicURLData } = supabase.storage
    .from("messages")
    .getPublicUrl(filePath);

  return publicURLData.publicUrl;
};
