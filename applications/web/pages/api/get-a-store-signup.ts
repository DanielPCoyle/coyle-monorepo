import { getDB } from "@coyle/database/db";
import { getAStoreSignUps } from "@coyle/database/schema";
import { NextApiRequest, NextApiResponse } from "next";

interface SignupRequestBody {
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  storeDomain: string;
  customDomain: string;
  products: string;
  orderFulfillment: string;
  additionalRequests: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const {
    organizationName,
    contactPerson,
    email,
    phone,
    website,
    storeDomain,
    customDomain,
    products,
    orderFulfillment,
    additionalRequests,
  }: SignupRequestBody = req.body;

  // Convert "yes"/"no" from the form to a boolean value
  const hasCustomDomain = customDomain === "yes";

  try {
    const db = getDB();
    const result = await db.insert(getAStoreSignUps).values({
      organizationName,
      contactPerson,
      email,
      phone,
      website,
      storeDomain,
      customDomain: hasCustomDomain,
      products,
      orderFulfillment,
      additionalRequests,
    }).returning()
    .execute();

    res.status(200).json({ message: "Signup Successful", data: result });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Database Insertion Error", error });
  }
}
