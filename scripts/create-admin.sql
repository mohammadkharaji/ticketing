-- ایجاد یوزر ادمین با دسترسی کامل در سیستم تیکتینگ (PostgreSQL)
-- توجه: برای اجرای این دستور باید uuid_generate_v4() یا gen_random_uuid() در دیتابیس فعال باشد

INSERT INTO users (
  id, username, display_name, email, department_id, role, is_active, settings, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'admin',
  'مدیر سیستم',
  'admin@example.com',
  NULL,
  'admin',
  TRUE,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (username) DO NOTHING;
