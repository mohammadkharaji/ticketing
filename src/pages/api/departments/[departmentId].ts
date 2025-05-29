// API route for managing a specific department (get, update, delete)
import type { NextApiRequest, NextApiResponse } from 'next';
import departmentService from '@/services/departmentService'; // فرض بر اینکه departmentService موجود و دارای متدهای لازم است

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { departmentId } = req.query;

  if (typeof departmentId !== 'string') {
    return res.status(400).json({ message: 'شناسه دپارتمان نامعتبر است.' });
  }

  // TODO: پیاده‌سازی احراز هویت و بررسی دسترسی‌های لازم برای هر متد (مخصوصاً برای PUT و DELETE که برای مدیران است)

  switch (req.method) {
    case 'GET':
      // دریافت اطلاعات یک دپارتمان خاص - در مستندات API.md این مسیر برای لیست کردن همه است، اما معمولا [id] برای یک آیتم خاص است.
      // با توجه به اینکه GET /api/departments برای لیست همه است، این مسیر را برای دریافت یک دپارتمان خاص در نظر می‌گیریم.
      // احراز هویت: نیازمند توکن (عمومی برای کاربران لاگین کرده)
      try {
        // TODO: پیاده‌سازی کامل getDepartmentById در departmentService
        const department = await departmentService.getDepartmentById(departmentId);
        if (!department) {
          return res.status(404).json({ message: 'دپارتمان پیدا نشد.' });
        }
        return res.status(200).json(department);
      } catch (error: any) {
        console.error(`Error fetching department ${departmentId}:`, error);
        return res.status(500).json({ message: 'خطا در دریافت اطلاعات دپارتمان', error: error.message });
      }

    case 'PUT':
      // به‌روزرسانی دپارتمان (برای مدیران)
      // احراز هویت: نیازمند توکن (مدیر سیستم)
      try {
        const { name, description } = req.body;
        // TODO: اعتبارسنجی داده‌های ورودی (name احتمالاً الزامی است اگر قرار است تغییر کند)
        // TODO: پیاده‌سازی کامل updateDepartment در departmentService
        const updates = { name, description }; // اطمینان حاصل کنید که فقط فیلدهای معتبر ارسال می‌شوند
        const success = await departmentService.updateDepartment(departmentId, updates);
        if (!success) { // یا اگر updatedDepartment برمی‌گرداند، چک کنید !updatedDepartment
          return res.status(404).json({ message: 'دپارتمان پیدا نشد یا به‌روزرسانی ناموفق بود.' });
        }
        // معمولاً پس از PUT، یا آبجکت آپدیت شده یا 204 No Content یا یک پیام موفقیت‌آمیز برگردانده می‌شود.
        // اگر آبجکت کامل را برنمی‌گردانید، می‌توانید یک getDepartmentById دیگر انجام دهید یا فقط پیام موفقیت ارسال کنید.
        return res.status(200).json({ message: `دپارتمان با شناسه ${departmentId} با موفقیت به‌روزرسانی شد.`, updates });
      } catch (error: any) {
        console.error(`Error updating department ${departmentId}:`, error);
        return res.status(500).json({ message: 'خطا در به‌روزرسانی اطلاعات دپارتمان', error: error.message });
      }

    case 'DELETE':
      // حذف دپارتمان (برای مدیران)
      // احراز هویت: نیازمند توکن (مدیر سیستم)
      try {
        // TODO: پیاده‌سازی کامل deleteDepartment در departmentService
        const success = await departmentService.deleteDepartment(departmentId);
        if (!success) {
          return res.status(404).json({ message: 'دپارتمان پیدا نشد یا حذف ناموفق بود.' });
        }
        return res.status(204).send(null); // No Content for successful DELETE
      } catch (error: any) {
        console.error(`Error deleting department ${departmentId}:`, error);
        return res.status(500).json({ message: 'خطا در حذف دپارتمان', error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}