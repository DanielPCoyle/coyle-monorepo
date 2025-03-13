import React from "react";
import { CloseThumbnailIcon } from "../../assets/svg/CloseThumbnailIcon";

interface ThumbnailProps {
  files: File[];
  file: File;
  index: number;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  children?: React.ReactNode;
}

export const Thumbnail = ({ files, file, index, setFiles, children }: ThumbnailProps) => {
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
