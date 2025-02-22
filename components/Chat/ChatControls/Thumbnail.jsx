import React from "react";

export const Thumbnail = ({ files, file, index, setFiles }) => {
    return <div key={file.name} style={{ position: "relative", display: "inline-block", margin: "5px" }}>
        <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            style={{ width: "100px", height: "100px", objectFit: "fill" }} />
        <button
            onClick={() => {
                const newFiles = files.filter((_, i) => i !== index);
                setFiles(newFiles);
            }}
            style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
            }}
        >
            X
        </button>
    </div>;
};
