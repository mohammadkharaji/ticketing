import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'users.json');
const PENDING_FILE = path.join(process.cwd(), 'pendingRegistrations.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'ایمیل و رمز عبور الزامی است.' });
  }
  // خواندن کاربران فعلی
  let users: any[] = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  }
  // بررسی تکراری نبودن ایمیل
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ message: 'این ایمیل قبلاً ثبت شده است.' });
  }
  // ایجاد کاربر جدید
  const newUser = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    password, // در پروژه واقعی باید هش شود
    role: 'user',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  users.push(newUser);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  // حذف از لیست انتظار
  let pending: string[] = [];
  if (fs.existsSync(PENDING_FILE)) {
    pending = JSON.parse(fs.readFileSync(PENDING_FILE, 'utf-8'));
    const idx = pending.indexOf(email);
    if (idx !== -1) {
      pending.splice(idx, 1);
      fs.writeFileSync(PENDING_FILE, JSON.stringify(pending, null, 2));
    }
  }
  // TODO: ارسال ایمیل رمز عبور به کاربر
  return res.status(200).json({ message: 'کاربر با موفقیت ایجاد شد.' });
}
