import moment from "moment";
import { useContext } from "react";
import { FilePreview } from "./FilePreview";
import { LinkPreview } from "./LinkPreview";
import { ChatContext } from "../../ChatContext";
import { MessageContext } from "./MessageContext";
import Image from "next/image";

export const MessageContent = () => {
  const { message, setShowReactionsPicker, setShowReplyModal } =
    useContext(MessageContext);
  const { user, userName } = useContext(ChatContext);
  return (
    <div
      className={`messageContent ${message.sender === userName ? "sender" : "receiver"}`}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          className="senderAvatar"
          style={{
            background: message.sender === user?.name ? "white" : "black",
            border: "solid 1px black",
          }}
        >
          <Image
            src={"/icon.png"}
            alt="avatar"
            width={30}
            height={30}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              filter: message.sender === user?.name ? "invert(0)" : "invert(1)",
            }}
          />
        </div>
        <div
          className="sender"
          style={{ fontWeight: "bolder", marginLeft: "5px" }}
        >
          {message.sender === user?.name
            ? user?.name + "@PhilaPrints"
            : message.sender}
        </div>
        <small className="time" style={{ marginLeft: "5px" }}>
          ({moment(message.createdAt).format("D MMM hh:mm A")})
        </small>
      </div>
      <FilePreview message={message} />
      <div
        className="message"
        dangerouslySetInnerHTML={{ __html: message.message }}
      />
      <LinkPreview message={message} />

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
       <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-reply-fill" viewBox="0 0 16 16">
  <path d="M5.921 11.9 1.353 8.62a.72.72 0 0 1 0-1.238L5.921 4.1A.716.716 0 0 1 7 4.719V6c1.5 0 6 0 7 8-2.5-4.5-7-4-7-4v1.281c0 .56-.606.898-1.079.62z"/>
</svg>
      </button>
    </div>
  );
};
