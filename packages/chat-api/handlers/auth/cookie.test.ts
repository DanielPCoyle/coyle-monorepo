import { describe, it, expect, vi, beforeEach } from "vitest";
import handler from "./cookie"; // Adjust path
import { handleCors } from "@simpler-development/chat-api/utils/handleCors";

vi.mock("../../../middlewares/handleCors", () => ({
  handleCors: vi.fn(),
}));

describe("GET /api/auth/token", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      method: "GET",
      headers: {},
    };

    res = {
      status: vi.fn(() => res),
      json: vi.fn(),
      setHeader: vi.fn(),
      end: vi.fn(),
    };

    vi.clearAllMocks();
    process.env.REACT_APP_COOKIE_DOMAIN = "test.local";
  });

  it("should return the jwt cookie if present", async () => {
    req.headers.cookie = "jwt=test-token; other=ignored";

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ jwt: "test-token" });
  });

  it("should return 401 if no cookie header", async () => {
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "No cookies found",
      cookieDomain: "test.local",
    });
  });

  it("should return 401 if jwt cookie is missing", async () => {
    req.headers.cookie = "other=value";

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "jwt cookie missing",
    });
  });

  it("should return 405 if method is not GET", async () => {
    req.method = "POST";

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({
      message: "Method not allowed",
    });
  });
});
