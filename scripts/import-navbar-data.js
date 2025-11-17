const { Client, Databases, ID } = require('node-appwrite');

// Configuration
const client = new Client()
    .setEndpoint('https://tor.cloud.appwrite.io/v1')
    .setProject('691acc3e001a5242479f')
    .setKey('standard_e2bff202bae739a02e61e5d940da9a1b5173bafe3653eba4390fba0a684171dfb787b88c9ce138bd2b9716cd237be63f4c632dc7d0d84d0d39080e22337f0e6696dd9f5cad53c50b89c9aea84dfa646a5fe7dd1226fbef0f9dd3e3a814ad31a3c6a7add8b75dc1b62d2cd9039e3f36c1029ec933c2447d03857736fadfdedfc5');

const databases = new Databases(client);
const DATABASE_ID = '691ad3650035c64ba996';
const COLLECTION_ID = 'navbar';

// Complete navbar data from the current component
const navbarData = [
  {
    label: 'Home',
    href: '/',
    order: 0,
    is_active: true
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    order: 1,
    is_active: true
  },
  {
    label: 'About',
    href: '/about',
    order: 2,
    is_active: true
  },
  {
    label: 'Features',
    href: '/features',
    order: 3,
    is_active: true
  },
  {
    label: 'FAQ',
    href: '/faq',
    order: 4,
    is_active: true
  },
  {
    label: 'Blog',
    href: '/blog',
    order: 5,
    is_active: true
  }
];

async function importNavbar() {
  console.log('🚀 Importing Navbar Data...\n');
  
  let successCount = 0;
  let errorCount = 0;

  for (const link of navbarData) {
    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        link
      );
      console.log(`✅ Created: ${link.label} (${link.href})`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error creating "${link.label}":`, error.message);
      errorCount++;
    }
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log('🎉 Navbar Import Complete!');
  console.log(`${'='.repeat(50)}`);
  console.log(`✅ Success: ${successCount} navigation links`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('\n✅ Next: Update the Navbar component to use this data!');
}

importNavbar().catch(console.error);
