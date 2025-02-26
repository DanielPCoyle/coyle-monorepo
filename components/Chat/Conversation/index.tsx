import React, { useRef, useState, useContext } from "react";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Message } from "./Message";
import { ChatContext } from "../ChatContext";
import { ThreeJsBackground } from "./ThreeJsBackground";

interface MessageType {
  id: string;
  text: string;
  user: string;
}

export const Conversation: React.FC = () => {
  const { messages, username, socket } = useContext(ChatContext);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <ThreeJsBackground />
      <div ref={contentRef} className="messageContainer">
        <div style={{ width: "90%", margin: "auto" }}>
          {messages.map((message: MessageType, index: number) => (
            <Message key={index} {...{ message, username }} index={index} />
          ))}
        </div>
      </div>
    </>
  );
};
