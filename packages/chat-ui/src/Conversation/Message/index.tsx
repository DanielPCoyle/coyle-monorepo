import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import type { Message as MessageType } from "../../../types";
import { ChatContext } from "../../ChatContext";
import { MessageContent } from "./MessageContent";
import { MessageContext } from "./MessageContext";
import { ReactionPicker } from "./ReactionPicker";
import { Reactions } from "./Reactions";
import { ReplyModal } from "./ReplyModal";

Modal.setAppElement("#__next");



export const Message: React.FC<{ message: MessageType; index: number }> = ({
  message,
  index,
}) => {
  const { user, userName, socket, id, email } = React.useContext(ChatContext);
  const [urlPreview] = useState<string | null>(null);
  const [showReactionsPicker, setShowReactionsPicker] =
    useState<boolean>(false);
  const [showReplyModal, setShowReplyModal] = useState<boolean>(false);
  const [seen, setSeen] = useState<boolean>(message.seen || false);
  const [reactions, setReactions] = useState<{ [key: string]: string[] }>(
    message.reactions || {},
  );

  useEffect(() => {
    socket.on("addReaction", (payload) => {
      if (payload.messageId === message.id) {
        setReactions(payload.reactions);
      }
    });
  }, []);

  const reactionsPickerRef = useRef<HTMLDivElement | null>(null);
  const messageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (userName !== message.sender && !message.seen) {
            socket.emit("seen", message.id);
            setTimeout(() => {
              setSeen(false);
            }, 1000);
          }
        }
      },
      { threshold: 0.1 },
    );

    if (messageRef.current) {
      observer.observe(messageRef.current);
    }

    return () => {
      if (messageRef.current) {
        observer.unobserve(messageRef.current);
      }
    };
  }, [messageRef.current, socket]);

  const addReaction = (emoji: { emoji: string }) => {
    const newReactions = { ...reactions };
    if (!newReactions[email]) {
      newReactions[email] = [];
    }
    newReactions[email].push(emoji.emoji);
    setReactions(newReactions);
    socket.emit("addReaction", {
      id: id,
      messageId: message.id,
      reactions: newReactions,
    });
    setShowReactionsPicker(false);
  };

  const removeReactions = (emoji: { emoji: string }) => {
    const newReactions = { ...reactions };
    if (newReactions[email]) {
      newReactions[email] = newReactions[email].filter(
        (e) => e !== emoji.emoji,
      );
      if (newReactions[email].length === 0) {
        delete newReactions[email];
      }
      setReactions(newReactions);

      socket.emit("addReaction", {
        id,
        messageId: message.id,
        reactions: newReactions,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        reactionsPickerRef.current &&
        !reactionsPickerRef.current.contains(event.target as Node)
      ) {
        setShowReactionsPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <MessageContext.Provider
      value={{
        message,
        urlPreview,
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
        style={{
          alignItems: message.sender === user ? "flex-end" : "flex-start",
        }}
        key={index}
        
      >
        <MessageContent />
      </div>
      {showReactionsPicker && (
        <ReactionPicker reactionsPickerRef={reactionsPickerRef} />
      )}

      {Boolean(reactions) && Object.values(reactions).length > 0 && (
        <Reactions
          isSender={message.sender === userName}
          reactions={reactions}
          removeReactions={removeReactions}
        />
      )}
      <ReplyModal {
        ...{
          showReplyModal,
          setShowReplyModal,
          message,
          showReactionsPicker,
          reactionsPickerRef,
          addReaction,
          user,
          email,
          socket,
        }} />
    </MessageContext.Provider>
  );
};