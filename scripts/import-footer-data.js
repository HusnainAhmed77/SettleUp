const { Client, Databases, ID } = require('node-appwrite');

// Configuration
const client = new Client()
    .setEndpoint('https://tor.cloud.appwrite.io/v1')
    .setProject('691acc3e001a5242479f')
    .setKey('standard_e2bff202bae739a02e61e5d940da9a1b5173bafe3653eba4390fba0a684171dfb787b88c9ce138bd2b9716cd237be63f4c632dc7d0d84d0d39080e22337f0e6696dd9f5cad53c50b89c9aea84dfa646a5fe7dd1226fbef0f9dd3e3a814ad31a3c6a7add8b75dc1b62d2cd9039e3f36c1029ec933c2447d03857736fadfdedfc5');

const databases = new Databases(client);
const DATABASE_ID = '691ad3650035c64ba996';

// All footer data in one array with type field
const footerData = [
  // Sections
  { type: 'section', section_id: 'product', heading: 'Product', order: 0, is_active: true },
  { type: 'section', section_id: 'company', heading: 'Company', order: 1, is_active: true },
  { type: 'section', section_id: 'support', heading: 'Support', order: 2, is_active: true },
  { type: 'section', section_id: 'legal', heading: 'Legal', order: 3, is_active: true },
  
  // Product Links
  { type: 'link', section_id: 'product', link_text: 'Dashboard', link_url: '/dashboard', is_external: false, order: 10, is_active: true },
  { type: 'link', section_id: 'product', link_text: 'Features', link_url: '/features', is_external: false, order: 11, is_active: true },
  { type: 'link', section_id: 'product', link_text: 'FAQ', link_url: '/faq', is_external: false, order: 12, is_active: true },
  
  // Company Links
  { type: 'link', section_id: 'company', link_text: 'About Us', link_url: '/about', is_external: false, order: 20, is_active: true },
  { type: 'link', section_id: 'company', link_text: 'Blog', link_url: '/blog', is_external: false, order: 21, is_active: true },
  { type: 'link', section_id: 'company', link_text: 'Contact', link_url: '/contact', is_external: false, order: 22, is_active: true },
  
  // Support Links
  { type: 'link', section_id: 'support', link_text: 'Help Center', link_url: 'https://feedback.splitwise.com', is_external: true, order: 30, is_active: true },
  { type: 'link', section_id: 'support', link_text: 'Site Status', link_url: 'https://status.splitwise.com', is_external: true, order: 31, is_active: true },
  { type: 'link', section_id: 'support', link_text: 'Security', link_url: '/security', is_external: false, order: 32, is_active: true },
  
  // Legal Links
  { type: 'link', section_id: 'legal', link_text: 'Terms of Service', link_url: '/terms', is_external: false, order: 40, is_active: true },
  { type: 'link', section_id: 'legal', link_text: 'Privacy Policy', link_url: '/privacy', is_external: false, order: 41, is_active: true },
  { type: 'link', section_id: 'legal', link_text: 'Payment Services', link_url: '/pay', is_external: false, order: 42, is_active: true },
  
  // Social Media
  { type: 'social', platform: 'twitter', url: 'https://twitter.com', order: 50, is_active: true },
  { type: 'social', platform: 'facebook', url: 'https://facebook.com', order: 51, is_active: true },
  { type: 'social', platform: 'instagram', url: 'https://www.instagram.com', order: 52, is_active: true },
  { type: 'social', platform: 'linkedin', url: 'https://www.linkedin.com', order: 53, is_active: true },
  
  // Settings
  { type: 'setting', setting_key: 'copyright_text', setting_value: 'SettleUp, Inc.', order: 60, is_active: true },
  { type: 'setting', setting_key: 'location_text', setting_value: 'Made with ❤️ in Providence, RI', order: 61, is_active: true },
  { type: 'setting', setting_key: 'logo_url', setting_value: '/imgs/footer-logo.png', order: 62, is_active: true }
];

// Main import function
async function importFooter() {
  console.log('🚀 Importing Footer Data...\n');
  
  let successCount = 0;
  let errorCount = 0;
  const COLLECTION_ID = 'footer';

  for (const item of footerData) {
    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        item
      );
      const label = item.heading || item.link_text || item.platform || item.setting_key || item.type;
      console.log(`✅ Created [${item.type}]: ${label}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error:`, error.message);
      errorCount++;
    }
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log('🎉 Footer Import Complete!');
  console.log(`${'='.repeat(50)}`);
  console.log(`✅ Success: ${successCount} items`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('\n📊 Breakdown:');
  console.log(`  - Sections: 4`);
  console.log(`  - Links: 12`);
  console.log(`  - Social Media: 4`);
  console.log(`  - Settings: 3`);
  console.log('\n✅ All footer data in ONE collection!\n');
}

importFooter().catch(console.error);
