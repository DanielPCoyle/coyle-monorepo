import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatCaddy from "../ChatCaddy";

// Mock the Chat component
vi.mock("../Chat", () => ({
  default: () => <div data-testid="chat-window">Chat Component</div>,
}));

// Mock SVG Icons
vi.mock("../../assets/svg/ChatIcon", () => ({
  ChatIcon: () => <svg data-testid="chat-icon" />,
}));

vi.mock("../../assets/svg/CloseIcon", () => ({
  CloseIcon: () => <svg data-testid="close-icon" />,
}));

describe("ChatCaddy", () => {
  beforeEach(() => {
    render(<ChatCaddy />);
  });

  it("does not display the chat window initially", () => {
    expect(screen.queryByTestId("chat-window")).not.toBeInTheDocument();
  });

  it("shows the chat window when the button is clicked", () => {
    const toggleButton = screen.getByRole("button");
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("chat-window")).toBeInTheDocument();
  });

  it("hides the chat window when the button is clicked again", () => {
    const toggleButton = screen.getByRole("button");

    // Open chat
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("chat-window")).toBeInTheDocument();

    // Close chat
    fireEvent.click(toggleButton);
    expect(screen.queryByTestId("chat-window")).not.toBeInTheDocument();
  });

  it("displays ChatIcon when chat is closed and CloseIcon when chat is open", () => {
    const toggleButton = screen.getByRole("button");

    // Initially should show ChatIcon
    expect(screen.getByTestId("chat-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("close-icon")).not.toBeInTheDocument();

    // Click to open chat
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("close-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("chat-icon")).not.toBeInTheDocument();

    // Click to close chat
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("chat-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("close-icon")).not.toBeInTheDocument();
  });
});
