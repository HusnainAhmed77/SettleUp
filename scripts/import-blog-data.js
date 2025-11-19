const { Client, Databases, ID } = require('node-appwrite');

// Configuration
const client = new Client()
    .setEndpoint('https://tor.cloud.appwrite.io/v1')
    .setProject('691acc3e001a5242479f')
    .setKey('standard_e2bff202bae739a02e61e5d940da9a1b5173bafe3653eba4390fba0a684171dfb787b88c9ce138bd2b9716cd237be63f4c632dc7d0d84d0d39080e22337f0e6696dd9f5cad53c50b89c9aea84dfa646a5fe7dd1226fbef0f9dd3e3a814ad31a3c6a7add8b75dc1b62d2cd9039e3f36c1029ec933c2447d03857736fadfdedfc5');

const databases = new Databases(client);
const DATABASE_ID = '691ad3650035c64ba996';

// Blog Posts
const blogPosts = [
  {
    slug: 'how-to-split-expenses-fairly',
    title: 'How to Split Expenses Fairly Among Roommates',
    excerpt: 'Learn the best practices for tracking and splitting expenses with roommates to avoid conflicts and maintain harmony.',
    content: `<p>Living with roommates can be one of the most rewarding experiences, but it can also lead to tension when it comes to splitting expenses. Whether you're sharing an apartment, house, or just splitting bills, having a clear system in place is essential for maintaining harmony.</p>

<h2>Understanding Fair Distribution</h2>
<p>The concept of "fair" can mean different things to different people. Some prefer equal splits, while others advocate for proportional distribution based on income or usage. The key is finding a system that everyone agrees upon before moving in together.</p>

<p>Start by having an open conversation about finances. Discuss everyone's income levels, spending habits, and expectations. This transparency helps prevent misunderstandings down the line.</p>

<h2>Common Expense Categories</h2>
<p>When living with roommates, expenses typically fall into several categories:</p>
<ul>
  <li><strong>Fixed costs:</strong> Rent, utilities, internet, and insurance</li>
  <li><strong>Shared supplies:</strong> Cleaning products, toilet paper, and kitchen essentials</li>
  <li><strong>Food:</strong> Groceries for shared meals or communal items</li>
  <li><strong>Furniture:</strong> Common area furnishings and appliances</li>
</ul>

<h2>Methods for Splitting Expenses</h2>
<p>There are several approaches to dividing costs among roommates:</p>

<h3>1. Equal Split</h3>
<p>The simplest method is dividing everything equally. This works well when roommates have similar incomes and use shared spaces equally. Each person pays the same amount regardless of individual usage.</p>

<h3>2. Proportional by Income</h3>
<p>For roommates with varying income levels, a proportional split can feel more equitable. Calculate each person's percentage of the total household income, then apply that percentage to shared expenses.</p>

<h3>3. Usage-Based Split</h3>
<p>Some expenses make more sense to split based on actual usage. For example, if one roommate has a larger bedroom, they might pay a higher portion of the rent. Utility bills can be divided based on consumption patterns.</p>

<h2>Using Technology to Track Expenses</h2>
<p>Gone are the days of complicated spreadsheets and awkward money conversations. Modern expense-splitting apps make it easy to track who paid for what and who owes whom. These tools automatically calculate balances and send reminders, reducing friction in the payment process.</p>

<p>Look for apps that offer features like receipt scanning, multiple currency support, and integration with payment platforms. The easier it is to log expenses, the more likely everyone will stay on top of their contributions.</p>

<h2>Final Thoughts</h2>
<p>Successfully splitting expenses with roommates requires communication, flexibility, and the right tools. By establishing clear guidelines from the start and using technology to simplify tracking, you can focus on enjoying your living situation rather than stressing about money.</p>`,
    category: 'Roommate Tips',
    author: 'Sarah Johnson',
    author_bio: 'Sarah is a financial advisor specializing in shared living arrangements and group expense management.',
    image_url: '/imgs/post1.jpg',
    published_date: '2023-02-16',
    read_time: '5 min read',
    tags: ['Roommates', 'Fair Split', 'Budgeting'],
    is_published: true,
    order: 3
  },
  {
    slug: 'managing-group-travel-expenses',
    title: 'Managing Group Travel Expenses Made Easy',
    excerpt: 'Discover how digital expense tracking helps travel groups stay organized and ensures everyone pays their fair share.',
    content: `<p>Group travel can create unforgettable memories, but managing expenses among multiple people often becomes a source of stress. From booking accommodations to splitting dinner bills, keeping track of who paid for what can quickly become overwhelming.</p>

<h2>Planning Before You Go</h2>
<p>The key to stress-free group travel finances starts before you even leave home. Gather your travel companions and discuss budget expectations, spending styles, and how you'll handle shared costs.</p>

<p>Create a shared budget that covers major expenses like accommodation, transportation, and activities. Decide whether you'll split everything equally or track individual expenses and settle up at the end.</p>

<h2>Setting Up a Group Fund</h2>
<p>Consider establishing a group travel fund before departure. Each person contributes an agreed-upon amount upfront, which covers major shared expenses. This eliminates the need for constant calculations during the trip.</p>

<p>Designate one person as the treasurer who manages the fund and keeps receipts. Use a shared spreadsheet or expense-tracking app to maintain transparency about how funds are being used.</p>

<h2>Handling Daily Expenses</h2>
<p>For day-to-day costs like meals and activities, establish a rotation system where different people take turns paying. This reduces the number of transactions and makes settling up easier later.</p>

<p>Use expense-splitting apps to log costs in real-time. Take photos of receipts and categorize expenses immediately while details are fresh. This prevents disputes and forgotten charges later.</p>

<h2>Settling Up After the Trip</h2>
<p>Don't wait too long after returning home to settle accounts. Memories fade and receipts get lost. Aim to finalize all payments within a week of returning.</p>

<p>Modern expense apps can calculate who owes whom and suggest the minimum number of transactions needed to settle all debts. This simplifies the process significantly compared to everyone paying everyone else.</p>

<h2>Conclusion</h2>
<p>Managing group travel expenses doesn't have to be complicated. With proper planning, clear communication, and the right tools, you can focus on creating memories rather than tracking receipts. The investment in setting up a good system pays off in stress-free travel and maintained friendships.</p>`,
    category: 'Travel & Trips',
    author: 'Michael Chen',
    author_bio: 'Michael is a travel blogger and financial consultant who specializes in group travel planning.',
    image_url: '/imgs/post2.jpg',
    published_date: '2023-02-16',
    read_time: '6 min read',
    tags: ['Travel', 'Groups', 'Tracking'],
    is_published: true,
    order: 2
  },
  {
    slug: 'psychology-of-shared-expenses',
    title: 'The Psychology of Shared Expenses',
    excerpt: 'Understanding the emotional and social dynamics of splitting costs can help maintain healthy relationships and financial transparency.',
    content: `<p>Money is often called the last taboo in relationships, and nowhere is this more evident than when sharing expenses. Understanding the psychological factors at play can help navigate these potentially awkward situations with grace and maintain healthy relationships.</p>

<h2>The Emotional Weight of Money</h2>
<p>Money carries emotional significance beyond its practical value. It represents security, freedom, status, and power. When we share expenses, we're not just dividing costs—we're navigating complex emotional terrain.</p>

<p>Different people have different "money scripts"—unconscious beliefs about money formed in childhood. Some view money as scarce and must be carefully guarded, while others see it as abundant and meant to be shared. These fundamental differences can create friction in shared expense situations.</p>

<h2>Fairness vs. Equality</h2>
<p>One of the biggest psychological challenges in shared expenses is the difference between fairness and equality. Equal splits are mathematically simple but may not feel fair to everyone involved.</p>

<p>Consider a dinner where one person orders an expensive steak and wine while another has a salad and water. An equal split might feel unfair to the frugal diner. Yet tracking individual orders can feel petty and damage the social atmosphere.</p>

<h2>Building Trust Through Transparency</h2>
<p>Transparency in shared expenses builds trust and reduces anxiety. When everyone can see what's been spent and who owes what, it eliminates suspicion and second-guessing.</p>

<p>Use tools that provide clear, accessible records of all transactions. This transparency serves as a neutral third party, removing the emotional charge from money conversations.</p>

<h2>Conclusion</h2>
<p>Understanding the psychology behind shared expenses helps us navigate these situations with empathy and effectiveness. By recognizing the emotional dimensions of money and implementing systems that address psychological needs, we can maintain both financial clarity and strong relationships.</p>`,
    category: 'Financial Planning',
    author: 'Dr. Emily Rodriguez',
    author_bio: 'Dr. Rodriguez is a psychologist specializing in financial relationships and behavioral economics.',
    image_url: '/imgs/post3.jpg',
    published_date: '2023-02-15',
    read_time: '7 min read',
    tags: ['Psychology', 'Relationships', 'Money'],
    is_published: true,
    order: 1
  }
];

