'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Receipt, 
  DollarSign, 
  Bell, 
  Smartphone, 
  PieChart, 
  Globe, 
  Camera, 
  TrendingUp,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Feature {
  title: string;
  description: string;
  detailedDescription: string;
  icon: any;
  color: string;
}

export default function FeaturesPage() {
  const [expandedCards, setExpandedCards] = useState<number[]>([]);

  const features: Feature[] = [
    {
      title: "Track Balances",
      description: "Keep track of shared expenses, balances, and who owes who in real-time.",
      detailedDescription: "Our intelligent balance tracking system automatically calculates who owes what after each expense. View detailed breakdowns, see your net balance across all groups, and get a clear picture of your financial relationships. Never lose track of shared costs again with our comprehensive balance management.",
      icon: Users,
      color: "from-blue-400 to-blue-600"
    },
    {
      title: "Organize Expenses",
      description: "Split expenses with any group: trips, housemates, friends, and family.",
      detailedDescription: "Create unlimited groups for different occasions - roommate expenses, vacation trips, dinner parties, or family events. Organize expenses by category, add notes and receipts, and keep everything neatly structured. Our flexible group system adapts to any sharing scenario you encounter.",
      icon: Receipt,
      color: "from-purple-400 to-purple-600"
    },
    {
      title: "Add Expenses Easily",
      description: "Quickly add expenses on the go before you forget who paid.",
      detailedDescription: "Adding expenses is lightning fast with our streamlined interface. Snap a photo of the receipt, enter the amount, select participants, and you're done. Our smart suggestions remember your frequent expenses and participants, making data entry even faster over time.",
      icon: DollarSign,
      color: "from-green-400 to-green-600"
    },
    {
      title: "Settle Up",
      description: "Record cash or online payments and keep balances up to date.",
      detailedDescription: "When it's time to settle debts, our settlement system shows you the most efficient way to balance accounts. Record payments made through cash, Venmo, PayPal, or any other method. The system automatically updates all balances and maintains a complete payment history.",
      icon: TrendingUp,
      color: "from-orange-400 to-orange-600"
    },
    {
      title: "Get Reminders",
      description: "Receive friendly reminders about upcoming bills and balances.",
      detailedDescription: "Never miss a payment with customizable reminders. Set up notifications for recurring expenses, payment due dates, or when balances exceed certain amounts. Our gentle reminder system helps maintain financial harmony without being pushy or annoying.",
      icon: Bell,
      color: "from-red-400 to-red-600"
    },
    {
      title: "Access Anywhere",
      description: "Use on iPhone, Android, or web - your data syncs automatically.",
      detailedDescription: "Your expense data is always available across all your devices. Start an expense on your phone, review it on your tablet, and settle up on your computer. Real-time synchronization ensures everyone in your group sees updates instantly, no matter what device they're using.",
      icon: Smartphone,
      color: "from-cyan-400 to-cyan-600"
    },
    {
      title: "Split by Percentage",
      description: "Split expenses by exact amounts, percentages, or shares.",
      detailedDescription: "Choose from multiple splitting methods to match any situation. Split equally, by exact amounts, by percentages, or by custom shares. Perfect for situations where costs should be divided based on usage, income levels, or any other criteria that makes sense for your group.",
      icon: PieChart,
      color: "from-pink-400 to-pink-600"
    },
    {
      title: "Multiple Currencies",
      description: "Track expenses in multiple currencies with automatic conversion.",
      detailedDescription: "Traveling internationally? No problem. Add expenses in any currency and our system automatically converts them using current exchange rates. View your balances in your preferred currency while maintaining accurate records of the original transaction amounts.",
      icon: Globe,
      color: "from-indigo-400 to-indigo-600"
    },
    {
      title: "Receipt Scanning",
      description: "Scan and attach receipts to expenses for easy record keeping.",
      detailedDescription: "Keep digital copies of all your receipts for tax purposes or reimbursement. Our receipt scanner captures images, extracts key information, and attaches them to the relevant expense. Search through receipts, export them for accounting, and never lose an important document again.",
      icon: Camera,
      color: "from-yellow-400 to-yellow-600"
    }
  ];

  const toggleCard = (index: number) => {
    setExpandedCards(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen relative">
      {/* Facets Background Image */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url('/images/facets.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      </div>

      {/* Magenta Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#FF007F]/10 via-transparent to-[#00CFFF]/10 z-0"></div>

      <div className="relative z-10">
      {/* Hero Section */}
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-semibold text-[#FF007F] tracking-wider mb-4">
              FEATURES
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-[#333333] mb-6">
              Our Features & Services.
            </h1>
            <p className="text-xl text-[#666666] max-w-2xl mx-auto">
              Everything you need to split expenses and track shared costs with ease and transparency.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <main className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isExpanded = expandedCards.includes(index);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Icon Section */}
                <div className={`relative h-48 bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                  <div className="relative z-10">
                    <Icon className="w-24 h-24 text-white" strokeWidth={1.5} />
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 rounded-full" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/20 rounded-full" />
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#FF007F] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#666666] mb-4 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-[#666666] mb-4 leading-relaxed border-t border-gray-100 pt-4">
                          {feature.detailedDescription}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* More Button */}
                  <button
                    onClick={() => toggleCard(index)}
                    className="w-full mt-4 px-6 py-3 bg-[#FF007F] hover:bg-[#00CFFF] text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <span>{isExpanded ? 'LESS' : 'MORE'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* CTA Section */}
      <div className="relative overflow-hidden py-20">
        {/* Gradient Background - behind facets */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF007F] to-[#00CFFF] z-0"></div>

        {/* Facets Pattern - in front of gradient */}
        <div 
          className="absolute inset-0 z-10"
          style={{
            backgroundImage: 'url(/images/facets.png)',
            backgroundPosition: 'center',
            backgroundSize: '1000px',
            backgroundRepeat: 'repeat',
            opacity: 1
          }}
        ></div>

        <div className="container mx-auto px-4 text-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of users who are already managing their shared expenses with ease.
            </p>
            <button className="px-10 py-4 bg-white text-[#FF007F] font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg">
              Start Splitting Now
            </button>
          </motion.div>
        </div>
      </div>
      </div>
    </div>
  );
}
