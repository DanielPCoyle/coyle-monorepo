import React, { useState, useContext } from "react";
import { ConversationList } from "./ConversationList";
import { Settings } from "./Settings";
import { CogSvg } from "../assets/svg/CogSvg";
import { MenuIcon } from "../assets/svg/MenuIcon";
import { CloseIcon } from "../assets/svg/CloseIcon";
import { ChatIcon } from "../assets/svg/ChatIcon";
import { ChatContext } from "../ChatContext";
import { LogoutIcon } from "./LogoutIcon";
import { useTranslation } from "react-i18next";

export const SideBar = () => {
  const [view, setView] = useState("conversations");
  const [showMenu, setShowMenu] = useState(false);
  const { setToken, setIsLoggedIn, user, socket } = useContext(ChatContext);
  const { t } = useTranslation();

  return (
    <>
      <button
        className="menuButton"
        onClick={() => setShowMenu(!showMenu)}
        aria-expanded={showMenu}
        aria-label={t("toggleMenu")}
      >
        {showMenu ? <CloseIcon /> : <MenuIcon />}
      </button>
      <div
        className={`sidebar ${showMenu ? "open" : "close"} animate__animated animate__fadeInLeft`}
        role="navigation"
        aria-label={t("sidebar")}
      >
        <div className="sidebarToggle">
          <div className="topSidebar">
          <button
            className={`animate__animated animate__slideInUp ${view === "conversations" ? "active" : ""}`}
            onClick={() => setView("conversations")}
            aria-pressed={view === "conversations"}
            aria-label={t("viewConversations")}
          >
            <ChatIcon />
          </button>
          <button
            className={`animate__animated animate__slideInUp ${view === "settings" ? "active" : ""}`}
            onClick={() => setView("settings")}
            aria-pressed={view === "settings"}
            aria-label={t("viewSettings")}
          >
            <CogSvg />
          </button>
          </div>

          <button
            className={`animate__animated animate__slideInUp logout`}
            onClick={() => {
              if (window.confirm("Are you sure you want to logout?")) {
                socket.emit("updateStatus", {
                  status: "offline",
                  id: user?.id,
                });
                document.cookie = `jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${process.env.REACT_APP_COOKIE_DOMAIN}; Path=/; httpOnly; SameSite=None; Secure;`;
                setToken("");
                setIsLoggedIn(false);
              }
            }}
            aria-label={t("logout")}
          >
            <LogoutIcon />
          </button>
        </div>
        {view === "conversations" ? (
          <ConversationList setShowMenu={setShowMenu} />
        ) : (
          <Settings />
        )}
      </div>
    </>
  );
};
