import React from "react";
import { PencilIcon } from "../../../assets/svg/PencilIcon";
import { TrashCanIcon } from "../../../assets/svg/TrashCanIcon";

export const AdminItem = ({ admin, handleDelete, handleEdit }) => {
  return (
    <li key={admin.id} className="adminItem" data-testid={`admin-item-${admin.id}`}>
      <div className="adminDetails" data-testid={`admin-details-${admin.id}`}>
        <div data-testid={`admin-name-${admin.id}`}>{admin.name}</div>
        <div data-testid={`admin-email-${admin.id}`}>{admin.email}</div>
      </div>
      <div className="adminActions" data-testid={`admin-actions-${admin.id}`}>
        <button
          onClick={() => handleEdit(admin.id)}
          className="editButton"
          data-testid={`edit-button-${admin.id}`}
        >
          <PencilIcon />
        </button>
        <button
          onClick={() => handleDelete(admin.id)}
          className="deleteButton"
          data-testid={`delete-button-${admin.id}`}
        >
          <TrashCanIcon />
        </button>
      </div>
    </li>
  );
};
