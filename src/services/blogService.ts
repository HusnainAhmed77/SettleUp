import { databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';

export interface BlogPost {
  $id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  category?: string;
  author?: string;
  author_bio?: string;
  image_url?: string;
  published_date?: string;
  read_time?: string;
  tags?: string[];
  is_published: boolean;
  order: number;
}

export interface BlogCategory {
  $id: string;
  name: string;
  slug: string;
  order: number;
  is_active: boolean;
}

export const blogService = {
  async getAllPosts(): Promise<BlogPost[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BLOG_POSTS,
        [
          Query.equal('is_published', true),
          Query.orderDesc('order')
        ]
      );
      return response.documents as unknown as BlogPost[];
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BLOG_POSTS,
        [
          Query.equal('slug', slug),
          Query.equal('is_published', true)
        ]
      );
      return (response.documents[0] as unknown as BlogPost) || null;
    } catch (error) {
      console.error(`Error fetching post ${slug}:`, error);
      return null;
    }
  },

  async getCategories(): Promise<BlogCategory[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BLOG_CATEGORIES,
        [
          Query.equal('is_active', true),
          Query.orderAsc('order')
        ]
      );
      return response.documents as unknown as BlogCategory[];
    } catch (error) {
      console.error('Error fetching blog categories:', error);
      return [];
    }
  }
};
