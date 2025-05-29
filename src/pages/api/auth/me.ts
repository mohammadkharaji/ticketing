// Mock API route for /api/auth/me
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // For debugging, always return a mock user without checking auth
  if (req.method === 'GET') {
    console.log('API: /auth/me endpoint called');
    
    // Read the first user from the users.json file
    const users = loadUsersFromFile();
    if (users.length > 0) {
      const firstUser = users[0];
      // Map to the expected format
      const user = {
        id: firstUser.id,
        firstName: firstUser.first_name,
        lastName: firstUser.last_name,
        email: firstUser.email,
        roleId: firstUser.role_id,
        departmentId: firstUser.department_id,
        departmentSectionId: null,
        branchId: null,
        branchSectionId: null,
        isActive: firstUser.is_active
      };
      console.log('API: Returning user from users.json:', user);
      return res.status(200).json(user);
    }
    
    // Fallback mock user if users.json doesn't have any users
    const mockUser = {
      id: 'tugv0486c',
      firstName: 'Test',
      lastName: 'User',
      email: 'admin@example.com',
      roleId: 'admin',
      departmentId: null,
      departmentSectionId: null,
      branchId: null,
      branchSectionId: null,
      isActive: true
    };
    console.log('API: Returning fallback mock user:', mockUser);
    return res.status(200).json(mockUser);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
