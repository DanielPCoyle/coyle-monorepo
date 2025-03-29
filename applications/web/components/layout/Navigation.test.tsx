import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Navigation from "./Navigation";
import { describe, it, expect, vi, afterEach } from "vitest";

// Mock next/image
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} alt={props.alt || "mocked-image"} />;
  },
}));

// Mock next/link
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const navData = [
  {
    title: "Shop",
    url: "/shop",
    subLinks: [
      {
        title: "Hoodies",
        url: "/shop/hoodies",
      },
    ],
  },
  {
    title: "About",
    url: "/about",
  },
];

afterEach(() => {
  cleanup();
});

describe("Navigation", () => {
  it("renders logo and phone number", () => {
    render(<Navigation navData={navData} />);
    expect(screen.getByAltText("Logo")).toBeInTheDocument();
    expect(screen.getAllByText("215-771-9404").length).toBe(2); // both mobile + desktop
  });

  it("renders nav items and sublinks", () => {
    render(<Navigation navData={navData} />);
    expect(screen.getByText("Shop")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Hoodies")).toBeInTheDocument();
  });

  it("toggles mobile menu when menu button is clicked", () => {
    render(<Navigation navData={navData} />);
    const toggleButton = screen.getByRole("button");
    fireEvent.click(toggleButton);

    const navList = screen.getByText("Shop").closest("ul");
    expect(navList?.className).toMatch(/open/);

    fireEvent.click(screen.getByText("Shop"));
    expect(navList?.className).not.toMatch(/open/);
  });

  it("loads iframe after mount", () => {
    render(<Navigation navData={navData} />);
    const iframe = screen.getByTestId("cart-frame");
    const iframeEl = screen.getByTestId("cart-frame");
    const iframeSrc = iframeEl?.getAttribute("src") ?? "";

    expect(iframeSrc).toContain("cartOnly=true");
  });
});
