import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

export const Message = ({ message, username, index, socket }) => {
    const messageRef = useRef(null);
    const [urlPreview, setUrlPreview] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [reactions, setReactions] = useState(message.reactions || {}); // Store reactions
    const emojiPickerRef = useRef(null);

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
        const newReactions = { ...reactions, [username]: emoji.native }; // Store reaction per user
        setReactions(newReactions);
        setShowEmojiPicker(false);
        socket.emit("message reaction", { messageId: message.id, reactions: newReactions });
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
        <div ref={messageRef} className="animate__animated animate__zoomIn"
            key={index} style={{
                display: "flex",
                flexDirection: "column",
                alignItems: message.sender === username ? "flex-end" : "flex-start",
                marginBottom: "10px"
            }}>
            <div style={{
                maxWidth: "70%",
                padding: "10px",
                borderRadius: "20px",
                backgroundColor: message.sender === username ? "#007AFF" : "#E5E5EA",
                color: message.sender === username ? "#FFFFFF" : "#000000",
                borderRadius: message.sender === username ? "20px 20px 0 20px" : "20px 20px 20px 0",
                boxShadow: "0 1px 1px rgba(0, 0, 0, 0.2)",
                minWidth: "20%",
                position: "relative"
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

                {/* Emoji Reaction Button */}
                <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    style={{
                        position: "absolute",
                        bottom: "-15px",
                        right: "10px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "18px"
                    }}>
                    😊
                </button>

                {/* Emoji Picker Popup */}
                {showEmojiPicker && (
                    <div ref={emojiPickerRef} style={{
                        position: "absolute",
                        top: "30px",
                        right: "10px",
                        zIndex: 1,
                        background: "white",
                        borderRadius: "10px",
                        boxShadow: "0px 0px 10px rgba(0,0,0,0.2)"
                    }}>
                        <Picker data={data} onEmojiSelect={addReaction} />
                    </div>
                )}
            </div>

            {/* Display Reactions */}
            {Object.values(reactions).length > 0 && (
                <div style={{
                    display: "flex",
                    marginTop: "5px",
                    gap: "5px",
                    fontSize: "16px",
                    background: "rgba(0, 0, 0, 0.05)",
                    padding: "5px 10px",
                    borderRadius: "10px"
                }}>
                    {Object.values(reactions).map((emoji, idx) => (
                        <span key={idx} style={{ cursor: "pointer" }}>{emoji}</span>
                    ))}
                </div>
            )}
        </div>
    );
};
