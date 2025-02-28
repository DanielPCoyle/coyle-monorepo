import React, { useContext, useRef } from "react";
import { ChatContext } from "../ChatContext";
import { Message } from "./Message";
import { ThreeJsBackground } from "./ThreeJsBackground";

interface MessageType {
  id: string;
  text: string;
  user: string;
}

export const Conversation: React.FC = () => {
  const { messages, username } = useContext(ChatContext);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <ThreeJsBackground />
      <div ref={contentRef} className="messageContainer">
        <div style={{ width: "90%", margin: "auto" }}>
          {messages
          .filter((message: MessageType) => !message.parentId)
          .map((message: MessageType, index: number) => (
            <Message key={index} {...{ message, username }} index={index} />
          ))}
        </div>
      </div>
    </>
  );
};
