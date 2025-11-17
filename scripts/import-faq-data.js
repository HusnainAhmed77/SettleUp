const { Client, Databases, ID } = require('node-appwrite');

// Configuration
const client = new Client()
    .setEndpoint('https://tor.cloud.appwrite.io/v1')
    .setProject('691acc3e001a5242479f')
    .setKey('standard_e2bff202bae739a02e61e5d940da9a1b5173bafe3653eba4390fba0a684171dfb787b88c9ce138bd2b9716cd237be63f4c632dc7d0d84d0d39080e22337f0e6696dd9f5cad53c50b89c9aea84dfa646a5fe7dd1226fbef0f9dd3e3a814ad31a3c6a7add8b75dc1b62d2cd9039e3f36c1029ec933c2447d03857736fadfdedfc5');

const databases = new Databases(client);
const DATABASE_ID = '691ad3650035c64ba996';
const COLLECTION_ID = 'faq_page';

// Complete FAQ data from the current page
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
    question: 'Is my financial data secure?',
    answer: 'Absolutely. We use bank-level encryption to protect your data, and we never store your payment information. All data is encrypted in transit and at rest. We also never sell your personal information to third parties. Your privacy and security are our top priorities.',
    category: 'Security',
    order: 4,
    is_active: true
  },
  {
    question: 'Can I add expenses from the past?',
    answer: 'Yes, you can add expenses with any date. When creating an expense, simply change the date to when the expense actually occurred. This is useful for catching up on expenses you forgot to log or for importing historical data.',
    category: 'Expenses',
    order: 5,
    is_active: true
  },
  {
    question: 'How do I settle up with someone?',
    answer: 'To settle up, go to your group or friend page and click the "Settle up" button. You can record a payment in full or partial amount. Once recorded, the balance will be updated automatically. You can also add a note about the payment method used.',
    category: 'Payments',
    order: 6,
    is_active: true
  },
  {
    question: 'Can I export my expense data?',
    answer: 'Yes, you can export your expense history as a CSV or Excel file. Go to your account settings, select "Export data," choose your date range and format, and download your complete expense history. This is useful for tax purposes or personal record-keeping.',
    category: 'Features',
    order: 7,
    is_active: true
  },
  {
    question: 'What happens if someone leaves a group?',
    answer: 'When someone leaves a group, their expense history remains intact, but they won\'t be able to add new expenses or see new activity. Any outstanding balances they have will still be visible. You can settle up with them before they leave or keep the balance for future reference.',
    category: 'Groups',
    order: 8,
    is_active: true
  },
  {
    question: 'How do I delete an expense?',
    answer: 'To delete an expense, open the expense details and click the delete button. Note that deleting an expense will update all balances accordingly. If other people were involved in the expense, they\'ll be notified of the deletion.',
    category: 'Expenses',
    order: 9,
    is_active: true
  }
];

async function importFAQs() {
  console.log('🚀 Importing FAQ Page Data...\n');
  
  let successCount = 0;
  let errorCount = 0;

  for (const faq of faqData) {
    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        faq
      );
      console.log(`✅ Created: ${faq.question}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error creating "${faq.question}":`, error.message);
      errorCount++;
    }
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log('🎉 FAQ Import Complete!');
  console.log(`${'='.repeat(50)}`);
  console.log(`✅ Success: ${successCount} FAQs`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('\n✅ Next: I will update the FAQ page component to use this data!');
}

importFAQs().catch(console.error);
