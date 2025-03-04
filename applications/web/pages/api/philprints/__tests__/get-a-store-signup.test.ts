import { describe, it, expect, vi } from "vitest";
import { NextApiRequest, NextApiResponse } from "next";
import handler from "../get-a-store-signup";
import { insertGetAStoreSignup } from "@coyle/database/src/util/insertGetAStoreSignup";

vi.mock("@coyle/database/src/util/insertGetAStoreSignup");

describe("POST /api/philprints/get-a-store-signup", () => {
  it("should return 405 if method is not POST", async () => {
    const req = {
      method: "GET",
    } as NextApiRequest;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as NextApiResponse;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ message: "Method Not Allowed" });
  });

  it("should return 200 and insert data if method is POST", async () => {
    const req = {
      method: "POST",
      body: {
        organizationName: "Test Org",
        contactPerson: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        website: "https://example.com",
        storeDomain: "example-store",
        customDomain: "yes",
        products: "Test Products",
        orderFulfillment: "Test Fulfillment",
        additionalRequests: "None",
      },
    } as NextApiRequest;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as NextApiResponse;

    (insertGetAStoreSignup as vi.Mock).mockResolvedValue({ id: 1 });

    await handler(req, res);

    expect(insertGetAStoreSignup).toHaveBeenCalledWith({
      organizationName: "Test Org",
      contactPerson: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      website: "https://example.com",
      storeDomain: "example-store",
      customDomain: true,
      products: "Test Products",
      orderFulfillment: "Test Fulfillment",
      additionalRequests: "None",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Signup Successful",
      data: { id: 1 },
    });
  });

  it("should return 500 if there is a database insertion error", async () => {
    const req = {
      method: "POST",
      body: {
        organizationName: "Test Org",
        contactPerson: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        website: "https://example.com",
        storeDomain: "example-store",
        customDomain: "yes",
        products: "Test Products",
        orderFulfillment: "Test Fulfillment",
        additionalRequests: "None",
      },
    } as NextApiRequest;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as NextApiResponse;

    (insertGetAStoreSignup as vi.Mock).mockRejectedValue(new Error("Database Error"));

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Database Insertion Error",
      error: new Error("Database Error"),
    });
  });
});