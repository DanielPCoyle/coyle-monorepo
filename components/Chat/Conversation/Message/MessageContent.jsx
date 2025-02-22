import { useContext } from "react";
import {MessageContext } from "./MessageContext";
import { LinkPreview } from "./LinkPreview";

export const MessageContent = () => {
    const { message,  username, setShowReactionPicker, addReaction } = useContext(MessageContext);
    return <div className={`messageContent ${message.sender === username ? "sender" : "receiver"}`}>
        
        <div style={{ display: "flex", alignItems: "center" }}>
            <div className="senderAvatar" style={{
                background: message.sender === "admin" ? "white" : "black",
                border: "solid 1px black",
            }}>
                <img src={"/icon.png"} alt="avatar" style={{
                    width: "30px", height: "30px", borderRadius: "50%",
                    filter: message.sender === "admin" ? "invert(0)" : "invert(1)"
                }} />
            </div>
            <div className="sender" style={{ fontWeight: "bolder", marginLeft: "5px" }}>
                {message.sender === "admin" ? "PhilaPrints" : message.sender}
            </div>
        </div>
        <div className="message">{message.message}</div>

        
            <LinkPreview message={message} />

        <button
            onClick={(e) => {
                setShowReactionPicker(true);
            }}
            className="showReactionEmojiPicker">
            😊
        </button>
    </div>
}

