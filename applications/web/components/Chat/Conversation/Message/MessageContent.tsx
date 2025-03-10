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
          {message.sender === user?.name ? user?.name+"@PhilaPrints" : message.sender}
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
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8.309 189.836L184.313 37.851C199.719 24.546 224 35.347 224 56.015v80.053c160.629 1.839 288 34.032 288 186.258 0 61.441-39.581 122.309-83.333 154.132-13.653 9.931-33.111-2.533-28.077-18.631 45.344-145.012-21.507-183.51-176.59-185.742V360c0 20.7-24.3 31.453-39.687 18.164l-176.004-152c-11.071-9.562-11.086-26.753 0-36.328z"></path>
        </svg>
      </button>
    </div>
  );
};
