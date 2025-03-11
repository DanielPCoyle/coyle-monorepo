import React, { useContext, useRef } from "react";
import { ChatContext } from "../ChatContext";
import { Message } from "./Message";
import { ThreeJsBackground } from "./ThreeJsBackground";

interface MessageType {
  id: string;
  text: string;
  user: string;
  parentId?: string;
  conversationKey: string;
  sender: string;
  message: string;
  createdAt: string;
  seen: boolean;
  reactions: Record<string, string[]>;
  files: any[];
  replies: any[];
}

export const Conversation: React.FC = () => {
  const { messages, loading } = useContext(ChatContext);
  const contentRef = useRef<HTMLDivElement>(null);

  if(loading) return <div className="loading">
    <div>
      <div className="loadingIcon">
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path></svg>
      </div>
    </div>
  </div>

  return (
    <>
      {/* <ThreeJsBackground /> */}
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
