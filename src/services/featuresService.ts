import { databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';

export interface Feature {
  $id: string;
  section_id: string;
  title?: string;
  description?: string;
  detailed_description?: string;
  icon?: string;
  color?: string;
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
  },

  async getHero(): Promise<Feature | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.FEATURES_PAGE,
        [
          Query.equal('section_id', 'hero'),
          Query.equal('is_active', true)
        ]
      );
      return (response.documents[0] as unknown as Feature) || null;
    } catch (error) {
      console.error('Error fetching hero:', error);
      return null;
    }
  },

  async getCTA(): Promise<Feature | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.FEATURES_PAGE,
        [
          Query.equal('section_id', 'cta'),
          Query.equal('is_active', true)
        ]
      );
      return (response.documents[0] as unknown as Feature) || null;
    } catch (error) {
      console.error('Error fetching CTA:', error);
      return null;
    }
  },

  async getFeatureCards(): Promise<Feature[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.FEATURES_PAGE,
        [
          Query.equal('is_active', true),
          Query.orderAsc('order')
        ]
      );
      // Filter out hero and cta
      const features = response.documents as unknown as Feature[];
      return features.filter(f => f.section_id !== 'hero' && f.section_id !== 'cta');
    } catch (error) {
      console.error('Error fetching feature cards:', error);
      return [];
    }
  }
};
