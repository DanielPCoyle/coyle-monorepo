import { updateConversationByKey } from "@coyle/chat-db";
export async function updateConversationLanguage(req, res) {
  try {
    if (req.method === "POST") {
      try {
        const { id, language } = req.body;
        await updateConversationByKey(id, { language });
        res
          .status(200)
          .json({ message: "Conversation language updated successfully" });
      } catch (error) {
        console.error("Error updating conversation language", error);
        res
          .status(500)
          .json({ message: "Error updating conversation language" });
      }
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error in API handler", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export default updateConversationLanguage;
