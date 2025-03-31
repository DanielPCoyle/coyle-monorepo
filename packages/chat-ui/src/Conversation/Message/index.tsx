import React, { useState,  useContext } from "react";
import { ChatContext } from "../../ChatContext";
import { MessageContext } from "./MessageContext";

import { ReplyModal } from "./ReplyModal/ReplyModal";
import { useMessageReactions } from "../../hooks/useMessageReactions";
import { useMessageSeen } from "../../hooks/useMessageSeen";


interface MessageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: any;
  key: string;
}
export const Message: React.FC<MessageProps> = ({
  message,
  key,
}) => {
  const { user, selectedMessageId,setSelectedMessageId } = useContext(ChatContext);
  const [showReactionsPicker, setShowReactionsPicker] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);

  const { seen, messageRef } = useMessageSeen(message);
  const { reactions, addReaction, removeReactions } = useMessageReactions(message);
  

  React.useEffect(() => {
    if(selectedMessageId === message.id){
      setShowReplyModal(true);
      setSelectedMessageId(null);
    }
  },[selectedMessageId]);

  return (
    <MessageContext.Provider
      value={{
        message,
        user,
        setShowReactionsPicker,
        setShowReplyModal,
        showReplyModal,
        removeReactions,
        showReactionsPicker,
        addReaction,
        reactions,
        seen,
      }}
    >
      <div
        ref={messageRef}
        className="animate__animated animate__zoomIn messageContainer"
        key={key}
        data-testid={`message-${key}`}
      >
        <div data-testid={`message-content-${key}`}>
        
        <MessageContent  />
        </div>
      </div>

      <div data-testid={`reply-modal-${key}`}>
            <ReplyModal/>
      </div>
    </MessageContext.Provider>
  );
};
