import React, { useState } from "react";
import { ConversationList } from "./ConversationList";
import { Settings } from "./Settings/Settings";
import { CogSvg } from "../../svg/CogSvg";
import { BackArrow } from "../../svg/BackArrow";
export const SideBar = () => {
  const [view, setView] = useState("conversations");
  return (
    <>
      <div className="sidebar animate__animated animate__fadeInLeft">
        <div className="sidebarToggle">
          {view === "conversations" ? (
            <button
              className="animate__animated animate__slideInUp"
              onClick={() => setView("settings")}
            >
              <CogSvg />
            </button>
          ) : (
            <button
              className="animate__animated animate__slideInUp"
              onClick={() => setView("conversations")}
            >
             <BackArrow />
            </button>
          )}
        </div>
        {view === "conversations" ? <ConversationList /> : <Settings />}
      </div>
    </>
  );
};