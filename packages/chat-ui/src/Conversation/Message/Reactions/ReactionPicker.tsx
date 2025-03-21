import EmojiPicker from "emoji-picker-react";
import React, { useContext } from "react";
import { MessageContext } from "../MessageContext";
import { ReactionPickerProps } from "../../../../types";

export const ReactionPicker: React.FC<ReactionPickerProps> = ({
  reactionsPickerRef,
}) => {
  const {  addReaction } = useContext(MessageContext);

  return (
    <div
      className="reactionsPicker"
      data-testid="reaction-picker-container"
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
