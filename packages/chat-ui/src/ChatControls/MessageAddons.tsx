import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import React, { RefObject } from "react";
import { ImageSvg } from "../../assets/svg/ImageSvg";

interface MessageAddonsProps {
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
  emojiPickerRef: RefObject<HTMLDivElement>;
  insertEmoji: (emoji: string) => void;
  typing: { name: string } | null;
}

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
      style={{
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
        marginTop: "10px",
      }}
      data-testid="message-addons-container"
    >
      <label
        style={{ marginLeft: "10px", cursor: "pointer" }}
        data-testid="file-upload-label"
      >
        <input
          type="file"
          onChange={handleFileUpload}
          style={{ display: "none" }}
          data-testid="file-upload-input"
        />
        <ImageSvg data-testid="image-icon" />
      </label>
      <button
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        style={{
          marginLeft: "10px",
          background: "none",
          border: "none",
          fontSize: "30px",
        }}
        data-testid="emoji-toggle-button"
      >
        🙂
      </button>
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          style={{
            position: "absolute",
            bottom: "60px",
            left: "10px",
            zIndex: 100,
          }}
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
