import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { SubMessage } from "../SubMessage/SubMessage";
import ChatContext from "../../../../ChatContext";
import MessageContext from "../../MessageContext";
import { SubMessageType } from "../../../../../types";
import "@testing-library/jest-dom";

// Mock dependencies
vi.mock("../../MessageContent", () => ({
  default: () => <div data-testid="message-content">Message Content</div>,
}));

vi.mock("../../Reactions/ReactionPicker", () => ({
  ReactionPicker: () => <div data-testid="reaction-picker">Reaction Picker</div>,
}));

vi.mock("../../Reactions/Reactions", () => ({
  Reactions: ({ reactions }: { reactions: { [key: string]: string[] } }) => (
    <div data-testid="reactions">{Object.keys(reactions).length ? "Reactions Present" : "No Reactions"}</div>
  ),
}));

// Mock reaction handlers
vi.mock("../SubMessage/reactionHandlers/handleAddReaction", () => ({
  handleAddReaction: vi.fn(),
}));

vi.mock("../SubMessage/reactionHandlers/handleRemoveReaction", () => ({
  handleRemoveReaction: vi.fn(),
}));

vi.mock("../SubMessage/reactionHandlers/useSocketReactions", () => ({
  useSocketReactions: vi.fn(),
}));

describe("SubMessage Component", () => {
  const mockSocket = { on: vi.fn(), emit: vi.fn() } as any;
  const mockUser = { name: "TestUser" };
  const mockEmail = "test@example.com";

  const mockReply: SubMessageType = {
    id: "reply1",
    sender: "TestUser",
    text: "Hello World",
    reactions: { "👍": ["TestUser"] },
  };

  const chatContextValue = { id: "user1", userName: "TestUser" };

  it("renders SubMessage component with MessageContent", () => {
    render(
      <ChatContext.Provider value={chatContextValue}>
        <SubMessage reply={mockReply} user={mockUser} socket={mockSocket} email={mockEmail} />
      </ChatContext.Provider>
    );

    expect(screen.getByTestId("submessage-container")).toBeInTheDocument();
    expect(screen.getByTestId("message-content")).toBeInTheDocument();
  });


  it("does not show reactions when none exist", () => {
    const replyWithoutReactions = { ...mockReply, reactions: {} };

    render(
      <ChatContext.Provider value={chatContextValue}>
        <SubMessage reply={replyWithoutReactions} user={mockUser} socket={mockSocket} email={mockEmail} />
      </ChatContext.Provider>
    );

    expect(screen.queryByTestId("reactions")).not.toBeInTheDocument();
  });

  it("opens reaction picker when setShowReactionsPicker is true", () => {
    render(
      <ChatContext.Provider value={chatContextValue}>
        <MessageContext.Provider value={{ message: mockReply, setShowReactionsPicker: vi.fn() }}>
          <SubMessage reply={mockReply} user={mockUser} socket={mockSocket} email={mockEmail} />
        </MessageContext.Provider>
      </ChatContext.Provider>
    );

    expect(screen.queryByTestId("reaction-picker")).not.toBeInTheDocument();
  });

});
