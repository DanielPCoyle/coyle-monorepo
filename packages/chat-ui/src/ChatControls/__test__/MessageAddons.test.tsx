import React, { createRef } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MessageAddons } from "../MessageAddons";

// Mock SVG components
vi.mock("../../svg/ImageSvg", () => ({ ImageSvg: () => <svg data-testid="image-icon" /> }));

// Mock emoji-mart Picker
vi.mock("@emoji-mart/react", () => ({
  default: vi.fn(() => <div data-testid="emoji-picker">Emoji Picker</div>),
}));

describe("MessageAddons", () => {
  let handleFileUploadMock: vi.Mock;
  let setShowEmojiPickerMock: vi.Mock;
  let insertEmojiMock: vi.Mock;
  let emojiPickerRef: React.RefObject<HTMLDivElement>;

  beforeEach(() => {
    handleFileUploadMock = vi.fn();
    setShowEmojiPickerMock = vi.fn();
    insertEmojiMock = vi.fn();
    emojiPickerRef = createRef();

    render(
      <MessageAddons
        handleFileUpload={handleFileUploadMock}
        showEmojiPicker={false}
        setShowEmojiPicker={setShowEmojiPickerMock}
        emojiPickerRef={emojiPickerRef}
        insertEmoji={insertEmojiMock}
        typing={null}
      />
    );
  });

  it("renders file upload button and emoji button", () => {
    expect(screen.getByTestId("file-upload-label")).toBeInTheDocument();
    expect(screen.getByTestId("emoji-toggle-button")).toBeInTheDocument();
  });

  it("calls handleFileUpload when file input changes", () => {
    const fileInput = screen.getByTestId("file-upload-input") as HTMLInputElement;
    const file = new File(["dummy content"], "example.png", { type: "image/png" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(handleFileUploadMock).toHaveBeenCalledTimes(1);
  });

  it("toggles emoji picker when emoji button is clicked", () => {
    fireEvent.click(screen.getByTestId("emoji-toggle-button"));
    expect(setShowEmojiPickerMock).toHaveBeenCalledWith(true);
  });

  it("renders emoji picker when showEmojiPicker is true", () => {
    render(
      <MessageAddons
        handleFileUpload={handleFileUploadMock}
        showEmojiPicker={true}
        setShowEmojiPicker={setShowEmojiPickerMock}
        emojiPickerRef={emojiPickerRef}
        insertEmoji={insertEmojiMock}
        typing={null}
      />
    );
  
    expect(screen.getAllByTestId("emoji-picker").length).toBeGreaterThan(0);
  });

  it("renders typing indicator when user is typing", () => {
    render(
      <MessageAddons
        handleFileUpload={handleFileUploadMock}
        showEmojiPicker={false}
        setShowEmojiPicker={setShowEmojiPickerMock}
        emojiPickerRef={emojiPickerRef}
        insertEmoji={insertEmojiMock}
        typing={{ name: "Alice" }}
      />
    );
  
    const typingIndicators = screen.getAllByTestId("typing-indicator");
    const typingElement = typingIndicators.find(el => el.textContent?.includes("Alice is typing..."));
  
    expect(typingElement).toBeInTheDocument();
  });

  it("does not render typing indicator when no one is typing", () => {
    expect(screen.getByTestId("typing-indicator")).toHaveTextContent("");
  });
});
