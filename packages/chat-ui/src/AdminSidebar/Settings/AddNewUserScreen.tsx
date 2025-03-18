import React from "react";
import SettingsContext from "./SettingsContext";

export const AddNewUserScreen = () => {
  const [adminName, setAdminName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("admin");
  const { setView } = React.useContext(SettingsContext);

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
      .then(() => {
        setView("adminUsers");
      });
  };

  return (
    <div data-testid="add-user-screen">
      <h1 data-testid="title">Add Chat Administrator</h1>
      <div className="formGroup" data-testid="admin-name-group">
        <label htmlFor="adminName">Admin Name</label>
        <input
          id="adminName"
          type="text"
          value={adminName}
          onChange={(e) => setAdminName(e.target.value)}
          data-testid="admin-name-input"
        />
      </div>
      <div className="formGroup" data-testid="email-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-testid="email-input"
        />
      </div>
      <div className="formGroup" data-testid="role-group">
        <label htmlFor="role">Role</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          data-testid="role-select"
        >
          <option value="admin" data-testid="role-option-admin">Admin</option>
          <option value="moderator" data-testid="role-option-moderator">Moderator</option>
          <option value="viewer" data-testid="role-option-viewer">Viewer</option>
        </select>
      </div>
      <button onClick={handleAddNewUser} data-testid="add-user-button">
        Add Admin
      </button>
    </div>
  );
};
