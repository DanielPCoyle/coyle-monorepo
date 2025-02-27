import EmojiPicker from "emoji-picker-react";
import React, { useContext, RefObject } from "react";
import { ChatContext } from "../../ChatContext";
import { MessageContext } from "./MessageContext";

interface ReactionPickerProps {
  reactionPickerRef: RefObject<HTMLDivElement>;
}

export const ReactionPicker: React.FC<ReactionPickerProps> = ({
  reactionPickerRef,
}) => {
  const { username } = useContext(ChatContext);
  const { message, addReaction } = useContext(MessageContext);

  return (
    <div
      className="reactionPicker"
      style={{
        textAlign: username === message.sender ? "right" : "left",
      }}
    >
      <div
        className="animate__animated animate__slideInUp"
        ref={reactionPickerRef}
      >
        <EmojiPicker
          reactionsDefaultOpen={true}
          onReactionClick={addReaction}
        />
      </div>
    </div>
  );
};
