import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import React, { RefObject } from "react";
import { ImageSvg } from "../../svg/ImageSvg";

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
    >
      <label style={{ marginLeft: "10px", cursor: "pointer" }}>
        <input
          type="file"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
        <ImageSvg />
      </label>
      <button
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        style={{
          marginLeft: "10px",
          background: "none",
          border: "none",
          fontSize: "30px",
        }}
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
        >
          <Picker data={data} onEmojiSelect={insertEmoji} />
        </div>
      )}
      <div className="isTyping">
        {typing ? <>{typing?.name} is typing...</> : <>&nbsp;</>}
      </div>
    </div>
  );
};
