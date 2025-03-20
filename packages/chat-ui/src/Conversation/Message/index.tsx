import React, { useState,  useContext } from "react";
import Modal from "react-modal";
import type { Message as MessageType } from "../../../types";
import { ChatContext } from "../../ChatContext";
import { MessageContent } from "./MessageContent";
import { MessageContext } from "./MessageContext";

import { ReplyModal } from "./ReplyModal/ReplyModal";
import { useMessageReactions } from "../../hooks/useMessageReactions";
import { useMessageSeen } from "../../hooks/useMessageSeen";


export const Message: React.FC<{ message: MessageType; index: number }> = ({
  message,
  index,
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
        index,
        addReaction,
        reactions,
        seen,
      }}
    >
      <div
        ref={messageRef}
        className="animate__animated animate__zoomIn messageContainer"
        key={index}
        data-testid={`message-${index}`}
      >
        <div data-testid={`message-content-${index}`}>
        <MessageContent />
        </div>
      </div>

      
    
   

      <div data-testid={`reply-modal-${index}`}>
            <ReplyModal/>
      </div>
    </MessageContext.Provider>
  );
};
