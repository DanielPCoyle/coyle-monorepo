import { describe, it, expect, vi } from "vitest";
import { handleAddReaction } from "../handleAddReaction"; // Adjust the import path as needed

describe("handleAddReaction", () => {
  it("should add a new reaction and emit event", () => {
    const emoji = { emoji: "👍" };
    const email = "test@example.com";
    const reactions = {};
    const setReactions = vi.fn();
    const socket = { emit: vi.fn() };
    const id = "123";
    const messageId = "456";
    const setShowReactionsPicker = vi.fn();

    handleAddReaction(
      emoji,
      email,
      reactions,
      setReactions,
      socket,
      id,
      messageId,
      setShowReactionsPicker
    );

    expect(setReactions).toHaveBeenCalledWith({ "test@example.com": ["👍"] });
    expect(socket.emit).toHaveBeenCalledWith("addReaction", {
      id,
      messageId,
      reactions: { "test@example.com": ["👍"] },
    });
    expect(setShowReactionsPicker).toHaveBeenCalledWith(false);
  });

  it("should append a reaction if the user already has reactions", () => {
    const emoji = { emoji: "😂" };
    const email = "user@example.com";
    const reactions = { "user@example.com": ["👍"] };
    const setReactions = vi.fn();
    const socket = { emit: vi.fn() };
    const id = "789";
    const messageId = "101";
    const setShowReactionsPicker = vi.fn();

    handleAddReaction(
      emoji,
      email,
      reactions,
      setReactions,
      socket,
      id,
      messageId,
      setShowReactionsPicker
    );

    expect(setReactions).toHaveBeenCalledWith({
      "user@example.com": ["👍", "😂"],
    });
    expect(socket.emit).toHaveBeenCalledWith("addReaction", {
      id,
      messageId,
      reactions: { "user@example.com": ["👍", "😂"] },
    });
    expect(setShowReactionsPicker).toHaveBeenCalledWith(false);
  });
});
