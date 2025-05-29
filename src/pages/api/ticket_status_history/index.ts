// API route for ticket status history (list, add)
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // TODO: لیست تاریخچه وضعیت تیکت
      return res.status(200).json({ message: 'لیست تاریخچه وضعیت' });
    case 'POST':
      // TODO: افزودن تاریخچه جدید
      return res.status(201).json({ message: 'تاریخچه افزوده شد' });
    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
