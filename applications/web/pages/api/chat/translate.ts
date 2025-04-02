import { updateMessage } from "@coyle/chat-db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { text, id } = req.body;
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
                  "You are an expert translator. You are an AI assistant that outputs valid JSON only.",
              },
              {
                role: "user",
                content:
                  "Translate the following text to English: " +
                  text +
                  '\n Output the result in JSON format with the following structure: {"text": "translated text", "language": "en"}',
              },
            ],
            max_tokens: 500,
          }),
        },
      );

      const promptsData = await promptsResponse.json();

      const translatedText = promptsData.choices[0].message.content;
      const response = {
        id: id,
        language: "en",
        text: JSON.parse(translatedText).text,
      };

      await updateMessage(id, {
        translation: {
          text: JSON.parse(translatedText).text,
          language: "en",
        },
      });

      res.status(200).json(response);
    } catch (error) {
      console.error("Error generating blog content:", error);
    }
  }
}
