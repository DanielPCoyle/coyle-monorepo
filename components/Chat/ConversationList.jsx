import React, { useState } from "react";
import { styles } from "../../pages/chat";
import { motion } from "framer-motion";

export const ConversationList = ({
    conversations, currentConversation, setCurrentConversation, socket, id,historicConversations
}) => {
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
                style={{
                    position: "fixed",
                    top: 0,
                    left: window.innerWidth > 1100 ? 0 : isDrawerOpen ? 0 : "-250px",
                    width: "250px",
                    height: "100%",
                    backgroundColor: "white",
                    boxShadow: "2px 0 5px rgba(0,0,0,0.5)",
                    transition: "left 0.3s ease",
                    zIndex: 999,
                    padding: "10px",
                }}
            >
                <h3>Active Conversations</h3>
                {/* <pre>{JSON.stringify(,null,2)}</pre> */}
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
                <h5 style={{marginTop:"3vh"}}>Historic Conversations</h5>
                
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
                style={convo?.id === currentConversation?.id ? { ...styles.conversationItem, backgroundColor: "lightblue" } : styles.conversationItem}
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



