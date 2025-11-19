const { Client, Databases, ID } = require('node-appwrite');

// Configuration
const client = new Client()
    .setEndpoint('https://tor.cloud.appwrite.io/v1')
    .setProject('691acc3e001a5242479f')
    .setKey('standard_e2bff202bae739a02e61e5d940da9a1b5173bafe3653eba4390fba0a684171dfb787b88c9ce138bd2b9716cd237be63f4c632dc7d0d84d0d39080e22337f0e6696dd9f5cad53c50b89c9aea84dfa646a5fe7dd1226fbef0f9dd3e3a814ad31a3c6a7add8b75dc1b62d2cd9039e3f36c1029ec933c2447d03857736fadfdedfc5');

const databases = new Databases(client);
const DATABASE_ID = '691ad3650035c64ba996';

// About Page Sections
const aboutSections = [
  {
    section_id: 'hero',
    heading: 'What is SettleUp?',
    subheading: 'ABOUT US',
    content: 'SettleUp is a Providence, RI-based company that makes it easy to split bills with friends and family. We organize all your shared expenses and IOUs in one place, so that everyone can see who they owe. Whether you are sharing a ski vacation, splitting rent with roommates, or paying someone back for lunch, SettleUp makes life easier. We store your data in the cloud so that you can access it anywhere: on iPhone, Android, or on your computer.',
    image_url: '/imgs/hero-object.png',
    order: 0,
    is_active: true
  },
  {
    section_id: 'values_heading',
    heading: 'Why Choose SettleUp?',
    order: 1,
    is_active: true
  },
  {
    section_id: 'user_friendly',
    heading: 'User-Friendly',
    content: 'Intuitive design that anyone can use. Our interface is designed with simplicity and clarity in mind, making it effortless for everyone to track and split expenses without any learning curve. Whether you\'re tech-savvy or just getting started, SettleUp provides a seamless experience that feels natural from day one. Every feature is thoughtfully placed, every button clearly labeled, ensuring you spend less time figuring things out and more time enjoying life with friends and family.',
    order: 2,
    is_active: true
  },
  {
    section_id: 'fair_honest',
    heading: 'Fair & Honest',
    content: 'Promoting fairness in every transaction. We believe in transparency and honesty, ensuring that everyone pays their fair share without any confusion or disputes. Our platform is built on the principle that financial relationships should strengthen bonds, not strain them. With clear breakdowns, fair calculations, and transparent tracking, we help maintain trust and harmony in all your shared expenses, whether it\'s with roommates, travel companions, or family members.',
    order: 3,
    is_active: true
  },
  {
    section_id: 'secure',
    heading: 'Secure',
    content: 'Your data is protected and private. We use industry-standard encryption and advanced security measures to ensure your financial information stays safe and confidential at all times. Your privacy is our top priority, and we never share your personal data with third parties. With secure cloud storage, encrypted connections, and regular security audits, you can trust that your expense information is protected with the same level of security used by major financial institutions.',
    order: 4,
    is_active: true
  },
  {
    section_id: 'fast_reliable',
    heading: 'Fast & Reliable',
    content: 'Lightning-fast performance you can trust. Our platform is built for speed and reliability, ensuring you can manage your expenses anytime, anywhere without delays or interruptions. With optimized code, efficient servers, and smart caching, SettleUp responds instantly to your actions. Whether you\'re adding an expense on the go, settling up with friends, or checking your balance, everything happens in real-time with the reliability you need to stay on top of your shared finances.',
    order: 5,
    is_active: true
  },
  {
    section_id: 'team_heading',
    heading: 'Meet Our Team',
    subheading: 'We\'re a passionate team of developers, designers, and support specialists working to make shared expenses easier for everyone.',
    order: 6,
    is_active: true
  }
];

// About Values (Core Values Cards)
const aboutValues = [
  {
    title: 'User-Friendly',
    description: 'Intuitive design that anyone can use',
    icon: 'Users',
    color: 'teal',
    order: 0,
    is_active: true
  },
  {
    title: 'Fair & Honest',
    description: 'Promoting fairness in every transaction',
    icon: 'Heart',
    color: 'rose',
    order: 1,
    is_active: true
  },
  {
    title: 'Secure',
    description: 'Your data is protected and private',
    icon: 'Shield',
    color: 'blue',
    order: 2,
    is_active: true
  },
  {
    title: 'Fast & Reliable',
    description: 'Lightning-fast performance you can trust',
    icon: 'Zap',
    color: 'amber',
    order: 3,
    is_active: true
  }
];

