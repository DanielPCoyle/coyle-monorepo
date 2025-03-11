import React, { useState } from "react";
import { SettingsContext } from "./SettingsContext";
import { ChatContext } from "../../ChatContext";
import { useContext } from "react";
import { AddUserSvg } from "../../../svg/AddUserSvg";

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-arrow-left-circle-fill"
                viewBox="0 0 16 16"
              >
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
              </svg>
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

const SettingsHome = () => {
  const { setView } = React.useContext(SettingsContext);
  return (
    <>
      <h1>Admin Settings</h1>

      <div className="settingsNav">
        <button onClick={() => setView("settings")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-person-fill"
            viewBox="0 0 16 16"
          >
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
          </svg>{" "}
          <span>Profile</span>
        </button>
        <button onClick={() => setView("adminUsers")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-people-fill"
            viewBox="0 0 16 16"
          >
            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
          </svg>
          <span>Chat Administrators</span>
        </button>
      </div>
    </>
  );
};

const ChatAdministators = () => {
  const [admins, setAdmins] = React.useState([]);
  const { setView, view } = React.useContext(SettingsContext);

  const handleEdit = (id) => {
    // Logic to edit admin
    console.log("Edit admin", id);
  };

  const handleDelete = (id) => {
    // Logic to delete admin
    console.log("Delete admin", id);
  };

  React.useEffect(() => {
    // Fetch chat administrators
    fetch("/api/chat/settings/admin-users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAdmins(data);
      });
  }, [view]);
  return (
    <div>
      <h1>Chat Administrators</h1>
      <button onClick={() => setView("addUser")}>
        <AddUserSvg /> <span>Add Admin</span>
      </button>
      <ul className="adminItems">
        {Boolean(admins?.map) &&
          admins?.map((admin) => (
            <li key={admin.id} className="adminItem">
              <div className="adminDetails">
                <div>{admin.name}</div>
                <div>{admin.email}</div>
              </div>
              <div className="adminActions">
                <button
                  onClick={() => handleEdit(admin.id)}
                  className="editButton"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-pencil"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(admin.id)}
                  className="deleteButton"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-trash3"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

const AddNewUserScreen = () => {
  const [adminName, setAdminName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("admin");
  const handleAddNewUser = () => {
    // Logic to add new user
    fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: adminName,
        email,
        role,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("User added", data);
        // setView("adminUsers");
      });
  };

  return (
    <div>
      <h1>Add Chat Administrator</h1>
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
        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>
      <button onClick={handleAddNewUser}>Add Admin</button>
    </div>
  );
};
