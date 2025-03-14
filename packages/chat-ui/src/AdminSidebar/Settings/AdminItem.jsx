import React from "react";
import { PencilIcon } from "../../../assets/svg/PencilIcon";
import { TrashCanIcon } from "../../../assets/svg/TrashCanIcon";

export const AdminItem = ({ admin, handleDelete, handleEdit }) => {
  return <li key={admin.id} className="adminItem">
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
  </li>;
};
