import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Modal from 'react-modal';
import { ChatControls } from "../../ChatControls";

import { ReactionPicker } from "./ReactionPicker";
import { Reactions } from "./Reactions";
import { MessageContent } from "./MessageContent";

import { ChatContext } from "../../ChatContext";
import { MessageContext } from "./MessageContext";


Modal.setAppElement('#__next');

const customStyles = {
    overlay:{
        insert:1,
        backgroundColor:"rgba(0,0,0,0.6)"
    },  
    content: {
        background:"black",
        borderRadius: "10px",
        border: "none",
        width:"80%",
        height:"100%",
        margin:"auto",
    },
  };

export const Message = ({ message, index }) => {
    const { username, currentConversation, socket, id, email } = React.useContext(ChatContext);
    
    const [urlPreview, setUrlPreview] = useState(null);
    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [reactions, setReactions] = useState(message.reaction || {}); 

    useEffect(() => {
        socket.on("addReaction", ({ messageId, reactions:reaction  }) => {
            if (messageId === message.id) {
                setReactions(reaction);
            }     
        });
    }, []);
    
    const reactionPickerRef = useRef(null);
    const messageRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    username !== message.sender &&
                    !message.seen &&
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
        if(!newReactions[email]) {
            newReactions[email] = []
        }
        newReactions[email].push(emoji.emoji);
        console.log({id,message, newReactions});
        setReactions(newReactions);
        socket.emit("addReaction", { 
            id:currentConversation?.id,
            messageId: message.id,
            reactions: newReactions 
        });
        setShowReactionPicker(false);
    };

    const removeReaction = (emoji) => {
        const newReactions = { ...reactions };
        if (newReactions[email]) {
            newReactions[email] = newReactions[email].filter(e => e !== emoji.emoji);
            if (newReactions[email].length === 0) {
                delete newReactions[email];
            }
            setReactions(newReactions);
            socket.emit("addReaction", { 
                id,
                messageId: message.id,
                reactions: newReactions 
            });
        }
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
            setShowReplyModal,
            showReplyModal,
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
            <Reactions {...{
                isSender:message.sender === username,
                reactions,removeReaction}} />
        )}



            <Modal
            isOpen={showReplyModal}
            // onAfterOpen={()=>alert("Modal is open")}
            // onRequestClose={()=>alert("Modal is requested to close")}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <div className="replyModal animate__animated animate__fadeIn">
                <div style={{display:"flex",justifyContent:"space-between"}}>
                <h3>Replying to...</h3>
                <button className="closeModal" onClick={()=>setShowReplyModal(false)}>
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512"  xmlns="http://www.w3.org/2000/svg"><path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"></path></svg>
                </button>
                </div>
                <div className="replies">
                    <MessageContent />
                </div>
                <hr/>
                <div style={{overflow:"hidden"}}>
                    <div className="animate__animated animate__faster animate__slideInDown" >
                        <ChatControls replyId={message.id} />
                    </div>
                </div>
            </div>
        </Modal>

        </MessageContext.Provider>
    );
};