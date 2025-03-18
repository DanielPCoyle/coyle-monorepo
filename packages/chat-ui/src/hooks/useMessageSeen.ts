import React from "react";
import { useEffect, useRef, useState } from "react";
import { ChatContext } from "../ChatContext";
import type { Message as MessageType } from "../../types";

export const useMessageSeen = (message: MessageType) => {
  const { socket, userName } = React.useContext(ChatContext);
  const [seen, setSeen] = useState<boolean>(message.seen || false);
  const messageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        console.log({ entry, userName, message });
        if (entry.isIntersecting && userName !== message.sender && !seen) {
          // Ensure we only emit once
          console.log("Emitting seen for message", message.id);
          socket.emit("seen", message.id);
          setSeen(true); // Ensure state updates and prevents multiple emits
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
      observer.disconnect(); // Clean up observer instance
    };
  }, [socket, seen]); // Depend on `seen` to prevent re-emitting

  return { seen, messageRef };
};
