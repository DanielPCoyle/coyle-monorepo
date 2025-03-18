import React, { useContext, useRef } from "react";
import { ChatContext } from "../ChatContext";
import { Message } from "./Message";
import { ThreeJsBackground } from "./ThreeJsBackground";
import { LoadingIcon } from "../../assets/svg/LoadingIcon";
import { MessageType } from "../../types";

export const Conversation: React.FC = () => {
  const { messages, loading } = useContext(ChatContext);
  const contentRef = useRef<HTMLDivElement>(null);

  if (loading)
    return (
      <div className="loading">
          <div className="loadingIcon" data-testid="loading-icon">
            <LoadingIcon />
          </div>
      </div>
    );

  return (
    <>
      {/* <ThreeJsBackground /> */}
      <div ref={contentRef} className="messagesContainer">
        <div>
          {messages
            .filter((message: MessageType) => !message.parentId)
            .map((message: MessageType, index: number) => (
              <Message
                key={message.id}
                index={index}
                message={message as MessageType}
              />
            ))}
        </div>
      </div>
    </>
  );
};
