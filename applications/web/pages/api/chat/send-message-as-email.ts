import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdminUsers } from '@coyle/database';
import {sendEmail} from '../../../util/sendEmail';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { message } = req.body;
    const admins = await getAdminUsers();
    const activeAdmins = admins.filter(admin => admin.isActive);
    
    try {
        activeAdmins.forEach(async admin => {
            await sendEmail({
                to: admin.email,
                subject: 'New message from chat from '+message.sender+' ('+message.email+')',
                text: `You have a new message from ${message.sender}:\n\n${message.message}\n\nfrom ${message.email}`,
            });
        });

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email' });
    }
}