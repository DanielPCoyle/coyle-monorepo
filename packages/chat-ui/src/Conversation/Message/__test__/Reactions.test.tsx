import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { Reactions } from "../Reactions";
import { ChatContext } from "../../../ChatContext";
import "@testing-library/jest-dom";


// Mocking the ChatContext provider to simulate user email
const mockRemoveReactions = vi.fn();

describe("Reactions Component", () => {
  it("renders reactions correctly based on props", () => {
    const mockEmail = "john@example.com";
    const reactions = {
      "john@example.com": ["😂", "😍"],
      "jane@example.com": ["😎"],
    };

    render(
      <ChatContext.Provider value={{ email: mockEmail }}>
        <Reactions
          isSender={true}
          reactions={reactions}
          removeReactions={mockRemoveReactions}
        />
      </ChatContext.Provider>
    );

    // Ensure the reactions are rendered
    expect(screen.getByText("😂")).toBeInTheDocument();
    expect(screen.getByText("😍")).toBeInTheDocument();
    expect(screen.getByText("😎")).toBeInTheDocument();
  });

  it("removes reactions when clicked and email matches", () => {
    const mockEmail = "john@example.com";
    const reactions = {
      "john@example.com": ["😂", "😍"],
      "jane@example.com": ["😎"],
    };

    render(
      <ChatContext.Provider value={{ email: mockEmail }}>
        <Reactions
          isSender={true}
          reactions={reactions}
          removeReactions={mockRemoveReactions}
        />
      </ChatContext.Provider>
    );

    // Click on the reaction
    fireEvent.click(screen.getByText("😂"));

    // Ensure removeReactions is called with the correct emoji
    expect(mockRemoveReactions).toHaveBeenCalledWith({ emoji: "😂" });

    // Click on another user's reaction (should not call removeReactions)
    fireEvent.click(screen.getByText("😎"));
    expect(mockRemoveReactions).toHaveBeenCalledTimes(1); // Only the first reaction should trigger it
  });

  it("renders reactions aligned correctly based on isSender prop", () => {
    const mockEmail = "john@example.com";
    const reactions = {
      "john@example.com": ["😂", "😍"],
      "jane@example.com": ["😎"],
    };

    // Render with isSender = true
    const { container: senderContainer } = render(
      <ChatContext.Provider value={{ email: mockEmail }}>
        <Reactions
          isSender={true}
          reactions={reactions}
          removeReactions={vi.fn()}
        />
      </ChatContext.Provider>
    );

    const senderReactionsContainer = senderContainer.querySelector(".reactionsContainer");
    expect(senderReactionsContainer).toHaveStyle("justify-content: flex-end");

    // Render again with isSender = false
    const { container: receiverContainer } = render(
      <ChatContext.Provider value={{ email: mockEmail }}>
        <Reactions
          isSender={false}
          reactions={reactions}
          removeReactions={vi.fn()}
        />
      </ChatContext.Provider>
    );

    const receiverReactionsContainer = receiverContainer.querySelector(".reactionsContainer");
    expect(receiverReactionsContainer).toHaveStyle("justify-content: flex-start");
  });
});
