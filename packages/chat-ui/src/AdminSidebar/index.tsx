import React, { useState } from "react";
import { ConversationList } from "./ConversationList";
import { Settings } from "./Settings";
import { CogSvg } from "../../assets/svg/CogSvg";
import { BackArrow } from "../../assets/svg/BackArrow";
import { MenuIcon } from "../../assets/svg/MenuIcon";
import { CloseIcon } from "../../assets/svg/CloseIcon";
import { ChatIcon } from "../../assets/svg/ChatIcon";
export const SideBar = () => {
  const [view, setView] = useState("conversations");
  const [showMenu, setShowMenu] = useState(false);
  return (
    <>
      <button className="menuButton" onClick={() => setShowMenu(!showMenu)}>
        {showMenu ? <CloseIcon /> : <MenuIcon />}
      </button>
      <div
        className={`sidebar ${showMenu ? "open" : "close"} animate__animated animate__fadeInLeft`}
      >
        <div className="sidebarToggle">
          <button
            className={`animate__animated animate__slideInUp ${view === "conversations" ? "active" : ""}`}
            onClick={() => setView("conversations")}
          >
            <ChatIcon />
          </button>
          <button
            className={`animate__animated animate__slideInUp ${view === "settings" ? "active" : ""}`}
            onClick={() => setView("settings")}
          >
            <CogSvg />
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
