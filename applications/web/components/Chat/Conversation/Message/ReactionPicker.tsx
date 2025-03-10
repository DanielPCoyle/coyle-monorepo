import EmojiPicker from "emoji-picker-react";
import React, { RefObject, useContext } from "react";
import { ChatContext } from "../../ChatContext";
import { MessageContext } from "./MessageContext";

interface ReactionPickerProps {
  reactionsPickerRef: RefObject<HTMLDivElement>;
}

export const ReactionPicker: React.FC<ReactionPickerProps> = ({
  reactionsPickerRef,
}) => {
  const { user,userName } = useContext(ChatContext);
  const { message, addReaction } = useContext(MessageContext);

  return (
    <div
      className="reactionsPicker"
      style={{
        textAlign: userName === message.sender ? "right" : "left",
      }}
    >
      <div
        className="animate__animated animate__slideInUp"
        ref={reactionsPickerRef}
      >
        <EmojiPicker
          reactionsDefaultOpen={true}
          onReactionClick={addReaction}
        />
      </div>
    </div>
  );
};
