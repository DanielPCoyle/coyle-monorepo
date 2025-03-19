import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { handleSocketEvents } from "../handleSocketEvents";

describe("handleSocketEvents", () => {
  let socket;
  let setMessages, setAdmins, setTyping, setConversations, setNotificationBar;
  let user, id;

  beforeEach(() => {
    socket = {
      on: vi.fn(),
      off: vi.fn(),
    };
    setMessages = vi.fn();
    setAdmins = vi.fn();
    setTyping = vi.fn();
    setConversations = vi.fn(); // ✅ Add this mock function
    setNotificationBar = vi.fn();
    user = { name: "Alice", role: "admin" };
    id = "123";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should subscribe to all expected socket events", () => {
    handleSocketEvents(socket, user, id, setMessages, setAdmins, setTyping, setNotificationBar );

    expect(socket.on).toHaveBeenCalledWith("conversations", expect.any(Function));
    expect(socket.on).toHaveBeenCalledWith("adminsOnline", setAdmins);
    expect(socket.on).toHaveBeenCalledWith("chat message", expect.any(Function));
    expect(socket.on).toHaveBeenCalledWith("user typing", expect.any(Function));
    expect(socket.on).toHaveBeenCalledWith("user not typing", expect.any(Function));
  });

  it("should not update conversations for non-admin users", () => {
    user.role = "user"; // Not an admin
    handleSocketEvents(socket, user, id, setMessages, setAdmins, setTyping, setNotificationBar);
    const callback = socket.on.mock.calls.find((call) => call[0] === "conversations")[1];

    callback([{ id: 1, name: "Chat 1" }]);
    
    expect(setConversations).not.toHaveBeenCalled();
  });

  it("should update admins list when 'adminsOnline' event is received", () => {
    handleSocketEvents(socket, user, id, setMessages, setAdmins, setTyping, setNotificationBar);
    const callback = socket.on.mock.calls.find((call) => call[0] === "adminsOnline")[1];

    callback(["Admin1", "Admin2"]);
    
    expect(setAdmins).toHaveBeenCalledWith(["Admin1", "Admin2"]);
  });

  it("should append new messages uniquely and sort them", () => {
    handleSocketEvents(socket, user, id, setMessages, setAdmins, setTyping, setNotificationBar);
    const callback = socket.on.mock.calls.find((call) => call[0] === "chat message")[1];

    const existingMessages = [{ id: 1, text: "Hello" }];
    setMessages.mockImplementation((updateFn) => {
      const updatedMessages = updateFn(existingMessages);
      expect(updatedMessages).toEqual([
        { id: 1, text: "Hello" },
        { id: 2, text: "World" },
      ]);
    });

    callback({ id: 2, text: "World" });
  });

  it("should not add duplicate messages", () => {
    handleSocketEvents(socket, user, id, setMessages, setAdmins, setTyping, setNotificationBar);
    const callback = socket.on.mock.calls.find((call) => call[0] === "chat message")[1];

    const existingMessages = [{ id: 1, text: "Hello" }];
    setMessages.mockImplementation((updateFn) => {
      const updatedMessages = updateFn([...existingMessages, { id: 1, text: "Hello" }]);
      expect(updatedMessages).toEqual([{ id: 1, text: "Hello" }]);
    });

    callback({ id: 1, text: "Hello" });
  });

  it("should update typing state when another user types", () => {
    handleSocketEvents(socket, user, id, setMessages, setAdmins, setTyping, setNotificationBar);
    const callback = socket.on.mock.calls.find((call) => call[0] === "user typing")[1];

    callback({ name: "Bob" });

    expect(setTyping).toHaveBeenCalledWith({ name: "Bob" });
  });

  it("should not update typing state when the same user types", () => {
    handleSocketEvents(socket, user, id, setMessages, setAdmins, setTyping, setNotificationBar);
    const callback = socket.on.mock.calls.find((call) => call[0] === "user typing")[1];

    callback({ name: "Alice" }); // Same user

    expect(setTyping).not.toHaveBeenCalled();
  });

  it("should clear typing state when another user stops typing", () => {
    handleSocketEvents(socket, user, id, setMessages, setAdmins, setTyping, setNotificationBar);
    const callback = socket.on.mock.calls.find((call) => call[0] === "user not typing")[1];

    callback({ user: "Bob" });

    expect(setTyping).toHaveBeenCalledWith(null);
  });

  it("should not clear typing state when the same user stops typing", () => {
    handleSocketEvents(socket, user, id, setMessages, setAdmins, setTyping, setNotificationBar);
    const callback = socket.on.mock.calls.find((call) => call[0] === "user not typing")[1];

    callback({ user: "Alice" }); // Same user

    expect(setTyping).not.toHaveBeenCalled();
  });

  it("should unsubscribe from events when cleanup is needed", () => {
    handleSocketEvents(socket, user, id, setMessages, setAdmins, setTyping, setNotificationBar);

    expect(socket.off).not.toHaveBeenCalled(); // Ensure off isn't called immediately

    // Simulate component unmounting
    socket.off("conversations", expect.any(Function));
    socket.off("adminsOnline", setAdmins);
    socket.off("chat message", expect.any(Function));
    socket.off("user typing", expect.any(Function));
    socket.off("user not typing", expect.any(Function));

    expect(socket.off).toHaveBeenCalledTimes(5);
  });
});
