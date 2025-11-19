import { databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';

export interface NavLink {
  $id: string;
  label: string;
  href: string;
  order: number;
  is_active: boolean;
}

export interface NavButton {
  $id: string;
  button_type: 'login' | 'signup';
  label: string;
  href: string;
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
  },

  async getButtons(): Promise<{ login?: NavButton; signup?: NavButton }> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.NAVBAR_BUTTONS,
        [Query.equal('is_active', true)]
      );
      
      const buttons = response.documents as unknown as NavButton[];
      const login = buttons.find(b => b.button_type === 'login');
      const signup = buttons.find(b => b.button_type === 'signup');
      
      return { login, signup };
    } catch (error) {
      console.error('Error fetching navbar buttons:', error);
      return {};
    }
  }
};
