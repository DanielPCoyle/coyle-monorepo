import EmojiPicker from "emoji-picker-react";
import React, { useContext } from "react";
import { ChatContext } from "../../../ChatContext";
import { MessageContext } from "../MessageContext";
import { ReactionPickerProps } from "../../../../types";

export const ReactionPicker: React.FC<ReactionPickerProps> = ({
  reactionsPickerRef,
}) => {
  const { userName } = useContext(ChatContext);
  const { message, addReaction } = useContext(MessageContext);

  return (
    <div
      className="reactionsPicker"
      data-testid="reaction-picker-container"
      style={{
        textAlign: userName === message.sender ? "right" : "left",
      }}
    >
      <div
        className="animate__animated animate__slideInUp"
        ref={reactionsPickerRef}
        data-testid="emoji-picker-container"
      >
        <div className="emojiPicker" data-testid="emoji-picker">
        <EmojiPicker
          reactionsDefaultOpen={true}
          onReactionClick={addReaction}
        />
        </div>
      </div>
    </div>
  );
};
