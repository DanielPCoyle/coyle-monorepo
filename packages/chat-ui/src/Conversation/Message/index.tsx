import React, { useState, useRef, useContext } from "react";
import Modal from "react-modal";
import type { Message as MessageType } from "../../../types";
import { ChatContext } from "../../ChatContext";
import { MessageContent } from "./MessageContent";
import { MessageContext } from "./MessageContext";
import { ReactionPicker } from "./ReactionPicker";
import { Reactions } from "./Reactions";
import { ReplyModal } from "./ReplyModal";
import { useMessageReactions } from "./hooks/useMessageReactions";
import { useMessageSeen } from "./hooks/useMessageSeen";
import { useOutsideClick } from "./hooks/useOutsideClick";

Modal.setAppElement("#__next");

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
      >
        <MessageContent />
      </div>

      {showReactionsPicker && <ReactionPicker reactionsPickerRef={reactionsPickerRef} />}

      {Object.values(reactions).length > 0 && (
        <Reactions
          isSender={message.sender === user}
          reactions={reactions}
          removeReactions={removeReactions}
        />
      )}

      <ReplyModal
        showReplyModal={showReplyModal}
        setShowReplyModal={setShowReplyModal}
        message={message}
      />
    </MessageContext.Provider>
  );
};
