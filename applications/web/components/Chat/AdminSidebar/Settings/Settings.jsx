import React, { useState } from "react";
import { SettingsContext } from "./SettingsContext";
export const Settings = () => {
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationSound, setNotificationSound] = useState("");
  const [notificationFrequency, setNotificationFrequency] = useState("daily");
  const [status, setStatus] = useState("offline");

  const [view, setView] = useState("home");

  const handleSave = () => {
    // Logic to save settings
    console.log("Settings saved", {
      adminName,
      email,
      password,
      notificationsEnabled,
      notificationSound,
      notificationFrequency,
      status,
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        adminName,
        setAdminName,
        email,
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
      {view !== "home" && <div className="settingsNav">
      <button onClick={() => setView("home")}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
      </svg>
      <span>Go Back</span>
      </button>
      </div> }
      {view === "home" && <SettingsHome />}
     


      
      {view === "settings" && <>
        <h1>Profile</h1>
      <div className="formGroup">
        <label>Admin Name</label>
        <input
          type="text"
          value={adminName}
          onChange={(e) => setAdminName(e.target.value)}
        />
      </div>
      <div className="formGroup">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="formGroup">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="formGroup">
        <label>Notification Sound</label>
        <input
          type="text"
          value={notificationSound}
          onChange={(e) => setNotificationSound(e.target.value)}
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
     
      <button onClick={handleSave}>Save Settings</button>
      </> }
      {view === "addUser" && <div>
        <h1>Chat Administrators</h1>
        
        </div>}
    </div>
    </SettingsContext.Provider>
  );
};



const SettingsHome = () => {
  const { status, setStatus, notificationsEnabled, setNotificationsEnabled, setView } = React.useContext(SettingsContext);
  return <>
      <h1>Admin Settings</h1>
      <div className="formGroup">
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>
      <div className="formGroup">
        <label>Enable Notifications</label>
        <input
          type="checkbox"
          checked={notificationsEnabled}
          onChange={(e) => setNotificationsEnabled(e.target.checked)}
        />
      </div>
      <hr/>
      <div className="settingsNav">
         <button onClick={() => setView("settings")}>
           
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
          </svg> <span>Profile</span>
          </button> 
        <button onClick={() => setView("addUser")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people-fill" viewBox="0 0 16 16">
            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
          </svg>
            <span>Chat Administrators</span>
          </button> 
      </div>
      </>
}