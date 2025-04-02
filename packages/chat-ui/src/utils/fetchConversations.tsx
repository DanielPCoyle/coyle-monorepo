export const fetchConversations = async (token, setConversations, user) => {
  if (!user || user?.role !== "admin" || !token) return;

  try {
    const res = await fetch(
      process.env.REACT_APP_API_BASE_URL + "/api/chat/conversations",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = await res.json();
    if (data?.length) {
      setConversations(
        data.map((convo) => ({
          ...convo,
          user: convo.name,
          id: convo.conversationKey,
        })),
      );
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
};
