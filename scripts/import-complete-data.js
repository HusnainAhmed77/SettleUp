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
      const identifier = doc.question || doc.title || doc.label || doc.section_id || doc.slug || doc.heading || 'item';
      console.log(`  ✅ Created: ${identifier}`);
      successCount++;
    } catch (error) {
      console.error(`  ❌ Error:`, error.message);
      errorCount++;
    }
  }
  
  console.log(`  📊 ${collectionName}: ${successCount} success, ${errorCount} errors`);
  return { success: successCount, errors: errorCount };
}

// ============================================
// NAVBAR DATA - Complete navigation links
// ============================================
const navbarData = [
  { label: 'Home', href: '/', order: 0, is_active: true },
  { label: 'Dashboard', href: '/dashboard', order: 1, is_active: true },
  { label: 'About', href: '/about', order: 2, is_active: true },
  { label: 'Features', href: '/features', order: 3, is_active: true },
  { label: 'FAQ', href: '/faq', order: 4, is_active: true },
  { label: 'Blog', href: '/blog', order: 5, is_active: true },
  { label: 'Contact', href: '/contact', order: 6, is_active: true },
];

// ============================================
// FOOTER DATA - Complete footer sections
// ============================================
const footerData = [
  // Company Section
  { section_id: 'company_heading', heading: 'Company', order: 0, is_active: true },
  { section_id: 'company_about', link_text: 'About', link_url: '/about', order: 1, is_active: true },
  { section_id: 'company_features', link_text: 'Features', link_url: '/features', order: 2, is_active: true },
  { section_id: 'company_blog', link_text: 'Blog', link_url: '/blog', order: 3, is_active: true },
  
  // Support Section
  { section_id: 'support_heading', heading: 'Support', order: 10, is_active: true },
  { section_id: 'support_faq', link_text: 'FAQ', link_url: '/faq', order: 11, is_active: true },
  { section_id: 'support_contact', link_text: 'Contact', link_url: '/contact', order: 12, is_active: true },
  { section_id: 'support_help', link_text: 'Help Center', link_url: '/faq', order: 13, is_active: true },
  
  // Legal Section
  { section_id: 'legal_heading', heading: 'Legal', order: 20, is_active: true },
  { section_id: 'legal_privacy', link_text: 'Privacy Policy', link_url: '/privacy', order: 21, is_active: true },
  { section_id: 'legal_terms', link_text: 'Terms of Service', link_url: '/terms', order: 22, is_active: true },
  { section_id: 'legal_security', link_text: 'Security', link_url: '/security', order: 23, is_active: true },
  
  // Social Section
  { section_id: 'social_heading', heading: 'Follow Us', order: 30, is_active: true },
  { section_id: 'social_twitter', link_text: 'Twitter', link_url: 'https://twitter.com', order: 31, is_active: true },
  { section_id: 'social_facebook', link_text: 'Facebook', link_url: 'https://facebook.com', order: 32, is_active: true },
  { section_id: 'social_instagram', link_text: 'Instagram', link_url: 'https://instagram.com', order: 33, is_active: true },
  
  // Copyright
  { section_id: 'copyright', content: '© 2024 SettleUp. All rights reserved.', order: 100, is_active: true },
];

// ============================================
// FAQ DATA - Complete FAQ questions
// ============================================
const faqData = [
  {
    question: 'How do I create a group?',
    answer: 'Creating a group is easy! Click on the "Create Group" button on your dashboard, give your group a name and description, then invite members by entering their email addresses or phone numbers. Once created, you can start adding expenses immediately.',
    category: 'Getting Started',
    order: 0,
    is_active: true
  },
  {
    question: 'How do I split expenses fairly?',
    answer: 'SettleUp offers multiple ways to split expenses: equally among all members, by exact amounts, by percentages, or by shares. You can also split by item if you want to track who ordered what. Simply choose the split method that works best for your situation when adding an expense.',
    category: 'Expenses',
    order: 1,
    is_active: true
  },
  {
    question: 'Can I use different currencies?',
    answer: 'Yes! SettleUp supports multiple currencies and automatic currency conversion. You can set a default currency for each group, and expenses in different currencies will be automatically converted using current exchange rates. This is perfect for international trips or groups with members in different countries.',
    category: 'Features',
    order: 2,
    is_active: true
  },
  {
    question: 'How does debt simplification work?',
    answer: 'Debt simplification reduces the number of transactions needed to settle all balances in a group. Instead of everyone paying everyone else, SettleUp calculates the minimum number of payments required. For example, if A owes B $10 and B owes C $10, we simplify it so A pays C $10 directly.',
    category: 'Features',
    order: 3,
    is_active: true
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely! We use bank-level encryption to protect your data. All information is encrypted in transit and at rest. We never share your personal information with third parties without your consent. Your financial data is stored securely and is only accessible to you and the people you choose to share it with.',
    category: 'Security',
    order: 4,
    is_active: true
  },
  {
    question: 'How do I settle up with someone?',
    answer: 'To settle up, go to your group or friend\'s page and click the "Settle Up" button. You can record a payment made outside the app, or use our integrated payment options. Once recorded, the balance will be updated automatically for all members.',
    category: 'Payments',
    order: 5,
    is_active: true
  },
  {
    question: 'Can I export my expense history?',
    answer: 'Yes! You can export your expense history as a CSV or PDF file from your account settings. This is useful for tax purposes, reimbursements, or just keeping personal records. You can filter by date range, group, or category before exporting.',
    category: 'Features',
    order: 6,
    is_active: true
  },
  {
    question: 'What happens if I delete an expense?',
    answer: 'When you delete an expense, all balances are automatically recalculated. All group members will see the updated balances immediately. If you accidentally delete an expense, you can add it back manually with the same details.',
    category: 'Expenses',
    order: 7,
    is_active: true
  },
];

