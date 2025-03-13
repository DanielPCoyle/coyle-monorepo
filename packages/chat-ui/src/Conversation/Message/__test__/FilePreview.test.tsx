import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import { FilePreview } from "../FilePreview";
import ChatContext from "../../../ChatContext";
import "@testing-library/jest-dom";

describe("FilePreview", () => {
  const mockSetModalSource = vi.fn();
  const mockSetModalIndex = vi.fn();

  const renderWithContext = (ui: React.ReactNode, files: string[] = []) => {
    return render(
      <ChatContext.Provider
        value={{
          setModalSource: mockSetModalSource,
          setModalIndex: mockSetModalIndex,
        }}
      >
        {ui}
      </ChatContext.Provider>
    );
  };

  it("renders the file preview container when files are present", () => {
    renderWithContext(<FilePreview message={{ files: ["file1.jpg"] }} />);

    expect(screen.getByTestId("file-preview")).toBeInTheDocument();
  });

  it("does not render the file preview container when no files are present", () => {
    renderWithContext(<FilePreview message={{ files: [] }} />);

    expect(screen.queryByTestId("file-preview")).not.toBeInTheDocument();
  });

  it("renders multiple images when files are provided", () => {
    const files = ["file1.jpg", "file2.jpg"];
    renderWithContext(<FilePreview message={{ files }} />);

    const images = screen.getAllByTestId("file-preview-image");
    expect(images.length).toBe(files.length);
  });

  it("calls setModalSource and setModalIndex when an image is clicked", () => {
    const files = ["file1.jpg", "file2.jpg"];
    renderWithContext(<FilePreview message={{ files }} />);

    const images = screen.getAllByTestId("file-preview-image");
    fireEvent.click(images[0]);

    expect(mockSetModalSource).toHaveBeenCalledWith(files);
    expect(mockSetModalIndex).toHaveBeenCalledWith(0);
  });
});
