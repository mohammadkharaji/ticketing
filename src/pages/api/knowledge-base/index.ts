// API route for knowledge base (list, get, add, update, delete)
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      // TODO: لیست مقالات
      return res.status(200).json({ message: 'لیست مقالات' });
    case 'POST':
      // TODO: افزودن مقاله جدید
      return res.status(201).json({ message: 'مقاله افزوده شد' });
    case 'PUT':
      // TODO: ویرایش مقاله
      return res.status(200).json({ message: 'مقاله ویرایش شد' });
    case 'DELETE':
      // TODO: حذف مقاله
      return res.status(200).json({ message: 'مقاله حذف شد' });
    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
