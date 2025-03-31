import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Page, { getServerSideProps } from "../pages/blog"; // Adjust path
import { a } from "vitest/dist/chunks/suite.d.FvehnV49";

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

// Mock child components
vi.mock("../components/layout/Footer", () => ({
  default: () => <footer>MockFooter</footer>,
}));

vi.mock("../components/layout/Navigation", () => ({
  default: () => <nav>MockNav</nav>,
}));

vi.mock("@coyle/chat-ui/src/ChatCaddy", () => ({
  ChatCaddy: () => <div>MockChat</div>,
}));
global.fetch = vi.fn();

const mockPosts = [
  {
    data: {
      slug: "test-post",
      featuredImage: "/test.jpg",
      title: "Test Post",
      tagLine: "Test Tagline",
    },
    createdDate: "2024-03-27T00:00:00.000Z",
  },
];

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("Page Component", () => {
  beforeEach(() => {
    (fetch as vi.Mock).mockReset();
  });

  it("renders initial blog posts", () => {
    render(
      <Page initialPosts={mockPosts} initialPage={1} hasMorePosts={true} />,
    );
    expect(screen.getByText("PhilaPrints' Latest Posts")).toBeInTheDocument();
    expect(screen.getByText("Test Post")).toBeInTheDocument();
  });

  it("disables 'Newer' button on first page", () => {
    render(
      <Page initialPosts={mockPosts} initialPage={1} hasMorePosts={true} />,
    );
    expect(screen.getByText("Newer")).toBeDisabled();
  });

  it("fetches next page of posts on 'Older' click", async () => {
    (fetch as vi.Mock).mockResolvedValueOnce({
      json: async () => ({ results: mockPosts }),
    });

    render(
      <Page initialPosts={mockPosts} initialPage={1} hasMorePosts={true} />,
    );

    fireEvent.click(screen.getByText("Older"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
      expect(screen.getByText("Test Post")).toBeInTheDocument();
    });
  });

  it("fetches previous page on 'Newer' click", async () => {
    (fetch as vi.Mock).mockResolvedValueOnce({
      json: async () => ({ results: mockPosts }),
    });

    render(
      <Page initialPosts={mockPosts} initialPage={2} hasMorePosts={true} />,
    );
    fireEvent.click(screen.getByText("Newer"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });
});

describe("getServerSideProps", () => {
  it("fetches data correctly", async () => {
    (fetch as vi.Mock).mockResolvedValueOnce({
      json: async () => ({ results: mockPosts }),
    });

    const context = { query: { page: "1" } };
    const result = await getServerSideProps(context as any);
    expect(result).toEqual({
      props: {
        initialPosts: mockPosts,
        initialPage: 1,
        hasMorePosts: false, // correct based on mockPosts.length !== limit
      },
    });
  });
});
