import React from "react";
import SettingsContext from "./SettingsContext";
import { UserIcon } from "../../../assets/svg/UserIcon";
import { UsersIcon } from "../../../assets/svg/UsersIcon";

export const SettingsHome = () => {
  const { setView } = React.useContext(SettingsContext);
  return (
    <>
      <h1>Admin Settings</h1>

      <div className="settingsNav">
        <button onClick={() => setView("settings")}>
          <UserIcon />{" "}
          <span>Profile</span>
        </button>
        <button onClick={() => setView("adminUsers")}>
         <UsersIcon />
          <span>Chat Administrators</span>
        </button>
      </div>
    </>
  );
};


