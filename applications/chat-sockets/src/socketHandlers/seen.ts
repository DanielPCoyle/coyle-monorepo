import { setMessageSeen } from "@coyle/database";
import { getConversations } from "@coyle/database";

export const seen = ({ socket,io }) =>
  socket.on("seen", async (messageId: number) => {
    try {
      await setMessageSeen(messageId);
      const conversations = await getConversations();
      io.emit("conversations", conversations);
    } catch (error) {
      console.log("ERROR UPDATING SEEN RECORD", error);
    }
  });
