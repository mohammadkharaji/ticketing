import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'ایمیل الزامی است.' });
  }
  // ثبت ایمیل در لیست انتظار ثبت‌نام
  const filePath = path.join(process.cwd(), 'pendingRegistrations.json');
  let pending: string[] = [];
  try {
    if (fs.existsSync(filePath)) {
      pending = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    if (!pending.includes(email)) {
      pending.push(email);
      fs.writeFileSync(filePath, JSON.stringify(pending, null, 2));
    }
  } catch (e) {
    return res.status(500).json({ message: 'خطا در ذخیره ثبت‌نام جدید.' });
  }
  // TODO: ارسال نوتیفیکیشن به ادمین (در صورت وجود سیستم نوتیفیکیشن)
  return res.status(200).json({ message: 'درخواست ثبت شد. ادمین به زودی حساب شما را ایجاد خواهد کرد.' });
}
