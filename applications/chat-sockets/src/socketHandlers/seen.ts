import { setMessageSeen } from "@coyle/database";

export const seen = ({ socket }) =>
  socket.on("seen", async (messageId: number) => {
    try {
      await setMessageSeen(messageId);
      // io.emit("conversations", conversations);
    } catch (error) {
      console.log("ERROR UPDATING SEEN RECORD", error);
    }
  });
