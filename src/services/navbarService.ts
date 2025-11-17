import { databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';

export interface NavLink {
  $id: string;
  label: string;
  href: string;
  order: number;
  is_active: boolean;
}

export const navbarService = {
  async getAllLinks(): Promise<NavLink[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.NAVBAR,
        [
          Query.equal('is_active', true),
          Query.orderAsc('order')
        ]
      );
      return response.documents as unknown as NavLink[];
    } catch (error) {
      console.error('Error fetching navbar links:', error);
      return [];
    }
  }
};
