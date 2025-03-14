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


export const SubMessage: React.FC<SubMessageType> = ({ reply, user, socket, email }) => {
  const [urlPreview] = useState<string | null>(null);
  const { id, userName } = useContext(ChatContext);
  const reactionsPickerRef = useRef<HTMLDivElement | null>(null);
  const [showReactionsPicker, setShowReactionsPicker] = useState<boolean>(false);
  const [showReplyModal, setShowReplyModal] = useState<boolean>(false);
  const [reactions, setReactions] = useState<{ [key: string]: string[] }>(reply.reactions || {});

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
        addReaction: (emoji) => handleAddReaction(emoji, email, reactions, setReactions, socket, id, reply.id, setShowReactionsPicker),
        reactions,
      }}
    >
      <div data-testid="submessage-container">
        <MessageContent data-testid="message-content" />
        {showReactionsPicker && (
          <div data-testid="reaction-picker">
            <ReactionPicker reactionsPickerRef={reactionsPickerRef} />
          </div>
        )}

        {Boolean(reactions) && Object.values(reactions).length > 0 && (
          <div data-testid="reactions">
            <Reactions
              isSender={reply.sender === userName}
              reactions={reactions}
              removeReactions={(emoji) => handleRemoveReaction(emoji, email, reactions, setReactions, socket, reply.id)}
            />
          </div>
        )}
      </div>
    </MessageContext.Provider>
  );
};
