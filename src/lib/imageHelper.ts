/**
 * Helper function to get image URLs
 * Supports both Appwrite Storage file IDs and direct URLs
 */

export const getImageUrl = (imageUrl: string | undefined): string => {
  if (!imageUrl) return '';
  
  // If it's already a full URL or path, return as is
  if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) {
    return imageUrl;
  }
  
  // If it's an Appwrite file ID (no slashes), construct the URL
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;
  
  if (endpoint && projectId && bucketId) {
    return `${endpoint}/storage/buckets/${bucketId}/files/${imageUrl}/view?project=${projectId}`;
  }
  
  // Fallback to empty string
  return '';
};
