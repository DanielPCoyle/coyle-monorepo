"use client"

import React, { useState } from "react";
import Chat from "./Chat";
import { ChatIcon } from "../svg/ChatIcon";
import { CloseIcon } from "../svg/CloseIcon";

export const ChatCaddy = () => {
  const [open, setOpen] = useState(false); // State to toggle chat window
  return (
    <div className="chatCaddyContainer">
      {open && (
        <div className="chatCaddy animate__animated animate__fadeInUp">
          <Chat />
        </div>
      )}
      <div className="showChat">
        <button onClick={() => setOpen(!open)}>
          {!open ? (
            <ChatIcon />
          ) : (
            <CloseIcon />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatCaddy;