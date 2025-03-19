import React, { useState, useContext } from "react";
import { ConversationList } from "./ConversationList";
import { Settings } from "./Settings";
import { CogSvg } from "../../assets/svg/CogSvg";
import { MenuIcon } from "../../assets/svg/MenuIcon";
import { CloseIcon } from "../../assets/svg/CloseIcon";
import { ChatIcon } from "../../assets/svg/ChatIcon";
import { ChatContext } from "../ChatContext";


export const SideBar = () => {
  const [view, setView] = useState("conversations");
  const [showMenu, setShowMenu] = useState(false);
  const { setToken, setIsLoggedIn, user, socket } = useContext(ChatContext);

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

          <button
            className={`animate__animated animate__slideInUp logout`}
            onClick={() => {
              if(window.confirm("Are you sure you want to logout?")){
                socket.emit("updateStatus", { status:'offline', id: user?.id });
                localStorage.removeItem("jwt");
                setToken("");
                setIsLoggedIn(false);
              }
            }}
          >
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="35px" width="35px" xmlns="http://www.w3.org/2000/svg"><path d="M5 11H13V13H5V16L0 12L5 8V11ZM3.99927 18H6.70835C8.11862 19.2447 9.97111 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C9.97111 4 8.11862 4.75527 6.70835 6H3.99927C5.82368 3.57111 8.72836 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C8.72836 22 5.82368 20.4289 3.99927 18Z"></path></svg>
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
