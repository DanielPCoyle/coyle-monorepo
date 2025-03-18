import React from "react";
import PropTypes from 'prop-types';
import { CloseIcon } from "../assets/svg/CloseIcon";


export const LightBox = ({
  setModalSource, modalSource, modalIndex,

}) => <div className="modal">
    <div className="modalContent">
      <img
        src={modalSource[modalIndex]}
        alt="file"
        />
      <button
        onClick={() => {
          setModalSource(null);
        }}
        className="closeButton"
      >
        <CloseIcon />
      </button>
    </div>
  </div>;


LightBox.propTypes = {
  setModalSource: PropTypes.func.isRequired,
  modalSource: PropTypes.array.isRequired,
  modalIndex: PropTypes.number.isRequired,
};