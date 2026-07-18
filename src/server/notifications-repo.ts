import { readJsonFile, writeJsonFile, uid } from "./json-store";

export type NotificationRecord = {
  id: string;
  userId: string;
  type: string;
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
};

const FILE = "notifications.json";

function load(): NotificationRecord[] {
  return readJsonFile<NotificationRecord[]>(FILE, []);
}

export const notificationsRepo = {
  listForUser(userId: string) {
    return load()
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  create(input: Omit<NotificationRecord, "id" | "createdAt" | "isRead"> & { isRead?: boolean }) {
    const all = load();
    const rec: NotificationRecord = {
      id: uid("ntf"),
      userId: input.userId,
      type: input.type,
      message: input.message,
      link: input.link ?? null,
      isRead: input.isRead ?? false,
      createdAt: new Date().toISOString(),
    };
    all.unshift(rec);
    writeJsonFile(FILE, all);
    return rec;
  },
  markRead(userId: string, ids?: string[]) {
    const all = load();
    let changed = false;
    for (const n of all) {
      if (n.userId !== userId) continue;
      if (!ids || ids.length === 0 || ids.includes(n.id)) {
        if (!n.isRead) {
          n.isRead = true;
          changed = true;
        }
      }
    }
    if (changed) writeJsonFile(FILE, all);
  },
};
