import { getConversationIdByKey, insertMessage } from "@coyle/database";
import { Server, Socket } from "socket.io";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { chatMessage } from "../chatMessage.js";

vi.mock("@coyle/database");

describe("chatMessage handler", () => {
  let socket: Socket;
  let io: Server;
  let conversations: unknown[];

  beforeEach(() => {
    socket = {
      on: vi.fn(),
      emit: vi.fn(),
    } as unknown as Socket;

    io = {
      to: vi.fn().mockReturnThis(),
      emit: vi.fn(),
    } as unknown as Server;

    conversations = [];
  });

  it("should handle chat message event and emit messages correctly", async () => {
    const id = "conversationId";
    const message = "Hello\nWorld";
    const sender = "user1";
    const files = ["file1.png"];
    const replyId = "replyId";
    const formattedMessage = "Hello<br/>World";
    const conversationId = "conv123";
    const data = { id: "msg123" };

    (getConversationIdByKey as vi.Mock).mockResolvedValue(conversationId);
    (insertMessage as vi.Mock).mockResolvedValue(data);

    chatMessage({ socket, io, conversations });

    const chatMessageHandler = (socket.on as vi.Mock).mock.calls[0][1];
    await chatMessageHandler({ id, message, sender, files, replyId });

    expect(getConversationIdByKey).toHaveBeenCalledWith(id);
    expect(insertMessage).toHaveBeenCalledWith({
      sender,
      message: formattedMessage,
      conversationId,
      parentId: replyId,
      files,
      seen: false,
    });

    expect(io.to).toHaveBeenCalledWith(id);
    expect(io.to(id).emit).toHaveBeenCalledWith("chat message", {
      sender,
      message: formattedMessage,
      id: data.id,
      parentId: replyId,
      files,
    });

    expect(io.emit).toHaveBeenCalledWith("conversations", conversations);
  });

  it("should log error if an exception occurs", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const error = new Error("Test error");

    (getConversationIdByKey as vi.Mock).mockRejectedValue(error);

    chatMessage({ socket, io, conversations });

    const chatMessageHandler = (socket.on as vi.Mock).mock.calls[0][1];
    await chatMessageHandler({
      id: "id",
      message: "message",
      sender: "sender",
      files: [],
      replyId: "replyId",
    });

    expect(consoleSpy).toHaveBeenCalledWith({ error });

    consoleSpy.mockRestore();
  });
});
