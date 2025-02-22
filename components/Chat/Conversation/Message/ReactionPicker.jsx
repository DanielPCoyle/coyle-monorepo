import EmojiPicker from "emoji-picker-react";
import React from "react";
import { ChatContext } from "../../ChatContext";
import {MessageContext} from "./MessageContext";
export const ReactionPicker = ({reactionPickerRef}) => {
    const { username } = React.useContext(ChatContext);
    const {message,addReaction } = React.useContext(MessageContext);
    return <div className="reactionPicker"
        style={{
            textAlign: username === message.sender ? "right" : "left",
        }}
    >
        <div className="animate__animated animate__slideInUp" ref={reactionPickerRef}>
            <EmojiPicker reactionsDefaultOpen={true} onReactionClick={addReaction} />
        </div>
    </div>;
};
