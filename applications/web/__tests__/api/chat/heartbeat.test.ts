import { describe, it, expect, vi, beforeEach } from "vitest";
import handler from "../../../pages/api/heartbeat"; // Adjust path to your file
import type { NextApiRequest, NextApiResponse } from "next";

describe("GET /api/status", () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    req = { method: "GET" };

    res = {
      status: vi.fn(() => res),
      json: vi.fn(),
      setHeader: vi.fn(),
      end: vi.fn(),
    };
  });

  it("should return 200 and a timestamp on GET", async () => {
    await handler(req as any, res as any);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "ok",
        timestamp: expect.any(String),
      }),
    );
  });

  it("should return 405 for non-GET methods", async () => {
    req.method = "POST";

    await handler(req as any, res as any);

    expect(res.setHeader).toHaveBeenCalledWith("Allow", ["GET"]);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.end).toHaveBeenCalledWith("Method POST Not Allowed");
  });
});
