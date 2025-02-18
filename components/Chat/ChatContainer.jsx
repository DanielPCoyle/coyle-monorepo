import React from "react";

export const ChatContainer = ({
    styles, input, currentConversation, socket, setInput, username, typing
}) => {
    return <div className="inputContainer">
        <div style={{display:"flex", alignItems:"center"}}>
        <textarea
        placeholder="Type a message..."
        value={input} onChange={(e) => {
            setInput(e.target.value);
            if (currentConversation) {
                socket.emit("user typing", { conversationId: currentConversation.id, username });
            }
        }} style={styles.input}></textarea>
        <button
            onClick={() => {
                const randomString = Math.random().toString(36).substring(7);
                if (currentConversation) {
                    const message = {
                        id: currentConversation.id,
                        messageId: randomString,
                        message: input,
                        sender: username,
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
        <div style={{color:"white", width:"100%"}}>{Boolean(typing && typing?.username !== username) ? <>{typing.username} is typing...</> : <>&nbsp;</>}</div>

    </div>;
};
