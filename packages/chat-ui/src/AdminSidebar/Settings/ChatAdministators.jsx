import React from "react";
import AddUserSvg from "../../../assets/svg/AddUserSvg";
import SettingsContext from "./SettingsContext";
import { AdminItem } from "./AdminItem";

export const ChatAdministators = () => {
  const [admins, setAdmins] = React.useState([]);
  const { setView, view } = React.useContext(SettingsContext);
  const [selected, setSelected] = React.useState(null);
  const handleEdit = (id) => {
    console.log("Edit admin", id);
    setSelected(id);
    setView("editUser");
    // TODO: Handle Edit Admin, add edit screen
  };

  const handleDelete = async (id) => {
    const answer =  window.confirm("Are you sure you want to delete this admin?");
    if(!answer) return;
    setSelected(id);
    fetch(`/api/chat/settings/delete-admin-user`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({ id }),
    }).then(() => {
      setAdmins(admins.filter((admin) => admin.id !== id));
      alert("Admin deleted successfully");
    });
    // TODO: Handle Delete Admin
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
          admins?.map((admin,i) => (
            <AdminItem key={"admin_item_"+i}  {...{admin, handleDelete, selected, handleEdit}} />
          ))}
      </ul>
    </div>
  );
};