import React from "react";
import { Editor, EditorState, Modifier, RichUtils } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "draft-js/dist/Draft.css";
import { useContext, useEffect, useRef, useState } from "react";
import { SendSvg } from "../assets/svg/SendSvg";
import { ChatContext } from "../ChatContext";
import { FormattingBar } from "./FormattingBar";
import { MessageAddons } from "./MessageAddons";
import { Thumbnail } from "./Thumbnail";
import { uploadFileToSupabase } from "./uploadFileToSupabase";
import { CloseIcon } from "../assets/svg/CloseIcon";
import { useTranslation } from 'react-i18next';

export const ChatControls = ({ replyId }: { replyId?: number }) => {
  const {
    id,
    socket,
    user,
    userName,
    typing,
    files,
    setFiles,
    setInput,
    admins,
    setLanguage,
    language,
  } = useContext(ChatContext);
  const { t, i18n } = useTranslation();

  const languages = {
    en: t("english"),
    es: t("spanish"),
    fr: t("french"),
  };
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("jwt="))
    ?.split("=")[1];
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const insertEmoji = (emoji) => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const newContentState = Modifier.insertText(
      contentState,
      selectionState,
      emoji.native,
    );
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "insert-characters",
    );
    setEditorState(newEditorState);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setFiles([...files, file]);
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const toggleInlineStyle = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const sendMessage = async () => {
    const contentState = editorState.getCurrentContent();
    const htmlContent = stateToHTML(contentState);
    const randomString = Math.random().toString(36).substring(7);

    if (id) {
      let uploadedFiles = [];

      if (files.length > 0) {
        const uploadPromises = files.map(uploadFileToSupabase);
        uploadedFiles = await Promise.all(uploadPromises);
      }

      const message = {
        id: id,
        messageId: randomString,
        message: htmlContent,
        sender: user?.name || userName,
        replyId: replyId,
        email: user?.email,
        files: uploadedFiles.filter((url) => url),
        isAdmin: user?.role === "admin",
        language: language,
      };

      socket.emit("chat message", message);

      if (!(admins?.length > 0)) {
        await fetch(process.env.REACT_APP_API_BASE_URL+"/api/chat/send-message-as-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message }),
        });
      }
      setEditorState(EditorState.createEmpty());
      setFiles([]); // Clear uploaded files after sending the message
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {!admins?.length && (
        <div className="noAdmins" role="alert" aria-live="polite">
          We&apos;re not in at the moment but leave a message and we will get
          back to you as soon as possible :)
        </div>
      )}

      <div className="inputContainer">
        {files?.length > 0 && (
          <div className="thumbnails" aria-label={"uploadedFiles"}>
            {files.map((file: File, index: number) => (
              <Thumbnail
                key={index}
                index={index}
                file={file}
                files={files}
                setFiles={setFiles}
              />
            ))}
          </div>
        )}
        <div>
          <FormattingBar {...{ toggleInlineStyle, toggleBlockType }} />
        </div>
        <div>
          <div className="editor">
            <Editor
              editorState={editorState}
              handleKeyCommand={handleKeyCommand}
              onChange={(es) => {
                setInput(es.getCurrentContent().getPlainText());
                setEditorState(es);
              }}
              placeholder={t("enterMessage")}
              aria-label={t("messageEditor")}
            />
          </div>
          <div className="buttonContainer">
            <MessageAddons
              {...{
                handleFileUpload,
                showEmojiPicker,
                setShowEmojiPicker,
                emojiPickerRef,
                insertEmoji,
                typing,
              }}
            />
            <div className="buttonGroup">
            <div className="languageGroup">
              <div className="popover">
                {Object.keys(languages).map((lang) => (
                  <button
                    key={lang}
                    className="languageButton"
                    onClick={() => {
                      setLanguage(lang);
                    }}
                  >
                    {languages[lang]}
                  </button>
                ))}
                </div>
            <button className="languageButton" aria-label={t("languageSettings")}>
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="30px" width="30px" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16zm2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"></path></svg>
              <span>{languages[language]}</span>
            </button>
            </div>
            <button
              onClick={sendMessage}
              className="sendButton"
              aria-label={t("sendMessage")}
            >
              {t('send')}
              <SendSvg />
            </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
