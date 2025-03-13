import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Thumbnail } from "../Thumbnail";
import { CloseThumbnailIcon } from "../../../svg/CloseThumbnailIcon";
import "@testing-library/jest-dom";

// Mock CloseThumbnailIcon component
vi.mock("../../../svg/CloseThumbnailIcon", () => ({
  CloseThumbnailIcon: () => <svg data-testid="close-icon" />,
}));

describe("Thumbnail", () => {
  const mockFile = new File(["dummy content"], "test.png", { type: "image/png" });

  it("renders the image with correct src and alt text", () => {
    URL.createObjectURL = vi.fn(() => "mock-url"); // Mock createObjectURL

    render(
      <Thumbnail files={[mockFile]} file={mockFile} index={0} setFiles={() => {}} />
    );

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "mock-url");
    expect(img).toHaveAttribute("alt", "test.png");
  });

  it("calls setFiles with a new array when close button is clicked", () => {
    const setFilesMock = vi.fn();
    render(
      <Thumbnail files={[mockFile]} file={mockFile} index={0} setFiles={setFilesMock} />
    );

    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    expect(setFilesMock).toHaveBeenCalledWith([]); // Expect empty array after removal
  });

  it("renders children when provided", () => {
    render(
      <Thumbnail files={[mockFile]} file={mockFile} index={0} setFiles={() => {}}>
        <div data-testid="child">Extra Content</div>
      </Thumbnail>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
