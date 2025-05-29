// API route for ticket attachments (list, upload, delete)
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // TODO: لیست فایل‌های پیوست
      return res.status(200).json({ message: 'لیست فایل‌ها' });
    case 'POST':
      // TODO: آپلود فایل جدید
      return res.status(201).json({ message: 'فایل آپلود شد' });
    case 'DELETE':
      // TODO: حذف فایل
      return res.status(200).json({ message: 'فایل حذف شد' });
    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