// ============================================
// FEATURES PAGE DATA
// ============================================
const featuresData = [
  {
    section_id: 'hero',
    title: 'Our Features & Services',
    description: 'Everything you need to split expenses and track shared costs with ease and transparency.',
    order: 0,
    is_active: true
  },
  {
    section_id: 'cta',
    title: 'Ready to Get Started?',
    description: 'Join thousands of users who are already managing their shared expenses with ease.',
    order: 100,
    is_active: true
  }
];

// ============================================
// ABOUT PAGE DATA
// ============================================
const aboutData = [
  {
    section_id: 'hero',
    heading: 'About SettleUp',
    subheading: 'Making shared expenses simple and stress-free',
    content: 'SettleUp is the easiest way to share expenses with friends, family, and roommates. Track balances, split bills, and settle up with confidence. We believe managing money with others should be simple, transparent, and fair.',
    order: 0,
    is_active: true
  },
  {
    section_id: 'mission',
    heading: 'Our Mission',
    content: 'To make splitting expenses so simple that money never gets in the way of relationships. We help millions of people around the world share costs fairly and transparently.',
    order: 1,
    is_active: true
  },
  {
    section_id: 'values',
    heading: 'Our Values',
    content: 'Transparency, fairness, and simplicity guide everything we do. We believe in building tools that make life easier, not more complicated.',
    order: 2,
    is_active: true
  },
  {
    section_id: 'team',
    heading: 'Meet Our Team',
    content: 'We\'re a passionate team of developers, designers, and support specialists working to make shared expenses easier for everyone.',
    order: 3,
    is_active: true
  }
];

// ============================================
// BLOG POSTS DATA
// ============================================
const blogData = [
  {
    slug: 'how-to-split-expenses-fairly',
    title: 'How to Split Expenses Fairly Among Roommates',
    excerpt: 'Learn the best practices for tracking and splitting expenses with roommates to avoid conflicts and maintain harmony.',
    content: 'Living with roommates can be great, but managing shared expenses can be tricky. Here are our top tips for keeping things fair and transparent. First, establish clear rules from the start. Decide what expenses will be shared (rent, utilities, groceries) and what will be individual. Use SettleUp to track everything automatically. Second, communicate openly about money. Don\'t let small debts pile up - settle regularly. Third, be flexible and understanding. Sometimes life happens and people need a little extra time. The key is maintaining open communication and using tools like SettleUp to keep everything transparent.',
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
    content: 'Group trips are amazing experiences, but managing who paid for what can get complicated fast. Here\'s how SettleUp makes it simple. Before the trip, create a group and invite all travelers. During the trip, add expenses as they happen - hotels, meals, activities, transportation. SettleUp automatically calculates who owes what. After the trip, use the settle up feature to handle all payments at once. No more awkward conversations about who paid for dinner three days ago. Pro tip: Assign one person as the "trip treasurer" to verify all expenses are logged correctly.',
    category: 'Travel & Trips',
    author: 'SettleUp Team',
    published_date: '2024-01-10',
    is_published: true,
    order: 1
  },
  {
    slug: 'financial-planning-for-couples',
    title: 'Financial Planning for Couples: A Modern Approach',
    excerpt: 'How couples can manage shared expenses while maintaining financial independence.',
    content: 'Managing money as a couple doesn\'t mean you have to merge everything. Many modern couples prefer to keep some financial independence while sharing common expenses. SettleUp helps you track shared costs like rent, groceries, and utilities, while keeping personal expenses separate. Create a "household" group for shared expenses and settle up monthly. This approach gives you transparency without sacrificing autonomy. It also makes it easier to see spending patterns and budget together for shared goals.',
    category: 'Financial Planning',
    author: 'SettleUp Team',
    published_date: '2024-01-05',
    is_published: true,
    order: 2
  }
];

// Main import function
async function importAll() {
  console.log('🚀 Starting complete data import...\n');
  console.log('This will import ALL content for your pages.\n');
  
  const results = {
    navbar: await importCollection('navbar', navbarData, 'Navbar Links'),
    footer: await importCollection('footer', footerData, 'Footer Sections'),
    faq: await importCollection('faq_page', faqData, 'FAQ Questions'),
    features: await importCollection('features_page', featuresData, 'Features Page'),
    about: await importCollection('about_page', aboutData, 'About Page'),
    blog: await importCollection('blog_posts', blogData, 'Blog Posts'),
  };
  
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Complete Import Finished!');
  console.log('='.repeat(60));
  
  const totalSuccess = Object.values(results).reduce((sum, r) => sum + r.success, 0);
  const totalErrors = Object.values(results).reduce((sum, r) => sum + r.errors, 0);
  
  console.log(`\n📊 Summary:`);
  console.log(`   ✅ ${results.navbar.success} navbar links`);
  console.log(`   ✅ ${results.footer.success} footer items`);
  console.log(`   ✅ ${results.faq.success} FAQ questions`);
  console.log(`   ✅ ${results.features.success} features sections`);
  console.log(`   ✅ ${results.about.success} about sections`);
  console.log(`   ✅ ${results.blog.success} blog posts`);
  console.log(`\n   📈 Total: ${totalSuccess} documents created`);
  if (totalErrors > 0) {
    console.log(`   ⚠️  ${totalErrors} errors (check above for details)`);
  }
  
  console.log('\n✅ Next steps:');
  console.log('1. Verify data in Appwrite Console');
  console.log('2. I will now update all page components');
  console.log('3. Test each page to see dynamic content!\n');
}

// Run the import
importAll().catch(console.error);
