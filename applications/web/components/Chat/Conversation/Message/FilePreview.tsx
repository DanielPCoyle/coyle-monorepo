import React, { useContext } from "react";
import ChatContext from "../../ChatContext";
import Image from 'next/image';

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
          <Image
            src={file}
            key={index}
            alt="file"
            width={200}
            height={200}
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
