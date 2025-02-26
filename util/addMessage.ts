import { supabase } from "../pages/api/socket";

interface AddMessageParams {
  sender: string;
  message: string;
  conversation_key: string;
  files: any;
}

export async function addMessage({
  sender,
  message,
  conversation_key,
  files,
}: AddMessageParams): Promise<number | null> {
  // Fetch the conversation ID
  const { data, error } = await supabase
    .from("conversations")
    .select("id")
    .eq("conversation_key", conversation_key)
    .single(); // Ensures we get only one result

  if (error) {
    return null;
  }

  const conversationId = data.id;

  // Insert message and return the newly inserted record
  const { data: messageData, error: messageError } = await supabase
    .from("messages")
    .insert([{ conversation_id: conversationId, message, sender, files }])
    .select(); // 👈 This ensures the response includes the inserted row(s)

  if (messageError) {
    return null;
  }

  return messageData[0].id; // Return the inserted message with its ID
}
