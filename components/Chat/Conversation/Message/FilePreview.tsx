import React, { useContext } from "react";
import ChatContext from "../../ChatContext";

interface Message {
  files?: string[];
}

interface FilePreviewProps {
  message: Message;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ message }) => {
  const { setModalSource, setModalIndex } = useContext(ChatContext);

  return (
    Boolean(message?.files?.length) && (
      <div className="filePreview">
        {message?.files?.map((file, index) => (
          <img
            src={file}
            key={index}
            alt="file"
            style={{ width: 200, borderRadius: 10 }}
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
