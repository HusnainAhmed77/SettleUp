import { databases } from '@/lib/appwrite';
import { ID, Query, Permission, Role } from 'appwrite';
import { Group, User } from '@/lib/mockData';
import { Expense, UpcomingExpense } from '@/lib/split';

const DATABASE_ID = process.env.NEXT_PUBLIC_APP_DATABASE_ID!;
const GROUPS_COLLECTION_ID = 'groups';
const EXPENSES_COLLECTION_ID = 'expenses';
const UPCOMING_EXPENSES_COLLECTION_ID = 'upcomingExpenses';

// Helper to convert Group to Appwrite document
function groupToDocument(group: Group, userId: string, userName?: string, userEmail?: string, currency: string = 'USD') {
  return {
    name: group.name,
    description: group.description,
    userId: userId,
    members: JSON.stringify(group.members),
    creatorName: userName || '',
    creatorEmail: userEmail || '',
    adminUserId: userId,
    sharedWith: [], // Initialize empty array
    currency: currency, // Add currency field
  };
}

// Helper to convert Appwrite document to Group
function documentToGroup(doc: any): Group {
  // Parse members - they're stored as JSON array of user IDs or user objects
  let members: User[] = [];
  try {
    const parsed = JSON.parse(doc.members);
    // Check if members are already User objects or just IDs
    if (parsed.length > 0) {
      if (typeof parsed[0] === 'string') {
        // Members are stored as IDs - convert to User objects with placeholder data
        members = parsed.map((id: string) => ({
          id,
          name: `User ${id.substring(0, 8)}`, // Placeholder name
          email: `user-${id}@example.com`, // Placeholder email
        }));
      } else {
        // Members are already User objects
        members = parsed;
      }
    }
  } catch (error) {
    console.error('Error parsing members:', error);
    members = [];
  }

  return {
    id: doc.$id,
    name: doc.name,
    description: doc.description,
    userId: doc.userId, // Include the creator/admin userId
    members,
    expenses: [], // Expenses loaded separately
    createdAt: new Date(doc.$createdAt),
    currency: doc.currency || 'USD', // Include currency with default
  };
}

// Helper to convert Expense to Appwrite document
function expenseToDocument(expense: Expense, groupId: string, userId: string, payerName?: string, payerEmail?: string) {
  return {
    groupId: groupId,
    userId: userId,
    title: expense.title,
    amountCents: expense.amountCents,
    currency: expense.currency,
    payerId: expense.payerId,
    payerName: payerName || '', // Add payer name for readability
    payerEmail: payerEmail || '', // Add payer email for readability
    participants: JSON.stringify(expense.participants),
    splitType: expense.splitType,
    splits: JSON.stringify(expense.splits),
    payers: expense.payers ? JSON.stringify(expense.payers) : '',
    date: expense.date.toISOString(),
    isAdminSettlement: false, // Default to false
    adminNotes: null,
    settledBy: null,
  };
}

// Helper to convert Appwrite document to Expense
function documentToExpense(doc: any): Expense {
  return {
    id: doc.$id,
    title: doc.title,
    amountCents: doc.amountCents,
    currency: doc.currency,
    payerId: doc.payerId,
    participants: JSON.parse(doc.participants),
    splitType: doc.splitType,
    splits: JSON.parse(doc.splits),
    payers: doc.payers && doc.payers !== '' ? JSON.parse(doc.payers) : undefined,
    date: new Date(doc.date),
  };
}

// Groups API
export async function createGroup(
  name: string,
  description: string,
  members: User[],
  userId: string,
  userName?: string,
  userEmail?: string,
  currency: string = 'USD'
): Promise<Group> {
  const group: Group = {
    id: '', // Will be set by Appwrite
    name,
    description,
    members,
    expenses: [],
    createdAt: new Date(),
  };

  const doc = await databases.createDocument(
    DATABASE_ID,
    GROUPS_COLLECTION_ID,
    ID.unique(),
    groupToDocument(group, userId, userName, userEmail, currency),
    [
      Permission.read(Role.users()), // Any authenticated user can read
      Permission.update(Role.user(userId)),
      Permission.delete(Role.user(userId))
    ]
  );

  return documentToGroup(doc);
}

export async function getUserGroups(userId: string): Promise<Group[]> {
  try {
    console.log('🔍 Loading groups for user:', userId);
    
    // Get groups created by user
    const createdResponse = await databases.listDocuments(
      DATABASE_ID,
      GROUPS_COLLECTION_ID,
      [Query.equal('userId', userId)]
    );
    console.log('📁 Created groups:', createdResponse.documents.length);

    // Get groups shared with user (where user is in sharedWith array)
    const sharedResponse = await databases.listDocuments(
      DATABASE_ID,
      GROUPS_COLLECTION_ID,
      [Query.equal('sharedWith', userId)]
    );
    console.log('🤝 Shared groups:', sharedResponse.documents.length);

    // Combine and deduplicate
    const allDocs = [...createdResponse.documents, ...sharedResponse.documents];
    const uniqueDocs = Array.from(
      new Map(allDocs.map(doc => [doc.$id, doc])).values()
    );
    console.log('✅ Total unique groups:', uniqueDocs.length);

    const groups = uniqueDocs.map(documentToGroup);

    // Load expenses for each group
    for (const group of groups) {
      console.log(`💰 Loading expenses for group: ${group.name} (${group.id})`);
      group.expenses = await getGroupExpenses(group.id);
      console.log(`   Found ${group.expenses.length} expenses`);
    }

    return groups;
  } catch (error) {
    console.error('❌ Error fetching groups:', error);
    return [];
  }
}

