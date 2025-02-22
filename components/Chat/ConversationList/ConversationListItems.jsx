import { motion } from "framer-motion";
export const ConversationListItems = ({conversations, socket, currentConversation, setCurrentConversation, id}) => {
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