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
    <div>
      <h1>Add Chat Administrator</h1>
      <div className="formGroup">
        <label>Admin Name</label>
        <input
          type="text"
          value={adminName}
          onChange={(e) => setAdminName(e.target.value)} />
      </div>
      <div className="formGroup">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
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
