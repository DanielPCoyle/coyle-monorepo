import { describe, expect, it, vi } from "vitest";
import { leave } from "../leave.js";

describe("leave handler", () => {
  it("should leave the room with the given id", () => {
    const socket = {
      on: vi.fn((event, callback) => {
        if (event === "leave") {
          callback({ id: "room1" });
        }
      }),
      leave: vi.fn(),
    };

    leave({ socket });

    expect(socket.on).toHaveBeenCalledWith("leave", expect.any(Function));
    expect(socket.leave).toHaveBeenCalledWith("room1");
  });
});
