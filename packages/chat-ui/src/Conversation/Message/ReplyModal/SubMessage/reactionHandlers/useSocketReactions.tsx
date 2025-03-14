import { useEffect } from "react";
export const useSocketReactions = (socket, reply, setReactions) => {
    if(typeof socket === 'undefined') {
        return;
    }
    useEffect(() => {
        const handleReactionUpdate = (payload) => {
            if (payload.messageId === reply.id) {
                setReactions(payload.reactions);
            }
        };

        socket.on("addReaction", handleReactionUpdate);

        return () => {
            socket.off("addReaction", handleReactionUpdate);
        };
    }, [socket, reply, setReactions]);
};
