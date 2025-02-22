import React, { useState, useContext } from "react";
import {ChatContext } from "../ChatContext";
import { ConversationListItems } from "./ConversationListItems";
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
            <div className="conversationList">
                <h3>Active Conversations</h3>
                <ConversationListItems
                    socket={socket}
                    setCurrentConversation={setCurrentConversation}
                    currentConversation={currentConversation}
                    conversations={conversations.map((convo) => {
                        if (!convo?.id) return null;
                        const historicRecord = historicConversations.find(
                            (historic) => historic.id === convo.id
                        );
                        convo.unSeenMessages = historicRecord?.unSeenMessages || 0;
                        return convo;
                    }).filter((convo, index, self) => 
                        convo && index === self.findIndex((c) => c?.id === convo?.id)
                    )}
                    id={id}
                />
                <div className="historicConversations">
                    <h5>Historic Conversations</h5>
                    <ConversationListItems
                        socket={socket}
                        setCurrentConversation={setCurrentConversation}
                        currentConversation={currentConversation}
                        conversations={historicConversations.filter(
                            (convo) =>
                                !conversations.some((c) => c?.id === convo?.id)
                        )}
                        id={id}
                    />
                </div>
            </div>
        </>
    );
};

