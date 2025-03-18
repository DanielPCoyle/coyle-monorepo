import React from "react";

import moment from "moment";
import { useContext } from "react";
import { FilePreview } from "./FilePreview";
import { LinkPreview } from "./LinkPreview";
import { ChatContext } from "../../ChatContext";
import { MessageContext } from "./MessageContext";
import { ReplySvg } from "../../../assets/svg/ReplySvg";

export const MessageContent = () => {
  const { message, setShowReactionsPicker, setShowReplyModal } =
    useContext(MessageContext);
  const { user, userName } = useContext(ChatContext);

  return (
    <div
      className={`messageContent ${message.sender === userName ? "sender" : "receiver"}`}
    >
      <div>
        <div
          className="senderAvatar"
        >
          <img
            src={"/icon.png"}
            alt="avatar"
            className="avatar"
          />
        </div>
        <div
          className="sender"
        >
          {message.sender === user?.name
            ? user?.name + "@PhilaPrints"
            : message.sender}
        </div>
      
      </div>
      <FilePreview message={message} />
      <div
        className="message"
        dangerouslySetInnerHTML={{ __html: message.message }}
      />
      <LinkPreview message={message} />
      <div className="messageActions">
        <button
          onClick={() => {
            setShowReactionsPicker(true);
          }}
          className="showreactionsEmojiPicker"
        >
          😊
        </button>
        <button
          onClick={() => {
            setShowReplyModal(true);
          }}
          className="showReply"
        >
          <ReplySvg /> {message?.replies?.length > 0 && message.replies.length}
        </button>
      </div>
    </div>
  );
};

export default MessageContent;
