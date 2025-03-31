import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import Page, { getServerSideProps } from "../pages/products"; // adjust if needed

// Mocks
vi.mock("@builder.io/react", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual, // keeps original exports like `builder`
    BuilderComponent: (props: any) => (
      <div data-testid="builder-component" data-props={JSON.stringify(props)} />
    ),
    useIsPreviewing: vi.fn(() => false), // override this
  };
});

vi.mock("../components/layout/Navigation", () => ({
  default: () => <nav>MockNav</nav>,
}));

vi.mock("@coyle/chat-ui/src/ChatCaddy", () => ({
  ChatCaddy: () => <div>MockChat</div>,
}));

vi.mock("../util/fetchProducts", () => ({
  fetchProducts: vi.fn(),
}));

const useIsPreviewingMock = vi.fn(() => false);

const mockPage = {
  id: "test-page-id",
  data: {
    title: "Mock Page",
  },
};

describe("Builder Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders BuilderComponent when page exists", () => {
    render(<Page page={mockPage} />);
    expect(screen.getByTestId("builder-component")).toBeInTheDocument();
    expect(screen.getByText("MockNav")).toBeInTheDocument();
    expect(screen.getByText("MockChat")).toBeInTheDocument();
  });

  it.skip("shows 404 page when no content and not previewing", () => {
    // override the mock to return false for previewing
    vi.mocked(require("@builder.io/react").useIsPreviewing).mockReturnValueOnce(
      false,
    );

    render(<Page page={null} />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("fetches products on load", async () => {
    const { fetchProducts } = await import("../util/fetchProducts");
    render(<Page page={mockPage} />);

    expect(fetchProducts).toHaveBeenCalled();
  });
});

describe("getServerSideProps", () => {
  it("returns content as props", async () => {
    const builder = await import("@builder.io/react");
    vi.spyOn(builder.builder, "get").mockReturnValueOnce({
      toPromise: () =>
        Promise.resolve({
          id: "server-page",
          data: { title: "SSR Page" },
        }),
    } as any);

    const result = await getServerSideProps({} as any);

    expect(result).toEqual({
      props: {
        page: {
          id: "server-page",
          data: { title: "SSR Page" },
        },
      },
    });
  });
});
