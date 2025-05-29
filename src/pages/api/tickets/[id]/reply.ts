import type { NextApiRequest, NextApiResponse } from 'next';
import ticketService from '@/services/ticketService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'شناسه تیکت نامعتبر است.' });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { userId, message } = req.body;
  if (!userId || !message) {
    return res.status(400).json({ message: 'اطلاعات ناقص است.' });
  }
  try {
    const reply = await ticketService.addReply({ ticketId: id, userId, message });
    return res.status(201).json(reply);
  } catch (e) {
    return res.status(500).json({ message: 'خطا در ثبت پاسخ.' });
  }
}
