const { Client, Databases, ID } = require('node-appwrite');

// Configuration
const client = new Client()
    .setEndpoint('https://tor.cloud.appwrite.io/v1')
    .setProject('691acc3e001a5242479f')
    .setKey('standard_e2bff202bae739a02e61e5d940da9a1b5173bafe3653eba4390fba0a684171dfb787b88c9ce138bd2b9716cd237be63f4c632dc7d0d84d0d39080e22337f0e6696dd9f5cad53c50b89c9aea84dfa646a5fe7dd1226fbef0f9dd3e3a814ad31a3c6a7add8b75dc1b62d2cd9039e3f36c1029ec933c2447d03857736fadfdedfc5');

const databases = new Databases(client);
const DATABASE_ID = '691ad3650035c64ba996';
const COLLECTION_ID = 'features_page';

// Complete features data from the current page
const featuresData = [
  {
    section_id: 'hero',
    title: 'Our Features & Services.',
    description: 'Everything you need to split expenses and track shared costs with ease and transparency.',
    order: 0,
    is_active: true
  },
  {
    section_id: 'track_balances',
    title: 'Track Balances',
    description: 'Keep track of shared expenses, balances, and who owes who in real-time.',
    detailed_description: 'Our intelligent balance tracking system automatically calculates who owes what after each expense. View detailed breakdowns, see your net balance across all groups, and get a clear picture of your financial relationships. Never lose track of shared costs again with our comprehensive balance management.',
    icon: 'Users',
    color: 'from-blue-400 to-blue-600',
    order: 1,
    is_active: true
  },
  {
    section_id: 'organize_expenses',
    title: 'Organize Expenses',
    description: 'Split expenses with any group: trips, housemates, friends, and family.',
    detailed_description: 'Create unlimited groups for different occasions - roommate expenses, vacation trips, dinner parties, or family events. Organize expenses by category, add notes and receipts, and keep everything neatly structured. Our flexible group system adapts to any sharing scenario you encounter.',
    icon: 'Receipt',
    color: 'from-purple-400 to-purple-600',
    order: 2,
    is_active: true
  },
  {
    section_id: 'add_expenses',
    title: 'Add Expenses Easily',
    description: 'Quickly add expenses on the go before you forget who paid.',
    detailed_description: 'Adding expenses is lightning fast with our streamlined interface. Snap a photo of the receipt, enter the amount, select participants, and you\'re done. Our smart suggestions remember your frequent expenses and participants, making data entry even faster over time.',
    icon: 'DollarSign',
    color: 'from-green-400 to-green-600',
    order: 3,
    is_active: true
  },
  {
    section_id: 'settle_up',
    title: 'Settle Up',
    description: 'Record cash or online payments and keep balances up to date.',
    detailed_description: 'When it\'s time to settle debts, our settlement system shows you the most efficient way to balance accounts. Record payments made through cash, Venmo, PayPal, or any other method. The system automatically updates all balances and maintains a complete payment history.',
    icon: 'TrendingUp',
    color: 'from-orange-400 to-orange-600',
    order: 4,
    is_active: true
  },
  {
    section_id: 'reminders',
    title: 'Get Reminders',
    description: 'Receive friendly reminders about upcoming bills and balances.',
    detailed_description: 'Never miss a payment with customizable reminders. Set up notifications for recurring expenses, payment due dates, or when balances exceed certain amounts. Our gentle reminder system helps maintain financial harmony without being pushy or annoying.',
    icon: 'Bell',
    color: 'from-red-400 to-red-600',
    order: 5,
    is_active: true
  },
  {
    section_id: 'access_anywhere',
    title: 'Access Anywhere',
    description: 'Use on iPhone, Android, or web - your data syncs automatically.',
    detailed_description: 'Your expense data is always available across all your devices. Start an expense on your phone, review it on your tablet, and settle up on your computer. Real-time synchronization ensures everyone in your group sees updates instantly, no matter what device they\'re using.',
    icon: 'Smartphone',
    color: 'from-cyan-400 to-cyan-600',
    order: 6,
    is_active: true
  },
  {
    section_id: 'split_percentage',
    title: 'Split by Percentage',
    description: 'Split expenses by exact amounts, percentages, or shares.',
    detailed_description: 'Choose from multiple splitting methods to match any situation. Split equally, by exact amounts, by percentages, or by custom shares. Perfect for situations where costs should be divided based on usage, income levels, or any other criteria that makes sense for your group.',
    icon: 'PieChart',
    color: 'from-pink-400 to-pink-600',
    order: 7,
    is_active: true
  },
  {
    section_id: 'multiple_currencies',
    title: 'Multiple Currencies',
    description: 'Track expenses in multiple currencies with automatic conversion.',
    detailed_description: 'Traveling internationally? No problem. Add expenses in any currency and our system automatically converts them using current exchange rates. View your balances in your preferred currency while maintaining accurate records of the original transaction amounts.',
    icon: 'Globe',
    color: 'from-indigo-400 to-indigo-600',
    order: 8,
    is_active: true
  },
  {
    section_id: 'receipt_scanning',
    title: 'Receipt Scanning',
    description: 'Scan and attach receipts to expenses for easy record keeping.',
    detailed_description: 'Keep digital copies of all your receipts for tax purposes or reimbursement. Our receipt scanner captures images, extracts key information, and attaches them to the relevant expense. Search through receipts, export them for accounting, and never lose an important document again.',
    icon: 'Camera',
    color: 'from-yellow-400 to-yellow-600',
    order: 9,
    is_active: true
  },
  {
    section_id: 'cta',
    title: 'Ready to Get Started?',
    description: 'Join thousands of users who are already managing their shared expenses with ease.',
    order: 10,
    is_active: true
  }
];

async function importFeatures() {
  console.log('🚀 Importing Features Page Data...\n');
  
  let successCount = 0;
  let errorCount = 0;

  for (const feature of featuresData) {
    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        feature
      );
      console.log(`✅ Created: ${feature.title || feature.section_id}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error creating "${feature.title || feature.section_id}":`, error.message);
      errorCount++;
    }
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log('🎉 Features Import Complete!');
  console.log(`${'='.repeat(50)}`);
  console.log(`✅ Success: ${successCount} features`);
  console.log(`❌ Errors: ${errorCount}`);
}

importFeatures().catch(console.error);
