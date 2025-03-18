import React, { useContext } from "react";
import ChatContext from "../../ChatContext";
import { FilePreviewProps } from "../../../types";

export const FilePreview: React.FC<FilePreviewProps> = ({ message }) => {
  const { setModalSource, setModalIndex } = useContext(ChatContext);

  return (
    Boolean(message?.files?.length) && (
      <div className="filePreview" data-testid="file-preview">
        {message?.files?.map((file, index) => (
          <img
            src={file}
            key={index}
            alt="file"
            width={200}
            height={200}
            data-testid="file-preview-image"
            onClick={() => {
              setModalSource(message?.files || []);
              setModalIndex(index);
            }}
          />
        ))}
      </div>
    )
  );
};
