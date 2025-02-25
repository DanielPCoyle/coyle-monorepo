import { supabase } from "./socket";

export async function addConversation({ name, email, conversation_key }) {
    const { data: existingData, error: existingError } = await supabase
        .from('conversations')
        .select('*')
        .eq('conversation_key', conversation_key);

    if (existingError) {
        console.error(existingError);
        return;
    }

    if (existingData.length > 0) {
        return;
    }

    const { data, error } = await supabase
        .from('conversations')
        .insert([{ name, email, conversation_key }]);

    if (error) console.error(error);
    else console.log('Inserted:', data);
}
