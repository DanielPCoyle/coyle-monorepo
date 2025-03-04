import { addReactionToMessage } from "@coyle/database";
import { describe, expect, it, vi } from "vitest";
import { addReaction } from "../addReaction";

vi.mock("@coyle/database", () => ({
    addReactionToMessage: vi.fn(),
}));

describe("addReaction", () => {
    it("should add reaction and emit event", async () => {
        const socket = {
            on: vi.fn((event, callback) => {
                if (event === "addReaction") {
                    callback({ id: "123", messageId: "456", reactions: ["👍"] });
                }
            }),
        };
        const io = {
            to: vi.fn().mockReturnThis(),
            emit: vi.fn(),
        };

        addReaction({ socket, io });

        expect(socket.on).toHaveBeenCalledWith("addReaction", expect.any(Function));
        expect(addReactionToMessage).toHaveBeenCalledWith({
            reactions: ["👍"],
            messageId: "456",
        });
        await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for async operations
        expect(io.to).toHaveBeenCalledWith("123");
        expect(io.emit).toHaveBeenCalledWith("addReaction", {
            messageId: "456",
            reactions: ["👍"],
        });
    });

    it("should handle errors", async () => {
        const socket = {
            on: vi.fn((event, callback) => {
                if (event === "addReaction") {
                    callback({ id: "123", messageId: "456", reactions: ["👍"] });
                }
            }),
        };
        const io = {
            to: vi.fn().mockReturnThis(),
            emit: vi.fn(),
        };

        const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
        addReactionToMessage.mockRejectedValue(new Error("Database error"));

        addReaction({ socket, io });

        expect(socket.on).toHaveBeenCalledWith("addReaction", expect.any(Function));
        expect(addReactionToMessage).toHaveBeenCalledWith({
            reactions: ["👍"],
            messageId: "456",
        });
        await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for async operations
        expect(consoleSpy).toHaveBeenCalledWith("ERROR ADDING REACTION", {
            error: new Error("Database error"),
        });

        consoleSpy.mockRestore();
    });
});