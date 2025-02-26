import { motion } from "framer-motion";

interface Conversation {
    id: string;
    username: string;
    email: string;
    status: string;
    unSeenMessages: number;
}

interface ConversationListItemsProps {
    conversations: Conversation[];
    socket: any;
    currentConversation: Conversation | null;
    setCurrentConversation: (conversation: Conversation) => void;
    id: string;
}

export const ConversationListItems: React.FC<ConversationListItemsProps> = ({ conversations, socket, currentConversation, setCurrentConversation, id }) => {
    const filteredConversations = conversations
        ?.filter((convo) => convo?.id !== id && convo?.username && convo?.username !== "admin");

    return Boolean(filteredConversations?.length) ? (
        <>
            {filteredConversations?.map((convo, i) => (
                <div
                    className={`conversationListItem ${currentConversation?.id === convo.id ? "active" : ""}`}
                    key={i}
                    onClick={() => {
                        socket.emit("leave", { id: currentConversation?.id });
                        setCurrentConversation(convo);
                    }}
                >
                    {convo.status}
                    {convo.username} - {convo.email}
                    {convo?.unSeenMessages > 0 && ` (${convo.unSeenMessages})`}
                </div>
            ))}
        </>
    ) : (
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
    );
};