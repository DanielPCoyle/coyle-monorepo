import React, { useState, useRef, useContext } from "react";
import type { SubMessageType } from "../../../../../types";
import ChatContext from "../../../../ChatContext";
import MessageContent from "../../MessageContent";
import MessageContext from "../../MessageContext";
import { ReactionPicker } from "../../Reactions/ReactionPicker";
import { Reactions } from "../../Reactions/Reactions";
import { handleRemoveReaction } from "./reactionHandlers/handleRemoveReaction";
import { handleAddReaction } from "./reactionHandlers/handleAddReaction";
import { useSocketReactions } from "./reactionHandlers/useSocketReactions";
import { useMessageSeen } from "../../../../hooks/useMessageSeen";

export const SubMessage: React.FC<SubMessageType> = ({reply} : any) => {
  const [urlPreview] = useState<string | null>(null);
  const { id, userName, user, socket, email  } = useContext(ChatContext);
  const reactionsPickerRef = useRef<HTMLDivElement | null>(null);
  const [showReactionsPicker, setShowReactionsPicker] = useState<boolean>(false);
  const [showReplyModal, setShowReplyModal] = useState<boolean>(false);
  const [reactions, setReactions] = useState<{ [key: string]: string[] }>(reply.reactions || {});
  const { seen, messageRef } = useMessageSeen(reply);

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
