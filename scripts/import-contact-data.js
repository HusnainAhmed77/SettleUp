/**
 * Script to import initial contact page content into Appwrite
 * 
 * Instructions:
 * 1. Make sure you have node-appwrite installed: npm install node-appwrite
 * 2. Update the environment variables in this script or use .env file
 * 3. Run: node scripts/import-contact-data.js
 */

const sdk = require('node-appwrite');

// Initialize Appwrite client
const client = new sdk.Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://tor.cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '691acc3e001a5242479f')
    .setKey(process.env.APPWRITE_API_KEY || 'YOUR_API_KEY_HERE'); // You need to create an API key in Appwrite Console

const databases = new sdk.Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'YOUR_DATABASE_ID';
const COLLECTION_ID = 'contact_page_content';

// Sample contact page content
const contactPageContent = {
    heroTitle: 'Contact Us',
    heroDescription: 'Not sure what you need? The team at SettleUp will be happy to listen to you and suggest ideas you hadn\'t considered!',
    email: 'support@settleup.com',
    phone: '+1 (212) 555-1234',
    supportText: 'Support',
    updatedAt: new Date().toISOString()
};

async function importContactData() {
    try {
        console.log('Starting contact page content import...');
        
        // Check if content already exists
        const existingDocs = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID
        );

        if (existingDocs.documents.length > 0) {
            console.log('Contact page content already exists. Updating...');
            const docId = existingDocs.documents[0].$id;
            
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                docId,
                contactPageContent
            );
            
            console.log('✓ Contact page content updated successfully!');
        } else {
            console.log('Creating new contact page content...');
            
            await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                'unique()',
                contactPageContent
            );
            
            console.log('✓ Contact page content created successfully!');
        }

        console.log('\nImported content:');
        console.log(JSON.stringify(contactPageContent, null, 2));
        
    } catch (error) {
        console.error('Error importing contact data:', error);
        process.exit(1);
    }
}

// Run the import
importContactData();
