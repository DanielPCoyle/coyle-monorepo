import React, { useState } from 'react';
import  ChatContext  from '../../../../components/Chat/ChatContext';

export const FilePreview = ({ message }) => {
    const {setModalSource, setModalIndex } = React.useContext(ChatContext);

    return Boolean(message?.files?.length) && (
        <div className="filePreview">
            {message?.files?.map((file, index) => (
                <img
                    src={file}
                    key={index}
                    alt="file"
                    style={{ width: 200, borderRadius: 10 }}
                    onClick={() => {
                        setModalSource(message?.files);
                        setModalIndex(index)
                    }}
                />
            ))}
        </div>
    );
};
