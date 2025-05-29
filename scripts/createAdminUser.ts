// This is a sample script to demonstrate how you might create an admin user via an API endpoint.
// You will need to adapt this script to your actual backend API implementation.

interface CreateAdminUserPayload {
  email: string;
  password: string; // In a real scenario, the backend should handle password hashing.
  firstName?: string;
  lastName?: string;
  roleId: string; // Assuming 'admin' is the roleId for administrators
}

async function createAdminUser(payload: CreateAdminUserPayload): Promise<any> {
  const apiEndpoint = 'http://localhost:3000/api/users'; // Replace with your actual user creation API endpoint

  try {
    console.log(`Attempting to create admin user: ${payload.email}`);
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary authentication headers if your API requires them for this operation
        // e.g., 'Authorization': 'Bearer YOUR_ADMIN_API_KEY_OR_TOKEN'
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        throw new Error(`API request failed with status: ${response.status} - ${response.statusText}`);
      }
      console.error('Error response from API:', errorData);
      throw new Error(errorData.message || `API request failed with status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Admin user created successfully:', result);
    return result;
  } catch (error: any) {
    console.error('Failed to create admin user:', error.message);
    throw error;
  }
}

// --- How to use this script ---
// 1. Ensure your backend has an API endpoint (e.g., POST /api/users or POST /api/admin/create-user)
//    that can create a new user and assign them an admin role.
// 2. Update the `apiEndpoint` variable above to match your actual API endpoint.
// 3. If your API requires authentication to create users, ensure you add the necessary
//    Authorization header in the `fetch` call.
// 4. You can run this script using Node.js with ts-node:
//    npx ts-node --project ../tsconfig.json c:\Users\Kharaji.M\Documents\ticketing\scripts\createAdminUser.ts
//    (Adjust the path to tsconfig.json if necessary)
// 5. Alternatively, compile it to JavaScript first (tsc) and then run with Node.

// Example usage (uncomment and modify to run):

async function main() {
  try {
    const newAdmin = await createAdminUser({
      email: 'admin@example.com',       // Replace with the desired admin email
      password: 'SecurePassword123!',  // Replace with a strong password
      firstName: 'Admin',
      lastName: 'User',
      roleId: 'admin'                   // Ensure this roleId corresponds to an admin role in your system
    });
    console.log('Script finished. New admin user details:', newAdmin);
  } catch (error) {
    console.error('Script failed to run:', error);
  }
}

main();


console.log('createAdminUser.ts script loaded. Uncomment the example usage (main function) and run it to create an admin user.');
console.log('IMPORTANT: This script assumes a backend API endpoint exists for user creation.');
console.log('Password handling: Ensure your backend securely hashes passwords. Do not store plain text passwords.');