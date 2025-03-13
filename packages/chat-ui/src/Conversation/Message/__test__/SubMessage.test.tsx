import { render, screen, fireEvent } from "@testing-library/react";
import { SubMessage } from "../SubMessage";
import { ChatContext } from "../../../ChatContext";
import { vi } from "vitest";
import "@testing-library/jest-dom"; // Ensure Jest DOM matchers are available

// Fix: Correctly mock named and default exports
vi.mock("../MessageContent", () => ({
    default: ({ setShowReactionsPicker }: { setShowReactionsPicker: (value: boolean) => void }) => (
      <div data-testid="message-content">
        Mock Message Content
        <button
          data-testid="reaction-button"
          onClick={() => setShowReactionsPicker(true)} // Ensure state updates
        >
          😊
        </button>
      </div>
    ),
  }));
  

vi.mock("../ReactionPicker", () => ({
  default: () => <div data-testid="reaction-picker">Mock Reaction Picker</div>,
}));

vi.mock("../Reactions", () => ({
  Reactions: () => <div data-testid="reactions">Mock Reactions</div>, // Named export fix
}));

describe("SubMessage Component", () => {
  const mockSocket = { on: vi.fn(), emit: vi.fn() };
  const mockReply = { id: "123", sender: "JohnDoe", message: "Hello!", reactions: {} };

  it("renders SubMessage correctly", () => {
    render(
      <ChatContext.Provider value={{ userName: "JohnDoe", id: "456" }}>
        <SubMessage reply={mockReply} user="JohnDoe" socket={mockSocket} email="john@example.com" addReaction={vi.fn()} />
      </ChatContext.Provider>
    );

    expect(screen.getByTestId("submessage-container")).toBeInTheDocument();
    expect(screen.getByTestId("message-content")).toBeInTheDocument();
  });

it.skip("shows the ReactionPicker when triggered", () => {
    render(
        <ChatContext.Provider value={{ userName: "JohnDoe", id: "456" }}>
            <SubMessage reply={mockReply} user="JohnDoe" socket={mockSocket} email="john@example.com" addReaction={vi.fn()} />
        </ChatContext.Provider>
    );

    // Click the reaction button
    fireEvent.click(screen.getByTestId("reaction-button"));

    // Ensure ReactionPicker is shown
    expect(screen.getByTestId("reaction-picker")).toBeInTheDocument();
});

  it("renders reactions when available", () => {
    const mockReplyWithReactions = {
      ...mockReply,
      reactions: { "john@example.com": ["😂"] },
    };

    render(
      <ChatContext.Provider value={{ userName: "JohnDoe", id: "456" }}>
        <SubMessage reply={mockReplyWithReactions} user="JohnDoe" socket={mockSocket} email="john@example.com" addReaction={vi.fn()} />
      </ChatContext.Provider>
    );

    expect(screen.getAllByTestId("reactions")[0]).toBeInTheDocument();
  });
});
