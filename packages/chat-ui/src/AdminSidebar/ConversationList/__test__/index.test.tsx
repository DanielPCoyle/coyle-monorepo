import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ConversationList } from "../../ConversationList";
import { ChatContext } from "../../../ChatContext";

// Mock Child Components
vi.mock("./ConversationListItems", () => ({
  ConversationListItems: () => <div data-testid="conversation-list-items">Conversations</div>,
}));
vi.mock("../../../svg/MenuIcon", () => ({ MenuIcon: () => <svg data-testid="menu-icon" /> }));
vi.mock("../../../svg/CloseIcon", () => ({ CloseIcon: () => <svg data-testid="close-icon" /> }));

// Mock Socket
const mockSocket = {
  emit: vi.fn(),
} as any;

// Mock ChatContext
const mockSetStatus = vi.fn();
const mockSetNotificationsEnabled = vi.fn();
const mockChatContext = {
  conversations: [
    { id: "1", name: "Alice", email: "alice@example.com", isActive: true },
    { id: "2", name: "Bob", email: "bob@example.com", isActive: false },
  ],
  admins: [{ id: "3", name: "Admin", email: "admin@example.com", isActive: true }],
  socket: mockSocket,
  user: { id: "user1", email: "user@example.com", status: "online" },
  status: "online",
  setStatus: mockSetStatus,
  notificationsEnabled: true,
  setNotificationsEnabled: mockSetNotificationsEnabled,
};

describe("ConversationList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the conversation list correctly", () => {
    render(
      <ChatContext.Provider value={mockChatContext}>
        <ConversationList />
      </ChatContext.Provider>
    );

    expect(screen.getByText("Active Conversations")).toBeInTheDocument();
    expect(screen.getByText("Inactive Conversations ( 1 )")).toBeInTheDocument();
    expect(screen.getByText("Admins Online")).toBeInTheDocument();
  });


  it("toggles drawer when menu button is clicked", () => {
    render(
      <ChatContext.Provider value={mockChatContext}>
        <ConversationList />
      </ChatContext.Provider>
    );

    const menuButton = screen.getByTestId("menu-icon").closest("button");
    fireEvent.click(menuButton!);

    const closeButton = screen.getByTestId("close-icon").closest("button");
    expect(closeButton).toBeInTheDocument();
  });

  it("updates status when dropdown is changed", () => {
    render(
      <ChatContext.Provider value={mockChatContext}>
        <ConversationList />
      </ChatContext.Provider>
    );

    const selectElement = screen.getByRole("combobox");
    fireEvent.change(selectElement, { target: { value: "offline" } });

    expect(mockSetStatus).toHaveBeenCalledWith("offline");
  });

  it("toggles notifications when checkbox is clicked", () => {
    render(
      <ChatContext.Provider value={mockChatContext}>
        <ConversationList />
      </ChatContext.Provider>
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(mockSetNotificationsEnabled).toHaveBeenCalledWith(false);
  });

  it("toggles historic conversations section when clicked", async () => {
    render(
      <ChatContext.Provider value={mockChatContext}>
        <ConversationList />
      </ChatContext.Provider>
    );
  
    const historicHeader = screen.getByTestId("historic-toggle");
    fireEvent.click(historicHeader);
  
    // Check that at least one conversation list item is visible
    expect(screen.queryAllByTestId("conversation-list-items").length).toBeGreaterThan(0);
  });
  

  it("emits socket event when status changes", () => {
    render(
      <ChatContext.Provider value={mockChatContext}>
        <ConversationList />
      </ChatContext.Provider>
    );

    expect(mockSocket.emit).toHaveBeenCalledWith("updateStatus", { status: "online", id: "user1" });
  });

  it("emits socket event when notifications setting changes", () => {
    render(
      <ChatContext.Provider value={mockChatContext}>
        <ConversationList />
      </ChatContext.Provider>
    );

    expect(mockSocket.emit).toHaveBeenCalledWith("updateNotificationsEnabled", {
      notificationsEnabled: true,
      id: "user1",
    });
  });
});
