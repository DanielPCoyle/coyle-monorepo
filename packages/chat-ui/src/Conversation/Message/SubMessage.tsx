import React, { useState, useRef, useEffect } from "react";
import type { Message as MessageType } from "../../../types";
import ChatContext from "../../ChatContext";
import MessageContent from "./MessageContent";
import MessageContext from "./MessageContext";
import { ReactionPicker } from "./ReactionPicker";
import { Reactions } from "./Reactions";

export const SubMessage: React.FC<{
  reply: MessageType;
  user: string;
  socket: any;
  email: string;
  addReaction: any;
}> = ({ reply, user, socket, email }) => {
  const [urlPreview] = useState<string | null>(null);
  const { id } = React.useContext(ChatContext);
  const reactionsPickerRef = useRef<HTMLDivElement | null>(null);
  const [showReactionsPicker, setShowReactionsPicker] = useState<boolean>(false);
  const [showReplyModal, setShowReplyModal] = useState<boolean>(false);
  const [reactions, setReactions] = useState<{ [key: string]: string[] }>(
    reply.reactions || {}
  );

  const { userName } = React.useContext(ChatContext);

  useEffect(() => {
    socket.on("addReaction", (payload) => {
      console.log({ payload, reply });
      if (payload.messageId === reply.id) {
        setReactions(payload.reactions);
      }
    });
  }, []);

  const addReaction = (emoji: { emoji: string }) => {
    const newReactions = { ...reactions };
    if (!newReactions[email]) {
      newReactions[email] = [];
    }
    newReactions[email].push(emoji.emoji);
    setReactions(newReactions);
    socket.emit("addReaction", {
      id: id,
      messageId: reply.id,
      reactions: newReactions,
    });
    setShowReactionsPicker(false);
  };

  const removeReactions = (emoji: { emoji: string }) => {
    const newReactions = { ...reactions };
    if (newReactions[email]) {
      newReactions[email] = newReactions[email].filter((e) => e !== emoji.emoji);
      if (newReactions[email].length === 0) {
        delete newReactions[email];
      }
      setReactions(newReactions);

      socket.emit("addReaction", {
        messageId: reply.id,
        reactions: newReactions,
      });
    }
  };

  return (
    <MessageContext.Provider
      value={{
        message: reply,
        urlPreview,
        user,
        setShowReactionsPicker,
        setShowReplyModal,
        showReplyModal,
        addReaction,
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
              removeReactions={removeReactions}
            />
          </div>
        )}
      </div>
    </MessageContext.Provider>
  );
};
