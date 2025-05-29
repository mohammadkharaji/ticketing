// مدل‌های اعتبارسنجی Zod برای هر موجودیت
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  displayName: z.string(),
  email: z.string().email(),
  departmentId: z.string(),
  role: z.enum(['user', 'expert', 'manager', 'admin']),
  isActive: z.boolean(),
  settings: z.object({
    theme: z.enum(['light', 'dark']),
    notifications: z.boolean(),
  }).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const DepartmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  managerId: z.string().optional(),
  expertIds: z.array(z.string()).optional(),
  settings: z.object({
    notificationEmails: z.array(z.string().email()),
  }).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const TicketSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['pending', 'in_progress', 'answered', 'closed']),
  creatorId: z.string(),
  departmentId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const TicketMessageSchema = z.object({
  id: z.string(),
  ticketId: z.string(),
  senderId: z.string(),
  message: z.string(),
  createdAt: z.string(),
});

export const TicketAttachmentSchema = z.object({
  id: z.string(),
  ticketId: z.string(),
  fileName: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  fileUrl: z.string().url(),
  uploadedAt: z.string(),
});

export const TicketStatusHistorySchema = z.object({
  id: z.string(),
  ticketId: z.string(),
  oldStatus: z.enum(['pending', 'in_progress', 'answered', 'closed']),
  newStatus: z.enum(['pending', 'in_progress', 'answered', 'closed']),
  changedBy: z.string(),
  changedAt: z.string(),
});

export const NotificationSchema = z.object({
  id: z.string(),
  type: z.enum(['system', 'email']),
  message: z.string(),
  isRead: z.boolean(),
  userId: z.string(),
  createdAt: z.string(),
});
