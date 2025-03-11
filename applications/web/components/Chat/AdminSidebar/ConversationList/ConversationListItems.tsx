import { motion } from "framer-motion";
import React from "react";
import type { Socket } from "socket.io-client";
import { ChatContext } from "../../ChatContext";

interface Conversation {
  id: string;
  user: string;
  email: string;
  status: string;
  unSeenMessages: number;
}

interface ConversationListItemsProps {
  conversations: Conversation[];
  socket: Socket;
  toggleDrawer: () => void;
}

export const ConversationListItems: React.FC<ConversationListItemsProps> = ({
  conversations,
  socket,
  toggleDrawer,
}) => {
  
  const { setId, id } = React.useContext(ChatContext);

  return conversations?.length ? (
    <>
      {conversations?.map((convo, i) => (
        <div
          className={`conversationListItem ${id === convo.id ? "active" : ""}`}
          key={i}
          onClick={() => {
            socket.emit("leave", { id: id });
            setId(convo.conversationKey);
            toggleDrawer();
          }}
        >
          {convo.status}
          {convo.user} - {convo.email}
          {convo?.unSeenMessages > 0 && ` (${convo.unSeenMessages})`}
        </div>
      ))}
    </>
  ) : (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ padding: "10px", color: "gray" }}
      >
        No conversations...
      </motion.div>
    </>
  );
};
