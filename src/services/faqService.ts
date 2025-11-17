import { databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';

export interface FAQ {
  $id: string;
  question: string;
  answer: string;
  category?: string;
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
      return response.documents as unknown as FAQ[];
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      return [];
    }
  }
};
