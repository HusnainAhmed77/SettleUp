import { databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';

export interface FooterItem {
  $id: string;
  type: 'section' | 'link' | 'social' | 'setting';
  
  // For sections
  section_id?: string;
  heading?: string;
  
  // For links
  link_text?: string;
  link_url?: string;
  is_external?: boolean;
  
  // For social
  platform?: string;
  url?: string;
  
  // For settings
  setting_key?: string;
  setting_value?: string;
  
  order: number;
  is_active: boolean;
}

export interface FooterSection {
  $id: string;
  section_id: string;
  heading: string;
  order: number;
  is_active: boolean;
}

export interface FooterLink {
  $id: string;
  section_id: string;
  link_text: string;
  link_url: string;
  is_external: boolean;
  order: number;
  is_active: boolean;
}

export interface SocialMediaLink {
  $id: string;
  platform: string;
  url: string;
  order: number;
  is_active: boolean;
}

export const footerService = {
  async getSections(): Promise<FooterSection[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.FOOTER,
        [
          Query.equal('type', 'section'),
          Query.equal('is_active', true),
          Query.orderAsc('order')
        ]
      );
      return response.documents as unknown as FooterSection[];
    } catch (error) {
      console.error('Error fetching footer sections:', error);
      return [];
    }
  },

  async getLinks(): Promise<FooterLink[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.FOOTER,
        [
          Query.equal('type', 'link'),
          Query.equal('is_active', true),
          Query.orderAsc('order')
        ]
      );
      return response.documents as unknown as FooterLink[];
    } catch (error) {
      console.error('Error fetching footer links:', error);
      return [];
    }
  },

  async getSocialMedia(): Promise<SocialMediaLink[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.FOOTER,
        [
          Query.equal('type', 'social'),
          Query.equal('is_active', true),
          Query.orderAsc('order')
        ]
      );
      return response.documents as unknown as SocialMediaLink[];
    } catch (error) {
      console.error('Error fetching social media links:', error);
      return [];
    }
  },

  async getSettings(): Promise<Record<string, string>> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.FOOTER,
        [
          Query.equal('type', 'setting'),
          Query.equal('is_active', true)
        ]
      );
      
      const settings: Record<string, string> = {};
      (response.documents as unknown as FooterItem[]).forEach(doc => {
        if (doc.setting_key && doc.setting_value) {
          settings[doc.setting_key] = doc.setting_value;
        }
      });
      
      return settings;
    } catch (error) {
      console.error('Error fetching footer settings:', error);
      return {};
    }
  }
};
