import React from "react";
import AddUserSvg from "../../../assets/svg/AddUserSvg";
import { PencilIcon } from "../../../assets/svg/PencilIcon";
import { TrashCanIcon } from "../../../assets/svg/TrashCanIcon";
import SettingsContext from "./SettingsContext";

export const ChatAdministators = () => {
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
                  <PencilIcon />
                </button>
                <button
                  onClick={() => handleDelete(admin.id)}
                  className="deleteButton"
                >
                  <TrashCanIcon />
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};
