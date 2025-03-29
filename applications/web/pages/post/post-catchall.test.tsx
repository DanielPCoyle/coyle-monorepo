import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Page, { getStaticProps, getStaticPaths } from "./[[...page]]";
import fs from "fs";

// ------------------ Mock Builder ------------------

// 👇 hoisted mock block — must be first
vi.mock("@builder.io/react", async () => {
  const builderMocks = {
    mockUseIsPreviewing: vi.fn(),
    mockGet: vi.fn(),
    mockGetAll: vi.fn(),
  };

  const actual =
    await vi.importActual<typeof import("@builder.io/react")>(
      "@builder.io/react",
    );

  return {
    ...actual,
    useIsPreviewing: builderMocks.mockUseIsPreviewing,
    BuilderComponent: ({ content }: any) => (
      <div data-testid="builder">{content?.data?.title}</div>
    ),
    builder: {
      init: vi.fn(),
      get: builderMocks.mockGet,
      getAll: builderMocks.mockGetAll,
    },
  };
});

vi.mock("../../components/layout/Navigation", () => ({
  default: () => <nav>MockNav</nav>,
}));

// ------------------ Tests ------------------

describe("[...page].tsx", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders BuilderComponent when page exists", () => {
    mockUseIsPreviewing.mockReturnValue(false);

    render(<Page page={{ data: { title: "Test Page" } }} blogData={{}} />);

    expect(screen.getByTestId("builder")).toHaveTextContent("Test Page");
    expect(screen.getByText("MockNav")).toBeInTheDocument();
  });

  it("shows 404 when no content and not previewing", () => {
    mockUseIsPreviewing.mockReturnValue(false);

    render(<Page page={null} blogData={null} />);

    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("does not show 404 when previewing", () => {
    mockUseIsPreviewing.mockReturnValue(true);

    render(<Page page={null} blogData={null} />);

    expect(screen.getByTestId("builder")).toBeInTheDocument();
  });

  it("getStaticProps returns page + blogData", async () => {
    mockGet
      .mockReturnValueOnce({
        toPromise: () => Promise.resolve({ data: { title: "Static Title" } }),
      }) // page
      .mockReturnValueOnce({}); // blog

    const result = await getStaticProps({
      params: { page: ["custom", "slug"] },
    } as any);

    expect(result).toEqual({
      props: {
        page: { data: { title: "Static Title" } },
        blogData: {},
      },
      revalidate: 5,
    });
  });

  it("getStaticPaths returns all Builder blog slugs", async () => {
    const builder = await vi.importMock<any>("@builder.io/react");
    builder.__mocks__.getAll.mockResolvedValue([
      { data: { slug: "/test-slug" } },
      { data: { slug: "/another-post" } },
      { data: { slug: "" } }, // Should be filtered
    ]);

    const result = await getStaticPaths();

    expect(result).toEqual({
      paths: ["/post/test-slug", "/post/another-post"],
      fallback: "blocking",
    });
  });
});
