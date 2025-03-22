import React, { useContext, useState } from "react";
import { ChatContext } from "../../ChatContext";
import { ConversationListItems } from "./ConversationListItems";
import { a } from "framer-motion/dist/types.d-B50aGbjN";
import { useTranslation } from "react-i18next";
export const ConversationList = ({setShowMenu}: {setShowMenu: (showMenu: boolean) => void}) => {
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
  const { t } = useTranslation();
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
    <div
      className="sidebarHeader"
      data-testid="sidebar-header"
      >
     <h1>{t("chat")}</h1>
     <div className="immediateSettings" data-testid="immediate-settings">
        <div className="formGroup status">
          <label>{t("status")}</label>
          <select
            className="statusDropdown"
            data-testid="status-dropdown"
            value={status || user?.status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="online">{t("onlinr")}</option>
            <option value="offline">{t("offline")}</option>
          </select>
        
        </div>
        <div className="formGroup notifications">
          <label>{t("sound")} {notificationsEnabled ? t("on") : t("off")}</label>
          <input
            type="checkbox"
            data-testid="notifications-checkbox"
            checked={notificationsEnabled}
            onChange={() => setNotificationsEnabled(!notificationsEnabled)}
          />
        </div>
        
      </div>
    </div>
      <div className={`conversationList`} data-testid="conversation-list">
        <h3>{t("activeConversations")}</h3>

        <ConversationListItems
          socket={socket}
          setShowMenu={setShowMenu}
          conversations={conversations.filter((c) => c?.isActive)}
        />

          <h3>{t("adminsOnline")}</h3>
          <ConversationListItems
            socket={socket}
            setShowMenu={setShowMenu}
            conversations={admins.map((a)=>{
              a.conversationKey = [a.id,user.id].sort().join("_")
              return a
            })}
          />

        <div className="historicConversations" data-testid="historic-conversations">
          <h3
            className="pointer"
            data-testid="historic-toggle"
            onClick={() => setShowHistoric(!showHistoric)}
          >
            {t("inactiveConversations")} ({" "}
            {conversations.filter((c) => !c?.isActive && c?.id !== (user?.id +"_"+user?.id))?.length} )
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
                  setShowMenu={setShowMenu}
                  conversations={conversations.filter((c) => !c?.isActive && c?.id !== (user?.id +"_"+user?.id))}
                />
              </div>
            </div>
          )}
          
        </div>

    

      {status === "offline" && (
            <p className="offlineMessage">
              {t("youAreOffline")}
            </p>
          )}
      </div>
    </>
  );
};
