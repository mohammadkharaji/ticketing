# راهنمای نصب و راه‌اندازی پروژه

این فایل شامل مراحل نصب و راه‌اندازی سیستم مدیریت تیکت‌های سازمانی است.

## پیش‌نیازها

قبل از شروع، مطمئن شوید که نرم‌افزارهای زیر روی سیستم شما نصب شده باشند:

- **Node.js**: نسخه 18 یا بالاتر. می‌توانید از [وبسایت رسمی Node.js](https://nodejs.org/) دانلود کنید.
- **npm**: نسخه 9 یا بالاتر (معمولاً همراه با Node.js نصب می‌شود).
- **Git**: برای دریافت کد پروژه از مخزن. می‌توانید از [وبسایت رسمی Git](https://git-scm.com/) دانلود کنید.
- **PostgreSQL**: (یا پایگاه داده دیگری که برای بک‌اند انتخاب کرده‌اید). راهنمای نصب PostgreSQL را می‌توانید در [وبسایت رسمی PostgreSQL](https://www.postgresql.org/download/) پیدا کنید.

## مراحل نصب فرانت‌اند (Next.js)

1.  **دریافت کد پروژه:**
    ```bash
    git clone <URL_REPOSITORY_PROJECT>
    cd ticketing-system # یا نام پوشه پروژه شما
    ```

2.  **نصب وابستگی‌ها:**
    در پوشه اصلی پروژه (جایی که فایل `package.json` قرار دارد)، دستور زیر را اجرا کنید:
    ```bash
    npm install
    # یا اگر از yarn استفاده می‌کنید:
    # yarn install
    ```

3.  **تنظیم متغیرهای محیطی:**
    یک فایل به نام `.env.local` در ریشه پروژه ایجاد کنید. این فایل برای نگهداری متغیرهای محلی محیط توسعه استفاده می‌شود و نباید به مخزن Git ارسال شود (در `.gitignore` تعریف شده است).
    محتوای فایل `.env.example` را به عنوان الگو در `.env.local` کپی کرده و مقادیر آن را مطابق با تنظیمات خود تغییر دهید. به عنوان مثال:

    ```env
    # آدرس API بک‌اند
    NEXT_PUBLIC_API_URL=http://localhost:5000/api # مثال

    # سایر متغیرهای مورد نیاز برای فرانت‌اند
    # ...
    ```

4.  **اجرای سرور توسعه:**
    برای اجرای برنامه در حالت توسعه، دستور زیر را اجرا کنید:
    ```bash
    npm run dev
    # یا اگر از yarn استفاده می‌کنید:
    # yarn dev
    ```
    پس از اجرای موفقیت‌آمیز، برنامه معمولاً روی آدرس `http://localhost:3000` در دسترس خواهد بود.

5.  **ساخت نسخه پروداکشن:**
    برای ساخت نسخه بهینه شده برای محیط پروداکشن، دستور زیر را اجرا کنید:
    ```bash
    npm run build
    ```
    فایل‌های ساخته شده در پوشه `.next` قرار می‌گیرند.

6.  **اجرای نسخه پروداکشن:**
    برای اجرای نسخه ساخته شده، از دستور زیر استفاده کنید:
    ```bash
    npm run start
    ```

## مراحل نصب و راه‌اندازی بک‌اند (Node.js/Express.js - مثال)

*توجه: این بخش به عنوان یک راهنمای کلی برای یک بک‌اند مبتنی بر Node.js/Express.js و PostgreSQL ارائه شده است. مراحل دقیق ممکن است بسته به پیاده‌سازی خاص بک‌اند شما متفاوت باشد.*

1.  **دریافت کد پروژه بک‌اند (اگر در مخزن جداگانه‌ای است):**
    اگر بک‌اند در یک مخزن جداگانه قرار دارد، آن را نیز clone کنید.
    ```bash
    git clone <URL_REPOSITORY_BACKEND>
    cd backend-project-directory
    ```

2.  **نصب وابستگی‌های بک‌اند:**
    ```bash
    npm install
    # یا
    # yarn install
    ```

3.  **راه‌اندازی پایگاه داده:**
    -   یک پایگاه داده جدید در PostgreSQL (یا پایگاه داده انتخابی خود) ایجاد کنید.
    -   اگر از ORM مانند Prisma یا TypeORM استفاده می‌کنید، migration ها را اجرا کنید تا جداول پایگاه داده ایجاد شوند.
        ```bash
        # مثال برای Prisma
        npx prisma migrate dev
        ```

4.  **تنظیم متغیرهای محیطی بک‌اند:**
    یک فایل `.env` در ریشه پروژه بک‌اند ایجاد کنید و متغیرهای لازم مانند اطلاعات اتصال به پایگاه داده، کلیدهای JWT، پورت سرور و غیره را تنظیم کنید. مثال:
    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
    JWT_SECRET="your-very-strong-secret-key"
    PORT=5000
    # سایر متغیرهای مورد نیاز بک‌اند
    ```

5.  **اجرای سرور بک‌اند:**
    ```bash
    npm run start # یا دستور مربوط به اجرای سرور در پروژه بک‌اند شما
    # یا در حالت توسعه
    # npm run dev
    ```
    سرور بک‌اند معمولاً روی پورتی مانند `5000` اجرا می‌شود.

## استقرار (Deployment)

برای استقرار برنامه در محیط پروداکشن، می‌توانید از روش‌های مختلفی استفاده کنید:

-   **فرانت‌اند (Next.js):**
    -   استفاده از پلتفرم‌هایی مانند Vercel (توصیه شده برای Next.js)، Netlify، AWS Amplify.
    -   استقرار روی سرور شخصی با استفاده از Node.js و یک reverse proxy مانند Nginx.

-   **بک‌اند (Node.js/Express.js):**
    -   استفاده از پلتفرم‌های PaaS مانند Heroku, AWS Elastic Beanstalk, Google App Engine.
    -   استقرار روی سرور شخصی (VPS یا سرور اختصاصی) با استفاده از Node.js، یک process manager مانند PM2 و یک reverse proxy مانند Nginx.

### مثال تنظیمات Nginx برای Reverse Proxy (اختیاری)

اگر از Nginx به عنوان reverse proxy استفاده می‌کنید، یک نمونه کانفیگ می‌تواند به شکل زیر باشد (این فایل معمولاً در `/etc/nginx/sites-available/yourdomain.com` قرار می‌گیرد و سپس به `sites-enabled` لینک می‌شود):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS (اختیاری، نیازمند تنظیم SSL)
    # location / {
    #     return 301 https://$host$request_uri;
    # }
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # مسیر گواهی SSL (اختیاری، برای HTTPS)
    # ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    # include /etc/letsencrypt/options-ssl-nginx.conf;
    # ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://localhost:3000; # پورت فرانت‌اند Next.js
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ { # مسیر API بک‌اند
        proxy_pass http://localhost:5000/api/; # پورت بک‌اند Node.js
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # تنظیمات مربوط به فایل‌های استاتیک، لاگ‌ها و ...
}
```

پس از ایجاد یا تغییر فایل کانفیگ Nginx، آن را تست و reload کنید:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## عیب‌یابی

-   **خطاهای مربوط به Node.js/npm:** مطمئن شوید که نسخه‌های صحیح نصب شده‌اند. گاهی اوقات حذف پوشه `node_modules` و فایل `package-lock.json` (یا `yarn.lock`) و نصب مجدد وابستگی‌ها (`npm install`) مشکل را حل می‌کند.
-   **خطاهای اتصال به پایگاه داده:** اطلاعات اتصال در فایل `.env` بک‌اند را بررسی کنید (نام کاربری، رمز عبور، نام پایگاه داده، هاست، پورت).
-   **خطاهای CORS:** اگر فرانت‌اند و بک‌اند روی دامنه‌ها یا پورت‌های مختلفی اجرا می‌شوند، مطمئن شوید که بک‌اند به درستی برای CORS (Cross-Origin Resource Sharing) پیکربندی شده است تا به درخواست‌های فرانت‌اند اجازه دهد.

برای مشکلات بیشتر، لاگ‌های کنسول مرورگر (برای فرانت‌اند) و لاگ‌های سرور (برای بک‌اند) را بررسی کنید.
