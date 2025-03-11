import React, { useContext, useState } from "react";
import { ChatContext } from "../../ChatContext";
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
    user,
  } = useContext(ChatContext);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [status, setStatus] = useState("online");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
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
      <div className="immediateSettigs">
        <div className="formGroup status">
          <label>Status</label>
          <select
            className="statusDropdown"
            value={status || user?.status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>
        <div className="formGroup notifications">
          <label>
            Notifications {user.notificationsEnabled ? "On" : "Off"}
          </label>
          <input
            type="checkbox"
            checked={notificationsEnabled || user.notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
          />
        </div>
      </div>
      <hr />
      <div className={`conversationList`}>
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
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            className="bi bi-x-circle-fill"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
          </svg>
        </button>
        {/* <pre>{JSON.stringify(conversations,null,2)}</pre> */}
        <ConversationListItems
          socket={socket}
          toggleDrawer={toggleDrawer}
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
            toggleDrawer={toggleDrawer}
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
