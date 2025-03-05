import React from "react";
import { CloseThumbnailIcon } from "./CloseThumbnailIcon";

interface ThumbnailProps {
  files: File[];
  file: File;
  index: number;
  setFiles: (files: File[]) => void;
}

export const Thumbnail: React.FC<ThumbnailProps> = ({
  files,
  file,
  index,
  setFiles,
}) => {
  return (
    <div key={file.name} className="thumbnailContainer">
      <img
        src={URL.createObjectURL(file)}
        alt={file.name}
        className="thumbnail"
      />
      <button
        onClick={() => {
          const newFiles = files.filter((_, i) => i !== index);
          setFiles(newFiles);
        }}
        className={"closeThumbnail"}
      >
        <CloseThumbnailIcon />
      </button>
    </div>
  );
};
