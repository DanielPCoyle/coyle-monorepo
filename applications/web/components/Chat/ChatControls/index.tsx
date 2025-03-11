import { createClient } from "@supabase/supabase-js";
import { Editor, EditorState, Modifier, RichUtils } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "draft-js/dist/Draft.css";
import { useContext, useEffect, useRef, useState } from "react";
import { SendSvg } from "../../svg/SendSvg";
import { ChatContext } from "../ChatContext";
import { FormattingBar } from "./FormattingBar";
import { MessageAddons } from "./MessageAddons";
import { Thumbnail } from "./Thumbnail";

// Initialize Supabase client

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const ChatControls = ({ replyId }: { replyId: number }) => {
  const {
    id,
    socket,
    user,
    userName,
    typing,
    files,
    setFiles,
    setInput,
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

  const uploadFileToSupabase = async (file) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filePath = `public/${uniqueSuffix}-${file.name}`;
    const { error } = await supabase.storage
      .from("messages") // Replace with your bucket name
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading file:", error);
      return null;
    }

    // Get public URL
    const { data: publicURLData } = supabase.storage
      .from("messages")
      .getPublicUrl(filePath);

    return publicURLData.publicUrl;
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
        files: uploadedFiles.filter((url) => url),
        isAdmin:user?.role === "admin"
      };

      socket.emit("chat message", message);
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
      <div className="inputContainer">
        {files.length > 0 && (
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
        <div style={{ display: "flex" }}>
          <FormattingBar {...{ toggleInlineStyle, toggleBlockType }} />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
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
          <button onClick={sendMessage} className="sendButton">
            <SendSvg />
          </button>
        </div>
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
      </div>
    </>
  );
};
