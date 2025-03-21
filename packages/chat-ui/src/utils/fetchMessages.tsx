export const fetchMessages = async (id, token, setMessages, setLoading, offset = 0, limit = 10) => {
  if (!id) return;
  setLoading(true);
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/chat/messages?conversationKey=${id}&offset=${offset}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    if (data?.length) {
      setMessages(prevMessages => [...data.sort((a, b) => a.id - b.id), ...prevMessages]);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  } finally {
    setLoading(false);
  }
};
