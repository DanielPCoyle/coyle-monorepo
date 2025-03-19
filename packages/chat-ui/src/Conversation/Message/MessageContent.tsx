import React from "react";
import { useContext } from "react";
import { FilePreview } from "./FilePreview";
import { LinkPreview } from "./LinkPreview";
import { ChatContext } from "../../ChatContext";
import { MessageContext } from "./MessageContext";
import { ReplySvg } from "../../../assets/svg/ReplySvg";

// TODO: fix avatar on messages
export const MessageContent = () => {
  const { message, setShowReactionsPicker, setShowReplyModal } =
    useContext(MessageContext);
  const { user, userName } = useContext(ChatContext);

  return (
    <div
      className={`messageContent ${message.sender === userName ? "sender" : "receiver"}`}
    >
      <div className="message">
      <div className="senderInfo">
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
          {message?.replies?.filter((reply)=>!reply.seen).length > 0 && <span className="unreadReplies animate__animated animate__pulse animate__infinite">&nbsp;</span>}
        </button>
      </div>
      </div>
    </div>
  );
};

export default MessageContent;
