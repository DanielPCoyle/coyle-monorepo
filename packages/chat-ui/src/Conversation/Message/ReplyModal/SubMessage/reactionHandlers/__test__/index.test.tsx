import { describe, it, expect } from "vitest";
import {handleAddReaction, handleRemoveReaction, useSocketReactions} from "../index"; // Adjust the import path as needed


describe("index.ts exports", () => {
  it("should export handleAddReaction", () => {
    expect(handleAddReaction).toBeDefined();
  });

  it("should export handleRemoveReaction", () => {
    expect(handleRemoveReaction).toBeDefined();
  });

  it("should export useSocketReactions", () => {
    expect(useSocketReactions).toBeDefined();
  });
});
