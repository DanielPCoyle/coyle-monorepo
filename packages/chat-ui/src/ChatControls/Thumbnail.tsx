import React from "react";
import { CloseThumbnailIcon } from "../../svg/CloseThumbnailIcon";

interface ThumbnailProps {
  files: File[];
  file: File;
  index: number;
  setFiles: (files: File[]) => void;
  children?: React.ReactNode;
}

export const Thumbnail: React.FC<ThumbnailProps> = ({
  files,
  file,
  index,
  setFiles,
  children,
}) => {
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
        className={"closeThumbnail"}
      >
        <CloseThumbnailIcon />
      </button>
      {children}
    </div>
  );
};
