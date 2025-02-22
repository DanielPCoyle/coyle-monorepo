import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";
import EmojiPicker from 'emoji-picker-react';
import { ChatContext } from "../../context/chatContext";

export const Message = ({ message, index }) => {
    const { username, socket } = React.useContext(ChatContext);
    
    const [urlPreview, setUrlPreview] = useState(null);
    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const [reactions, setReactions] = useState(message.reactions || {}); 
    
    const reactionPickerRef = useRef(null);
    const messageRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    socket.emit("seen", message.id);
                }
            },
            { threshold: 0.1 }
        );

        if (messageRef.current) {
            observer.observe(messageRef.current);
        }

        return () => {
            if (messageRef.current) {
                observer.unobserve(messageRef.current);
            }
        };
    }, [messageRef.current, socket]);

    useEffect(() => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = message.message.match(urlRegex);
        if (urls && urls.length > 0) {
            axios.get(`/api/url-preview?url=${urls[0]}`)
                .then(response => {
                    setUrlPreview(response.data);
                })
                .catch(error => {
                    console.error("Error fetching URL metadata:", error);
                });
        }
    }, [message.message]);

    const addReaction = (emoji) => {
        const newReactions = { ...reactions };
        newReactions[emoji.emoji] = emoji.emoji;
        setReactions(newReactions);
        socket.emit("addReaction", { messageId: message.id, reactions: newReactions });
        setShowReactionPicker(false);
    };

    const removeReaction = (emoji) => {
        const newReactions = { ...reactions };
        delete newReactions[emoji.emoji];
        setReactions(newReactions);
        socket.emit("removeReaction", { messageId: message.id, reactions: newReactions });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (reactionPickerRef.current && !reactionPickerRef.current.contains(event.target)) {
                setShowReactionPicker(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
        <div ref={messageRef} className="animate__animated animate__zoomIn"
            key={index} 
            style={{
                alignItems: message.sender === username ? "flex-end" : "flex-start",
                display: "flex",
                flexDirection: "column",
                marginBottom: "20px",
                position: "relative"
            }}
            >
            <div style={{
                maxWidth: "70%",
                padding: "10px",
                borderRadius: "20px",
                backgroundColor: message.sender === username ? "#007AFF" : "#E5E5EA",
                color: message.sender === username ? "#FFFFFF" : "#000000",
                borderRadius: message.sender === username ? "20px 20px 0 20px" : "20px 20px 20px 0",
                boxShadow: "0 1px 1px rgba(0, 0, 0, 0.2)",
                minWidth: "20%",
            }}>
                
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="senderAvatar" style={{
                        background: message.sender === "admin" ? "white" : "black",
                        border: "solid 1px black",
                    }}>
                        <img src={"/icon.png"} alt="avatar" style={{
                            width: "30px", height: "30px", borderRadius: "50%",
                            filter: message.sender === "admin" ? "invert(0)" : "invert(1)"
                        }} />
                    </div>
                    <div className="sender" style={{ fontWeight: "bolder", marginLeft: "5px" }}>
                        {message.sender === "admin" ? "PhilaPrints" : message.sender}
                    </div>
                </div>
                <div className="message">{message.message}</div>

                {urlPreview && (
                    <Link href={urlPreview.url} target="_blank" style={{ color: "blue" }}>
                        <div className="urlPreview" style={{ marginTop: "10px", border: "1px solid #ccc", borderRadius: "10px", padding: "10px" }}>
                            <div style={{ fontWeight: "bold" }}>{urlPreview.title}</div>
                            <div>{urlPreview.description}</div>
                            {urlPreview.image && <img src={urlPreview.image} alt="preview" style={{ width: "45%", margin: "auto", borderRadius: "10px" }} />}
                            <div className="small">Link: {urlPreview.url}</div>
                        </div>
                    </Link>
                )}

                <button
                    onClick={(e) => {
                        setShowReactionPicker(true);
                    }}
                    className="showReactionEmojiPicker">
                    😊
                </button>
            </div>
        </div>
        {showReactionPicker && (
            <div className="reactionPicker"
                style={{
                    textAlign: username === message.sender ? "right" : "left",
                }}
            >
                <div className="animate__animated animate__slideInUp" ref={reactionPickerRef}>
                <EmojiPicker reactionsDefaultOpen={true} onReactionClick={addReaction} />
                </div>
            </div>
        )}
        {Object.values(reactions).length > 0 && (
                <div className="reactionsContainer">
                    <div className="reactions">
                        {Object.values(reactions).map((emoji, idx) => (
                            <span 
                            onClick={() => removeReaction({ emoji })}
                            key={idx} style={{ cursor: "pointer" }}>{emoji}</span>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};
