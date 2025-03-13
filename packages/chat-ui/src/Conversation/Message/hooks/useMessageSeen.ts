import React from "react";
import { useEffect, useRef, useState } from "react";
import { ChatContext } from "../../../ChatContext";
import type { Message as MessageType } from "../../../../types";

export const useMessageSeen = (message: MessageType) => {
  const { socket, userName } = React.useContext(ChatContext);
  const [seen, setSeen] = useState<boolean>(message.seen || false);
  const messageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && userName !== message.sender && !message.seen) {
          socket.emit("seen", message.id);
          setTimeout(() => {
            setSeen(false);
          }, 1000);
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
  }, [socket]);

  return { seen, messageRef };
};
