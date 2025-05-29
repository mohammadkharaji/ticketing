// API route for user management (list users, create user)
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'users.json');

function loadUsersFromFile() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error loading users from file:', e);
  }
  return [];
}

function saveUsersToFile(users: any[]) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving users to file:', e);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let users = loadUsersFromFile();
  switch (req.method) {
    case 'GET':
      // دریافت لیست کاربران (برای مدیران)
      // TODO: پیاده‌سازی احراز هویت و بررسی دسترسی مدیر
      try {
        const { role, departmentId, isActive, page, limit, searchTerm } = req.query;
        const filters = {
          role: role as string | undefined,
          department_id: departmentId as string | undefined,
          is_active: isActive ? isActive === 'true' : undefined,
          page: page ? parseInt(page as string) : undefined,
          pageSize: limit ? parseInt(limit as string) : undefined,
          searchTerm: searchTerm as string | undefined,
        };
        // فیلتر روی users از فایل
        let filtered = users;
        if (filters.role) filtered = filtered.filter((u: any) => u.role_id === filters.role);
        if (filters.department_id) filtered = filtered.filter((u: any) => u.department_id === filters.department_id);
        if (filters.is_active !== undefined) filtered = filtered.filter((u: any) => u.is_active === filters.is_active);
        if (filters.searchTerm) {
          const term = filters.searchTerm.toLowerCase();
          filtered = filtered.filter((u: any) => (u.first_name && u.first_name.toLowerCase().includes(term)) || (u.last_name && u.last_name.toLowerCase().includes(term)));
        }
        const count = filtered.length;
        // Pagination
        let paged = filtered;
        if (filters.page && filters.pageSize) {
          const from = (filters.page - 1) * filters.pageSize;
          paged = filtered.slice(from, from + filters.pageSize);
        }
        return res.status(200).json({
          users: paged,
          totalPages: filters.pageSize ? Math.ceil(count / filters.pageSize) : 1,
          currentPage: filters.page || 1,
          totalUsers: count
        });
      } catch (error: any) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'خطا در دریافت لیست کاربران', error: error.message });
      }

    case 'POST':
      // ایجاد کاربر جدید (معمولاً توسط مدیر سیستم)
      // TODO: پیاده‌سازی احراز هویت و بررسی دسترسی مدیر
      try {
        const { email, password, firstName, lastName, roleId, departmentId } = req.body;
        // TODO: اعتبارسنجی داده‌های ورودی
        if (!email || !password || !firstName || !lastName || !roleId) {
          return res.status(400).json({ message: 'اطلاعات ناقص برای ایجاد کاربر ارسال شده است.' });
        }
        if (users.find((u: any) => u.email === email)) {
          return res.status(400).json({ message: 'User already exists' });
        }
        const user = {
          id: Math.random().toString(36).substr(2, 9),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          email,
          first_name: firstName,
          last_name: lastName,
          avatar_url: null,
          role_id: roleId,
          department_id: departmentId || null,
          is_active: true,
          phone_number: null,
          job_title: null,
          password // فقط برای تست، هرگز در پروژه واقعی ذخیره نکنید
        };
        users.push(user);
        saveUsersToFile(users);
        const { password: _pw, ...userWithoutPassword } = user;
        return res.status(201).json(userWithoutPassword);
      } catch (error: any) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'خطا در ایجاد کاربر جدید', error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
