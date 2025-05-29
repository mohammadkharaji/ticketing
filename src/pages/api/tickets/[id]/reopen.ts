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
  try {
    await ticketService.reopenTicket(id);
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ message: 'خطا در بازکردن مجدد تیکت.' });
  }
}
