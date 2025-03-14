import { addReactionToMessage } from "@coyle/chat-db";

export const addReaction = ({ socket, io }) =>
  socket.on("addReaction", async ({ id, messageId, reactions }) => {
    try {
      await addReactionToMessage({ reactions, messageId });

      io.to(id).emit("addReaction", { messageId, reactions: reactions });
    } catch (error) {
      console.log("ERROR ADDING REACTION", { error });
    }
  });