// Blog Categories
const blogCategories = [
  { name: 'All', slug: 'all', order: 0, is_active: true },
  { name: 'Expense Splitting', slug: 'expense-splitting', order: 1, is_active: true },
  { name: 'Group Management', slug: 'group-management', order: 2, is_active: true },
  { name: 'Travel & Trips', slug: 'travel-trips', order: 3, is_active: true },
  { name: 'Roommate Tips', slug: 'roommate-tips', order: 4, is_active: true },
  { name: 'Financial Planning', slug: 'financial-planning', order: 5, is_active: true },
  { name: 'App Features', slug: 'app-features', order: 6, is_active: true }
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
      const label = doc.title || doc.name || doc.slug;
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
async function importBlog() {
  console.log('🚀 Starting Blog Import...\n');
  
  const results = {
    posts: await importCollection('blog_posts', blogPosts, 'Blog Posts'),
    categories: await importCollection('blog_categories', blogCategories, 'Blog Categories')
  };
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 Blog Import Complete!');
  console.log('='.repeat(50));
  
  const totalSuccess = Object.values(results).reduce((sum, r) => sum + r.success, 0);
  const totalErrors = Object.values(results).reduce((sum, r) => sum + r.errors, 0);
  
  console.log(`\n📊 Total: ${totalSuccess} documents created, ${totalErrors} errors`);
  console.log('\n✅ Blog is now ready to be made dynamic!\n');
}

importBlog().catch(console.error);
