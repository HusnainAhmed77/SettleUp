const { Client, Databases, ID } = require('node-appwrite');

// Configuration
const client = new Client()
    .setEndpoint('https://tor.cloud.appwrite.io/v1')
    .setProject('691acc3e001a5242479f')
    .setKey('standard_e2bff202bae739a02e61e5d940da9a1b5173bafe3653eba4390fba0a684171dfb787b88c9ce138bd2b9716cd237be63f4c632dc7d0d84d0d39080e22337f0e6696dd9f5cad53c50b89c9aea84dfa646a5fe7dd1226fbef0f9dd3e3a814ad31a3c6a7add8b75dc1b62d2cd9039e3f36c1029ec933c2447d03857736fadfdedfc5');

const databases = new Databases(client);
const DATABASE_ID = '691ad3650035c64ba996';

// Import function
async function importCollection(collectionId, documents, collectionName) {
  console.log(`\n📦 Importing ${collectionName}...`);
  let successCount = 0;
  let errorCount = 0;

  for (const doc of documents) {
    try {
      await databases.createDocument(
        DATABASE_ID,
        collectionId,
        ID.unique(),
        doc
      );
      console.log(`  ✅ Created: ${doc.question || doc.title || doc.label || doc.section_id || doc.slug}`);
      successCount++;
    } catch (error) {
      console.error(`  ❌ Error:`, error.message);
      errorCount++;
    }
  }
  
  console.log(`  📊 ${collectionName}: ${successCount} success, ${errorCount} errors`);
  return { success: successCount, errors: errorCount };
}

// FAQ Data
const faqData = [
  {
    question: 'How do I create a group?',
    answer: 'Creating a group is easy! Click on the "Create Group" button on your dashboard, give your group a name and description, then invite members by entering their email addresses or phone numbers.',
    order: 0,
    is_active: true
  },
  {
    question: 'How do I split expenses fairly?',
    answer: 'SettleUp offers multiple ways to split expenses: equally among all members, by exact amounts, by percentages, or by shares. Simply choose the split method that works best for your situation when adding an expense.',
    order: 1,
    is_active: true
  },
  {
    question: 'Can I use different currencies?',
    answer: 'Yes! SettleUp supports multiple currencies and automatic currency conversion. You can set a default currency for each group, and expenses in different currencies will be automatically converted.',
    order: 2,
    is_active: true
  },
  {
    question: 'How does debt simplification work?',
    answer: 'Debt simplification reduces the number of transactions needed to settle all balances in a group. Instead of everyone paying everyone else, SettleUp calculates the minimum number of payments required.',
    order: 3,
    is_active: true
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely! We use bank-level encryption to protect your data. All information is encrypted in transit and at rest. We never share your personal information with third parties.',
    order: 4,
    is_active: true
  }
];

// Features Data
const featuresData = [
  {
    section_id: 'feature_hero',
    title: 'Our Features & Services',
    description: 'Everything you need to split expenses and track shared costs with ease and transparency.',
    order: 0,
    is_active: true
  }
];

// About Data
const aboutData = [
  {
    section_id: 'hero',
    heading: 'About SettleUp',
    subheading: 'Making shared expenses simple',
    content: 'SettleUp is the easiest way to share expenses with friends, family, and roommates. Track balances, split bills, and settle up with confidence.',
    order: 0,
    is_active: true
  }
];

// Blog Data
const blogData = [
  {
    slug: 'how-to-split-expenses-fairly',
    title: 'How to Split Expenses Fairly Among Roommates',
    excerpt: 'Learn the best practices for tracking and splitting expenses with roommates to avoid conflicts.',
    content: 'Living with roommates can be great, but managing shared expenses can be tricky. Here are our top tips for keeping things fair and transparent...',
    category: 'Roommate Tips',
    author: 'SettleUp Team',
    published_date: '2024-01-15',
    is_published: true,
    order: 0
  },
  {
    slug: 'group-trip-expense-management',
    title: 'Managing Group Trip Expenses Made Easy',
    excerpt: 'Planning a trip with friends? Here\'s how to handle shared costs without the headache.',
    content: 'Group trips are amazing experiences, but managing who paid for what can get complicated. Here\'s how SettleUp makes it simple...',
    category: 'Travel & Trips',
    author: 'SettleUp Team',
    published_date: '2024-01-10',
    is_published: true,
    order: 1
  }
];

// Navbar Data
const navbarData = [
  { label: 'Features', href: '/features', order: 0, is_active: true },
  { label: 'About', href: '/about', order: 1, is_active: true },
  { label: 'Blog', href: '/blog', order: 2, is_active: true },
  { label: 'FAQ', href: '/faq', order: 3, is_active: true },
  { label: 'Contact', href: '/contact', order: 4, is_active: true }
];

// Footer Data
const footerData = [
  {
    section_id: 'company',
    heading: 'Company',
    order: 0,
    is_active: true
  },
  {
    section_id: 'company_about',
    link_text: 'About',
    link_url: '/about',
    order: 1,
    is_active: true
  },
  {
    section_id: 'company_features',
    link_text: 'Features',
    link_url: '/features',
    order: 2,
    is_active: true
  },
  {
    section_id: 'support',
    heading: 'Support',
    order: 10,
    is_active: true
  },
  {
    section_id: 'support_faq',
    link_text: 'FAQ',
    link_url: '/faq',
    order: 11,
    is_active: true
  },
  {
    section_id: 'support_contact',
    link_text: 'Contact',
    link_url: '/contact',
    order: 12,
    is_active: true
  }
];

// Main import function
async function importAll() {
  console.log('🚀 Starting import of all collections...\n');
  
  const results = {
    faq: await importCollection('faq_page', faqData, 'FAQ Page'),
    features: await importCollection('features_page', featuresData, 'Features Page'),
    about: await importCollection('about_page', aboutData, 'About Page'),
    blog: await importCollection('blog_posts', blogData, 'Blog Posts'),
    navbar: await importCollection('navbar', navbarData, 'Navbar'),
    footer: await importCollection('footer', footerData, 'Footer')
  };
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 Import Complete!');
  console.log('='.repeat(50));
  
  const totalSuccess = Object.values(results).reduce((sum, r) => sum + r.success, 0);
  const totalErrors = Object.values(results).reduce((sum, r) => sum + r.errors, 0);
  
  console.log(`\n📊 Total: ${totalSuccess} documents created, ${totalErrors} errors`);
  console.log('\n✅ Next steps:');
  console.log('1. Verify data in Appwrite Console');
  console.log('2. Test each page on your website');
  console.log('3. Edit content in Appwrite to see changes!\n');
}

// Run the import
importAll().catch(console.error);
