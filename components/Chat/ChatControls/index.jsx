import React, { useState, useEffect, useRef, useContext } from "react";
import { Editor, EditorState, RichUtils, convertToRaw, Modifier } from "draft-js";
import "draft-js/dist/Draft.css";
import { SendSvg } from "../../svg/SendSvg";
import { Thumbnail } from "./Thumbnail";
import { FormattingBar } from "./FormattingBar";
import { MessageAddons } from "./MessageAddons";
import { ChatContext } from "../../../context/chatContext";

export const ChatContainer = () => {
    const {
        currentConversation, 
        socket,  
        username, 
        typing,  
        files, 
        setFiles,
        setInput,
    } = useContext(ChatContext);

    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef(null);

    const insertEmoji = (emoji) => {
        const contentState = editorState.getCurrentContent();
        const selectionState = editorState.getSelection();
        const newContentState = Modifier.insertText(contentState, selectionState, emoji.native);
        const newEditorState = EditorState.push(editorState, newContentState, "insert-characters");
        setEditorState(newEditorState);
        setShowEmojiPicker(false);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if(!file) return;
        setFiles([...files, file]);
        const reader = new FileReader();
        reader.onload = function (e) {
            const fileBuffer = e.target.result; // Binary data
            socket.emit("file added", { 
                conversationId: currentConversation.id, 
                file: fileBuffer, 
                fileName: file.name,
                fileType: file.type
            });
        };
        reader.readAsArrayBuffer(file); // Convert to raw binary
    };

    const handleKeyCommand = (command) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setEditorState(newState);
            return 'handled';
        }
        return 'not-handled';
    };

    const toggleInlineStyle = (style) => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, style));
    };

    const toggleBlockType = (blockType) => {
        setEditorState(RichUtils.toggleBlockType(editorState, blockType));
    };

    const sendMessage = () => {
        const contentState = editorState.getCurrentContent();
        const rawContent = convertToRaw(contentState);
        const messageText = rawContent.blocks.map(block => block.text).join('\n');
        const randomString = Math.random().toString(36).substring(7);
        if (currentConversation) {
            const message = {
                id: currentConversation.id,
                messageId: randomString,
                message: messageText,
                sender: username,
                files,
            };
            socket.emit("chat message", message);
            setEditorState(EditorState.createEmpty());
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
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
                        {files.map((file, index) => (
                            <Thumbnail key={index} file={file} files={files} setFiles={setFiles} />
                        ))}
                    </div>
                )}
                <div style={{ display: "flex"}}>
                    <FormattingBar {...{toggleInlineStyle,toggleBlockType}} />
                    <div className="isTyping">
                        {Boolean(typing && typing?.username !== username) ? <>{typing.username} is typing...</> : <>&nbsp;</>}
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="editor">
                        <Editor
                            editorState={editorState}
                            handleKeyCommand={handleKeyCommand}
                            onChange={(es)=>{
                                setInput(es.getCurrentContent().getPlainText())
                                setEditorState(es)
                            }}
                            placeholder="Type a message..."
                        />
                    </div>
                    <button onClick={sendMessage} className="sendButton">
                        <SendSvg />
                    </button>
                </div>
              <MessageAddons {...{handleFileUpload,showEmojiPicker,setShowEmojiPicker,emojiPickerRef,insertEmoji}} />
            </div>
        </>
    );
};