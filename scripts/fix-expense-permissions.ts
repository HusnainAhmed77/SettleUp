/**
 * Migration script to fix permissions on existing expenses
 * Run this once to update all existing expenses to allow read access for all authenticated users
 * 
 * Usage: npx ts-node scripts/fix-expense-permissions.ts
 */

import { Client, Databases, Permission, Role, Query } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const databases = new Databases(client);
const DATABASE_ID = process.env.NEXT_PUBLIC_APP_DATABASE_ID!;
const EXPENSES_COLLECTION_ID = 'expenses';
const GROUPS_COLLECTION_ID = 'groups';

async function fixExpensePermissions() {
  try {
    console.log('Fetching all expenses...');
    
    // Get all expenses
    const response = await databases.listDocuments(
      DATABASE_ID,
      EXPENSES_COLLECTION_ID,
      [Query.limit(1000)] // Adjust if you have more than 1000 expenses
    );

    console.log(`Found ${response.documents.length} expenses`);

    // Update each expense
    for (const expense of response.documents) {
      console.log(`Updating expense ${expense.$id}...`);
      
      // Get current permissions
      const currentPermissions = expense.$permissions || [];
      
      // Check if users read permission already exists
      const hasUsersRead = currentPermissions.some((p: string) => p.includes('read("users")'));
      
      if (!hasUsersRead) {
        // Add read permission for all authenticated users
        const newPermissions = [
          Permission.read(Role.users()),
          ...currentPermissions.filter((p: string) => !p.includes('read('))
        ];
        
        await databases.updateDocument(
          DATABASE_ID,
          EXPENSES_COLLECTION_ID,
          expense.$id,
          {},
          newPermissions
        );
        
        console.log(`✓ Updated expense ${expense.$id}`);
      } else {
        console.log(`- Expense ${expense.$id} already has correct permissions`);
      }
    }

    console.log('\n✓ All expenses updated successfully!');
  } catch (error) {
    console.error('Error fixing expense permissions:', error);
  }
}

async function fixGroupPermissions() {
  try {
    console.log('\nFetching all groups...');
    
    // Get all groups
    const response = await databases.listDocuments(
      DATABASE_ID,
      GROUPS_COLLECTION_ID,
      [Query.limit(1000)]
    );

    console.log(`Found ${response.documents.length} groups`);

    // Update each group
    for (const group of response.documents) {
      console.log(`Updating group ${group.$id}...`);
      
      // Get current permissions
      const currentPermissions = group.$permissions || [];
      
      // Check if users read permission already exists
      const hasUsersRead = currentPermissions.some((p: string) => p.includes('read("users")'));
      
      if (!hasUsersRead) {
        // Add read permission for all authenticated users
        const newPermissions = [
          Permission.read(Role.users()),
          ...currentPermissions.filter((p: string) => !p.includes('read('))
        ];
        
        await databases.updateDocument(
          DATABASE_ID,
          GROUPS_COLLECTION_ID,
          group.$id,
          {},
          newPermissions
        );
        
        console.log(`✓ Updated group ${group.$id}`);
      } else {
        console.log(`- Group ${group.$id} already has correct permissions`);
      }
    }

    console.log('\n✓ All groups updated successfully!');
  } catch (error) {
    console.error('Error fixing group permissions:', error);
  }
}

// Run both migrations
async function main() {
  console.log('Starting permission migration...\n');
  await fixGroupPermissions();
  await fixExpensePermissions();
  console.log('\n✓ Migration complete!');
}

main();
