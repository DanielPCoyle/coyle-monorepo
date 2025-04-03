export const handleSocketEvents = (
  {socket,
  user,
  id,
  setMessages,
  setAdmins,
  setTyping,
  setConversations,
  setNotificationBar,
  messagesRef,
  isBot
  }
) => {
  socket.on("conversations", (conversations) => {
    if (user?.role === "admin") setConversations(conversations);
  });
  socket.on("adminsOnline", setAdmins);
  socket.on("chat message", (message) => {
    console.log({message})
    setMessages((prev) => {
      const newMessages = [...prev];
      if (message.parentId) {
        setNotificationBar((prev) => {
          const newNotifications = Array.isArray(prev) ? [...prev] : [];
          newNotifications.push({
            message: `${message.sender} replied to your message`,
            id: message.parentId,
          });

          return Array.from(new Set(newNotifications.map((n) => n.id))).map(
            (id) => newNotifications.find((n) => n.id === id),
          );
        });
        const parentIndex = newMessages.findIndex(
          (m) => m.id === message.parentId,
        );
        newMessages[parentIndex].replies =
          newMessages[parentIndex].replies || [];
        if (
          !newMessages[parentIndex].replies.some(
            (reply) => reply.id === message.id,
          )
        ) {
          newMessages[parentIndex].replies.push(message);
        }
      } else {
        if (!newMessages.some((msg) => msg.id === message.id)) {
          newMessages.push(message);
        }
      }
      
      return newMessages.sort((a, b) => a.id - b.id);
    });

  });

  socket.on("user typing", (data) => {
    setTyping(data);
  });

  socket.on("user not typing", (data) => {
    if (data.user !== user?.name) setTyping(null);
  });

};
