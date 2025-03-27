"use client"

import React, { useState, useEffect, useRef } from "react";
import Chat from "./Chat";
import { ChatIcon } from "./assets/svg/ChatIcon";
import { CloseIcon } from "./assets/svg/CloseIcon";

export const ChatCaddy = () => {
  const [open, setOpen] = useState(false); // State to toggle chat window
  const chatCaddyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatCaddyRef.current &&
        !chatCaddyRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="chatCaddyContainer" ref={chatCaddyRef}>
        <div className={"chatCaddy animate__animated animate__slideInUp "+ (open ? "show" : "hide")}>
          <Chat isChatCaddy={true} setOpen={setOpen} />
        </div>
      <div className="showChat">
        <button onClick={() => setOpen(!open)}>
          {!open ? <ChatIcon /> : <CloseIcon />}
        </button>
      </div>
    </div>
  );
};

export default ChatCaddy;