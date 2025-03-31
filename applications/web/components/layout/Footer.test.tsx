import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";
import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Mock next/link to render plain <a> tags
vi.mock("next/link", () => ({
  default: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

// Mock FontAwesomeIcon so it doesn't break the test
vi.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon }: any) => <span>{icon.iconName}</span>,
}));

afterEach(() => {
  cleanup();
});

describe("Footer", () => {
  it("renders company name", () => {
    render(<Footer />);
    expect(
      screen.getByText("Philadelphia Screen Printing"),
    ).toBeInTheDocument();
  });

  it("renders terms and privacy links", () => {
    render(<Footer />);
    expect(screen.getByText("Terms & Conditions")).toHaveAttribute(
      "href",
      "/terms",
    );
    expect(screen.getByText("Privacy Policy")).toHaveAttribute(
      "href",
      "/privacy",
    );
  });

  it("renders social media icons with correct links", () => {
    render(<Footer />);

    const links = screen.getAllByRole("link");
    const twitter = links.find(
      (link) => link.getAttribute("href") === "https://twitter.com/yourtwitter",
    );
    const facebook = links.find(
      (link) =>
        link.getAttribute("href") === "https://facebook.com/yourfacebook",
    );
    const instagram = links.find(
      (link) =>
        link.getAttribute("href") === "https://instagram.com/yourinstagram",
    );

    expect(twitter).toBeDefined();
    expect(facebook).toBeDefined();
    expect(instagram).toBeDefined();
  });

  it("displays the current year in copyright", () => {
    const currentYear = new Date().getFullYear();
    render(<Footer />);

    const matches = screen.getAllByText(
      new RegExp(`©\\s*${currentYear}\\s*Philadelphia Screen Printing`, "i"),
    );

    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0]).toBeInTheDocument();
  });
});
