import React from "react";

import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { ReactionPicker } from "../Reactions/ReactionPicker";
import { ChatContext } from "../../../ChatContext";
import { MessageContext } from "../MessageContext";
import { createRef } from "react";
import "@testing-library/jest-dom";

// Mock the EmojiPicker component
vi.mock("emoji-picker-react", () => ({
  __esModule: true,
  default: ({ onReactionClick }: { onReactionClick: (emoji: string) => void }) => (
    <button
      data-testid="mock-emoji-picker"
      onClick={() => onReactionClick("😂")}
    >
      Mock Emoji Picker
    </button>
  ),
}));

describe("ReactionPicker Component", () => {
  it("renders without crashing and applies correct text alignment", () => {
    const mockAddReaction = vi.fn();
    const mockMessage = { sender: "JohnDoe" };
    const mockUserName = "JohnDoe";
    const reactionsPickerRef = createRef<HTMLDivElement>();

    render(
      <ChatContext.Provider value={{ userName: mockUserName }}>
        <MessageContext.Provider value={{ message: mockMessage, addReaction: mockAddReaction }}>
          <ReactionPicker reactionsPickerRef={reactionsPickerRef} />
        </MessageContext.Provider>
      </ChatContext.Provider>
    );

    // Ensure container is rendered
    expect(screen.getByTestId("reaction-picker-container")).toBeInTheDocument();

    // Ensure emoji picker is rendered (mocked)
    expect(screen.getByTestId("mock-emoji-picker")).toBeInTheDocument();

    // Check that text alignment is correct
    const container = screen.getByTestId("reaction-picker-container");
    expect(container).toHaveStyle("text-align: right"); // because sender matches userName
  });

  it("calls addReaction when an emoji is clicked", () => {
    const mockAddReaction = vi.fn();
    const mockMessage = { sender: "JaneDoe" };
    const mockUserName = "JohnDoe";
    const reactionsPickerRef = createRef<HTMLDivElement>();

    render(
      <ChatContext.Provider value={{ userName: mockUserName }}>
        <MessageContext.Provider value={{ message: mockMessage, addReaction: mockAddReaction }}>
          <ReactionPicker reactionsPickerRef={reactionsPickerRef} />
        </MessageContext.Provider>
      </ChatContext.Provider>
    );

    // Click the mock emoji picker button
    screen.getByTestId("mock-emoji-picker").click();

    // Ensure addReaction was called with the correct emoji
    expect(mockAddReaction).toHaveBeenCalledWith("😂");
  });
});
