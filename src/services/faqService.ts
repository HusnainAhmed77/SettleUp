import { databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';

export interface FAQ {
  $id: string;
  type?: string;
  question?: string;
  answer?: string;
  title?: string;
  description?: string;
  order: number;
  is_active: boolean;
}

export const faqService = {
  async getAllFAQs(): Promise<FAQ[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.FAQ_PAGE,
        [
          Query.equal('is_active', true),
          Query.orderAsc('order')
        ]
      );
      // Filter out hero and cta, return only FAQ items
      const items = response.documents as unknown as FAQ[];
      return items.filter(item => !item.type || item.type === 'faq');
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      return [];
    }
  },

  async getHero(): Promise<FAQ | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.FAQ_PAGE,
        [
          Query.equal('type', 'hero'),
          Query.equal('is_active', true)
        ]
      );
      return (response.documents[0] as unknown as FAQ) || null;
    } catch (error) {
      console.error('Error fetching FAQ hero:', error);
      return null;
    }
  },

  async getCTA(): Promise<FAQ | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.FAQ_PAGE,
        [
          Query.equal('type', 'cta'),
          Query.equal('is_active', true)
        ]
      );
      return (response.documents[0] as unknown as FAQ) || null;
    } catch (error) {
      console.error('Error fetching FAQ CTA:', error);
      return null;
    }
  }
};
