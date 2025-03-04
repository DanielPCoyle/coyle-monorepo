import React, { useContext, useRef } from "react";
import { ChatContext } from "../ChatContext";
import { Message } from "./Message";
import { ThreeJsBackground } from "./ThreeJsBackground";

interface MessageType {
  id: string;
  text: string;
  user: string;
  parentId?: string;
  conversationId: string;
  sender: string;
  message: string;
  createdAt: string;
  seen: boolean;
  reactions: Record<string, string[]>;
  files: any[];
  replies: any[];
}

export const Conversation: React.FC = () => {
  const { messages } = useContext(ChatContext);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <ThreeJsBackground />
      <div ref={contentRef} className="messageContainer">
        <div style={{ width: "90%", margin: "auto" }}>
          {messages
            .filter((message: MessageType) => !message.parentId)
            .map((message: MessageType, index: number) => (
                <Message 
                key={message.id}
                index={index}
                message={message as any}
                />
              ))}
            </div>
            </div>
    </>
  );
};
