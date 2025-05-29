// API route for managing a specific user (get, update, delete)
import type { NextApiRequest, NextApiResponse } from 'next';
import userService from '@/services/userService'; // فرض بر اینکه userService موجود و دارای متدهای لازم است

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (typeof userId !== 'string') {
    return res.status(400).json({ message: 'شناسه کاربر نامعتبر است.' });
  }

  // TODO: پیاده‌سازی احراز هویت و بررسی دسترسی‌های لازم برای هر متد

  switch (req.method) {
    case 'GET':
      // دریافت اطلاعات یک کاربر خاص (برای مدیران یا خود کاربر برای پروفایلش)
      try {
        const user = await userService.getUserById(userId);
        if (!user) {
          return res.status(404).json({ message: 'کاربر پیدا نشد.' });
        }
        // حذف اطلاعات حساس مثل پسورد (در صورت وجود)
        const userObj = { ...user };
        if ('password' in userObj) delete userObj.password;
        return res.status(200).json(userObj);
      } catch (error: any) {
        console.error(`Error fetching user ${userId}:`, error);
        return res.status(500).json({ message: 'خطا در دریافت اطلاعات کاربر', error: error.message });
      }

    case 'PUT':
      // به‌روزرسانی اطلاعات یک کاربر (برای مدیران یا خود کاربر برای پروفایلش)
      try {
        const { firstName, lastName, roleId, departmentId, isActive } = req.body;
        // TODO: اعتبارسنجی داده‌های ورودی
        // const updates = { firstName, lastName, roleId, departmentId, isActive };
        // const updatedUser = await userService.updateUser(userId, updates);
        // if (!updatedUser) {
        //   return res.status(404).json({ message: 'کاربر پیدا نشد یا به‌روزرسانی ناموفق بود.' });
        // }
        // return res.status(200).json(updatedUser); // آبجکت کاربر به‌روزرسانی شده
        console.warn(`userService.updateUser needs to be implemented or verified for user: ${userId}`);
        return res.status(200).json({ message: `کاربر با شناسه ${userId} به‌روزرسانی شد (پیاده‌سازی updateUser در userService نیاز است)`, updates: req.body });
      } catch (error: any) {
        console.error(`Error updating user ${userId}:`, error);
        return res.status(500).json({ message: 'خطا در به‌روزرسانی اطلاعات کاربر', error: error.message });
      }

    case 'DELETE':
      // حذف یک کاربر (معمولاً توسط مدیر سیستم)
      try {
        // const success = await userService.deleteUser(userId);
        // if (!success) {
        //   return res.status(404).json({ message: 'کاربر پیدا نشد یا حذف ناموفق بود.' });
        // }
        // return res.status(204).send(null); // No Content
        console.warn(`userService.deleteUser needs to be implemented or verified for user: ${userId}`);
        return res.status(200).json({ message: `کاربر با شناسه ${userId} حذف شد (پیاده‌سازی deleteUser در userService نیاز است)` }); // 204 would be more appropriate on actual delete
      } catch (error: any) {
        console.error(`Error deleting user ${userId}:`, error);
        return res.status(500).json({ message: 'خطا در حذف کاربر', error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}