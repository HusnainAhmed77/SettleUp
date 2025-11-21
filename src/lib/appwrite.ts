import { Client, Databases, Storage, Account, Query, ID } from 'appwrite'

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'dummy-project-id');

// Configure client for better Safari compatibility
if (typeof window !== 'undefined') {
    // Ensure cookies are set with SameSite=None for OAuth
    // This helps with Safari's third-party cookie restrictions
    client.headers['X-Fallback-Cookies'] = 'true';
}

export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);

export { Query, ID };

// Database IDs
export const CMS_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!; // settleup_cms
export const APP_DATABASE_ID = '691c3c350001948e8960'; // settleup_Data

// Legacy export for backward compatibility
export const DATABASE_ID = CMS_DATABASE_ID;

// CMS Collections (in settleup_cms database)
export const CMS_COLLECTIONS = {
    HOME_PAGE: 'home_page',
    ABOUT_PAGE: 'about_page',
    ABOUT_VALUES: 'about_values',
    ABOUT_TEAM: 'about_team',
    FEATURES_PAGE: 'features_page',
    FAQ_PAGE: 'faq_page',
    BLOG_POSTS: 'blog_posts',
    BLOG_CATEGORIES: 'blog_categories',
    CONTACT_PAGE: 'contact_page',
    AUTH_PAGE: 'auth_page',
    NAVBAR: 'navbar',
    NAVBAR_BUTTONS: 'navbar_buttons',
    FOOTER: 'footer',
    CONTACT_PAGE_CONTENT: 'contact_page_content',
};

// App Collections (in settleup_Data database)
export const APP_COLLECTIONS = {
    GROUPS: 'groups',
    EXPENSES: 'expenses',
    EXPENSES_DATA: 'expenses_data', // JSON-based group data
    MEMBER_NAMES: 'member_names',
    USER_PROFILES: 'userprofiles',
    CONTACT_SUBMISSIONS: 'contact_submissions',
    ADMIN_SETTLEMENTS: 'admin_settlements',
    FRIENDS: 'friends',
};

// Legacy export for backward compatibility
export const COLLECTIONS = {
    ...CMS_COLLECTIONS,
    ...APP_COLLECTIONS,
};

// Storage Buckets
export const STORAGE_BUCKETS = {
    PROFILE_PICTURES: 'profile_pictures',
};
