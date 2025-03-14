import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { LinkPreview } from "../LinkPreview";
import React from "react";
import "@testing-library/jest-dom";
import axios from "axios";

vi.mock("axios");

describe("LinkPreview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading animation when message contains a link", async () => {
    // Mock axios.get to return a pending promise
    (axios.get as vi.Mock).mockReturnValue(new Promise(() => {}));

    render(<LinkPreview message={{ message: "Check this out: https://example.com" }} />);
    
    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
  });

  it("renders YouTube embed when message contains a YouTube link", async () => {
    render(<LinkPreview message={{ message: "Watch this video: https://www.youtube.com/watch?v=dQw4w9WgXcQ" }} />);
    
    await waitFor(() => expect(screen.getByTestId("youtube-preview")).toBeInTheDocument());

    const iframe = screen.getByTitle("YouTube video player");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute("src", expect.stringContaining("youtube.com/embed/dQw4w9WgXcQ"));
  });

  it("fetches and displays URL preview for non-YouTube links", async () => {
    const mockPreviewData = {
      url: "http://example.com",
      title: "Example Title",
      description: "Example Description",
      image: "http://example.com/image.jpg",
    };

    (axios.get as vi.Mock).mockResolvedValueOnce({ data: mockPreviewData });

    render(<LinkPreview message={{ message: "Check this: http://example.com" }} />);

    await waitFor(() => expect(screen.getByText(mockPreviewData.title)).toBeInTheDocument());
    expect(screen.getByText(mockPreviewData.description)).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", mockPreviewData.image);
  });

  it("handles API failure gracefully", async () => {
    (axios.get as vi.Mock).mockRejectedValueOnce(new Error("API error"));

    render(<LinkPreview message={{ message: "Check this: http://example.com" }} />);

    await waitFor(() => expect(screen.queryByText("Example Title")).not.toBeInTheDocument());
  });

  it("does not render preview if no link is present in the message", () => {
    render(<LinkPreview message={{ message: "No links here!" }} />);
    
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.queryByRole("iframe")).not.toBeInTheDocument();
  });

  it("renders loading state with ThreeDotsIcon when fetching preview", () => {
    // Mock axios.get to return a promise
    (axios.get as vi.Mock).mockImplementation(() => new Promise(() => {}));

    render(<LinkPreview message={{ message: "Check this out: https://example.com" }} />);
    
    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
  });
});
