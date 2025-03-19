import React, { useState } from "react";
import { SettingsContext } from "./SettingsContext";
import { ChatContext } from "../../ChatContext";
import { useContext } from "react";
import { ChatAdministators } from "./ChatAdministators";
import { AddNewUserScreen } from "./AddNewUserScreen";
import { BackArrow } from "@coyle/chat-ui/src/assets/svg/BackArrow";
import { ProfileSettings } from "./ProfileSettings";
import { SettingsHome } from "./SettingsHome";

export const Settings = () => {
  const { user } = useContext(ChatContext);
  const [view, setView] = useState("home");
  const [selected, setSelected] = React.useState(null);
  
  
  return (
    <SettingsContext.Provider
      value={{
        user,
        view,
        setView,
      }}
    >
      <div className="settingsContainer">
        {view === "home" && <SettingsHome />}
        {view === "settings" && (
          <ProfileSettings id={user.id} />
        )}
        {view === "editUser" && (
          <ProfileSettings id={selected} />
        )}
        {view === "adminUsers" && <ChatAdministators setSelected={setSelected} />}
        {view === "addUser" && <AddNewUserScreen />}
        {view !== "home" && (
          <div className="settingsNav">
            <button className="goBack" onClick={() => setView("home")}>
              <BackArrow />
              <span>Go Back</span>
            </button>
          </div>
        )}
      </div>
    </SettingsContext.Provider>
  );
};