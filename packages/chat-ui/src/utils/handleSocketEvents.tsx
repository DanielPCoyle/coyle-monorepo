export const handleSocketEvents = (socket, user, id, setMessages, setAdmins, setTyping, setConversations) => {
  socket.on("conversations", (conversations) => {
    if (user?.role === "admin") setConversations(conversations);
  });
  socket.on("adminsOnline", setAdmins);
  socket.on("chat message", (message) => {
    setMessages((prev) => {
      const newMessages = [...prev, message].filter(
        (msg, index, self) => index === self.findIndex((m) => m.id === msg.id)
      );
      return newMessages.sort((a, b) => a.id - b.id);
    });
  });
  socket.on("user typing", (data) => {
    if (data.name !== user?.name) setTyping(data);
  });
  socket.on("user not typing", (data) => {
    if (data.user !== user?.name) setTyping(null);
  });
};
