import { motion } from "framer-motion";
import React from "react";
import { ChatContext } from "../../ChatContext";
import { ConversationListItemsProps } from "../../../types";

export const ConversationListItems: React.FC<ConversationListItemsProps> = ({
  conversations,
  socket,
  setShowMenu,
}) => {
  const { setId, id, user, status } = React.useContext(ChatContext);

  return conversations?.length ? (
    <>
      {conversations?.map((convo, i) => (
        <div
          data-testid="conversation-list-items"
          className={`conversationListItem ${id === convo.conversationKey ? "active" : ""}`}
          key={i}
          onClick={() => {
            socket.emit("leave", { id: id });
            setId(convo.conversationKey);
            setShowMenu(false);
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
      >
        No conversations...
      </motion.div>
    </>
  );
};
