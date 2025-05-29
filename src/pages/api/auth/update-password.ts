import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { newPassword, resetToken } = req.body;
  if (!newPassword) {
    return res.status(400).json({ message: 'رمز عبور جدید الزامی است.' });
  }
  // در سیستم واقعی باید رمز عبور کاربر را با توکن معتبر تغییر دهید
  return res.status(200).json({ message: 'رمز عبور با موفقیت به‌روزرسانی شد.' });
}
