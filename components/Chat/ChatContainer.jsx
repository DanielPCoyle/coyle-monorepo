import React, { useState, useEffect, useRef } from "react";
import { Editor, EditorState, RichUtils, convertToRaw, Modifier } from "draft-js";
import "draft-js/dist/Draft.css";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

export const ChatContainer = ({
    styles, input, currentConversation, socket, setInput, username, typing, setColor, files, setFiles
}) => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef(null);

    const insertEmoji = (emoji) => {
        const contentState = editorState.getCurrentContent();
        const selectionState = editorState.getSelection();
        const newContentState = Modifier.insertText(contentState, selectionState, emoji.native);
        const newEditorState = EditorState.push(editorState, newContentState, "insert-characters");
        setEditorState(newEditorState);
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
                            <div key={file.name} style={{ position: "relative", display: "inline-block", margin: "5px" }}>
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    style={{ width: "100px", height: "100px", objectFit: "fill" }}
                                />
                                <button
                                    onClick={() => {
                                        const newFiles = files.filter((_, i) => i !== index);
                                        setFiles(newFiles);
                                    }}
                                    style={{
                                        position: "absolute",
                                        top: "5px",
                                        right: "5px",
                                        background: "red",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50%",
                                        cursor: "pointer",
                                    }}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ display: "flex", justifyContent: "start", alignItems: "center", marginTop: "10px" }}>
                    <button
                        onClick={() => toggleInlineStyle("BOLD")}
                        style={{ marginLeft: "10px", cursor: "pointer", background: "none", border: "none", color: "white" }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-type-bold" viewBox="0 0 16 16">
                          <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"/>
                        </svg>
                    </button>
                    <button
                        onClick={() => toggleInlineStyle("ITALIC")}
                        style={{ marginLeft: "10px", cursor: "pointer", background: "none", border: "none", color: "white" }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-type-italic" viewBox="0 0 16 16">
                          <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>
                        </svg>
                    </button>
                    <button
                        onClick={() => insertAtCursor("[link text](url)")}
                        style={{ marginLeft: "10px", cursor: "pointer", background: "none", border: "none", color: "white" }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-link" viewBox="0 0 16 16">
                        <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9q-.13 0-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z"/>
                        <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4 4 0 0 1-.82 1H12a3 3 0 1 0 0-6z"/>
                        </svg>
                    </button>
                    <button
                        onClick={() => toggleBlockType("unordered-list-item")}
                        style={{ marginLeft: "10px", cursor: "pointer", background: "none", border: "none", color: "white" }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list-ul" viewBox="0 0 16 16">
                          <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                        </svg>
                    </button>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ flex: 1, color:"white", border: "1px solid #ccc", borderRadius: "5px", padding: "10px", minHeight: "100px" }}>
                        <Editor
                            editorState={editorState}
                            handleKeyCommand={handleKeyCommand}
                            onChange={setEditorState}
                            placeholder="Type a message..."
                        />
                    </div>
                    <button
                        onClick={sendMessage}
                        style={styles.sendButton}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
                            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
                        </svg>
                    </button>
                </div>
                
                <div style={{ display: "flex", justifyContent: "start", alignItems: "center", marginTop: "10px" }}>
                    <label style={{ marginLeft: "10px", cursor: "pointer" }}>
                        <input type="file" onChange={handleFileUpload} style={{ display: "none" }} />
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="white" className="bi bi-images" viewBox="0 0 16 16">
                            <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                            <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2M14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1M2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1z"/>
                        </svg>
                    </label>
                    <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} style={{ marginLeft: "10px", background:"none", border:"none", fontSize:"30px", }}>
                        🙂
                    </button>
                    {showEmojiPicker && (
                        <div ref={emojiPickerRef} style={{ position: "absolute", bottom: "60px", right: "10px", zIndex: 100 }}>
                            <Picker data={data} onEmojiSelect={insertEmoji} />
                        </div>
                    )}
                </div>
                <div style={{ color: "white", width: "100%" }}>
                    {Boolean(typing && typing?.username !== username) ? <>{typing.username} is typing...</> : <>&nbsp;</>}
                </div>
            </div>
        </>
    );
};
