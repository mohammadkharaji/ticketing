import { readJsonFile, writeJsonFile, uid } from "./json-store";

export type DepartmentRecord = {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
};

const FILE = "departments.json";

function seed(): DepartmentRecord[] {
  const now = new Date().toISOString();
  return [
    { id: "it", name: "فناوری اطلاعات", description: "زیرساخت، شبکه و نرم‌افزار", createdAt: now, updatedAt: now },
    { id: "hr", name: "منابع انسانی", description: "پرسنلی و اداری", createdAt: now, updatedAt: now },
    { id: "finance", name: "مالی", description: "حسابداری و خزانه", createdAt: now, updatedAt: now },
    { id: "sales", name: "فروش", description: "فروش و بازاریابی", createdAt: now, updatedAt: now },
    { id: "support", name: "پشتیبانی", description: "پشتیبانی شعب", createdAt: now, updatedAt: now },
  ];
}

function load(): DepartmentRecord[] {
  const data = readJsonFile<DepartmentRecord[]>(FILE, []);
  if (!data.length) {
    const s = seed();
    writeJsonFile(FILE, s);
    return s;
  }
  return data;
}

export const departmentRepo = {
  list(): DepartmentRecord[] {
    return load();
  },
  getById(id: string): DepartmentRecord | null {
    return load().find((d) => d.id === id) || null;
  },
  create(input: { name: string; description?: string | null }): DepartmentRecord {
    const all = load();
    const now = new Date().toISOString();
    const rec: DepartmentRecord = {
      id: uid("dept"),
      name: input.name,
      description: input.description ?? null,
      createdAt: now,
      updatedAt: now,
    };
    all.push(rec);
    writeJsonFile(FILE, all);
    return rec;
  },
  update(id: string, updates: Partial<DepartmentRecord>): DepartmentRecord | null {
    const all = load();
    const idx = all.findIndex((d) => d.id === id);
    if (idx < 0) return null;
    all[idx] = { ...all[idx], ...updates, id, updatedAt: new Date().toISOString() };
    writeJsonFile(FILE, all);
    return all[idx];
  },
  remove(id: string): boolean {
    const all = load();
    const next = all.filter((d) => d.id !== id);
    if (next.length === all.length) return false;
    writeJsonFile(FILE, next);
    return true;
  },
};
