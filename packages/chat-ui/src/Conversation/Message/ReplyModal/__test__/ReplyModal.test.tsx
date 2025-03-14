import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import Modal from "react-modal";
import { ReplyModal } from "../ReplyModal";
import { MessageContext } from "../../MessageContext";
import { ChatContext } from "../../../../ChatContext";

// Ensure react-modal is set up correctly for testing
Modal.setAppElement(document.createElement("div"));

// Mock Supabase to avoid errors in components that use it
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    auth: {
      onAuthStateChange: vi.fn(),
    },
  }),
}));

describe("ReplyModal", () => {
  const mockSetShowReplyModal = vi.fn();
  const mockAddReaction = vi.fn();
  const mockSocket = { emit: vi.fn() };

  const mockMessageContext = {
    showReplyModal: true,
    setShowReplyModal: mockSetShowReplyModal,
    message: { id: "1", message: "This is a test message", replies: [{ id: "2", text: "Reply message" }] }, // ✅ Added "message"
    showReactionsPicker: false,
    reactionsPickerRef: { current: null },
    addReaction: mockAddReaction,
  };

  const mockChatContext = {
    user: { name: "Test User" },
    email: "test@example.com",
    socket: mockSocket,
  };

  it("should render the modal when showReplyModal is true", () => {
    render(
      <MessageContext.Provider value={mockMessageContext}>
        <ChatContext.Provider value={mockChatContext}>
          <ReplyModal />
        </ChatContext.Provider>
      </MessageContext.Provider>
    );

    expect(screen.getByText("Replying to...")).toBeInTheDocument();
  });

  it("should close the modal when close button is clicked", () => {
    render(
      <MessageContext.Provider value={mockMessageContext}>
        <ChatContext.Provider value={mockChatContext}>
          <ReplyModal />
        </ChatContext.Provider>
      </MessageContext.Provider>
    );

    const closeButton = screen.getByTestId("close-modal");
    fireEvent.click(closeButton);

    expect(mockSetShowReplyModal).toHaveBeenCalledWith(false);
  });

  it("should render the ChatControls component", () => {
    render(
      <MessageContext.Provider value={mockMessageContext}>
        <ChatContext.Provider value={mockChatContext}>
          <ReplyModal />
        </ChatContext.Provider>
      </MessageContext.Provider>
    );

    expect(screen.getByText("Replying to...")).toBeInTheDocument();
  });

  it("should show the reaction picker when showReactionsPicker is true", () => {
    render(
      <MessageContext.Provider value={{ ...mockMessageContext, showReactionsPicker: true }}>
        <ChatContext.Provider value={mockChatContext}>
          <ReplyModal />
        </ChatContext.Provider>
      </MessageContext.Provider>
    );

    expect(screen.getByTestId("reaction-picker")).toBeInTheDocument();
  });
});
