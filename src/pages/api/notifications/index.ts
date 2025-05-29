// API route for notifications (list, mark as read, delete)
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // TODO: لیست اعلان‌ها
      return res.status(200).json({ message: 'لیست اعلان‌ها' });
    case 'PUT':
      // TODO: علامت‌گذاری به عنوان خوانده شده
      return res.status(200).json({ message: 'اعلان خوانده شد' });
    case 'DELETE':
      // TODO: حذف اعلان
      return res.status(200).json({ message: 'حذف اعلان' });
    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
