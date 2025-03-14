import React, { useState, useRef, useContext } from "react";
import type { Message as MessageType } from "../../../../../types";
import ChatContext from "../../../../ChatContext";
import MessageContent from "../../MessageContent";
import MessageContext from "../../MessageContext";
import { ReactionPicker } from "../../Reactions/ReactionPicker";
import { Reactions } from "../../Reactions/Reactions";
import { handleRemoveReaction } from "./reactionHandlers/handleRemoveReaction";
import { handleAddReaction } from "./reactionHandlers/handleAddReaction";
import { useSocketReactions } from "./reactionHandlers/useSocketReactions";
import type { Socket } from "socket.io-client";
export const SubMessage: React.FC<{
  reply: MessageType;
  user: string;
  socket:Socket;
  email: string;
}> = ({ reply, user, socket, email }) => {
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
