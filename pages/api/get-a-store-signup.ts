import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SignupRequestBody {
    organization: string;
    contact: string;
    email: string;
    phone: string;
    website: string;
    store_domain: string;
    custom_domain: string;
    products: string;
    order_fulfillment: string;
    additional_requests: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const {
        organization,
        contact,
        email,
        phone,
        website,
        store_domain,
        custom_domain,
        products,
        order_fulfillment,
        additional_requests
    }: SignupRequestBody = req.body;

    // Convert "yes"/"no" from the form to a boolean value
    const has_custom_domain = custom_domain === "yes";

    const { data, error } = await supabase.from('get_a_store_signups').insert([
        {
            organization_name: organization,
            contact_person: contact,
            email,
            phone,
            website,
            store_domain,
            custom_domain: has_custom_domain,
            products,
            order_fulfillment,
            additional_requests
        }
    ]);

    if (error) {
        return res.status(500).json({ message: 'Database Insertion Error', error });
    }

    res.status(200).json({ message: 'Signup Successful', data });
}