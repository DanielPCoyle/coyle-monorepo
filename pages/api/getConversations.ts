import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";

dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
);

interface Conversation {
  id: string;
  unSeenMessages?: number;
  // ...other properties
}

async function getConversations(): Promise<Conversation[]> {
  const { data, error } = await supabase.from("conversations").select("*");
  if (error) console.error(error);

  // get the count of un-seen messages for each conversation
  for (let i = 0; i < data.length; i++) {
    const conversation = data[i];

    const { data: messageData, error: messageError } = await supabase.rpc(
      "count_unseen_messages",
      {
        convo_id: conversation.id,
        sender: "admin",
      },
    );
    if (messageError) console.error(messageError);

    const unSeenMessages = messageData;
    data[i].unSeenMessages = unSeenMessages;
  }
  return data;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const conversations = await getConversations();
  res.status(200).json(conversations);
}
