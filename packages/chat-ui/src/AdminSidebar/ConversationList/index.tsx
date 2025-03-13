import React, { useContext, useState } from "react";
import { ChatContext } from "../../ChatContext";
import { ConversationListItems } from "./ConversationListItems";
import { MenuIcon } from "../../../assets/svg/MenuIcon";
import { CloseIcon } from "../../../assets/svg/CloseIcon";

export const ConversationList: React.FC = () => {
  const {
    conversations,
    socket,
    user,
    admins,
    status,
    setStatus,
    notificationsEnabled,
    setNotificationsEnabled,
  } = useContext(ChatContext);
  const [showHistoric, setShowHistoric] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  React.useEffect(() => {
    socket.emit("updateStatus", { status, id: user?.id });
  }, [status]);

  React.useEffect(() => {
    socket.emit("updateNotificationsEnabled", {
      notificationsEnabled,
      id: user?.id,
    });
  }, [notificationsEnabled]);

  return (
    <>
      <button
        onClick={toggleDrawer}
        data-testid="menu-button"
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
        <span data-testid="menu-icon">
        <MenuIcon  />
        </span>
      </button>
      <div className="immediateSettings" data-testid="immediate-settings">
        <div className="formGroup status">
          <label>Status</label>
          <select
            className="statusDropdown"
            data-testid="status-dropdown"
            value={status || user?.status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>
        <div className="formGroup notifications">
          <label>Sound {notificationsEnabled ? "On" : "Off"}</label>
          <input
            type="checkbox"
            data-testid="notifications-checkbox"
            checked={notificationsEnabled}
            onChange={() => setNotificationsEnabled(!notificationsEnabled)}
          />
        </div>
      </div>
      <hr />
      <div className={`conversationList`} data-testid="conversation-list">
        <button
          onClick={toggleDrawer}
          data-testid="close-button"
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
        <span data-testid="close-icon">
          <CloseIcon  />
          </span>
        </button>
        <h3>Active Conversations</h3>

        <ConversationListItems
          socket={socket}
          toggleDrawer={toggleDrawer}
          conversations={conversations.filter((c) => c?.isActive)}
        />
        <div className="historicConversations" data-testid="historic-conversations">
          <h3
            data-testid="historic-toggle"
            onClick={() => setShowHistoric(!showHistoric)}
          >
            Inactive Conversations ({" "}
            {conversations.filter((c) => !c?.isActive)?.length} )
          </h3>
          {showHistoric && (
            <div style={{ overflow: "hidden" }}>
              <div
                className="animate__animated animate__slideInDown animate__faster"
                data-testid="historic-conversation-list"
              >
                <ConversationListItems
                  socket={socket}
                  toggleDrawer={toggleDrawer}
                  conversations={conversations.filter((c) => !c?.isActive)}
                />
              </div>
            </div>
          )}
          <h3>Admins Online</h3>
          <ConversationListItems
            socket={socket}
            toggleDrawer={toggleDrawer}
            conversations={admins}
          />
        </div>
      </div>
    </>
  );
};
