import { describe, it, expect, vi, beforeEach } from "vitest";
import handler from "../../../pages/api/chat/send-message-as-email"; // Adjust path to your file
import { getAdminUsers } from "@coyle/chat-db";
import { sendEmail } from "@coyle/chat-api/utils/sendEmail";
import { handleCors } from "@coyle/chat-api/utils/handleCors";

vi.mock("@coyle/chat-db", () => ({
  getAdminUsers: vi.fn(),
}));

vi.mock("../../../util/sendEmail", () => ({
  sendEmail: vi.fn(),
}));

vi.mock("../../../middlewares/handleCors", () => ({
  handleCors: vi.fn(),
}));

describe("POST /api/send-message-email", () => {
  let req: any;
  let res: any;

  const mockAdmins = [
    { email: "active1@example.com", isActive: true },
    { email: "inactive@example.com", isActive: false },
    { email: "active2@example.com", isActive: true },
  ];

  const message = {
    sender: "John Doe",
    email: "john@example.com",
    message: "Hello admin!",
  };

  beforeEach(() => {
    req = {
      method: "POST",
      body: { message },
    };
    res = {
      status: vi.fn(() => res),
      json: vi.fn(),
      setHeader: vi.fn(),
    };

    (getAdminUsers as any).mockResolvedValue(mockAdmins);
    vi.clearAllMocks();
  });

  it("should return 405 if method is not POST", async () => {
    req.method = "GET";

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ message: "Method not allowed" });
  });

  it("should send emails to active admins and return 200", async () => {
    await handler(req, res);

    expect(getAdminUsers).toHaveBeenCalled();

    expect(sendEmail).toHaveBeenCalledTimes(2);
    expect(sendEmail).toHaveBeenCalledWith({
      to: "active1@example.com",
      subject: "New message from chat from John Doe (john@example.com)",
      text: "You have a new message from John Doe:\n\nHello admin!\n\nfrom john@example.com",
    });
    expect(sendEmail).toHaveBeenCalledWith({
      to: "active2@example.com",
      subject: "New message from chat from John Doe (john@example.com)",
      text: "You have a new message from John Doe:\n\nHello admin!\n\nfrom john@example.com",
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email sent successfully",
    });
  });

  it("should return 500 if sending emails fails", async () => {
    (sendEmail as any).mockRejectedValue(new Error("Email failure"));

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Error sending email" });
  });
});
