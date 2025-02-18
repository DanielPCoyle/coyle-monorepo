import React, { useEffect, useRef }  from "react";

export const Message = ({ message, username, index, socket }) => {


    const messageRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
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
        </div>
    </div>;
};
