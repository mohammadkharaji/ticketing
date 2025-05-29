# مستندات API سامانه مدیریت تیکت

این مستند، endpoint های اصلی API سامانه مدیریت تیکت را شرح می‌دهد. تمامی درخواست‌ها و پاسخ‌ها در فرمت JSON هستند.

## احراز هویت

اکثر endpoint ها نیازمند احراز هویت هستند. پس از ورود موفقیت‌آمیز، یک توکن JWT در پاسخ ارسال می‌شود که باید در هدر `Authorization` تمامی درخواست‌های بعدی به صورت `Bearer <token>` ارسال گردد.

## ۱. احراز هویت (`/api/auth`)

### `POST /api/auth/login`
ورود کاربر به سیستم.
-   **احراز هویت**: عمومی
-   **بدنه درخواست (Request Body)**:
    ```json
    {
      "email": "user@example.com",
      "password": "yourpassword"
    }
    ```
-   **پاسخ موفق (Success Response - 200 OK)**:
    ```json
    {
      "user": {
        "id": "string",
        "firstName": "string | null",
        "lastName": "string | null",
        "email": "string",
        "roleId": "string | null",
        // ... سایر اطلاعات کاربر مطابق UserProfile
      },
      "session": {
        "token": "jwt_token_string",
        "expiresAt": "datetime_string"
      }
    }
    ```
-   **پاسخ خطا (Error Response - 400/401/500)**:
    ```json
    {
      "message": "توضیحات خطا"
    }
    ```

### `POST /api/auth/logout`
خروج کاربر از سیستم (ابطال توکن در سمت سرور در صورت پیاده‌سازی).
-   **احراز هویت**: نیازمند توکن
-   **پاسخ موفق (Success Response - 200 OK)**:
    ```json
    {
      "message": "خروج با موفقیت انجام شد"
    }
    ```

### `GET /api/auth/me`
دریافت اطلاعات کاربر لاگین کرده.
-   **احراز هویت**: نیازمند توکن
-   **پاسخ موفق (Success Response - 200 OK)**:
    ```json
    // ساختار مشابه فیلد user در پاسخ /api/auth/login
    {
      "id": "string",
      "firstName": "string | null",
      // ...
    }
    ```

### `POST /api/auth/request-password-reset`
ارسال درخواست بازنشانی رمز عبور.
-   **احراز هویت**: عمومی
-   **بدنه درخواست (Request Body)**:
    ```json
    {
      "email": "user@example.com"
    }
    ```
-   **پاسخ موفق (Success Response - 200 OK)**:
    ```json
    {
      "message": "ایمیل بازنشانی رمز عبور ارسال شد"
    }
    ```

### `POST /api/auth/update-password`
به‌روزرسانی رمز عبور کاربر (با توکن بازنشانی یا در حالت لاگین).
-   **احراز هویت**: عمومی (با `resetToken`) یا نیازمند توکن (بدون `resetToken`)
-   **بدنه درخواست (Request Body)**:
    ```json
    {
      "newPassword": "newSecurePassword123",
      "resetToken": "optional_reset_token_string" // اختیاری
    }
    ```
-   **پاسخ موفق (Success Response - 200 OK)**:
    ```json
    {
      "message": "رمز عبور با موفقیت به‌روزرسانی شد"
    }
    ```

## ۲. تیکت‌ها (`/api/tickets`)

### `POST /api/tickets`
ایجاد یک تیکت جدید.
-   **احراز هویت**: نیازمند توکن
-   **بدنه درخواست (Request Body)**:
    ```json
    {
      "title": "string",
      "description": "string",
      "departmentId": "string",
      "priority": "low" | "medium" | "high" | "urgent",
      "attachments": [ { "fileName": "string", "fileUrl": "string" } ] // اختیاری
    }
    ```
-   **پاسخ موفق (Success Response - 201 Created)**:
    ```json
    // آبجکت تیکت ایجاد شده
    {
      "id": "string",
      "title": "string",
      // ... سایر فیلدهای تیکت
    }
    ```

