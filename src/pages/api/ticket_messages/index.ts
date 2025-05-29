// API route for ticket messages (list, add message)
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // TODO: لیست پیام‌های تیکت
      return res.status(200).json({ message: 'لیست پیام‌ها' });
    case 'POST':
      // TODO: افزودن پیام جدید
      return res.status(201).json({ message: 'پیام افزوده شد' });
    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
