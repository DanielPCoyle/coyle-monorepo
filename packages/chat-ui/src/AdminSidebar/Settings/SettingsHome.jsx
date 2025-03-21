import React from "react";
import SettingsContext from "./SettingsContext";
import { UserIcon } from "../../assets/svg/UserIcon";
import { UsersIcon } from "../../assets/svg/UsersIcon";
import { useTranslation } from "react-i18next";
export const SettingsHome = () => {
  const { setView } = React.useContext(SettingsContext);
  const { t } = useTranslation();
  return (
    <>
      <h1>{t("settings")}</h1>

      <div className="settingsNav">
        <button onClick={() => setView("settings")}>
          <UserIcon />{" "}
          <span>{t("profile")}</span>
        </button>
        <button onClick={() => setView("adminUsers")}>
         <UsersIcon />
          <span>{t("chatAdministrators")}</span>
        </button>
        <button onClick={() => setView("adminUsers")}>
            <UsersIcon />
          <span>{t("content")}</span>
        </button>
      </div>
    </>
  );
};


export default SettingsHome;