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
  conversationKey: string;
  isActive: boolean;
  name: string;
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
  const { setId, id, user, status } = React.useContext(ChatContext);

  return conversations?.length ? (
    <>
      {conversations?.map((convo, i) => (
        <div
          className={`conversationListItem ${id === convo.conversationKey ? "active" : ""}`}
          key={i}
          onClick={() => {
            socket.emit("leave", { id: id });
            setId(convo.conversationKey);
            toggleDrawer();
          }}
        >
          {user.email === convo.email ? (
            <>
              {convo.isActive && (
                <div className={`activeDot ${status}`}>&nbsp;</div>
              )}
              <div>
                You ({user.name}) - {status}
              </div>
            </>
          ) : (
            <>
              {<div className={`activeDot`}>&nbsp;</div>}

              <div>
                {convo.name} - {convo.email}
              </div>
              <div>
                &nbsp;{" "}
                {convo?.unSeenMessages > 0 && ` (${convo.unSeenMessages})`}
              </div>
            </>
          )}
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
