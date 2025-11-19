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

export interface AboutValue {
  $id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  is_active: boolean;
}

export interface TeamMember {
  $id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  twitter?: string;
  linkedin?: string;
  email?: string;
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
  },

  async getValues(): Promise<AboutValue[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ABOUT_VALUES,
        [
          Query.equal('is_active', true),
          Query.orderAsc('order')
        ]
      );
      return response.documents as unknown as AboutValue[];
    } catch (error) {
      console.error('Error fetching about values:', error);
      return [];
    }
  },

  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ABOUT_TEAM,
        [
          Query.equal('is_active', true),
          Query.orderAsc('order')
        ]
      );
      return response.documents as unknown as TeamMember[];
    } catch (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
  }
};
