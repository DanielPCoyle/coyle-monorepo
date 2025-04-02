import React, { useContext, useState } from "react";
import { ChatContext } from "../../ChatContext";
import { ConversationListItems } from "./ConversationListItems";
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
    <h1>{t("chat")}</h1>
    <div
      className="sidebarHeader"
      data-testid="sidebar-header"
      >
     
     <div className="immediateSettings" data-testid="immediate-settings">
        <div className="formGroup status">
          <label>{t("status")}</label>
          <select
            className="statusDropdown"
            data-testid="status-dropdown"
            value={status || user?.status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="online">{t("online")}</option>
            <option value="offline">{t("offline")}</option>
          </select>
        
        </div>
        <div className="formGroup notifications">
          <label> {!notificationsEnabled ? <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path d="M157.65 176.1H64v159.8h93.65L288 440V72L157.65 176.1z"></path><path fill="none" stroke-linecap="square" stroke-linejoin="round" stroke-width="32" d="M352 320c9.74-19.41 16-40.81 16-64 0-23.51-6-44.4-16-64m48 176c19.48-34 32-64 32-112s-12-77.7-32-112"></path></svg> :
           <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M416 432 64 80"></path><path d="M243.33 98.86a23.89 23.89 0 0 0-25.55 1.82l-.66.51-28.52 23.35a8 8 0 0 0-.59 11.85l54.33 54.33a8 8 0 0 0 13.66-5.66v-64.49a24.51 24.51 0 0 0-12.67-21.71zm8 236.43L96.69 180.69A16 16 0 0 0 85.38 176H56a24 24 0 0 0-24 24v112a24 24 0 0 0 24 24h69.76l92 75.31a23.9 23.9 0 0 0 25.87 1.69A24.51 24.51 0 0 0 256 391.45v-44.86a16 16 0 0 0-4.67-11.3zM352 256c0-24.56-5.81-47.87-17.75-71.27a16 16 0 1 0-28.5 14.55C315.34 218.06 320 236.62 320 256q0 4-.31 8.13a8 8 0 0 0 2.32 6.25l14.36 14.36a8 8 0 0 0 13.55-4.31A146 146 0 0 0 352 256zm64 0c0-51.18-13.08-83.89-34.18-120.06a16 16 0 0 0-27.64 16.12C373.07 184.44 384 211.83 384 256c0 23.83-3.29 42.88-9.37 60.65a8 8 0 0 0 1.9 8.26L389 337.4a8 8 0 0 0 13.13-2.79C411 311.76 416 287.26 416 256z"></path><path d="M480 256c0-74.25-20.19-121.11-50.51-168.61a16 16 0 1 0-27 17.22C429.82 147.38 448 189.5 448 256c0 46.19-8.43 80.27-22.43 110.53a8 8 0 0 0 1.59 9l11.92 11.92a8 8 0 0 0 12.92-2.16C471.6 344.9 480 305 480 256z"></path></svg>
           }
          <input
            className="notificationsCheckbox"
            type="checkbox"
            data-testid="notifications-checkbox"
            checked={notificationsEnabled}
            onChange={() => setNotificationsEnabled(!notificationsEnabled)}
          />
          </label>
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
