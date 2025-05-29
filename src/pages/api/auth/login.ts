// API route for login with LDAP (Active Directory)
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'users.json');

function loadUsersFromFile() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error loading users from file:', e);
  }
  return [];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  const { email, username, password } = req.body;
  const userField = email || username;
  if (!userField || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  try {
    const users = loadUsersFromFile();
    const user = users.find((u: any) => u.email === userField && u.password === password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Set a mock session cookie for development (cross-origin compatible)
    res.setHeader('Set-Cookie', `auth_token=devtoken; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=86400`);
    // حذف پسورد از خروجی
    const { password: _pw, ...userWithoutPassword } = user;
    return res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error?.toString() });
  }
}
