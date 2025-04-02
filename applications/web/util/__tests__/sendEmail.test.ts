import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendEmail } from "../sendEmail"; // adjust path if needed
import nodemailer from "nodemailer";

vi.mock("nodemailer", async () => {
  const actual: typeof import("nodemailer") =
    await vi.importActual("nodemailer");

  return {
    ...actual,
    default: {
      ...actual,
      createTransport: vi.fn(),
    },
  };
});

describe("sendEmail", () => {
  const sendMailMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // mock nodemailer.createTransport to return object with sendMail
    (nodemailer as unknown as any).createTransport.mockReturnValue({
      sendMail: sendMailMock,
    });

    // Set environment variables
    process.env.NEXT_PUBLIC_EMAIL = "test@example.com";
    process.env.NEXT_PUBLIC_EMAIL_APP_PASSWORD = "password";
  });

  it("should send an email successfully", async () => {
    sendMailMock.mockResolvedValueOnce({});

    await sendEmail({
      to: "user@example.com",
      subject: "Test Subject",
      text: "<p>Hello</p>",
    });

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: "gmail",
      auth: {
        user: "test@example.com",
        pass: "password",
      },
    });

    expect(sendMailMock).toHaveBeenCalledWith({
      from: "test@example.com",
      to: "user@example.com",
      subject: "Test Subject",
      html: "<p>Hello</p>",
    });
  });

  it("should catch and log error on failure", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    sendMailMock.mockRejectedValueOnce(new Error("SMTP failed"));

    await sendEmail({
      to: "fail@example.com",
      subject: "Oops",
      text: "<p>Error Test</p>",
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error sending email to fail@example.com:",
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });
});
