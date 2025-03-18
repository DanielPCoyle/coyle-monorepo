import React from "react";
import { Editor, EditorState, Modifier, RichUtils } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "draft-js/dist/Draft.css";
import { useContext, useEffect, useRef, useState } from "react";
import { SendSvg } from "../../assets/svg/SendSvg";
import { ChatContext } from "../ChatContext";
import { FormattingBar } from "./FormattingBar";
import { MessageAddons } from "./MessageAddons";
import { Thumbnail } from "./Thumbnail";
import { uploadFileToSupabase } from "./uploadFileToSupabase";

export const ChatControls = ({ replyId }: { replyId: number }) => {
  const {
    id,
    token,
    socket,
    user,
    userName,
    typing,
    files,
    setFiles,
    setInput,
    admins,
  } = useContext(ChatContext);

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
      };

      socket.emit("chat message", message);

      if (!(admins?.length > 0)) {
        await fetch("/api/chat/send-message-as-email", {
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
        <div className="noAdmins">
          We&apos;re not in at the moment but leave a message and we will get
          back to you as soon as possible :)
        </div>
      )}
      <div className="inputContainer">
        {files?.length > 0 && (
          <div className="thumbnails">
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
              placeholder="Type a message..."
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
            <button onClick={sendMessage} className="sendButton">
              <SendSvg />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
