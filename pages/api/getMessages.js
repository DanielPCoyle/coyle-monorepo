import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

async function getMessages(conversation_key) {
    const { data, error } = await supabase
        .from('conversations')
        .select('id')
        .eq('conversation_key', conversation_key);
    if (error) console.error(error);
    const conversationId = data[0].id;
    const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId);
    if (messageError) console.error(messageError);
    return messageData;
}

export default async function handler(req, res) {
    const { conversation_key } = req.query;
    const messages = await getMessages(conversation_key);
    res.status(200).json(messages);
}