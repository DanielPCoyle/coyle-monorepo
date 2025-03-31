import React, { useState, useContext } from "react";
import type { SubMessageType, } from "../../../../../types";
import ChatContext from "../../../../ChatContext";
import MessageContent from "../../MessageContent";
import MessageContext from "../../MessageContext";
import { handleAddReaction } from "./reactionHandlers/handleAddReaction";
import { useSocketReactions } from "./reactionHandlers/useSocketReactions";
import { useMessageSeen } from "../../../../hooks/useMessageSeen";


export const SubMessage: React.FC<SubMessageType> = ({ reply }) => {
  const [urlPreview] = useState<string | null>(null);
  const { id, user, socket, email  } = useContext(ChatContext);
  const [showReactionsPicker, setShowReactionsPicker] = useState<boolean>(false);
  const [showReplyModal, setShowReplyModal] = useState<boolean>(false);
  const [reactions, setReactions] = useState<{ [key: string]: string[] }>(reply.reactions || {});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { messageRef } = useMessageSeen(reply as any);

  useSocketReactions(socket, reply, setReactions);

  return (
    <MessageContext.Provider
      value={{
        message: reply,
        urlPreview,
        user,
        setShowReactionsPicker,
        setShowReplyModal,
        showReplyModal,
        showReactionsPicker,
        addReaction: (emoji) => handleAddReaction(emoji, email, reactions, setReactions, socket, id, reply.id, setShowReactionsPicker),
        reactions,
      }}
    >
      <div ref={messageRef} data-testid="submessage-container" className='subMessage'>
        <MessageContent  data-testid="message-content" />
        {/* {showReactionsPicker && (
          <div data-testid="reaction-picker">
            <ReactionPicker reactionsPickerRef={reactionsPickerRef} />
          </div>
        )} */}

      </div>
    </MessageContext.Provider>
  );
};
