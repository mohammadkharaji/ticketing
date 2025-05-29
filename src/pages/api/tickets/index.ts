import type { NextApiRequest, NextApiResponse } from 'next';
import ticketService from '@/services/ticketService';
import { format } from "date-fns-jalali";
import fs from "fs";
import path from "path";

// Branch code mapping for Tehran and other cities
const BRANCH_CODE_MAP: Record<string, string> = {
  // تهران
  "211": "21", // مرکز
  "212": "21", // جنوب
  "214": "21", // شرق
  "215": "21", // غرب
  "216": "21", // حومه
  // خراسان رضوی
  "301": "51", // مشهد
  // اصفهان
  "302": "31", // اصفهان
  // فارس
  "303": "71", // شیراز
  // آذربایجان شرقی
  "304": "41", // تبریز
  // خوزستان
  "305": "61", // اهواز
  // البرز
  "306": "26", // کرج
  // قم
  "307": "25", // قم
  // گیلان
  "308": "13", // رشت
  // یزد
  "309": "35", // یزد
  // کرمان
  "310": "34", // کرمان
  // آذربایجان غربی
  "311": "44", // ارومیه
  // سیستان و بلوچستان
  "312": "54", // زاهدان
  // کردستان
  "313": "87", // سنندج
  // هرمزگان
  "314": "76", // بندرعباس
  // همدان
  "315": "81", // همدان
  // مازندران
  "316": "11", // ساری
  // گلستان
  "317": "17", // گرگان
  // زنجان
  "318": "24", // زنجان
  // لرستان
  "319": "66", // خرم‌آباد
  // خراسان جنوبی
  "320": "56", // بیرجند
  // مرکزی
  "321": "86", // اراک
  // قزوین
  "322": "28", // قزوین
  // چهارمحال و بختیاری
  "323": "38", // شهرکرد
  // اردبیل
  "324": "45", // اردبیل
  // بوشهر
  "325": "77", // بوشهر
  // ایلام
  "326": "84", // ایلام
  // کهگیلویه و بویراحمد
  "327": "74", // یاسوج
  // خراسان شمالی
  "328": "58", // بجنورد
  // سمنان
  "329": "23", // سمنان
  // شهرهای پرجمعیت دیگر (نمونه)
  "340": "61", // آبادان (خوزستان)
  "341": "31", // کاشان (اصفهان)
  "342": "41", // مراغه (آذربایجان شرقی)
  "343": "11", // بابل (مازندران)
  "344": "51", // سبزوار (خراسان رضوی)
  "345": "31", // نجف‌آباد (اصفهان)
  "346": "81", // ملایر (همدان)
  "347": "13", // بندر انزلی (گیلان)
  "348": "31", // خمینی‌شهر (اصفهان)
  "349": "21", // ورامین (تهران)
  "350": "44", // مهاباد (آذربایجان غربی)
  // ... شهرهای دیگر به همین صورت قابل افزودن است ...
};

async function generateTicketNumber(branchId: string) {
  // 1. Map branchId to code
  const branchCode = BRANCH_CODE_MAP[branchId] || branchId || "000";
  // 2. Get Jalali date (yyyyMMdd)
  const now = new Date();
  const shamsiDate = format(now, "yyyyMMdd");
  // 3. Get all tickets for this branch (could be optimized in real DB)
  const { tickets } = await ticketService.getTickets({ branchId });
  // 4. Filter tickets for today (Jalali date)
  const todayTickets = tickets.filter(t => {
    if (!t.createdAt) return false;
    try {
      const ticketDate = format(new Date(t.createdAt), "yyyyMMdd");
      return ticketDate === shamsiDate;
    } catch {
      return false;
    }
  });
  // 5. Find max ticket number for today/branch
  let maxNo = 0;
  todayTickets.forEach(t => {
    const num = t.ticketNumber?.toString().slice(-2);
    if (num && !isNaN(Number(num))) {
      maxNo = Math.max(maxNo, Number(num));
    }
  });
  const nextNo = (maxNo + 1).toString().padStart(2, "0");
  // 6. Build code
  return `${branchCode}${shamsiDate}${nextNo}`;
}

async function generateUniqueTicketNumber(branchId: string) {
  let tryCount = 0;
  let ticketNumber;
  let isUnique = false;
  while (!isUnique && tryCount < 5) {
    ticketNumber = await generateTicketNumber(branchId);
    // بررسی یکتایی (گزینه 2)
    const { tickets } = await ticketService.getTickets({ ticketNumber });
    if (!tickets || tickets.length === 0) {
      isUnique = true;
    } else {
      // ثبت لاگ (گزینه 4)
      try {
        const logPath = path.join(process.cwd(), "logs", "ticket-duplicate.log");
        fs.appendFileSync(logPath, `[${new Date().toISOString()}] Duplicate ticketNumber: ${ticketNumber}\n`);
      } catch {}
      tryCount++;
    }
  }
  if (!isUnique) {
    // ثبت لاگ خطا
    try {
      const logPath = path.join(process.cwd(), "logs", "ticket-duplicate.log");
      fs.appendFileSync(logPath, `[${new Date().toISOString()}] ERROR: Could not generate unique ticketNumber for branch ${branchId}\n`);
    } catch {}
  }
  return ticketNumber;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      // لیست همه تیکت‌ها
      const tickets = await ticketService.getTickets();
      return res.status(200).json(tickets);
    }
    case 'POST': {
      // ثبت تیکت جدید
      const ticketData = req.body;
      // Generate unique ticket number with check (گزینه 2 و 4)
      ticketData.ticketNumber = await generateUniqueTicketNumber(ticketData.branchId);
      const newTicket = await ticketService.createTicket(ticketData);
      return res.status(201).json(newTicket);
    }
    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
