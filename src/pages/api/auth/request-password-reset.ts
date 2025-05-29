import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'ایمیل الزامی است.' });
  }
  // در سیستم واقعی باید ایمیل ارسال شود. اینجا فقط پیام موفقیت برمی‌گردد
  return res.status(200).json({ message: 'اگر ایمیل معتبر باشد، لینک بازیابی رمز عبور ارسال خواهد شد.' });
}
