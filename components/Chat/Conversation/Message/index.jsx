import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ReactionPicker } from "./ReactionPicker";
import { Reactions } from "./Reactions";
import { MessageContent } from "./MessageContent";

import { ChatContext } from "../../ChatContext";
import { MessageContext } from "./MessageContext";

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
        <MessageContext.Provider value={{ 
            message,
            urlPreview,
            username,
            setShowReactionPicker,
            addReaction,
            reactions 
         }}>
        
        <div
            ref={messageRef} className="animate__animated animate__zoomIn"
            key={index} 
            style={{
                alignItems: message.sender === username ? "flex-end" : "flex-start",
                display: "flex",
                flexDirection: "column",
                marginBottom: "20px",
                position: "relative"
            }}
        >
            <MessageContent />
        </div>
        
        {showReactionPicker && (
            <ReactionPicker reactionPickerRef={reactionPickerRef} />
        )}
        
        {Object.values(reactions).length > 0 && (
            <Reactions {...{reactions,removeReaction}} />
        )}
        </MessageContext.Provider>
    );
};