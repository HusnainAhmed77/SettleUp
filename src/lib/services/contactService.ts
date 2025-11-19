import { databases, CMS_DATABASE_ID, APP_DATABASE_ID, CMS_COLLECTIONS, APP_COLLECTIONS, Query } from '../appwrite';
import { Permission, Role } from 'appwrite';

// TypeScript Interfaces
export interface ContactPageContent {
  heroTitle: string;
  heroDescription: string;
  email: string;
  phone: string;
  supportText: string;
}

export interface ContactFormData {
  fullName: string;
  company?: string;
  email: string;
  phone?: string;
  address?: string;
  message: string;
}

export interface ContactSubmission extends ContactFormData {
  $id: string;
  status: 'new' | 'in-progress' | 'resolved';
  submittedAt: string;
}

/**
 * Fetches contact page content from Appwrite CMS
 * @returns Promise with contact page content
 */
export async function getContactPageContent(): Promise<ContactPageContent> {
  try {
    const response = await databases.listDocuments(
      CMS_DATABASE_ID,
      CMS_COLLECTIONS.CONTACT_PAGE_CONTENT,
      [Query.limit(1)]
    );

    if (response.documents.length === 0) {
      throw new Error('No contact page content found');
    }

    const doc = response.documents[0];
    
    return {
      heroTitle: doc.heroTitle,
      heroDescription: doc.heroDescription,
      email: doc.email,
      phone: doc.phone,
      supportText: doc.supportText,
    };
  } catch (error) {
    console.error('Error fetching contact page content:', error);
    throw error;
  }
}

/**
 * Creates a new contact form submission in the database
 * @param data Contact form data
 * @returns Promise with the created submission
 */
export async function createContactSubmission(
  data: ContactFormData
): Promise<ContactSubmission> {
  try {
    const submissionData = {
      fullName: data.fullName,
      company: data.company || '',
      email: data.email,
      phone: data.phone || '',
      address: data.address || '',
      message: data.message,
      status: 'new' as const,
      submittedAt: new Date().toISOString(),
    };

    const response = await databases.createDocument(
      APP_DATABASE_ID,
      APP_COLLECTIONS.CONTACT_SUBMISSIONS,
      'unique()',
      submissionData,
      [
        // Allow guests to create contact submissions
        Permission.write(Role.guests()),
      ]
    );

    return {
      $id: response.$id,
      fullName: response.fullName,
      company: response.company,
      email: response.email,
      phone: response.phone,
      address: response.address,
      message: response.message,
      status: response.status,
      submittedAt: response.submittedAt,
    };
  } catch (error) {
    console.error('Error creating contact submission:', error);
    throw error;
  }
}
