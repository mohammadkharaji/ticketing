# تیکت‌یار (Ticketing)

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![React Three Fiber](https://img.shields.io/badge/R3F-3D%20Login-purple)
![RTL](https://img.shields.io/badge/UI-Persian%20RTL-orange)
![License](https://img.shields.io/badge/License-Proprietary-lightgrey)

**سامانه یکپارچه مدیریت تیکت‌های سازمانی** — ارتباط هوشمند میان شعب و دپارتمان‌های دفتر مرکزی.

> Enterprise service-desk for branch staff and HQ departments: create, assign, track, and resolve tickets in a full Persian (RTL) web app.

---

## معرفی

تیکت‌یار یک اپلیکیشن وب با **Next.js (Pages Router)** است که چرخهٔ کامل تیکت سازمانی را پوشش می‌دهد:

- ثبت و پیگیری تیکت با **کد پیگیری یکتا** (کد شعبه + تاریخ شمسی + ردیف روزانه)
- نقش‌های دسترسی (**RBAC**): کاربر، کارشناس، مدیر دپارتمان/شعبه، ادمین
- داشبورد و گزارش، پایگاه دانش، اعلان‌ها، پنل مدیریت
- **صفحه ورود سه‌بعدی حرفه‌ای** (React Three Fiber + Three.js)
- رابط **RTL فارسی** با تم روشن/تاریک

---

## امکانات

### تیکت‌ها
- ثبت تیکت (عنوان، توضیحات، اولویت، دپارتمان، شعبه)
- لیست با فیلتر وضعیت / اولویت / جستجو
- جزئیات تیکت، گفتگو و پاسخ
- بستن و بازگشایی تیکت
- تاریخچه به‌روزرسانی‌ها

### کاربران و دسترسی
| نقش | دسترسی نمونه |
|-----|----------------|
| `admin` | همه بخش‌ها، کاربران، مدیریت |
| `department_manager` | تیکت/گزارش دپارتمان |
| `branch_manager` | تیکت/گزارش شعبه |
| `support` | پاسخ و تغییر وضعیت |
| `user` | ثبت و مشاهده تیکت خود |

### سایر ماژول‌ها
- **داشبورد** — آمار زنده تیکت‌ها
- **گزارش‌ها** — توزیع وضعیت
- **پایگاه دانش** — مقالات راهنما
- **اعلان‌ها** — درون‌سامانه‌ای
- **گفتگو** — میان‌بر به تیکت‌های باز
- **مدیریت** — دپارتمان، شعب، نقش‌ها، ایجاد کاربر
- **تنظیمات** — پروفایل، امنیت، تم، اعلان
- **راهنما** — FAQ و لینک‌های سریع

---

## تکنولوژی‌ها

| لایه | ابزار |
|------|--------|
| Framework | Next.js 15 · React 18 · TypeScript |
| UI | Tailwind CSS · Radix/Shadcn · Lucide · Framer Motion |
| 3D Login | Three.js · React Three Fiber · Drei |
| API | Next.js API Routes |
| داده (dev) | JSON store (`data/`, `users.json`) |
| تاریخ | `date-fns` · `date-fns-jalali` |
| تست | Jest · Testing Library |

> مسیر توسعه فعلی روی **فایل‌های JSON محلی** است (بدون نیاز اجباری به PostgreSQL برای اجرا). اسکریپت‌های `scripts/setup-db*` برای استقرار دیتابیس در آینده آماده شده‌اند.

---

## شروع سریع

### پیش‌نیاز
- **Node.js** 18+
- **npm** 9+

### نصب

```bash
git clone https://github.com/mohammadkharaji/ticketing.git
cd ticketing
npm install
```

### متغیر محیطی

فایل `.env.local` (اختیاری برای توسعه):

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

نمونه کامل‌تر: `.env.example`

### اجرا

```bash
npm run dev
```

مرورگر: [http://localhost:3000](http://localhost:3000)

### حساب‌های آزمایشی

| نقش | ایمیل | رمز |
|-----|--------|-----|
| مدیر سیستم | `admin@example.com` | `SecurePassword123!` |
| کارشناس | `expert@example.com` | `Expert123!` |
| مدیر دپارتمان | `manager@example.com` | `Manager123!` |
| کاربر | `user@example.com` | `User123!` |
| مدیر شعبه | `branch@example.com` | `Branch123!` |

---

## ساختار پروژه

```
ticketing/
├── data/                 # داده runtime (tickets, departments, KB) — gitignore
├── public/               # استاتیک (logo, fonts)
├── scripts/              # نصب سرور، DB، backup
├── src/
│   ├── components/       # UI، layout، auth (3D scene)
│   ├── contexts/         # Auth، Theme، Sidebar
│   ├── pages/            # صفحات + API Routes
│   │   ├── api/          # auth, tickets, users, dashboard, ...
│   │   └── auth/login    # ورود سه‌بعدی
│   ├── server/           # لایه داده سمت سرور (repos)
│   ├── services/         # کلاینت fetch به API
│   └── styles/
├── users.json            # کاربران seed (توسعه)
├── API.md
├── INSTALL.md
└── USER_GUIDE.md
```

### مسیرهای مهم

| مسیر | توضیح |
|------|--------|
| `/auth/login` | ورود 3D |
| `/dashboard` | داشبورد |
| `/tickets` · `/tickets/new` · `/tickets/[id]` | تیکت‌ها |
| `/knowledge-base` | پایگاه دانش |
| `/reports` | گزارش |
| `/admin` | پنل مدیریت |
| `/settings` | تنظیمات |

---

## API (خلاصه)

احراز هویت با کوکی `HttpOnly` + پشتیبان `localStorage` در کلاینت.

| متد | مسیر | توضیح |
|-----|------|--------|
| POST | `/api/auth/login` | ورود |
| POST | `/api/auth/logout` | خروج |
| GET | `/api/auth/me` | کاربر جاری |
| GET/POST | `/api/tickets` | لیست / ایجاد |
| GET/PUT/DELETE | `/api/tickets/:id` | جزئیات / ویرایش / حذف |
| POST | `/api/tickets/:id/reply` | پاسخ |
| GET | `/api/dashboard` | آمار |
| GET/POST | `/api/departments` | دپارتمان‌ها |
| GET/POST | `/api/users` | کاربران |
| GET/POST | `/api/knowledge-base` | مقالات |
| GET/POST | `/api/notifications` | اعلان‌ها |

جزئیات بیشتر: [`API.md`](./API.md)

---

## اسکریپت‌ها

```bash
npm run dev          # توسعه
npm run build        # بیلد production
npm start            # اجرای production
npm test             # Jest
npm run type-check   # TypeScript
npm run lint         # ESLint
```

---

## استقرار (خلاصه)

- **Node + PM2** + Nginx (فایل‌های `ecosystem.config.js`, `nginx.conf`)
- اسکریپت: `bash scripts/install-server.sh` (لینوکس)
- راهنمای کامل: [`INSTALL.md`](./INSTALL.md)

---

## مستندات

| فایل | محتوا |
|------|--------|
| [INSTALL.md](./INSTALL.md) | نصب و راه‌اندازی |
| [API.md](./API.md) | مستند API |
| [USER_GUIDE.md](./USER_GUIDE.md) | راهنمای کاربری |

---

## توسعه و مشارکت

1. Fork / Clone
2. شاخه feature بسازید
3. تغییرات + تست
4. Pull Request

برای گزارش باگ یا پیشنهاد: Issue در همین مخزن یا ایمیل پشتیبانی.

---

## مجوز و تماس

تمامی حقوق این نرم‌افزار محفوظ است. استفاده تجاری فقط با مجوز رسمی.

**ایمیل:** [kharaji.369@gmail.com](mailto:kharaji.369@gmail.com)

---

<div align="center">

**تیکت‌یار** — Enterprise Ticketing for Persian Organizations

</div>
