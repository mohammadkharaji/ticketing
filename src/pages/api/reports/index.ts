// API route for reports (generate, list)
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // TODO: لیست گزارش‌ها
      return res.status(200).json({ message: 'لیست گزارش‌ها' });
    case 'POST':
      // TODO: تولید گزارش جدید
      return res.status(201).json({ message: 'گزارش تولید شد' });
    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
