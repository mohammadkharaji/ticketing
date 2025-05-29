import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'ایمیل الزامی است.' });
  }
  // حذف ایمیل از لیست انتظار پس از تایید یا ایجاد کاربر
  const filePath = path.join(process.cwd(), 'pendingRegistrations.json');
  let pending: string[] = [];
  try {
    if (fs.existsSync(filePath)) {
      pending = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const idx = pending.indexOf(email);
      if (idx !== -1) {
        pending.splice(idx, 1);
        fs.writeFileSync(filePath, JSON.stringify(pending, null, 2));
      }
    }
  } catch (e) {
    return res.status(500).json({ message: 'خطا در حذف ثبت‌نام.' });
  }
  return res.status(200).json({ message: 'ثبت‌نام حذف شد.' });
}
