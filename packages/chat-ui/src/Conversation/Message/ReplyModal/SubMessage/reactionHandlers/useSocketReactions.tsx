import { useEffect } from "react";
import type { Socket } from "socket.io-client";
export const useSocketReactions = (socket:Socket, reply, setReactions) => {
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
