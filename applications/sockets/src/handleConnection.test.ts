import { describe, it, vi, expect, beforeEach } from "vitest";
import { handleConnection } from "./handleConnection";
import {
  updateUserStatus,
  getUsersOnline,
  updateUserNotificationsEnabled,
} from "@simpler-development/chat-db";

vi.mock("./socketHandlers/addReaction", () => ({ addReaction: vi.fn() }));
vi.mock("./socketHandlers/chatMessage", () => ({ chatMessage: vi.fn() }));
vi.mock("./socketHandlers/disconnect", () => ({ disconnect: vi.fn() }));
vi.mock("./socketHandlers/join", () => ({ join: vi.fn() }));
vi.mock("./socketHandlers/leave", () => ({ leave: vi.fn() }));
vi.mock("./socketHandlers/login", () => ({ login: vi.fn() }));
vi.mock("./socketHandlers/seen", () => ({ seen: vi.fn() }));
vi.mock("./socketHandlers/updateMessageAction", () => ({
  updateMessageAction: vi.fn(),
}));
vi.mock("./socketHandlers/userTyping", () => ({ userTyping: vi.fn() }));
vi.mock("./socketHandlers/translation", () => ({ translation: vi.fn() }));

vi.mock("@simpler-development/chat-db", async () => ({
  updateUserStatus: vi.fn(),
  getUsersOnline: vi.fn(),
  updateUserNotificationsEnabled: vi.fn(),
}));

describe("handleConnection", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockSocket: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockIo: any;

  beforeEach(() => {
    mockSocket = {
      on: vi.fn(),
    };

    mockIo = {
      emit: vi.fn(),
    };

    vi.clearAllMocks();
  });

  it("should register all socket handlers", () => {
    handleConnection(mockSocket, mockIo);

    expect(mockSocket.on).toHaveBeenCalledWith(
      "updateStatus",
      expect.any(Function),
    );
    expect(mockSocket.on).toHaveBeenCalledWith(
      "updateNotificationsEnabled",
      expect.any(Function),
    );
  });

  it("should handle updateStatus event", async () => {
    const statusFn = vi.fn();
    mockSocket.on = vi.fn((event, handler) => {
      if (event === "updateStatus") statusFn.mockImplementation(handler);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (getUsersOnline as any).mockResolvedValue(["user1", "user2"]);

    handleConnection(mockSocket, mockIo);

    await statusFn({ status: "online", id: "123" });

    expect(updateUserStatus).toHaveBeenCalledWith({
      status: "online",
      id: "123",
    });
    expect(getUsersOnline).toHaveBeenCalled();
    expect(mockIo.emit).toHaveBeenCalledWith("adminsOnline", [
      "user1",
      "user2",
    ]);
  });

  it("should not call updateUserStatus if status is missing", async () => {
    const statusFn = vi.fn();
    mockSocket.on = vi.fn((event, handler) => {
      if (event === "updateStatus") statusFn.mockImplementation(handler);
    });

    handleConnection(mockSocket, mockIo);

    await statusFn({ status: "", id: "123" });

    expect(updateUserStatus).not.toHaveBeenCalled();
    expect(getUsersOnline).not.toHaveBeenCalled();
    expect(mockIo.emit).not.toHaveBeenCalled();
  });

  it("should handle updateNotificationsEnabled event", async () => {
    const notifFn = vi.fn();
    mockSocket.on = vi.fn((event, handler) => {
      if (event === "updateNotificationsEnabled")
        notifFn.mockImplementation(handler);
    });

    handleConnection(mockSocket, mockIo);

    await notifFn({ notificationsEnabled: true, id: "456" });

    expect(updateUserNotificationsEnabled).toHaveBeenCalledWith({
      notificationsEnabled: true,
      id: "456",
    });
  });
});
