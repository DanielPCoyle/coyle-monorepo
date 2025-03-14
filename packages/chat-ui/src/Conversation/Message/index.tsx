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

Modal.setAppElement("#__next"); // TODO: Fix this so it's not hardcoded or dependent on Next.js

export const Message: React.FC<{ message: MessageType; index: number }> = ({
  message,
  index,
}) => {
  const { user } = useContext(ChatContext);
  const [showReactionsPicker, setShowReactionsPicker] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);

  const { seen, messageRef } = useMessageSeen(message);
  const { reactions, addReaction, removeReactions } = useMessageReactions(message);
  
  const reactionsPickerRef = useRef<HTMLDivElement | null>(null);
  useOutsideClick(reactionsPickerRef, () => setShowReactionsPicker(false));

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
        style={{ alignItems: message.sender === user ? "flex-end" : "flex-start" }}
        key={index}
        data-testid={`message-${index}`}
      >
        <div data-testid={`message-content-${index}`}>
        <MessageContent  />
        </div>
      </div>

      {showReactionsPicker && (
        <div data-testid={`reaction-picker-${index}`} >
        <ReactionPicker 
          reactionsPickerRef={reactionsPickerRef} 
          
        />
        </div>
      )}

      {Object.values(reactions).length > 0 && (
        <div data-testid={`reactions-${index}`}>
        <Reactions
          isSender={message.sender === user}
          reactions={reactions}
          removeReactions={removeReactions}
        />
        </div>
      )}

      <div data-testid={`reply-modal-${index}`}>
            <ReplyModal
              showReplyModal={showReplyModal}
              setShowReplyModal={setShowReplyModal}
              message={message}
              
            />
      </div>
    </MessageContext.Provider>
  );
};
