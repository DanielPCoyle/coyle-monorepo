import { describe, it, vi, expect, beforeEach } from "vitest";
import { login } from "../login";
import {
  addConversation,
  getConversations,
  getConversationIdByKey,
  updateConversationIsActive,
} from "@coyle/database";

vi.mock("@coyle/database", () => ({
  addConversation: vi.fn(),
  getConversations: vi.fn(),
  getConversationIdByKey: vi.fn(),
  updateConversationIsActive: vi.fn(),
  updateConversationSocketId: vi.fn(),
}));

describe("login function", () => {
  let socket, io;

  beforeEach(() => {
    socket = { on: vi.fn(), join: vi.fn() };
    io = { emit: vi.fn() };
  });

  it("should join the socket room and activate an existing conversation", async () => {
    const mockUser = {
      userName: "Test User",
      email: "test@example.com",
      id: "123",
      isAdmin: false,
    };
    const mockConversations = [{ id: "123", name: "Test User" }];

    getConversationIdByKey.mockResolvedValue("123");
    getConversations.mockResolvedValue(mockConversations);

    login({ socket, io });

    const loginHandler = socket.on.mock.calls[0][1];
    await loginHandler(mockUser);

    expect(socket.join).toHaveBeenCalledWith("123");
    expect(updateConversationIsActive).toHaveBeenCalledWith("123", true);
    expect(io.emit).toHaveBeenCalledWith("conversations", mockConversations);
  });

  it("should add a new conversation if one does not exist", async () => {
    const mockUser = {
      userName: "New User",
      email: "new@example.com",
      id: "456",
      isAdmin: true,
    };
    const mockConversations = [{ id: "456", name: "New User" }];

    getConversationIdByKey.mockResolvedValue(null);
    getConversations.mockResolvedValue(mockConversations);
    addConversation.mockResolvedValue();

    login({ socket, io });

    const loginHandler = socket.on.mock.calls[0][1];
    await loginHandler(mockUser);

    expect(socket.join).toHaveBeenCalledWith("456");
    expect(addConversation).toHaveBeenCalledWith({
      name: "New User",
      email: "new@example.com",
      conversationKey: "456",
      isAdmin: true,
      isActive: true,
    });
    expect(io.emit).toHaveBeenCalledWith("conversations", mockConversations);
  });
});
