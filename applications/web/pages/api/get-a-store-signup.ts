import { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../database/db";
import { getAStoreSignUps } from "../../database/schema";

interface SignupRequestBody {
  organization_name: string;
  contact_person: string;
  email: string;
  phone: string;
  website: string;
  store_domain: string;
  custom_domain: string;
  products: string;
  order_fulfillment: string;
  additional_requests: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const {
    organization_name,
    contact_person,
    email,
    phone,
    website,
    store_domain,
    custom_domain,
    products,
    order_fulfillment,
    additional_requests,
  }: SignupRequestBody = req.body;

  // Convert "yes"/"no" from the form to a boolean value
  const has_custom_domain = custom_domain === "yes";

  try {
    const db = getDB();
    const result = await db.insert(getAStoreSignUps).values({
      organization_name,
      contact_person,
      email,
      phone,
      website,
      store_domain,
      custom_domain: has_custom_domain,
      products,
      order_fulfillment,
      additional_requests,
    }).returning()
    .execute();

    res.status(200).json({ message: "Signup Successful", data: result });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Database Insertion Error", error });
  }
}
