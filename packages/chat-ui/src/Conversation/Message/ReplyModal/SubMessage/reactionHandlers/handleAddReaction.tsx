export const handleAddReaction = (emoji, email, reactions, setReactions, socket, id, messageId, setShowReactionsPicker) => {
    const newReactions = { ...reactions };
    if (!newReactions[email]) {
        newReactions[email] = [];
    }
    newReactions[email].push(emoji.emoji);
    setReactions(newReactions);
    socket.emit("addReaction", { id, messageId, reactions: newReactions });
    setShowReactionsPicker(false);
};
