import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendWelcomeEmail } from "./sendWelcomeEmail"; // Adjust path
import nodemailer from "nodemailer";

vi.mock("nodemailer", async () => {
  const actual: typeof import("nodemailer") = await vi.importActual("nodemailer");
  return {
    ...actual,
    default: {
      ...actual,
      createTransport: vi.fn(),
    },
  };
});

describe("sendWelcomeEmail", () => {
  const sendMailMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // mock createTransport to return our mocked sendMail
    (nodemailer as unknown as any).createTransport.mockReturnValue({
      sendMail: sendMailMock,
    });

    // mock env
    process.env.NEXT_PUBLIC_EMAIL = "test@example.com";
    process.env.NEXT_PUBLIC_EMAIL_APP_PASSWORD = "password";
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://test.local";
  });

  it("should send a welcome email with correct content", async () => {
    sendMailMock.mockResolvedValueOnce({});

    await sendWelcomeEmail("Alice", "alice@example.com", "temporary123");

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: "gmail",
      auth: {
        user: "test@example.com",
        pass: "password",
      },
    });

    expect(sendMailMock).toHaveBeenCalledWith({
      from: '"PhilaPrints" <info@info@philadelphiascreenprinting.com>',
      to: "alice@example.com",
      subject: "Welcome to PhilaPrints Alice!",
      text: "Thank you for joining PhilaPrints. We are excited to have you!",
      html: expect.stringContaining("temporary123"),
    });
  });

  it("should log an error if sending fails", async () => {
    const error = new Error("SMTP failure");
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    sendMailMock.mockRejectedValueOnce(error);

    await sendWelcomeEmail("Bob", "bob@example.com", "securepass");

    expect(consoleSpy).toHaveBeenCalledWith("Error sending email:", "SMTP failure");

    consoleSpy.mockRestore();
  });
});
