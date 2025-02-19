import React from "react";

export const ChatContainer = ({
    styles, input, currentConversation, socket, setInput, username, typing, setColor, files, setFiles
}) => {

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

                <div style={{ display: "flex", alignItems: "center" }}>
                    <textarea
                        placeholder="Type a message..."
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            if (currentConversation) {
                                socket.emit("user typing", { conversationId: currentConversation.id, username });
                            }
                        }}
                        style={styles.input}
                    ></textarea>
                    <button
                        onClick={() => {
                            const randomString = Math.random().toString(36).substring(7);
                            if (currentConversation) {
                                const message = {
                                    id: currentConversation.id,
                                    messageId: randomString,
                                    message: input,
                                    sender: username,
                                    files,
                                };
                                socket.emit("chat message", message);
                                setInput("");
                            }
                        }}
                        style={styles.sendButton}
                    >
                        Send
                    </button>
                </div>
                

                <div style={{display: "flex", justifyContent: "start", alignItems: "center", marginTop: "10px"}}>
                <label style={{ marginLeft: "10px", cursor: "pointer" }}>
                    <input type="file" onChange={handleFileUpload} style={{ display: "none" }} />
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="white" class="bi bi-images" viewBox="0 0 16 16">
                        <path d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                        <path d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2M14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1M2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1z"/>
                    </svg>
                </label>


                </div>
                <div style={{ color: "white", width: "100%" }}>
                    {Boolean(typing && typing?.username !== username) ? <>{typing.username} is typing...</> : <>&nbsp;</>}
                </div>
            </div>
        </>
    );
};
