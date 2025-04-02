import { describe, it, expect } from "vitest";
import Chat from "../pages/chat"; // adjust the path to match your file
import ActualChat from "@coyle/chat-ui/src/Chat";

describe("Chat export", () => {
  it("should re-export Chat component from chat-ui", () => {
    expect(Chat).toBe(ActualChat);
  });
});
