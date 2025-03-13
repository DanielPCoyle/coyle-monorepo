import React, { useState } from "react";
import { SettingsContext } from "./SettingsContext";
import { ChatContext } from "../../ChatContext";
import { useContext } from "react";
import { ChatAdministators } from "./ChatAdministators";
import { AddNewUserScreen } from "./AddNewUserScreen";
import { SettingsHome } from "./SettingsHome";
import { BackArrow } from "../../../assets/svg/BackArrow";

export const Settings = () => {
  const { user, setUser } = useContext(ChatContext);
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationSound, setNotificationSound] = useState("");
  const [notificationFrequency, setNotificationFrequency] = useState("daily");
  const [status, setStatus] = useState("offline");
  const [view, setView] = useState("home");

  const handleSave = () => {
    console.log("Settings saved", {
      adminName,
      email,
      password,
      notificationFrequency,
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        adminName,
        setAdminName,
        email,
        user,
        setUser,
        setEmail,
        password,
        setPassword,
        notificationsEnabled,
        setNotificationsEnabled,
        notificationSound,
        setNotificationSound,
        notificationFrequency,
        setNotificationFrequency,
        status,
        setStatus,
        view,
        setView,
        handleSave,
      }}
    >
      <div className="settingsContainer">
        {view !== "home" && (
          <div className="settingsNav">
            <button onClick={() => setView("home")}>
              <BackArrow />
              <span>Go Back</span>
            </button>
          </div>
        )}
        {view === "home" && <SettingsHome />}

        {view === "settings" && (
          <>
            <h1>Profile</h1>
            <div className="formGroup">
              <label>Admin Name</label>
              <input
                type="text"
                value={adminName || user.name}
                onChange={(e) => setAdminName(e.target.value)}
              />
            </div>
            <div className="formGroup">
              <label>Email</label>
              <input
                type="email"
                value={email || user.email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="formGroup">
              <label>Notification Frequency</label>
              <select
                value={notificationFrequency}
                onChange={(e) => setNotificationFrequency(e.target.value)}
              >
                <option value="instant">Instant</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <hr />
            <div className="formGroup">
              <label>New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="formGroup">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button onClick={handleSave}>Save Settings</button>
          </>
        )}
        {view === "adminUsers" && <ChatAdministators />}
        {view === "addUser" && <AddNewUserScreen />}
      </div>
    </SettingsContext.Provider>
  );
};

