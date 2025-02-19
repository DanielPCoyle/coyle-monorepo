import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";
export const Message = ({ message, username, index, socket }) => {

    const messageRef = useRef(null);
    const [urlPreview, setUrlPreview] = useState(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    console.log("Message seen:", message);
                    socket.emit("seen", message.id);
                } else {
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

    }, [messageRef.current,socket]);

    useEffect(() => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = message.message.match(urlRegex);
        if (urls && urls.length > 0) {
            console.log({urls})
            axios.get(`/api/url-preview?url=${urls[0]}`)
                .then(response => {
                    setUrlPreview(response.data);
                })
                .catch(error => {
                    console.error("Error fetching URL metadata:", error);
                });
        }
    }, [message.message]);

    return <div
        ref={messageRef}
        className="animate__animated animate__zoomIn"
        key={index} style={{ display: "flex", justifyContent: message.sender === username ? "flex-end" : "flex-start", marginBottom: "10px" }}>
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
            <div style={{ display: "flex", }}>
                <div className="senderAvatar"
                style={{
                    background:message.sender === "admin" ? "white" : "black",
                    border:"solid 1px black",
                }}
                >
                    <img src={"/icon.png"}
                        alt="avatar"
                        style={{
                            width: "30px", height: "30px", borderRadius: "50%",
                            filter: message.sender === "admin" ? "invert(0)" : "invert(1)"
                        }} />
                </div>
                <div className="sender" style={{ fontWeight: "bolder", marginBottom: "5px" }}>{message.sender === "admin" ? "PhilaPrints" : message.sender}</div>
            </div>
            <div className="message">{message.message}</div>
            {urlPreview && (
                    <Link href={urlPreview.url} target="_blank" style={{ color: "blue" }}>
                <div className="urlPreview" style={{ marginTop: "10px", border: "1px solid #ccc", borderRadius: "10px", padding: "10px" }}>
                    
                    <div style={{ fontWeight: "bold", }}>{urlPreview.title}</div>
                    <div>{urlPreview.description}</div>
                    {Boolean(urlPreview.image) && <img src={urlPreview.image} alt="preview" style={{ width: "45%", margin:"auto", borderRadius: "10px" }} /> }
                    <div className="small">Link:{urlPreview.url}</div>
                </div>
                    </Link>
            )}
        </div>
    </div>;
};