### `GET /api/tickets`
دریافت لیست تیکت‌ها (با قابلیت فیلتر و صفحه‌بندی).
-   **احراز هویت**: نیازمند توکن
-   **پارامترهای کوئری (Query Parameters)**:
    -   `status`: `open`, `pending`, `resolved`, `closed`, ...
    -   `priority`: `low`, `medium`, `high`, `urgent`
    -   `departmentId`: `string`
    -   `userId`: `string` (برای مدیران جهت مشاهده تیکت‌های یک کاربر خاص)
    -   `page`: `number` (برای صفحه‌بندی)
    -   `limit`: `number` (تعداد آیتم در هر صفحه)
    -   `sortBy`: `createdAt`, `updatedAt`, `priority`
    -   `sortOrder`: `asc`, `desc`
-   **پاسخ موفق (Success Response - 200 OK)**:
    ```json
    {
      "tickets": [
        // آرایه‌ای از آبجکت‌های تیکت
      ],
      "totalPages": "number",
      "currentPage": "number",
      "totalTickets": "number"
    }
    ```

### `GET /api/tickets/:ticketId`
دریافت جزئیات یک تیکت خاص.
-   **احراز هویت**: نیازمند توکن (کاربر باید دسترسی به تیکت داشته باشد)
-   **پاسخ موفق (Success Response - 200 OK)**:
    ```json
    // آبجکت تیکت
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "status": "string",
      "priority": "string",
      "user": { /* ... اطلاعات کاربر ایجاد کننده ... */ },
      "department": { /* ... اطلاعات دپارتمان ... */ },
      "messages": [ /* ... لیست پیام‌های تیکت ... */ ],
      "attachments": [ /* ... لیست فایل‌های پیوست ... */ ],
      "statusHistory": [ /* ... تاریخچه وضعیت ... */ ],
      "createdAt": "datetime_string",
      "updatedAt": "datetime_string"
    }
    ```

### `PUT /api/tickets/:ticketId`
به‌روزرسانی یک تیکت (مثلاً تغییر وضعیت، اولویت، ارجاع به دپارتمان دیگر توسط کارشناس/مدیر).
-   **احراز هویت**: نیازمند توکن (کارشناس/مدیر با دسترسی لازم)
-   **بدنه درخواست (Request Body)**:
    ```json
    {
      "status": "string", // اختیاری
      "priority": "string", // اختیاری
      "assignedToUserId": "string", // اختیاری، برای ارجاع به کارشناس دیگر
      "departmentId": "string" // اختیاری، برای ارجاع به دپارتمان دیگر
      // ... سایر فیلدهای قابل ویرایش
    }
    ```
-   **پاسخ موفق (Success Response - 200 OK)**:
    ```json
    // آبجکت تیکت به‌روزرسانی شده
    ```

### `DELETE /api/tickets/:ticketId`
حذف یک تیکت (معمولاً برای مدیران سیستم).
-   **احراز هویت**: نیازمند توکن (مدیر سیستم)
-   **پاسخ موفق (Success Response - 204 No Content)**

## ۳. پیام‌های تیکت (`/api/tickets/:ticketId/messages`)

### `POST /api/tickets/:ticketId/messages`
افزودن یک پیام جدید به تیکت.
-   **احراز هویت**: نیازمند توکن (کاربر ایجاد کننده تیکت یا کارشناس مربوطه)
-   **بدنه درخواست (Request Body)**:
    ```json
    {
      "content": "string",
      "attachments": [ { "fileName": "string", "fileUrl": "string" } ] // اختیاری
    }
    ```
-   **پاسخ موفق (Success Response - 201 Created)**:
    ```json
    // آبجکت پیام ایجاد شده
    {
      "id": "string",
      "content": "string",
      "userId": "string",
      "createdAt": "datetime_string",
      "attachments": []
    }
    ```

## ۴. کاربران (`/api/users`)

### `GET /api/users`
دریافت لیست کاربران (برای مدیران).
-   **احراز هویت**: نیازمند توکن (مدیر سیستم/مدیر دپارتمان با دسترسی محدود)
-   **پارامترهای کوئری**: `role`, `departmentId`, `isActive`, `page`, `limit`
-   **پاسخ موفق (Success Response - 200 OK)**:
    ```json
    {
      "users": [
        // آرایه‌ای از آبجکت‌های کاربر (بدون اطلاعات حساس مانند هش پسورد)
      ],
      "totalPages": "number",
      "currentPage": "number",
      "totalUsers": "number"
    }
    ```

