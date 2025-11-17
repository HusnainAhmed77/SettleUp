import { databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';

export interface AboutSection {
  $id: string;
  section_id: string;
  heading?: string;
  subheading?: string;
  content?: string;
  image_url?: string;
  order: number;
  is_active: boolean;
}

export const aboutService = {
  async getAllSections(): Promise<AboutSection[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ABOUT_PAGE,
        [
          Query.equal('is_active', true),
          Query.orderAsc('order')
        ]
      );
      return response.documents as unknown as AboutSection[];
    } catch (error) {
      console.error('Error fetching about sections:', error);
      return [];
    }
  },

  async getSectionById(sectionId: string): Promise<AboutSection | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ABOUT_PAGE,
        [
          Query.equal('section_id', sectionId),
          Query.equal('is_active', true)
        ]
      );
      return (response.documents[0] as unknown as AboutSection) || null;
    } catch (error) {
      console.error(`Error fetching section ${sectionId}:`, error);
      return null;
    }
  }
};
