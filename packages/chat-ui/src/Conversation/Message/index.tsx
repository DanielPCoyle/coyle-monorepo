import React, { useState, useRef, useContext } from "react";
import Modal from "react-modal";
import type { Message as MessageType } from "../../../types";
import { ChatContext } from "../../ChatContext";
import { MessageContent } from "./MessageContent";
import { MessageContext } from "./MessageContext";
import { ReactionPicker } from "./Reactions/ReactionPicker";
import { Reactions } from "./Reactions/Reactions";
import { ReplyModal } from "./ReplyModal/ReplyModal";
import { useMessageReactions } from "../../hooks/useMessageReactions";
import { useMessageSeen } from "../../hooks/useMessageSeen";
import { useOutsideClick } from "../../hooks/useOutsideClick";


export const Message: React.FC<{ message: MessageType; index: number }> = ({
  message,
  index,
}) => {
  const { user, selectedMessageId,setSelectedMessageId } = useContext(ChatContext);
  const [showReactionsPicker, setShowReactionsPicker] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);

  const { seen, messageRef } = useMessageSeen(message);
  const { reactions, addReaction, removeReactions } = useMessageReactions(message);
  
  const reactionsPickerRef = useRef<HTMLDivElement | null>(null);
  useOutsideClick(reactionsPickerRef, () => setShowReactionsPicker(false));

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
        <MessageContent  />
        </div>
      </div>

      
      {showReactionsPicker && (
        <div data-testid={`reaction-picker-${index}`} className={`${message.sender === user?.name ? "senderReactionPicker" : "receiverReactionPicker"}`}>
        <ReactionPicker 
          reactionsPickerRef={reactionsPickerRef} 
        />
        </div>
      )}

      {Object.values(reactions).length > 0 && (
        <div data-testid={`reactions-${index}`} className={`${message.sender === user?.name ? "senderReactions" : "receiverReactions"}`}>
        <Reactions
          isSender={message.sender === user}
          reactions={reactions}
          removeReactions={removeReactions}
        />
        </div>
      )}

      <div data-testid={`reply-modal-${index}`}>
            <ReplyModal/>
      </div>
    </MessageContext.Provider>
  );
};
