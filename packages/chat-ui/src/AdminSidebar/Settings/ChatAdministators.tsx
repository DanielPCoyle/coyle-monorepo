import React from "react";
import AddUserSvg from "../../assets/svg/AddUserSvg";
import SettingsContext from "./SettingsContext";
import { AdminItem } from "./AdminItem";
import { useTranslation } from "react-i18next";
export const ChatAdministators = ({setSelected}: {setSelected: (id)=>void}) => {
  const [admins, setAdmins] = React.useState([]);
  const { setView, view } = React.useContext(SettingsContext);
  const { t } = useTranslation();
  const handleEdit = (id:string) => {
    setSelected(id);
    setView("editUser");
    // TODO: Handle Edit Admin, add edit screen
  };

  const handleDelete = async (id) => {
    const answer =  window.confirm("Are you sure you want to delete this admin?");
    if(!answer) return;
    setSelected(id);
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/chat/delete-admin-user`, {
      method: "DELETE",
      headers: {
      Authorization: `Bearer ${document.cookie
        .split("; ")
        .find((row) => row.startsWith("jwt="))
        ?.split("=")[1]}`,
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
    fetch(process.env.REACT_APP_API_BASE_URL+"/api/chat/admin-users", {
      headers: {
      Authorization: `Bearer ${document.cookie
        .split("; ")
        .find((row) => row.startsWith("jwt="))
        ?.split("=")[1]}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
      setAdmins(data);
      });
  }, [view]);

  return (
    <div>
      <h1>{t("chatAdministrators")}</h1>
      <button onClick={() => setView("addUser")}>
        <AddUserSvg /> <span>{t("addAdministrator")}</span>
      </button>
      <ul className="adminItems">
        {Boolean(admins?.map) &&
          admins?.map((admin,i) => (
            <AdminItem key={"admin_item_"+i}  {...{admin, handleDelete, handleEdit}} />
          ))}
      </ul>
    </div>
  );
};