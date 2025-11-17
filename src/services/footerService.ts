import { databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';

export interface FooterSection {
  $id: string;
  section_id: string;
  heading?: string;
  content?: string;
  link_text?: string;
  link_url?: string;
  order: number;
  is_active: boolean;
}

export const footerService = {
  async getAllSections(): Promise<FooterSection[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.FOOTER,
        [
          Query.equal('is_active', true),
          Query.orderAsc('order')
        ]
      );
      return response.documents as unknown as FooterSection[];
    } catch (error) {
      console.error('Error fetching footer sections:', error);
      return [];
    }
  }
};
