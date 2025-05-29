import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const filePath = path.join(process.cwd(), 'pendingRegistrations.json');
  let pending: string[] = [];
  try {
    if (fs.existsSync(filePath)) {
      pending = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (e) {
    return res.status(500).json({ message: 'خطا در خواندن لیست ثبت‌نام‌ها.' });
  }
  return res.status(200).json({ pending });
}
