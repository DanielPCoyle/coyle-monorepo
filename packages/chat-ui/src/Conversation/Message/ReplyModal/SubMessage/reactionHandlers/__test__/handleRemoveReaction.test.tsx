import { describe, it, expect, vi } from "vitest";
import { handleRemoveReaction } from "../handleRemoveReaction"; // Adjust the import path as needed

describe("handleRemoveReaction", () => {
  it("should remove a specific reaction from a user and emit event", () => {
    const emoji = { emoji: "👍" };
    const email = "test@example.com";
    const reactions = { "test@example.com": ["👍", "😂"] };
    const setReactions = vi.fn();
    const socket = { emit: vi.fn() };
    const messageId = "456";

    handleRemoveReaction(emoji, email, reactions, setReactions, socket, messageId);

    expect(setReactions).toHaveBeenCalledWith({ "test@example.com": ["😂"] });
    expect(socket.emit).toHaveBeenCalledWith("addReaction", {
      messageId,
      reactions: { "test@example.com": ["😂"] },
    });
  });

  it("should remove the user from reactions if their last reaction is removed", () => {
    const emoji = { emoji: "👍" };
    const email = "user@example.com";
    const reactions = { "user@example.com": ["👍"] };
    const setReactions = vi.fn();
    const socket = { emit: vi.fn() };
    const messageId = "789";

    handleRemoveReaction(emoji, email, reactions, setReactions, socket, messageId);

    expect(setReactions).toHaveBeenCalledWith({});
    expect(socket.emit).toHaveBeenCalledWith("addReaction", {
      messageId,
      reactions: {},
    });
  });

  it("should do nothing if the user has no reactions", () => {
    const emoji = { emoji: "😂" };
    const email = "unknown@example.com";
    const reactions = { "test@example.com": ["👍"] };
    const setReactions = vi.fn();
    const socket = { emit: vi.fn() };
    const messageId = "123";

    handleRemoveReaction(emoji, email, reactions, setReactions, socket, messageId);

    expect(setReactions).not.toHaveBeenCalled();
    expect(socket.emit).not.toHaveBeenCalled();
  });

  it("should not modify reactions if the reaction does not exist for the user", () => {
    const emoji = { emoji: "😂" };
    const email = "test@example.com";
    const reactions = { "test@example.com": ["👍"] };
    const setReactions = vi.fn();
    const socket = { emit: vi.fn() };
    const messageId = "999";
  
    handleRemoveReaction(emoji, email, reactions, setReactions, socket, messageId);
  
    expect(setReactions).toHaveBeenCalledWith(reactions); // Ensure the same object is passed
  });
});
