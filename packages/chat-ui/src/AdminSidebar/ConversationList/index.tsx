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
     <h1>Chats</h1>
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
        <h3>Active Conversations</h3>

        <ConversationListItems
          socket={socket}
          toggleDrawer={toggleDrawer}
          conversations={conversations.filter((c) => c?.isActive)}
        />

<h3>Admins Online</h3>
          <ConversationListItems
            socket={socket}
            toggleDrawer={toggleDrawer}
            conversations={admins}
          />


        <div className="historicConversations" data-testid="historic-conversations">
          <h3
            className="pointer"
            data-testid="historic-toggle"
            onClick={() => setShowHistoric(!showHistoric)}
          >
            Inactive Conversations ({" "}
            {conversations.filter((c) => !c?.isActive)?.length} )
          </h3>
          {showHistoric && (
            <div 
              className="overflowHidden"
              >
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
          
        </div>
      </div>
    </>
  );
};
