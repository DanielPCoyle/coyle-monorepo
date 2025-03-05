import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Thumbnail } from "./Thumbnail";

vi.mock("./CloseThumbnailIcon", () => ({
  CloseThumbnailIcon: () => <div>CloseIcon</div>,
}));

describe("Thumbnail component", () => {
  const mockSetFiles = vi.fn();
  const file = new File(["dummy content"], "example.png", {
    type: "image/png",
  });
  const files = [file];

  it("should render the thumbnail image", () => {
    const { getByAltText } = render(
      <Thumbnail files={files} file={file} index={0} setFiles={mockSetFiles} />,
    );

    const imgElement = getByAltText("example.png");
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute("src", URL.createObjectURL(file));
  });

  it("should call setFiles with the correct arguments when close button is clicked", () => {
    const { getByRole } = render(
      <Thumbnail files={files} file={file} index={0} setFiles={mockSetFiles} />,
    );

    const buttonElement = getByRole("button");
    fireEvent.click(buttonElement);

    expect(mockSetFiles).toHaveBeenCalledWith([]);
  });

  it("should render the CloseThumbnailIcon", () => {
    const { getByText } = render(
      <Thumbnail files={files} file={file} index={0} setFiles={mockSetFiles} />,
    );

    const iconElement = getByText("CloseIcon");
    expect(iconElement).toBeInTheDocument();
  });
});
