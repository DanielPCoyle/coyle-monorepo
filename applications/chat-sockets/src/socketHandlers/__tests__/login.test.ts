import { addConversation } from "@coyle/database";
import { describe, expect, it, vi } from "vitest";
import { login } from "../login";

vi.mock("@coyle/database", () => ({
  addConversation: vi.fn(),
}));

describe("login handler", () => {
  it("should add a conversation and emit the updated conversations", () => {
    const socket = {
      on: vi.fn(),
      id: "socket-id",
      join: vi.fn(),
    };
    const io = {
      emit: vi.fn(),
    };
    const conversations = [];

    login({ socket, io, conversations });

    const loginHandler = socket.on.mock.calls[0][1];
    const userData = {
      user: "testuser",
      email: "test@example.com",
      id: "user-id",
    };

    loginHandler(userData);

    expect(conversations).toEqual([
      {
        user: "testuser",
        email: "test@example.com",
        id: "user-id",
        socketId: "socket-id",
      },
    ]);
    expect(io.emit).toHaveBeenCalledWith("conversations", conversations);
    expect(socket.join).toHaveBeenCalledWith("user-id");
    expect(addConversation).toHaveBeenCalledWith({
      name: "testuser",
      email: "test@example.com",
      conversationKey: "user-id",
    });
  });
});
