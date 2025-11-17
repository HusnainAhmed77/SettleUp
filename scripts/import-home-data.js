const { Client, Databases, ID } = require('node-appwrite');

// Configuration
const client = new Client()
    .setEndpoint('https://tor.cloud.appwrite.io/v1')
    .setProject('691acc3e001a5242479f')
    .setKey('standard_e2bff202bae739a02e61e5d940da9a1b5173bafe3653eba4390fba0a684171dfb787b88c9ce138bd2b9716cd237be63f4c632dc7d0d84d0d39080e22337f0e6696dd9f5cad53c50b89c9aea84dfa646a5fe7dd1226fbef0f9dd3e3a814ad31a3c6a7add8b75dc1b62d2cd9039e3f36c1029ec933c2447d03857736fadfdedfc5');

const databases = new Databases(client);
const DATABASE_ID = '691ad3650035c64ba996';
const COLLECTION_ID = 'home_page';

// All home page data
const documents = [
  {
    section_id: 'hero',
    heading: 'Less Stress When',
    subheading: 'Sharing Expenses',
    content: 'Keep track of your shared expenses and balances with housemates, trips, groups, friends, and family. Split bills easily and settle up with confidence.',
    image_url: '/imgs/asset2-2x-1a032de8cdb5bd11e5c3cd37ce08391497ac0f14f2bba61987.png',
    order: 0,
    is_active: true
  },
  {
    section_id: 'cta',
    heading: 'Ready to get started?',
    content: 'Join millions of people around the world.',
    button_text: 'Create account',
    button_link: '/auth?mode=signup',
    order: 1,
    is_active: true
  },
  {
    section_id: 'feature_1',
    title: 'Track Balances',
    description: 'Keep track of shared expenses, balances, and who owes who. Our intelligent system makes it easy to see your financial picture at a glance.',
    icon_name: 'wallet',
    image_url: '/imgs/asset1-2x-b7225a262a58f40d591ad168dded30b61f6c6e0daaba1b2e83.png',
    background_color: '#0099CC',
    border_color: '#FF007F',
    order: 10,
    is_active: true
  },
  {
    section_id: 'feature_2',
    title: 'Split Expenses',
    description: 'Organize and split expenses with any group: trips, housemates, friends, and family. Make group finances simple and transparent.',
    icon_name: 'users',
    image_url: '/imgs/asset3-2x-233776b3d1a29f11a498cb836488ad04a552788bb66c0f4e1f.png',
    background_color: '#CC0066',
    border_color: '#00CFFF',
    order: 11,
    is_active: true
  },
  {
    section_id: 'feature_3',
    title: 'Add Expenses Easily',
    description: 'Quickly add expenses on the go before you forget who paid. Our streamlined interface makes expense tracking a breeze.',
    icon_name: 'receipt',
    image_url: '/imgs/asset2-2x-1a032de8cdb5bd11e5c3cd37ce08391497ac0f14f2bba61987.png',
    background_color: '#0099CC',
    border_color: '#FF007F',
    order: 12,
    is_active: true
  },
  {
    section_id: 'testimonial_1',
    content: '"Fundamental" for tracking finances. As good as WhatsApp for containing awkwardness.',
    author: 'Financial Times',
    author_role: 'Publication',
    rating: 5,
    order: 20,
    is_active: true
  },
  {
    section_id: 'testimonial_2',
    content: 'Life hack for group trips. Amazing tool to use when traveling with friends! Makes life so easy!!',
    author: 'Ahah S',
    author_role: 'iOS User',
    rating: 5,
    order: 21,
    is_active: true
  },
  {
    section_id: 'testimonial_3',
    content: 'Makes it easy to split everything from your dinner bill to rent.',
    author: 'NY Times',
    author_role: 'Publication',
    rating: 5,
    order: 22,
    is_active: true
  },
  {
    section_id: 'testimonial_4',
    content: 'So amazing to have this app manage balances and help keep money out of relationships. love it!',
    author: 'Haseena C',
    author_role: 'Android User',
    rating: 5,
    order: 23,
    is_active: true
  },
  {
    section_id: 'testimonial_5',
    content: 'I never fight with roommates over bills because of this genius expense-splitting app',
    author: 'Business Insider',
    author_role: 'Publication',
    rating: 5,
    order: 24,
    is_active: true
  },
  {
    section_id: 'testimonial_6',
    content: 'I use it everyday. I use it for trips, roommates, loans. I love SettleUp.',
    author: 'Trickseyus',
    author_role: 'iOS User',
    rating: 5,
    order: 25,
    is_active: true
  },
  {
    section_id: 'contact_1',
    title: 'Contact Form',
    description: 'Fill out our online form',
    icon_name: 'form',
    button_text: 'Get in touch',
    button_link: '/contact',
    order: 30,
    is_active: true
  },
  {
    section_id: 'contact_2',
    title: 'Email Us',
    description: 'From your email app',
    icon_name: 'mail',
    link_text: 'support@settleup.com',
    link_url: 'mailto:support@settleup.com',
    order: 31,
    is_active: true
  },
  {
    section_id: 'contact_3',
    title: 'Call or text us',
    description: 'From your phone',
    icon_name: 'phone',
    link_text: '+1 (647) 492-1845',
    link_url: 'tel:+16474921845',
    order: 32,
    is_active: true
  }
];

async function importData() {
  console.log('🚀 Starting import...\n');
  
  let successCount = 0;
  let errorCount = 0;

  for (const doc of documents) {
    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        doc
      );
      console.log(`✅ Created: ${doc.section_id}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error creating ${doc.section_id}:`, error.message);
      errorCount++;
    }
  }
  
  console.log(`\n🎉 Import complete!`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
}

// Run the import
importData().catch(console.error);
