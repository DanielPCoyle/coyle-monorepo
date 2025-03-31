import { describe, expect, it, vi } from "vitest";
import { join } from "../join.js";

describe("join", () => {
  it("should join the socket to the room and emit update messages request", () => {
    const socket = {
      on: vi.fn((event, callback) => {
        if (event === "join") {
          callback({ id: "room1" });
        }
      }),
      join: vi.fn(),
    };

    const io = {
      to: vi.fn().mockReturnThis(),
      emit: vi.fn(),
    };

    join({ socket, io });

    expect(socket.on).toHaveBeenCalledWith("join", expect.any(Function));
    expect(socket.join).toHaveBeenCalledWith("room1");
    expect(io.to).toHaveBeenCalledWith("room1");
    expect(io.emit).toHaveBeenCalledWith("update messages request", "room1");
  });
});
