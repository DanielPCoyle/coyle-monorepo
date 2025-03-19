import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ConversationListItems } from "../ConversationListItems";
import { ChatContext } from "../../../ChatContext";

// Mock Socket.io Client
const mockSocket = {
  emit: vi.fn(),
} as any;

// Mock ChatContext
const mockSetId = vi.fn();
const mockChatContext = {
  setId: mockSetId,
  id: "convo-1",
  user: { email: "user@example.com", name: "User" },
  status: "online",
};

describe("ConversationListItems", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders conversations correctly", () => {
    const mockConversations = [
      {
        id: "1",
        user: "Alice",
        email: "alice@example.com",
        status: "online",
        unSeenMessages: 2,
        conversationKey: "convo-1",
        isActive: true,
        name: "Alice",
      },
      {
        id: "2",
        user: "Bob",
        email: "bob@example.com",
        status: "offline",
        unSeenMessages: 0,
        conversationKey: "convo-2",
        isActive: false,
        name: "Bob",
      },
    ];

    render(
      <ChatContext.Provider value={mockChatContext}>
        <ConversationListItems
          conversations={mockConversations}
          socket={mockSocket}
          toggleDrawer={vi.fn()}
        />
      </ChatContext.Provider>
    );

    expect(screen.getByText("Alice - alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("(2)")).toBeInTheDocument();
    expect(screen.getByText("Bob - bob@example.com")).toBeInTheDocument();
  });

  it("renders 'No conversations' message when list is empty", () => {
    render(
      <ChatContext.Provider value={mockChatContext}>
        <ConversationListItems
          conversations={[]}
          socket={mockSocket}
          toggleDrawer={vi.fn()}
        />
      </ChatContext.Provider>
    );

    expect(screen.getByText("No conversations...")).toBeInTheDocument();
  });

  it("emits 'leave' event and updates context when a conversation is clicked", () => {
    const mockConversations = [
      {
        id: "1",
        user: "Alice",
        email: "alice@example.com",
        status: "online",
        unSeenMessages: 2,
        conversationKey: "convo-1",
        isActive: true,
        name: "Alice",
      },
      {
        id: "2",
        user: "Bob",
        email: "bob@example.com",
        status: "offline",
        unSeenMessages: 0,
        conversationKey: "convo-2",
        isActive: false,
        name: "Bob",
      },
    ];

    const toggleDrawerMock = vi.fn();

    render(
      <ChatContext.Provider value={mockChatContext}>
        <ConversationListItems
          conversations={mockConversations}
          socket={mockSocket}
          toggleDrawer={toggleDrawerMock}
        />
      </ChatContext.Provider>
    );

    const bobConversation = screen.getByText("Bob - bob@example.com");
    fireEvent.click(bobConversation);

    expect(mockSocket.emit).toHaveBeenCalledWith("leave", { id: "convo-1" });
    expect(mockSetId).toHaveBeenCalledWith("convo-2");
    expect(toggleDrawerMock).toHaveBeenCalledTimes(1);
  });

  it("marks the active conversation with the 'active' class", () => {
    const mockConversations = [
      {
        id: "1",
        user: "Alice",
        email: "alice@example.com",
        status: "online",
        unSeenMessages: 2,
        conversationKey: "convo-1",
        isActive: true,
        name: "Alice",
      },
      {
        id: "2",
        user: "Bob",
        email: "bob@example.com",
        status: "offline",
        unSeenMessages: 0,
        conversationKey: "convo-2",
        isActive: false,
        name: "Bob",
      },
    ];
  
    render(
      <ChatContext.Provider value={mockChatContext}>
        <ConversationListItems
          conversations={mockConversations}
          socket={mockSocket}
          toggleDrawer={vi.fn()}
        />
      </ChatContext.Provider>
    );
  
    // Get the conversation div that should be active
    const conversationItems = screen.getAllByText(/Alice - alice@example.com/i);
    
    // Find the closest `.conversationListItem`
    const activeConversation = conversationItems[0].closest(".conversationListItem");
  
    expect(activeConversation).toHaveClass("active");
  });
});
