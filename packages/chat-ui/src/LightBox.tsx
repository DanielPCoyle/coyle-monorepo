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
        style={{ width: "100%", borderRadius: 10 }} />
      <button
        onClick={() => {
          setModalSource(null);
        }}
        style={{
          position: "fixed",
          top: "5px",
          right: "5px",
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
        }}
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