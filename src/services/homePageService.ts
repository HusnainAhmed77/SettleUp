import { databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';

export interface HomePageSection {
  $id: string;
  section_id: string;
  heading?: string;
  subheading?: string;
  content?: string;
  button_text?: string;
  button_link?: string;
  image_url?: string;
  title?: string;
  description?: string;
  icon_name?: string;
  author?: string;
  author_role?: string;
  rating?: number;
  link_url?: string;
  link_text?: string;
  background_color?: string;
  border_color?: string;
  order: number;
  is_active: boolean;
}


export const homePageService = {
  // Get all sections for home page
  async getAllSections(): Promise<HomePageSection[]> {
    try {
      console.log('Fetching from Appwrite...');
      console.log('Database ID:', DATABASE_ID);
      console.log('Collection:', COLLECTIONS.HOME_PAGE);
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.HOME_PAGE,
        [
          Query.equal('is_active', true),
          Query.orderAsc('order')
        ]
      );
      
      console.log('Success! Got documents:', response.documents.length);
      return response.documents as unknown as HomePageSection[];
    } catch (error: any) {
      console.error('Error fetching home page sections:', error);
      console.error('Error details:', error.message, error.code, error.type);
      return [];
    }
  },

  // Get a specific section by section_id
  async getSectionById(sectionId: string): Promise<HomePageSection | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.HOME_PAGE,
        [
          Query.equal('section_id', sectionId),
          Query.equal('is_active', true)
        ]
      );
      return (response.documents[0] as unknown as HomePageSection) || null;
    } catch (error) {
      console.error(`Error fetching section ${sectionId}:`, error);
      return null;
    }
  }
};