import React from "react";
import { CloseThumbnailIcon } from "./CloseThumbnailIcon";
import Image from 'next/image';

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
      <Image
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
    </div>
  );
};
