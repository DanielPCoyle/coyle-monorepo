import React from "react";
import { CloseThumbnailIcon } from "../assets/svg/CloseThumbnailIcon";
import { ThumbnailProps } from "../../types";

export const Thumbnail = ({
  files,
  file,
  index,
  setFiles,
  children,
}: ThumbnailProps) => {
  return (
    <div key={file.name} className="thumbnailContainer">
      <img
        src={URL.createObjectURL(file)}
        alt={file.name}
        className="thumbnail"
        width={100}
        height={100}
      />
      <button
        onClick={() => {
          const newFiles = files.filter((_, i) => i !== index);
          setFiles(newFiles);
        }}
        className="closeThumbnail"
      >
        <CloseThumbnailIcon />
      </button>
      {children}
    </div>
  );
};
