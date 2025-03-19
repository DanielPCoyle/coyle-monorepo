export const handleRemoveReaction = (emoji, email, reactions, setReactions, socket, messageId) => {
    const newReactions = { ...reactions };
    if (newReactions[email]) {
        newReactions[email] = newReactions[email].filter((e) => e !== emoji.emoji);
        if (newReactions[email].length === 0) {
            delete newReactions[email];
        }
        setReactions(newReactions);
        socket.emit("addReaction", { messageId, reactions: newReactions });
    }
};
