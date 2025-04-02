import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import React from "react";
import { ImageSvg } from "../assets/svg/ImageSvg";
import { MessageAddonsProps } from "../../types";
import { useTranslation } from "react-i18next";

export const MessageAddons: React.FC<MessageAddonsProps> = ({
  handleFileUpload,
  showEmojiPicker,
  setShowEmojiPicker,
  emojiPickerRef,
  insertEmoji,
}) => {
  const { t } = useTranslation();
  return (
    <div
      className="messageAddOns"
      data-testid="message-addons-container"
      role="region"
      aria-label={t("messageAddons")}
    >
      <label
        className="hideFileInput"
        data-testid="file-upload-label"
        aria-label={t("uploadImage")}
      >
        <input
          type="file"
          onChange={handleFileUpload}
          data-testid="file-upload-input"
          aria-hidden="true"
          tabIndex={-1}
        />

        <ImageSvg data-testid="image-icon" />
      </label>
      <button
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className="emojiButton"
        data-testid="emoji-toggle-button"
        type="button"
        aria-expanded={showEmojiPicker}
        aria-label={t("toggleEmojiPicker")}
      >
        🙂
      </button>
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          className="emojiPicker"
          data-testid="emoji-picker"
          role="dialog"
          aria-label={t("emojiPicker")}
        >
          <Picker data={data} onEmojiSelect={insertEmoji} />
        </div>
      )}
    </div>
  );
};
