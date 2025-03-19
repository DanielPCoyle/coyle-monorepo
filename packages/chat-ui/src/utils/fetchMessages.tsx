export const fetchMessages = async (id, token, setMessages, setLoading) => {
  if (!id) return;
  setLoading(true);
  try {
    const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/chat/messages?conversationKey=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data?.length) {
      setMessages(data.sort((a, b) => a.id - b.id));
    }
  } catch (error) {
    console.error("Fetch error:", error); // Ensure errors are caught
  } finally {
    setLoading(false);
  }
};
