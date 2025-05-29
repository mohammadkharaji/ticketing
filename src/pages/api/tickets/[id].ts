import type { NextApiRequest, NextApiResponse } from 'next';
import ticketService from '@/services/ticketService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'شناسه تیکت نامعتبر است.' });
  }

  switch (req.method) {
    case 'GET': {
      // دریافت اطلاعات یک تیکت خاص
      const ticket = await ticketService.getTicketById(id);
      if (!ticket) return res.status(404).json({ message: 'تیکت پیدا نشد.' });
      return res.status(200).json(ticket);
    }
    case 'PUT': {
      // ویرایش تیکت
      const updates = req.body;
      const result = await ticketService.updateTicket(id, updates);
      return res.status(result ? 200 : 400).json({ success: result });
    }
    case 'DELETE': {
      // حذف تیکت
      const result = await ticketService.deleteTicket(id);
      return res.status(result ? 200 : 400).json({ success: result });
    }
    default:
      return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