### `GET /api/users/:userId`
دریافت اطلاعات یک کاربر خاص (برای مدیران یا خود کاربر برای پروفایلش).
-   **احراز هویت**: نیازمند توکن
-   **پاسخ موفق (Success Response - 200 OK)**:
    ```json
    // آبجکت کاربر (بدون اطلاعات حساس)
    ```

### `PUT /api/users/:userId`
به‌روزرسانی اطلاعات یک کاربر (برای مدیران یا خود کاربر برای پروفایلش).
-   **احراز هویت**: نیازمند توکن
-   **بدنه درخواست (Request Body)**:
    ```json
    {
      "firstName": "string", // اختیاری
      "lastName": "string", // اختیاری
      "roleId": "string", // اختیاری (فقط توسط مدیر)
      "departmentId": "string", // اختیاری (فقط توسط مدیر)
      "isActive": "boolean" // اختیاری (فقط توسط مدیر)
      // ... سایر فیلدهای قابل ویرایش
    }
    ```
-   **پاسخ موفق (Success Response - 200 OK)**:
    ```json
    // آبجکت کاربر به‌روزرسانی شده
    ```

### `POST /api/users`
ایجاد کاربر جدید (معمولاً توسط مدیر سیستم).
-   **احراز هویت**: نیازمند توکن (مدیر سیستم)
-   **بدنه درخواست (Request Body)**:
    ```json
    {
        "email": "newuser@example.com",
        "password": "initialPassword123",
        "firstName": "string",
        "lastName": "string",
        "roleId": "string",
        "departmentId": "string | null"
    }
    ```
-   **پاسخ موفق (Success Response - 201 Created)**:
    ```json
    // آبجکت کاربر ایجاد شده (بدون پسورد)
    ```

### `DELETE /api/users/:userId`
حذف یک کاربر (معمولاً توسط مدیر سیستم).
-   **احراز هویت**: نیازمند توکن (مدیر سیستم)
-   **پاسخ موفق (Success Response - 204 No Content)**

## ۵. دپارتمان‌ها (`/api/departments`)

### `GET /api/departments`
دریافت لیست تمامی دپارتمان‌ها.
-   **احراز هویت**: نیازمند توکن (عمومی برای کاربران لاگین کرده)
-   **پاسخ موفق (Success Response - 200 OK)**:
    ```json
    [
      // آرایه‌ای از آبجکت‌های دپارتمان
      {
        "id": "string",
        "name": "string",
        "description": "string | null"
      }
    ]
    ```

### `POST /api/departments` (برای مدیران)
ایجاد دپارتمان جدید.
-   **احراز هویت**: نیازمند توکن (مدیر سیستم)
-   **بدنه درخواست (Request Body)**:
    ```json
    {
        "name": "نام دپارتمان جدید",
        "description": "توضیحات اختیاری"
    }
    ```
-   **پاسخ موفق (Success Response - 201 Created)**:
    ```json
    // آبجکت دپارتمان ایجاد شده
    ```

### `PUT /api/departments/:departmentId` (برای مدیران)
به‌روزرسانی دپارتمان.
-   **احراز هویت**: نیازمند توکن (مدیر سیستم)
-   **بدنه درخواست (Request Body)**:
    ```json
    {
        "name": "نام ویرایش شده",
        "description": "توضیحات ویرایش شده"
    }
    ```
-   **پاسخ موفق (Success Response - 200 OK)**:
    ```json
    // آبجکت دپارتمان ویرایش شده
    ```

### `DELETE /api/departments/:departmentId` (برای مدیران)
حذف دپارتمان.
-   **احراز هویت**: نیازمند توکن (مدیر سیستم)
-   **پاسخ موفق (Success Response - 204 No Content)**

## ۶. اعلان‌ها (`/api/notifications`)

