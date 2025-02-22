import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import {ChatContext } from "../../context/chatContext";

export const ConversationList = () => {
    const {
        conversations,
        currentConversation,
        setCurrentConversation,
        socket,
        id,
        historicConversations,
    } = useContext(ChatContext);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <>
            <button
                onClick={toggleDrawer}
                style={{
                    position: "fixed",
                    top: 10,
                    left: 10,
                    zIndex: 1000,
                    display: window.innerWidth <= 1100 ? "block" : "none",
                }}
            >
                {isDrawerOpen ? "Close" : "Open"} Conversations
            </button>
            <div
                className="conversationList"
            >
                <h3>Active Conversations</h3>
                <ConversationListItems
                socket={socket}
                setCurrentConversation={setCurrentConversation} 
                currentConversation={currentConversation} 
                conversations={conversations.map((convo)=>{
                    if(!convo?.id) return null;
                    const historicRecord = historicConversations.find(historic=>historic.conversation_key === convo.id);
                    convo.unSeenMessages = historicRecord?.unSeenMessages || 0;
                    return convo;
                })} 
                id={id} />
                <div className="historicConversations">
                <h5>Historic Conversations</h5>
                    <ConversationListItems
                        socket={socket}
                        setCurrentConversation={setCurrentConversation} 
                        currentConversation={currentConversation} 
                        conversations={historicConversations
                            .filter(convo=>conversations.map(c=>c?.id).includes(convo?.id) === false)
                        } 
                        id={id} 
                    />
                </div>
            </div>
        </>
    );
};

const ConversationListItems = ({conversations, socket, currentConversation, setCurrentConversation, id}) => {
    const filteredConversations = conversations
    ?.filter((convo) => convo?.id !== id && convo?.username  && convo?.username !== "admin");
    return  Boolean(filteredConversations?.length) ? <>
    {
        filteredConversations?.map((convo, i) => (
            <div
                key={i}
                onClick={(prev) => {
                    setCurrentConversation((prev) => {
                        socket.emit("leave", { id: prev.id });
                        return convo;
                    });
                }}
            >
                {convo.status}
                {convo.username} - {convo.email} 
                {convo?.unSeenMessages > 0 && `(${convo.unSeenMessages})`}
            </div>
        ))}
        </> : 
        <>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{ padding: "10px", color: "gray" }}

        >
            No conversations...
        </motion.div>
        </>
}