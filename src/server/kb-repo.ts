import { readJsonFile, writeJsonFile, uid } from "./json-store";

export type KbArticle = {
  id: string;
  title: string;
  summary: string;
  content: string;
  categoryId: string;
  categoryName: string;
  tags: string[];
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  views: number;
};

const FILE = "knowledge-base.json";

function seed(): KbArticle[] {
  const now = new Date().toISOString();
  return [
    {
      id: "kb_1",
      title: "نحوه ثبت تیکت جدید",
      summary: "راهنمای گام‌به‌گام ثبت تیکت در سامانه",
      content:
        "## ثبت تیکت\n\n1. از منوی تیکت‌ها گزینه «تیکت جدید» را بزنید.\n2. عنوان و توضیحات را کامل بنویسید.\n3. دپارتمان و اولویت را مشخص کنید.\n4. روی ثبت کلیک کنید.\n\nکد پیگیری پس از ثبت نمایش داده می‌شود.",
      categoryId: "guide",
      categoryName: "راهنما",
      tags: ["تیکت", "ثبت", "کاربر"],
      authorId: "tugv0486c",
      authorName: "Admin User",
      createdAt: now,
      updatedAt: now,
      views: 42,
    },
    {
      id: "kb_2",
      title: "اتصال VPN سازمانی",
      summary: "مراحل اتصال به VPN و عیب‌یابی رایج",
      content:
        "## VPN\n\n- از نرم‌افزار رسمی سازمان استفاده کنید.\n- نام کاربری و رمز اکانت سازمانی را وارد کنید.\n- در صورت خطای certificate با واحد IT تماس بگیرید.",
      categoryId: "it",
      categoryName: "فناوری اطلاعات",
      tags: ["vpn", "شبکه"],
      authorId: "tugv0486c",
      authorName: "Admin User",
      createdAt: now,
      updatedAt: now,
      views: 87,
    },
    {
      id: "kb_3",
      title: "بازیابی رمز عبور",
      summary: "اگر رمز عبور خود را فراموش کرده‌اید",
      content:
        "از صفحه ورود، «فراموشی رمز عبور» را انتخاب کنید و ایمیل خود را وارد نمایید. لینک بازیابی برای شما ارسال می‌شود.",
      categoryId: "security",
      categoryName: "امنیت",
      tags: ["رمز", "ورود"],
      authorId: "tugv0486c",
      authorName: "Admin User",
      createdAt: now,
      updatedAt: now,
      views: 120,
    },
    {
      id: "kb_4",
      title: "سطوح اولویت تیکت",
      summary: "تفاوت اولویت کم، متوسط، بالا و فوری",
      content:
        "- **کم**: درخواست‌های غیرضروری\n- **متوسط**: کارهای روزمره\n- **بالا**: اختلال در کار یک واحد\n- **فوری**: قطع سرویس حیاتی سازمان",
      categoryId: "guide",
      categoryName: "راهنما",
      tags: ["اولویت", "SLA"],
      authorId: "tugv0486c",
      authorName: "Admin User",
      createdAt: now,
      updatedAt: now,
      views: 55,
    },
  ];
}

function load(): KbArticle[] {
  const data = readJsonFile<KbArticle[]>(FILE, []);
  if (!data.length) {
    const s = seed();
    writeJsonFile(FILE, s);
    return s;
  }
  return data;
}

export const kbRepo = {
  list(search?: string) {
    let items = load();
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return items.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },
  get(id: string) {
    const a = load().find((x) => x.id === id);
    if (!a) return null;
    a.views += 1;
    const all = load().map((x) => (x.id === id ? a : x));
    writeJsonFile(FILE, all);
    return a;
  },
  create(input: Omit<KbArticle, "id" | "createdAt" | "updatedAt" | "views">) {
    const all = load();
    const now = new Date().toISOString();
    const rec: KbArticle = {
      ...input,
      id: uid("kb"),
      createdAt: now,
      updatedAt: now,
      views: 0,
    };
    all.unshift(rec);
    writeJsonFile(FILE, all);
    return rec;
  },
  categories() {
    const map = new Map<string, { id: string; name: string; count: number }>();
    for (const a of load()) {
      const cur = map.get(a.categoryId) || {
        id: a.categoryId,
        name: a.categoryName,
        count: 0,
      };
      cur.count += 1;
      map.set(a.categoryId, cur);
    }
    return Array.from(map.values());
  },
};
