import React, {useContext} from "react";

import PropTypes from "prop-types";
import { PencilIcon } from "../../../assets/svg/PencilIcon";
import { TrashCanIcon } from "../../../assets/svg/TrashCanIcon";
import { ChatContext } from "../../ChatContext";
export const AdminItem = ({ admin, handleDelete, handleEdit }) => {
  const {user }  = useContext(ChatContext);
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
        {admin.id !== user.id && <button
          onClick={() => handleDelete(admin.id)}
          className="deleteButton"
          data-testid={`delete-button-${admin.id}`}
        >
          <TrashCanIcon />
        </button> }
      </div>
    </li>
  )
};

AdminItem.propTypes = {
  admin: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
};
