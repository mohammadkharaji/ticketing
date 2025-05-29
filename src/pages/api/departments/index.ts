// API route for department management (list all departments, create new department)
import type { NextApiRequest, NextApiResponse } from 'next';
import departmentService from '@/services/departmentService'; // فرض بر اینکه departmentService موجود و دارای متدهای لازم است
// import { Department } from '@/models/types'; // یا هر نوع داده‌ای که برای دپارتمان تعریف شده

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: پیاده‌سازی احراز هویت و بررسی دسترسی‌های لازم برای هر متد

  switch (req.method) {
    case 'GET':
      // دریافت لیست تمامی دپارتمان‌ها
      // احراز هویت: نیازمند توکن (عمومی برای کاربران لاگین کرده)
      try {
        const departments = await departmentService.getDepartments();
        return res.status(200).json(departments);
      } catch (error: any) {
        console.error('Error fetching departments:', error);
        return res.status(500).json({ message: 'خطا در دریافت لیست دپارتمان‌ها', error: error.message });
      }

    case 'POST':
      // ایجاد دپارتمان جدید (برای مدیران)
      // احراز هویت: نیازمند توکن (مدیر سیستم)
      try {
        const { name, description } = req.body;
        // TODO: اعتبارسنجی داده‌های ورودی (name الزامی است)
        if (!name) {
          return res.status(400).json({ message: 'نام دپارتمان الزامی است.' });
        }
        // TODO: پیاده‌سازی کامل createDepartment در departmentService
        const newDepartment = await departmentService.createDepartment({ name, description });
        if (!newDepartment) {
          return res.status(500).json({ message: 'خطا در ایجاد دپارتمان جدید.' });
        }
        return res.status(201).json(newDepartment); // آبجکت دپارتمان ایجاد شده
      } catch (error: any) {
        console.error('Error creating department:', error);
        return res.status(500).json({ message: 'خطا در ایجاد دپارتمان جدید', error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
