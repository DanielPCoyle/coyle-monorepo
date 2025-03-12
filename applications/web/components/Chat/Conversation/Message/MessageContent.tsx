import moment from "moment";
import { useContext } from "react";
import { FilePreview } from "./FilePreview";
import { LinkPreview } from "./LinkPreview";
import { ChatContext } from "../../ChatContext";
import { MessageContext } from "./MessageContext";
import { ReplySvg } from "../../../svg/ReplySvg";
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
        <ReplySvg /> {message?.replies?.length > 0 && message.replies.length}
      </button>
    </div>
  );
};