export async function getGroup(groupId: string): Promise<Group | null> {
  try {
    const doc = await databases.getDocument(
      DATABASE_ID,
      GROUPS_COLLECTION_ID,
      groupId
    );

    const group = documentToGroup(doc);
    group.expenses = await getGroupExpenses(groupId);

    return group;
  } catch (error) {
    console.error('Error fetching group:', error);
    return null;
  }
}

export async function updateGroup(
  groupId: string,
  updates: Partial<Group>,
  userId: string
): Promise<void> {
  const updateData: any = {};

  if (updates.name) updateData.name = updates.name;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.members) updateData.members = JSON.stringify(updates.members);

  await databases.updateDocument(
    DATABASE_ID,
    GROUPS_COLLECTION_ID,
    groupId,
    updateData
  );
}

export async function deleteGroup(groupId: string): Promise<void> {
  // Delete all expenses in the group first
  const expenses = await getGroupExpenses(groupId);
  for (const expense of expenses) {
    await deleteExpense(expense.id);
  }

  // Delete the group
  await databases.deleteDocument(
    DATABASE_ID,
    GROUPS_COLLECTION_ID,
    groupId
  );
}

// Expenses API
export async function createExpense(
  groupId: string,
  expense: Expense,
  userId: string,
  payerName?: string,
  payerEmail?: string
): Promise<Expense> {
  const doc = await databases.createDocument(
    DATABASE_ID,
    EXPENSES_COLLECTION_ID,
    ID.unique(),
    expenseToDocument(expense, groupId, userId, payerName, payerEmail),
    [
      Permission.read(Role.users()), // Any authenticated user can read
      Permission.update(Role.user(userId)),
      Permission.delete(Role.user(userId))
    ]
  );

  return documentToExpense(doc);
}

export async function getGroupExpenses(groupId: string): Promise<Expense[]> {
  try {
    console.log('🔍 Querying expenses for groupId:', groupId);
    const response = await databases.listDocuments(
      DATABASE_ID,
      EXPENSES_COLLECTION_ID,
      [Query.equal('groupId', groupId), Query.orderDesc('date')]
    );
    console.log(`✅ Found ${response.documents.length} expenses for group ${groupId}`);
    return response.documents.map(documentToExpense);
  } catch (error) {
    console.error('❌ Error fetching expenses for group', groupId, ':', error);
    return [];
  }
}

export async function updateExpense(
  expenseId: string,
  updates: Partial<Expense>
): Promise<void> {
  const updateData: any = {};

  if (updates.title) updateData.title = updates.title;
  if (updates.amountCents !== undefined) updateData.amountCents = updates.amountCents;
  if (updates.splitType) updateData.splitType = updates.splitType;
  if (updates.splits) updateData.splits = JSON.stringify(updates.splits);

  await databases.updateDocument(
    DATABASE_ID,
    EXPENSES_COLLECTION_ID,
    expenseId,
    updateData
  );
}

export async function deleteExpense(expenseId: string): Promise<void> {
  await databases.deleteDocument(
    DATABASE_ID,
    EXPENSES_COLLECTION_ID,
    expenseId
  );
}



// Upcoming Expenses API
export async function createUpcomingExpense(
  upcoming: UpcomingExpense,
  userId: string
): Promise<UpcomingExpense> {
  const doc = await databases.createDocument(
    DATABASE_ID,
    UPCOMING_EXPENSES_COLLECTION_ID,
    ID.unique(),
    {
      groupId: upcoming.groupId,
      userId: userId,
      title: upcoming.title,
      amountCents: upcoming.amountCents,
      currency: upcoming.currency,
      targetDate: upcoming.targetDate.toISOString(),
      participants: JSON.stringify(upcoming.participants),
      splitType: upcoming.splitType,
      splits: JSON.stringify(upcoming.splits),
      notes: upcoming.notes,
      createdAt: upcoming.createdAt.toISOString(),
      updatedAt: upcoming.updatedAt.toISOString(),
    }
  );

  return {
    id: doc.$id,
    groupId: doc.groupId,
    createdBy: userId,
    title: doc.title,
    amountCents: doc.amountCents,
    currency: doc.currency,
    targetDate: new Date(doc.targetDate),
    participants: JSON.parse(doc.participants),
    splitType: doc.splitType,
    splits: JSON.parse(doc.splits),
    notes: doc.notes,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
  };
}

export async function getUserUpcomingExpenses(userId: string): Promise<UpcomingExpense[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      UPCOMING_EXPENSES_COLLECTION_ID,
      [Query.equal('userId', userId), Query.orderAsc('targetDate')]
    );

    return response.documents.map((doc) => ({
      id: doc.$id,
      groupId: doc.groupId,
      createdBy: doc.userId,
      title: doc.title,
      amountCents: doc.amountCents,
      currency: doc.currency,
      targetDate: new Date(doc.targetDate),
      participants: JSON.parse(doc.participants),
      splitType: doc.splitType,
      splits: JSON.parse(doc.splits),
      notes: doc.notes,
      createdAt: new Date(doc.createdAt),
      updatedAt: new Date(doc.updatedAt),
    }));
  } catch (error) {
    console.error('Error fetching upcoming expenses:', error);
    return [];
  }
}

export async function deleteUpcomingExpense(expenseId: string): Promise<void> {
  await databases.deleteDocument(
    DATABASE_ID,
    UPCOMING_EXPENSES_COLLECTION_ID,
    expenseId
  );
}
