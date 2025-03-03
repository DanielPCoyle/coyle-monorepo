import { addReaction, eq } from "@coyle/database";
import { describe, expect, it, vi } from "vitest";

describe("addReaction", () => {
    it("should update the message reactions and emit the addReaction event", async () => {
        const socket = {
            on: vi.fn((event, callback) => {
                if (event === "addReaction") {
                    callback({ id: "user1", messageId: "msg1", reactions: ["like"] });
                }
            }),
        };
        const io = {
            to: vi.fn().mockReturnThis(),
            emit: vi.fn(),
        };
        const messages = { id: "msg1" };
        const db = {
            update: vi.fn().mockReturnThis(),
            set: vi.fn().mockReturnThis(),
            where: vi.fn().mockResolvedValueOnce({}),
        };

        addReaction({ socket, io, messages, db });

        expect(socket.on).toHaveBeenCalledWith("addReaction", expect.any(Function));
        expect(db.update).toHaveBeenCalledWith(messages);
        expect(db.set).toHaveBeenCalledWith({ reactions: ["like"] });
        expect(db.where).toHaveBeenCalledWith(eq(messages.id, "msg1"));
        expect(io.to).toHaveBeenCalledWith("user1");
        expect(io.emit).toHaveBeenCalledWith("addReaction", { messageId: "msg1", reaction: ["like"] });
    });

    it("should log an error if the database update fails", async () => {
        const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
        const socket = {
            on: vi.fn((event, callback) => {
                if (event === "addReaction") {
                    callback({ id: "user1", messageId: "msg1", reactions: ["like"] });
                }
            }),
        };
        const io = {
            to: vi.fn().mockReturnThis(),
            emit: vi.fn(),
        };
        const messages = { id: "msg1" };
        const db = {
            update: vi.fn().mockReturnThis(),
            set: vi.fn().mockReturnThis(),
            where: vi.fn().mockRejectedValueOnce(new Error("DB error")),
        };

        addReaction({ socket, io, messages, db });

        expect(socket.on).toHaveBeenCalledWith("addReaction", expect.any(Function));
        expect(db.update).toHaveBeenCalledWith(messages);
        expect(db.set).toHaveBeenCalledWith({ reactions: ["like"] });
        expect(db.where).toHaveBeenCalledWith(eq(messages.id, "msg1"));
        expect(consoleSpy).toHaveBeenCalledWith("ERROR ADDING REACTION", { error: new Error("DB error") });

        consoleSpy.mockRestore();
    });
});