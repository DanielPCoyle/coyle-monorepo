import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { ChatControls } from "../../ChatControls";

import type { Message as MessageType } from "../../../../types";
import { ChatContext } from "../../ChatContext";
import { MessageContent } from "./MessageContent";
import { MessageContext } from "./MessageContext";
import { ReactionPicker } from "./ReactionPicker";
import { Reactions } from "./Reactions";

Modal.setAppElement("#__next");

const customStyles = {
  overlay: {
    insert: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  content: {
    background: "black",
    borderRadius: "10px",
    border: "none",
    width: "50%",
    height: "100%",
    margin: "auto",
  },
};

export const Message: React.FC<{ message: MessageType; index: number }> = ({
  message,
  index,
}) => {
  const {
    user,
    userName,
    socket,
    id,
    email,
    conversations,
  } = React.useContext(ChatContext);

  const [urlPreview] = useState<string | null>(null);
  const [showReactionsPicker, setShowReactionsPicker] =
    useState<boolean>(false);
  const [showReplyModal, setShowReplyModal] = useState<boolean>(false);
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
            const nConversations = [...conversations];
            const index = nConversations.findIndex((c) => {
              console.log({ c });
              return c?.id === id;
            });
            if(nConversations[index]) {
            nConversations[index].unSeenMessages -= 1;
            // setConversations(nConversations);
            }
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
      }}
    >
      <div
        ref={messageRef}
        className="animate__animated animate__zoomIn"
        key={index}
        style={{
          alignItems: message.sender === user ? "flex-end" : "flex-start",
          display: "flex",
          flexDirection: "column",
          marginBottom: "20px",
          position: "relative",
        }}
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

      <Modal
        isOpen={showReplyModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="replyModal animate__animated animate__fadeIn">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>Replying to...</h3>
            <button
              className="closeModal"
              onClick={() => setShowReplyModal(false)}
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"></path>
              </svg>
            </button>
          </div>
          <div className="replies">
            <MessageContent />
            {showReactionsPicker && (
              <ReactionPicker reactionsPickerRef={reactionsPickerRef} />
            )}
            {message.replies && (
              <div>
                {message.replies.map((reply: MessageType, index: number) => (
                  <div key={index}>
                    <SubMessage
                      reply={reply}
                      user={user}
                      email={email}
                      addReaction={addReaction}
                      socket={socket}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <hr />
          <div style={{ overflow: "hidden" }}>
            <div className="animate__animated animate__faster animate__slideInDown">
              <ChatControls replyId={message.id} />
            </div>
          </div>
        </div>
      </Modal>
    </MessageContext.Provider>
  );
};

const SubMessage: React.FC<{
  reply: MessageType;
  user: string;
  socket: any;
  email: string;
  addReaction: any;
}> = ({ reply, user, socket, email }) => {
  const [urlPreview] = useState<string | null>(null);
  const { id } = React.useContext(ChatContext);
  const reactionsPickerRef = useRef<HTMLDivElement | null>(null);
  const [showReactionsPicker, setShowReactionsPicker] =
    useState<boolean>(false);
  const [showReplyModal, setShowReplyModal] = useState<boolean>(false);
  const [reactions, setReactions] = useState<{ [key: string]: string[] }>(
    reply.reactions || {},
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
      newReactions[email] = newReactions[email].filter(
        (e) => e !== emoji.emoji,
      );
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
      <MessageContent />
      {showReactionsPicker && (
        <ReactionPicker reactionsPickerRef={reactionsPickerRef} />
      )}

      {Boolean(reactions) && Object.values(reactions).length > 0 && (
        <Reactions
          isSender={reply.sender === userName}
          reactions={reactions}
          removeReactions={removeReactions}
        />
      )}
    </MessageContext.Provider>
  );
};
