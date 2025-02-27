import React, { useState, useContext } from "react";
import { ChatContext } from "../ChatContext";
import { ConversationListItems } from "./ConversationListItems";

interface Conversation {
  id: string;
  unSeenMessages?: number;
}

export const ConversationList: React.FC = () => {
  const {
    conversations,
    currentConversation,
    setCurrentConversation,
    socket,
    id,
    historicConversations,
  } = useContext(ChatContext) as any;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <button
        onClick={toggleDrawer}
        style={{
          position: "fixed",
          top: 10,
          left: 10,
          zIndex: 5,
          backgroundColor: "transparent",
          border: "none",
          color: "white",
          cursor: "pointer",
          display: window.innerWidth <= 1100 ? "block" : "none",
        }}
      >
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="30px"
          width="30px"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="Menu_Kebab">
            <path d="M14.5,12c0,1.38 -1.12,2.5 -2.5,2.5c-1.38,-0 -2.5,-1.12 -2.5,-2.5c0,-1.38 1.12,-2.5 2.5,-2.5c1.38,-0 2.5,1.12 2.5,2.5Zm-1,-0c0,-0.828 -0.672,-1.5 -1.5,-1.5c-0.828,-0 -1.5,0.672 -1.5,1.5c0,0.828 0.672,1.5 1.5,1.5c0.828,-0 1.5,-0.672 1.5,-1.5Z"></path>
            <path d="M14.5,4.563c0,1.38 -1.12,2.5 -2.5,2.5c-1.38,-0 -2.5,-1.12 -2.5,-2.5c0,-1.38 1.12,-2.5 2.5,-2.5c1.38,-0 2.5,1.12 2.5,2.5Zm-1,-0c0,-0.828 -0.672,-1.5 -1.5,-1.5c-0.828,-0 -1.5,0.672 -1.5,1.5c0,0.828 0.672,1.5 1.5,1.5c0.828,-0 1.5,-0.672 1.5,-1.5Z"></path>
            <path d="M14.5,19.437c0,1.38 -1.12,2.5 -2.5,2.5c-1.38,0 -2.5,-1.12 -2.5,-2.5c0,-1.38 1.12,-2.5 2.5,-2.5c1.38,0 2.5,1.12 2.5,2.5Zm-1,0c0,-0.828 -0.672,-1.5 -1.5,-1.5c-0.828,0 -1.5,0.672 -1.5,1.5c0,0.828 0.672,1.5 1.5,1.5c0.828,0 1.5,-0.672 1.5,-1.5Z"></path>
          </g>
        </svg>
      </button>
      <div
        className={`conversationList animate__animated ${isDrawerOpen ? "open animate__slideInLeft" : ""}`}
      >
        <h3>Active Conversations</h3>
        <button
          onClick={toggleDrawer}
          style={{
            position: "absolute",
            cursor: "pointer",
            top: 10,
            right: 10,
            zIndex: 5,
            backgroundColor: "transparent",
            border: "none",
            color: "white",
            display: window.innerWidth <= 1100 ? "block" : "none",
          }}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="30px"
            width="30px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Menu_Kebab">
              <path d="M14.5,12c0,1.38 -1.12,2.5 -2.5,2.5c-1.38,-0 -2.5,-1.12 -2.5,-2.5c0,-1.38 1.12,-2.5 2.5,-2.5c1.38,-0 2.5,1.12 2.5,2.5Zm-1,-0c0,-0.828 -0.672,-1.5 -1.5,-1.5c-0.828,-0 -1.5,0.672 -1.5,1.5c0,0.828 0.672,1.5 1.5,1.5c0.828,-0 1.5,-0.672 1.5,-1.5Z"></path>
              <path d="M14.5,4.563c0,1.38 -1.12,2.5 -2.5,2.5c-1.38,-0 -2.5,-1.12 -2.5,-2.5c0,-1.38 1.12,-2.5 2.5,-2.5c1.38,-0 2.5,1.12 2.5,2.5Zm-1,-0c0,-0.828 -0.672,-1.5 -1.5,-1.5c-0.828,-0 -1.5,0.672 -1.5,1.5c0,0.828 0.672,1.5 1.5,1.5c0.828,-0 1.5,-0.672 1.5,-1.5Z"></path>
              <path d="M14.5,19.437c0,1.38 -1.12,2.5 -2.5,2.5c-1.38,0 -2.5,-1.12 -2.5,-2.5c0,-1.38 1.12,-2.5 2.5,-2.5c1.38,0 2.5,1.12 2.5,2.5Zm-1,0c0,-0.828 -0.672,-1.5 -1.5,-1.5c-0.828,0 -1.5,0.672 -1.5,1.5c0,0.828 0.672,1.5 1.5,1.5c0.828,0 1.5,-0.672 1.5,-1.5Z"></path>
            </g>
          </svg>
        </button>
        <ConversationListItems
          socket={socket}
          setCurrentConversation={setCurrentConversation}
          currentConversation={currentConversation}
          conversations={conversations
            .map((convo: Conversation) => {
              if (!convo?.id) return null;
              const historicRecord = historicConversations.find(
                (historic: Conversation) => historic.id === convo.id,
              );
              convo.unSeenMessages = historicRecord?.unSeenMessages || 0;
              return convo;
            })
            .filter(
              (
                convo: Conversation | null,
                index: number,
                self: (Conversation | null)[],
              ) =>
                convo && index === self.findIndex((c) => c?.id === convo?.id),
            )}
          id={id}
        />
        <div className="historicConversations">
          <h3>Historic Conversations</h3>
          <ConversationListItems
            socket={socket}
            setCurrentConversation={setCurrentConversation}
            currentConversation={currentConversation}
            conversations={historicConversations.filter(
              (convo: Conversation) =>
                !conversations.some((c: Conversation) => c?.id === convo?.id),
            )}
            id={id}
          />
        </div>
      </div>
    </>
  );
};