// Team Members
const teamMembers = [
  {
    name: 'Sarah Johnson',
    role: 'CEO & Co-Founder',
    bio: 'Passionate about making financial management accessible to everyone.',
    avatar: '👩‍💼',
    twitter: '#',
    linkedin: '#',
    email: 'sarah@settleup.com',
    order: 0,
    is_active: true
  },
  {
    name: 'Michael Chen',
    role: 'CTO & Co-Founder',
    bio: 'Building scalable solutions that millions of people rely on daily.',
    avatar: '👨‍💻',
    twitter: '#',
    linkedin: '#',
    email: 'michael@settleup.com',
    order: 1,
    is_active: true
  },
  {
    name: 'Emily Rodriguez',
    role: 'Head of Design',
    bio: 'Creating beautiful, intuitive experiences that users love.',
    avatar: '👩‍🎨',
    twitter: '#',
    linkedin: '#',
    email: 'emily@settleup.com',
    order: 2,
    is_active: true
  },
  {
    name: 'David Park',
    role: 'Lead Engineer',
    bio: 'Crafting robust, efficient code that powers our platform.',
    avatar: '👨‍🔧',
    twitter: '#',
    linkedin: '#',
    email: 'david@settleup.com',
    order: 3,
    is_active: true
  },
  {
    name: 'Jessica Martinez',
    role: 'Product Manager',
    bio: 'Driving product vision and ensuring user needs are met.',
    avatar: '👩‍💼',
    twitter: '#',
    linkedin: '#',
    email: 'jessica@settleup.com',
    order: 4,
    is_active: true
  },
  {
    name: 'Ryan Thompson',
    role: 'Senior Developer',
    bio: 'Passionate about clean code and innovative solutions.',
    avatar: '👨‍💻',
    twitter: '#',
    linkedin: '#',
    email: 'ryan@settleup.com',
    order: 5,
    is_active: true
  },
  {
    name: 'Sophia Lee',
    role: 'UX Researcher',
    bio: 'Understanding user behavior to improve experiences.',
    avatar: '👩‍🔬',
    twitter: '#',
    linkedin: '#',
    email: 'sophia@settleup.com',
    order: 6,
    is_active: true
  },
  {
    name: 'James Wilson',
    role: 'DevOps Engineer',
    bio: 'Ensuring smooth deployments and system reliability.',
    avatar: '👨‍🔧',
    twitter: '#',
    linkedin: '#',
    email: 'james@settleup.com',
    order: 7,
    is_active: true
  },
  {
    name: 'Amanda Foster',
    role: 'Marketing Director',
    bio: 'Spreading the word about making expense sharing easy.',
    avatar: '👩‍💼',
    twitter: '#',
    linkedin: '#',
    email: 'amanda@settleup.com',
    order: 8,
    is_active: true
  },
  {
    name: 'Kevin Patel',
    role: 'Data Scientist',
    bio: 'Turning data into insights that drive better decisions.',
    avatar: '👨‍💻',
    twitter: '#',
    linkedin: '#',
    email: 'kevin@settleup.com',
    order: 9,
    is_active: true
  },
  {
    name: 'Lisa Anderson',
    role: 'Customer Success',
    bio: 'Helping users get the most out of our platform.',
    avatar: '👩‍💼',
    twitter: '#',
    linkedin: '#',
    email: 'lisa@settleup.com',
    order: 10,
    is_active: true
  },
  {
    name: 'Marcus Brown',
    role: 'Security Engineer',
    bio: 'Protecting user data and maintaining platform security.',
    avatar: '👨‍💻',
    twitter: '#',
    linkedin: '#',
    email: 'marcus@settleup.com',
    order: 11,
    is_active: true
  }
];

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
      const label = doc.heading || doc.title || doc.name || doc.section_id;
      console.log(`  ✅ Created: ${label}`);
      successCount++;
    } catch (error) {
      console.error(`  ❌ Error:`, error.message);
      errorCount++;
    }
  }
  
  console.log(`  📊 ${collectionName}: ${successCount} success, ${errorCount} errors`);
  return { success: successCount, errors: errorCount };
}

// Main import function
async function importAbout() {
  console.log('🚀 Starting About Page Import...\n');
  
  const results = {
    sections: await importCollection('about_page', aboutSections, 'About Sections'),
    values: await importCollection('about_values', aboutValues, 'Core Values'),
    team: await importCollection('about_team', teamMembers, 'Team Members')
  };
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 About Page Import Complete!');
  console.log('='.repeat(50));
  
  const totalSuccess = Object.values(results).reduce((sum, r) => sum + r.success, 0);
  const totalErrors = Object.values(results).reduce((sum, r) => sum + r.errors, 0);
  
  console.log(`\n📊 Total: ${totalSuccess} documents created, ${totalErrors} errors`);
  console.log('\n✅ About page is now fully dynamic!\n');
}

importAbout().catch(console.error);
