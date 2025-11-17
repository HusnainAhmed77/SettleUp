import {Client, Databases, Storage, Query} from 'appwrite'

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

    export const databases = new Databases(client);
    export const storage = new Storage(client);

    export {Query};

    export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

    export const COLLECTIONS = {
        HOME_PAGE: 'home_page',
        ABOUT_PAGE: 'about_page',
        FEATURES_PAGE: 'features_page',
        FAQ_PAGE: 'faq_page',
        BLOG_POSTS: 'blog_posts',
        CONTACT_PAGE: 'contact_page',
        AUTH_PAGE: 'auth_page',
        NAVBAR: 'navbar',
        FOOTER: 'footer',
    };

    