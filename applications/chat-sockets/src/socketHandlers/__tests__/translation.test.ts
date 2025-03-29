// translation.test.ts
import { describe, it, expect, vi } from "vitest";
import { translation } from "../translation"; // adjust the path if needed

describe("translation", () => {
  it('should listen for "translation" and emit to the correct room', () => {
    const mockEmit = vi.fn();
    const mockTo = vi.fn(() => ({ emit: mockEmit }));
    const mockSocket = {
      on: vi.fn(),
      to: mockTo,
    };
    const mockIo = {}; // not used in this function, but passed in

    translation({ socket: mockSocket as any, io: mockIo });

    // Extract the callback passed to socket.on
    expect(mockSocket.on).toHaveBeenCalledWith(
      "translation",
      expect.any(Function),
    );

    const callback = mockSocket.on.mock.calls[0][1];

    const payload = {
      conversationKey: "room123",
      id: "user456",
      data: { message: "Hello" },
    };

    callback(payload);

    expect(mockTo).toHaveBeenCalledWith("room123");
    expect(mockEmit).toHaveBeenCalledWith("translation", payload);
  });
});
