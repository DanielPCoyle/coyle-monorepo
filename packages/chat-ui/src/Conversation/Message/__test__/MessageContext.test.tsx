import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { MessageContent } from "../MessageContent";
import { ChatContext } from "../../../ChatContext";
import { MessageContext } from "../MessageContext";
import moment from "moment";
import "@testing-library/jest-dom"; // Ensures Jest DOM matchers are available

// Mocking FilePreview and LinkPreview components
vi.mock("../FilePreview", () => ({
  FilePreview: () => <div data-testid="file-preview">File Preview</div>,
}));

vi.mock("../LinkPreview", () => ({
  LinkPreview: () => <div data-testid="link-preview">Link Preview</div>,
}));

describe("MessageContent Component", () => {
  const mockSetShowReactionsPicker = vi.fn();
  const mockSetShowReplyModal = vi.fn();

  const mockMessage = {
    sender: "JohnDoe",
    createdAt: new Date(2025, 2, 13, 10, 30), // March 13, 2025, 10:30 AM
    message: "<p>Hello, world!</p>",
    replies: [{}, {}], // Two replies
  };

  const mockUser = { name: "JohnDoe" };

  it("renders message content correctly", () => {
    render(
      <ChatContext.Provider value={{ user: mockUser, userName: "JohnDoe" }}>
        <MessageContext.Provider
          value={{
            message: mockMessage,
            setShowReactionsPicker: mockSetShowReactionsPicker,
            setShowReplyModal: mockSetShowReplyModal,
          }}
        >
          <MessageContent />
        </MessageContext.Provider>
      </ChatContext.Provider>
    );

    // Check sender name
    expect(screen.getByText("JohnDoe@PhilaPrints")).toBeInTheDocument();

    // Check timestamp
    const formattedTime = moment(mockMessage.createdAt).format("D MMM hh:mm A");
    expect(screen.getByText(`(${formattedTime})`)).toBeInTheDocument();

    // Check message content
    expect(screen.getByText("Hello, world!")).toBeInTheDocument();
  });

  it("renders FilePreview and LinkPreview components", () => {
    render(
      <ChatContext.Provider value={{ user: mockUser, userName: "JohnDoe" }}>
        <MessageContext.Provider
          value={{
            message: mockMessage,
            setShowReactionsPicker: mockSetShowReactionsPicker,
            setShowReplyModal: mockSetShowReplyModal,
          }}
        >
          <MessageContent />
        </MessageContext.Provider>
      </ChatContext.Provider>
    );

    // Ensure file preview and link preview are rendered
    expect(screen.getByTestId("file-preview")).toBeInTheDocument();
    expect(screen.getByTestId("link-preview")).toBeInTheDocument();
  });

  it("updates state when reaction button is clicked", () => {
    render(
      <ChatContext.Provider value={{ user: mockUser, userName: "JohnDoe" }}>
        <MessageContext.Provider
          value={{
            message: mockMessage,
            setShowReactionsPicker: mockSetShowReactionsPicker,
            setShowReplyModal: mockSetShowReplyModal,
          }}
        >
          <MessageContent />
        </MessageContext.Provider>
      </ChatContext.Provider>
    );

    // Click the reaction button
    fireEvent.click(screen.getByText("😊"));

    // Ensure state update function was called
    expect(mockSetShowReactionsPicker).toHaveBeenCalledWith(true);
  });

  it("updates state when reply button is clicked", () => {
    render(
      <ChatContext.Provider value={{ user: mockUser, userName: "JohnDoe" }}>
        <MessageContext.Provider
          value={{
            message: mockMessage,
            setShowReactionsPicker: mockSetShowReactionsPicker,
            setShowReplyModal: mockSetShowReplyModal,
          }}
        >
          <MessageContent />
        </MessageContext.Provider>
      </ChatContext.Provider>
    );

    // Click the reply button
    fireEvent.click(screen.getByRole("button", { name: "2" })); // Replies count is 2

    // Ensure state update function was called
    expect(mockSetShowReplyModal).toHaveBeenCalledWith(true);
  });

  it("renders sender avatar correctly based on user name", () => {
    render(
      <ChatContext.Provider value={{ user: mockUser, userName: "JohnDoe" }}>
        <MessageContext.Provider
          value={{
            message: mockMessage,
            setShowReactionsPicker: mockSetShowReactionsPicker,
            setShowReplyModal: mockSetShowReplyModal,
          }}
        >
          <MessageContent />
        </MessageContext.Provider>
      </ChatContext.Provider>
    );

    // Ensure avatar image is rendered
    const avatar = screen.getByAltText("avatar");
    expect(avatar).toHaveAttribute("src", "/icon.png");

    // Ensure avatar filter style is applied correctly
    expect(avatar).toHaveStyle("filter: invert(0)");
  });

  it("applies correct background color for sender and receiver", () => {
    // Test for sender
    const { container: senderContainer } = render(
      <ChatContext.Provider value={{ user: mockUser, userName: "JohnDoe" }}>
        <MessageContext.Provider
          value={{
            message: mockMessage,
            setShowReactionsPicker: mockSetShowReactionsPicker,
            setShowReplyModal: mockSetShowReplyModal,
          }}
        >
          <MessageContent />
        </MessageContext.Provider>
      </ChatContext.Provider>
    );

    const senderAvatar = senderContainer.querySelector(".senderAvatar");
    expect(senderAvatar).toHaveStyle("background: white");

    // Test for receiver
    const { container: receiverContainer } = render(
      <ChatContext.Provider value={{ user: { name: "JaneDoe" }, userName: "JaneDoe" }}>
        <MessageContext.Provider
          value={{
            message: mockMessage,
            setShowReactionsPicker: mockSetShowReactionsPicker,
            setShowReplyModal: mockSetShowReplyModal,
          }}
        >
          <MessageContent />
        </MessageContext.Provider>
      </ChatContext.Provider>
    );

    const receiverAvatar = receiverContainer.querySelector(".senderAvatar");
    expect(receiverAvatar).toHaveStyle("background: black");
  });
});
