// مدل کاربر
export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  departmentId: string;
  role: 'user' | 'expert' | 'manager' | 'admin';
  isActive: boolean;
  settings?: UserSettings;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
}

// مدل دپارتمان
export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  expertIds?: string[];
  settings?: DepartmentSettings;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentSettings {
  notificationEmails: string[];
}

// مدل تیکت
export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: TicketStatus;
  creatorId: string;
  departmentId: string;
  createdAt: string;
  updatedAt: string;
}

export type TicketStatus = 'pending' | 'in_progress' | 'answered' | 'closed';

// مدل پیام تیکت
export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  message: string;
  createdAt: string;
}

// مدل پیوست تیکت
export interface TicketAttachment {
  id: string;
  ticketId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  uploadedAt: string;
}

// مدل تاریخچه وضعیت تیکت
export interface TicketStatusHistory {
  id: string;
  ticketId: string;
  oldStatus: TicketStatus;
  newStatus: TicketStatus;
  changedBy: string;
  changedAt: string;
}

// مدل اعلان
export interface Notification {
  id: string;
  type: 'system' | 'email';
  message: string;
  isRead: boolean;
  userId: string;
  createdAt: string;
}
