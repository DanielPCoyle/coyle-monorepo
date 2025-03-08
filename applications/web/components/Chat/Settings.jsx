import React, { useState } from "react";

export const Settings = () => {
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationSound, setNotificationSound] = useState("");
  const [notificationFrequency, setNotificationFrequency] = useState("daily");
  const [status, setStatus] = useState("offline");

  const handleSave = () => {
    // Logic to save settings
    console.log("Settings saved", { adminName, email, password, notificationsEnabled, notificationSound, notificationFrequency, status });
  };

  return (
    <div className="settingsContainer">
      <h1>Admin Settings</h1>
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
        <label>Enable Notifications</label>
        <input
          type="checkbox"
          checked={notificationsEnabled}
          onChange={(e) => setNotificationsEnabled(e.target.checked)}
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
      <div className="formGroup">
        <label>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>
      <button onClick={handleSave}>Save Settings</button>
    </div>
  );
};