### `GET /api/notifications`
دریافت لیست اعلان‌های کاربر لاگین کرده.
-   **احراز هویت**: نیازمند توکن
-   **پارامترهای کوئری**: `read` (boolean, برای فیلتر خوانده شده/نشده)، `page`, `limit`
-   **پاسخ موفق (Success Response - 200 OK)**:
    ```json
    {
      "notifications": [
        {
          "id": "string",
          "type": "ticket_update" | "new_message" | "system_alert",
          "message": "string",
          "link": "string | null", // لینک به تیکت یا بخش مربوطه
          "isRead": "boolean",
          "createdAt": "datetime_string"
        }
      ],
      "totalPages": "number",
      "currentPage": "number",
      "unreadCount": "number"
    }
    ```

### `POST /api/notifications/mark-as-read`
علامت‌گذاری اعلان‌ها به عنوان خوانده شده.
-   **احراز هویت**: نیازمند توکن
-   **بدنه درخواست (Request Body)**:
    ```json
    {
      "notificationIds": ["id1", "id2"] // آرایه‌ای از ID اعلان‌ها، یا خالی برای همه
    }
    ```
-   **پاسخ موفق (Success Response - 200 OK)**:
    ```json
    {
      "message": "اعلان‌ها با موفقیت خوانده شدند"
    }
    ```

## ۷. فایل‌ها (`/api/files`)

### `POST /api/files/upload`
آپلود فایل (برای پیوست به تیکت‌ها یا پیام‌ها).
-   **احراز هویت**: نیازمند توکن
-   **بدنه درخواست (Request Body)**: `multipart/form-data` با فیلد `file`.
-   **پاسخ موفق (Success Response - 200 OK)**:
    ```json
    {
      "fileName": "uploaded_file_name.ext",
      "fileUrl": "url_to_access_the_file",
      "fileType": "mime_type",
      "fileSize": "number_in_bytes"
    }
    ```

## ۸. پایگاه دانش (`/api/knowledge-base`)

### `GET /api/knowledge-base/articles`
دریافت لیست مقالات پایگاه دانش.
-   **احراز هویت**: نیازمند توکن (عمومی برای کاربران لاگین کرده)
-   **پارامترهای کوئری**: `categoryId`, `searchQuery`, `page`, `limit`
-   **پاسخ موفق (Success Response - 200 OK)**:
    ```json
    {
      "articles": [
        {
          "id": "string",
          "title": "string",
          "summary": "string",
          "category": { "id": "string", "name": "string" },
          "createdAt": "datetime_string",
          "updatedAt": "datetime_string"
        }
      ],
      "totalPages": "number",
      "currentPage": "number"
    }
    ```

### `GET /api/knowledge-base/articles/:articleId`
دریافت جزئیات یک مقاله.
-   **احراز هویت**: نیازمند توکن
-   **پاسخ موفق (Success Response - 200 OK)**:
    ```json
    {
      "id": "string",
      "title": "string",
      "content": "string_html_or_markdown",
      "category": { "id": "string", "name": "string" },
      "tags": ["string"],
      "author": { "id": "string", "name": "string" },
      "createdAt": "datetime_string",
      "updatedAt": "datetime_string"
    }
    ```

### `GET /api/knowledge-base/categories`
دریافت لیست دسته‌بندی‌های پایگاه دانش.
-   **احراز هویت**: نیازمند توکن
-   **پاسخ موفق (Success Response - 200 OK)**:
    ```json
    [
      { "id": "string", "name": "string", "articleCount": "number" }
    ]
    ```

*(Endpoint های مربوط به ایجاد/ویرایش/حذف مقالات و دسته‌بندی‌های پایگاه دانش برای مدیران نیز باید تعریف شوند)*

## ۹. داشبورد و گزارش‌ها (`/api/dashboard`, `/api/reports`)

این endpoint ها داده‌های تجمیعی برای نمایش در داشبورد و تولید گزارش‌ها را فراهم می‌کنند. ساختار دقیق به نیازهای گزارش‌گیری بستگی دارد.

### مثال: `GET /api/dashboard/summary` (برای مدیران)
-   **احراز هویت**: نیازمند توکن (مدیر)
-   **پاسخ موفق (Success Response - 200 OK)**:
    ```json
    {
      "totalTickets": "number",
      "openTickets": "number",
      "pendingTickets": "number",
      "resolvedToday": "number",
      "averageResolutionTime": "string_duration_format",
      // ... سایر آمارها
    }
    ```

---
