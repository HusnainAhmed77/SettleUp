import { databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';

export interface Feature {
  $id: string;
  section_id: string;
  title?: string;
  description?: string;
  icon_name?: string;
  image_url?: string;
  order: number;
  is_active: boolean;
}

export const featuresService = {
  async getAllFeatures(): Promise<Feature[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.FEATURES_PAGE,
        [
          Query.equal('is_active', true),
          Query.orderAsc('order')
        ]
      );
      return response.documents as unknown as Feature[];
    } catch (error) {
      console.error('Error fetching features:', error);
      return [];
    }
  }
};
