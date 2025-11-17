import { databases, DATABASE_ID, COLLECTIONS, Query } from '@/lib/appwrite';

export interface BlogPost {
  $id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  category?: string;
  author?: string;
  image_url?: string;
  published_date?: string;
  is_published: boolean;
  order: number;
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
  }
};
