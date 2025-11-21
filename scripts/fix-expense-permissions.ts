/**
 * Migration script to fix permissions on existing expenses
 * Run this once to update all existing expenses to allow read access for all authenticated users
 * 
 * Usage: npx tsx scripts/fix-expense-permissions.ts
 */

import { Client, Databases, Permission, Role, Query } from 'appwrite';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.NEXT_PUBLIC_APP_DATABASE_ID;
const API_KEY = process.env.APPWRITE_API_KEY;

if (!ENDPOINT || !PROJECT_ID || !DATABASE_ID) {
  console.error('❌ Missing required environment variables!');
  console.error('Make sure .env.local has:');
  console.error('  - NEXT_PUBLIC_APPWRITE_ENDPOINT');
  console.error('  - NEXT_PUBLIC_APPWRITE_PROJECT_ID');
  console.error('  - NEXT_PUBLIC_APP_DATABASE_ID');
  console.error('  - APPWRITE_API_KEY (get this from Appwrite Console → Settings → API Keys)');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID);

// Use API key if available (for admin operations)
if (API_KEY) {
  client.setKey(API_KEY);
  console.log('✓ Using API key for admin access\n');
} else {
  console.warn('⚠️  No API key found. This script requires admin access.');
  console.warn('   Create an API key in Appwrite Console → Settings → API Keys');
  console.warn('   Add it to .env.local as APPWRITE_API_KEY=your_key_here\n');
  process.exit(1);
}

const databases = new Databases(client);
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
