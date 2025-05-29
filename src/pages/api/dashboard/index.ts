// API route for dashboard analytics (statistics, charts)
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // TODO: آمار و اطلاعات داشبورد
    return res.status(200).json({ message: 'آمار داشبورد' });
  }
  return res.status(405).json({ message: 'Method Not Allowed' });
}
