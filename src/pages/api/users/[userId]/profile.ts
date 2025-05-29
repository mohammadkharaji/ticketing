// API route for getting a user profile
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
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId } = req.query;

  console.log(`Getting profile for user ID: ${userId}`);

  // For debugging, always return a profile regardless of user ID
  try {
    const users = loadUsersFromFile();
    const user = users.find((u: any) => u.id === userId);
    
    if (user) {
      // Map the user data to match UserProfile interface
      const userProfile = {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        roleId: user.role_id,
        departmentId: user.department_id,
        isActive: user.is_active,
      };

      console.log(`Returning profile for user: ${JSON.stringify(userProfile)}`);
      return res.status(200).json(userProfile);
    }
    
    // If no user with this ID, return a mock profile
    const mockProfile = {
      id: userId as string,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      roleId: 'admin',
      departmentId: null,
      isActive: true
    };
    
    console.log(`Returning mock profile: ${JSON.stringify(mockProfile)}`);
    return res.status(200).json(mockProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Internal server error', error: error?.toString() });
  }
}
