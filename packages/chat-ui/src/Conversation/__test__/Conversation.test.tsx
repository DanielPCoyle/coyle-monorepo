import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Conversation } from "../";
import { ChatContext } from "../../ChatContext";
import { ThreeJsBackground } from "../ThreeJsBackground";
import { Message } from "../Message";
import { LoadingIcon } from "../../../assets/svg/LoadingIcon";
import "@testing-library/jest-dom";

vi.mock("../ThreeJsBackground", () => ({
  ThreeJsBackground: () => <div data-testid="threejs-container" />,
}));

vi.mock("../Message", () => ({
  Message: ({ message }) => <div data-testid="message">{message.text}</div>,
}));

vi.mock("../../assets/svg/LoadingIcon", () => ({
  LoadingIcon: () => <svg data-testid="loading-icon" />,
}));

describe("Conversation Component", () => {
  it("renders loading state correctly", () => {
    render(
      <ChatContext.Provider value={{ messages: [], loading: true }}>
        <Conversation />
      </ChatContext.Provider>
    );
    
    expect(screen.getByTestId("loading-icon")).toBeInTheDocument();
  });

  it("renders messages correctly", () => {
    const mockMessages = [
      {
        id: "1",
        text: "Hello World",
        user: "User1",
        conversationKey: "key1",
        sender: "User1",
        message: "Hello World",
        createdAt: "2025-03-14T12:00:00Z",
        seen: true,
        reactions: {},
        files: [],
        replies: [],
      },
    ];

    render(
      <ChatContext.Provider value={{ messages: mockMessages, loading: false }}>
        <Conversation />
      </ChatContext.Provider>
    );
    
    expect(screen.getByTestId("threejs-container")).toBeInTheDocument();
    expect(screen.getByTestId("message")).toHaveTextContent("Hello World");
  });
});