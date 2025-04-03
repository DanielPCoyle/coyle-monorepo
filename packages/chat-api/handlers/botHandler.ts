import {
  getMessages,
  insertMessage,
  getConversationIdByKey,
} from "@simpler-development/chat-db";

export async function botHandler(req, res) {
  if (req.method === "GET") {
    try {
      const { conversationKey } = req.query;
      // eslint-disable-next-line
      let messages: any = await getMessages(conversationKey);
      // eslint-disable-next-line
      messages = messages.map((message: any) => {
        return {
          message: message.message,
          id: message.id,
          sender: message.sender,
        };
      });
      const apiKey = process.env.NEXT_PUBLIC_OPEN_AI_KEY;

      const promptsResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are an expert screen printer. You are an AI assistant that outputs valid JSON only.",
              },
              {
                role: "user",
                content:
                  "Answer the last message in this array:" +
                  JSON.stringify(messages) +
                  '\n Output the result in JSON format with the following structure: {"text": "RESPONSE", "language": "en"}',
              },
            ],
            max_tokens: 500,
          }),
        },
      );

      const promptsData = await promptsResponse.json();
      console.log({ promptsData });

      const translatedText = promptsData.choices[0].message.content;
      const response = {
        language: "en",
        text: JSON.parse(translatedText).text,
      };

      const conversationId = await getConversationIdByKey(conversationKey);
      await insertMessage({
        message: JSON.parse(translatedText).text,
        conversationId,
        sender: "bot",
        seen: false,
      });

      res.status(200).json(response);
    } catch (error) {
      console.error("Error generating blog content:", error);
    }
  }
}

export default botHandler;
