import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, beforeEach } from "vitest";
import { ReplyModal } from "../ReplyModal";
import { MessageContext } from "../../MessageContext";
import { ChatContext } from "../../../../ChatContext";
import { CloseIcon } from "../../../../../assets/svg/CloseIcon";
import Modal from "react-modal";
import dotenv from "dotenv";
import "@testing-library/jest-dom";

dotenv.config();
// Mock Modal to avoid issues with testing-library
Modal.setAppElement = vi.fn();

const mockSetShowReplyModal = vi.fn();
const mockAddReaction = vi.fn();

const mockMessageContext = {
  showReplyModal: true,
  setShowReplyModal: mockSetShowReplyModal,
  message: { id: "1", text: "Test message", replies: [] },
  showReactionsPicker: false,
  reactionsPickerRef: { current: null },
  addReaction: mockAddReaction,
};

const mockChatContext = {
  user: { id: "123", name: "Test User" },
  email: "test@example.com",
  socket: {},
};

vi.mock("../../../ChatControls", () => ({
  ChatControls: vi.fn(() => <div data-testid="chat-controls">Mock ChatControls</div>),
}));



// Utility to render the component with contexts
const renderWithProviders = () => {
  return render(
    <MessageContext.Provider value={mockMessageContext}>
      <ChatContext.Provider value={mockChatContext}>
        <ReplyModal />
      </ChatContext.Provider>
    </MessageContext.Provider>
  );
};

describe("ReplyModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the modal when showReplyModal is true", () => {
    renderWithProviders();
    expect(screen.getByText("Replying to...")).toBeInTheDocument();
  });

  it("calls setShowReplyModal when close button is clicked", () => {
    renderWithProviders();
    const closeButton = screen.getByTestId("close-modal");
    fireEvent.click(closeButton);
    expect(mockSetShowReplyModal).toHaveBeenCalledWith(false);
  });

  it("does not render the reaction picker when showReactionsPicker is false", () => {
    renderWithProviders();
    expect(screen.queryByTestId("reaction-picker")).not.toBeInTheDocument();
  });
});
