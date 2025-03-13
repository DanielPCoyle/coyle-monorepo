"use client"

import React, { useState } from "react";
import Chat from "./Chat";

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
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 16 16"
              height="35px"
              width="35px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"></path>
              <path d="M8 3.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132"></path>
            </svg>
          ) : (
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="35px"
              width="35px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.5859 12L2.79297 4.20706L4.20718 2.79285L12.0001 10.5857L19.793 2.79285L21.2072 4.20706L13.4143 12L21.2072 19.7928L19.793 21.2071L12.0001 13.4142L4.20718 21.2071L2.79297 19.7928L10.5859 12Z"></path>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatCaddy;
