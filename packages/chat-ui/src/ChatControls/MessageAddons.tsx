import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import React from "react";
import { ImageSvg } from "../../assets/svg/ImageSvg";
import { MessageAddonsProps } from "../../types";

export const MessageAddons: React.FC<MessageAddonsProps> = ({
  handleFileUpload,
  showEmojiPicker,
  setShowEmojiPicker,
  emojiPickerRef,
  insertEmoji,
  typing,
}) => {
  return (
    <div
     
      data-testid="message-addons-container"
    >
      <label
        data-testid="file-upload-label"
      >
        <input
          type="file"
          onChange={handleFileUpload}
          data-testid="file-upload-input"
        />
        <ImageSvg data-testid="image-icon" />
      </label>
      <button
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        data-testid="emoji-toggle-button"
      >
        🙂
      </button>
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          data-testid="emoji-picker"
        >
          <Picker data={data} onEmojiSelect={insertEmoji} />
        </div>
      )}
      <div className="isTyping" data-testid="typing-indicator">
        {typing ? <>{typing?.name} is typing...</> : <>&nbsp;</>}
      </div>
    </div>
  );
};
