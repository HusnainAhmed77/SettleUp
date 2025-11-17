'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Tag, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';

export const dynamic = 'force-dynamic';

// Mock blog data - in a real app, this would come from a CMS or API
const blogPosts: Record<string, any> = {
  'how-to-split-expenses-fairly': {
    title: 'How to Split Expenses Fairly Among Roommates',
    category: 'Tips & Guides',
    date: 'February 16, 2023',
    author: 'Sarah Johnson',
    authorBio: 'Sarah is a financial advisor specializing in shared living arrangements and group expense management.',
    readTime: '5 min read',
    tags: ['Roommates', 'Expense Splitting', 'Best Practices'],
    content: `
      <p>Living with roommates can be one of the most rewarding experiences, but it can also lead to tension when it comes to splitting expenses. Whether you're sharing an apartment, house, or just splitting bills, having a clear system in place is essential for maintaining harmony.</p>

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

      <h2>Setting Clear Expectations</h2>
      <p>Create a roommate agreement that outlines your expense-splitting arrangement. Include details about:</p>
      <ul>
        <li>Which expenses are shared and which are individual</li>
        <li>Payment due dates and methods</li>
        <li>How to handle late payments</li>
        <li>Procedures for adding or removing roommates</li>
        <li>What happens when someone moves out</li>
      </ul>

      <h2>Handling Conflicts</h2>
      <p>Even with the best systems in place, disagreements can arise. Address issues promptly and directly. If someone consistently pays late or disputes charges, have a calm conversation to understand their perspective and find a solution.</p>

      <p>Consider designating one person as the "finance manager" who tracks expenses and sends monthly summaries. Rotate this responsibility to ensure fairness and prevent burnout.</p>

      <h2>Final Thoughts</h2>
      <p>Successfully splitting expenses with roommates requires communication, flexibility, and the right tools. By establishing clear guidelines from the start and using technology to simplify tracking, you can focus on enjoying your living situation rather than stressing about money.</p>

      <p>Remember, the goal isn't just to split costs—it's to maintain positive relationships while sharing a living space. A little effort upfront in setting up a fair system pays dividends in harmony and peace of mind.</p>
    `
  },
  'managing-group-travel-expenses': {
    title: 'Managing Group Travel Expenses Made Easy',
    category: 'Travel Tips',
    date: 'February 16, 2023',
    author: 'Michael Chen',
    authorBio: 'Michael is a travel blogger and financial consultant who specializes in group travel planning.',
    readTime: '6 min read',
    tags: ['Travel', 'Group Expenses', 'Planning'],
    content: `
      <p>Group travel can create unforgettable memories, but managing expenses among multiple people often becomes a source of stress. From booking accommodations to splitting dinner bills, keeping track of who paid for what can quickly become overwhelming.</p>

      <h2>Planning Before You Go</h2>
      <p>The key to stress-free group travel finances starts before you even leave home. Gather your travel companions and discuss budget expectations, spending styles, and how you'll handle shared costs.</p>

      <p>Create a shared budget that covers major expenses like accommodation, transportation, and activities. Decide whether you'll split everything equally or track individual expenses and settle up at the end.</p>

      <h2>Setting Up a Group Fund</h2>
      <p>Consider establishing a group travel fund before departure. Each person contributes an agreed-upon amount upfront, which covers major shared expenses. This eliminates the need for constant calculations during the trip.</p>

      <p>Designate one person as the treasurer who manages the fund and keeps receipts. Use a shared spreadsheet or expense-tracking app to maintain transparency about how funds are being used.</p>

      <h2>Handling Daily Expenses</h2>
      <p>For day-to-day costs like meals and activities, establish a rotation system where different people take turns paying. This reduces the number of transactions and makes settling up easier later.</p>

      <p>Use expense-splitting apps to log costs in real-time. Take photos of receipts and categorize expenses immediately while details are fresh. This prevents disputes and forgotten charges later.</p>

      <h2>Dealing with Different Budgets</h2>
      <p>Not everyone in your group may have the same budget. Some travelers might prefer luxury accommodations while others are happy with budget options. Address these differences early:</p>
      <ul>
        <li>Allow people to opt out of expensive activities without judgment</li>
        <li>Split accommodation costs proportionally if room quality varies</li>
        <li>Keep some meals flexible so people can choose their own dining options</li>
        <li>Be transparent about costs before committing to activities</li>
      </ul>

      <h2>Currency Conversion Challenges</h2>
      <p>International travel adds complexity with multiple currencies and exchange rates. Use apps that automatically convert currencies and apply the correct exchange rate at the time of purchase.</p>

      <p>Decide whether to use the exchange rate from the day of purchase or the day of settlement. Consistency is more important than perfection—choose a method and stick with it.</p>

      <h2>Settling Up After the Trip</h2>
      <p>Don't wait too long after returning home to settle accounts. Memories fade and receipts get lost. Aim to finalize all payments within a week of returning.</p>

      <p>Modern expense apps can calculate who owes whom and suggest the minimum number of transactions needed to settle all debts. This simplifies the process significantly compared to everyone paying everyone else.</p>

      <h2>Tips for Smooth Group Travel Finances</h2>
      <ul>
        <li>Discuss money matters before booking anything</li>
        <li>Use technology to track expenses in real-time</li>
        <li>Be flexible and understanding of different financial situations</li>
        <li>Keep communication open throughout the trip</li>
        <li>Settle accounts promptly after returning</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Managing group travel expenses doesn't have to be complicated. With proper planning, clear communication, and the right tools, you can focus on creating memories rather than tracking receipts. The investment in setting up a good system pays off in stress-free travel and maintained friendships.</p>
    `
  },
  'psychology-of-shared-expenses': {
    title: 'The Psychology of Shared Expenses',
    category: 'Relationships',
    date: 'February 15, 2023',
    author: 'Dr. Emily Rodriguez',
    authorBio: 'Dr. Rodriguez is a psychologist specializing in financial relationships and behavioral economics.',
    readTime: '7 min read',
    tags: ['Psychology', 'Relationships', 'Communication'],
    content: `
      <p>Money is often called the last taboo in relationships, and nowhere is this more evident than when sharing expenses. Understanding the psychological factors at play can help navigate these potentially awkward situations with grace and maintain healthy relationships.</p>

      <h2>The Emotional Weight of Money</h2>
      <p>Money carries emotional significance beyond its practical value. It represents security, freedom, status, and power. When we share expenses, we're not just dividing costs—we're navigating complex emotional terrain.</p>

      <p>Different people have different "money scripts"—unconscious beliefs about money formed in childhood. Some view money as scarce and must be carefully guarded, while others see it as abundant and meant to be shared. These fundamental differences can create friction in shared expense situations.</p>

      <h2>Fairness vs. Equality</h2>
      <p>One of the biggest psychological challenges in shared expenses is the difference between fairness and equality. Equal splits are mathematically simple but may not feel fair to everyone involved.</p>

      <p>Consider a dinner where one person orders an expensive steak and wine while another has a salad and water. An equal split might feel unfair to the frugal diner. Yet tracking individual orders can feel petty and damage the social atmosphere.</p>

      <h2>The Reciprocity Principle</h2>
      <p>Humans have a deep-seated need for reciprocity—we feel obligated to return favors and balance social exchanges. When expense-sharing feels unbalanced, it triggers psychological discomfort.</p>

      <p>This is why keeping track of shared expenses is so important. It's not about being petty; it's about maintaining psychological equilibrium in relationships. Clear tracking prevents the buildup of resentment that comes from perceived imbalances.</p>

      <h2>Communication Barriers</h2>
      <p>Many people find it difficult to discuss money openly. This reluctance stems from various sources:</p>
      <ul>
        <li>Fear of appearing cheap or greedy</li>
        <li>Concern about damaging relationships</li>
        <li>Embarrassment about financial situations</li>
        <li>Cultural taboos around money discussions</li>
      </ul>

      <p>These barriers can lead to passive-aggressive behavior, avoided conversations, and festering resentment. Breaking through these barriers requires conscious effort and creating safe spaces for money discussions.</p>

      <h2>The Power Dynamic</h2>
      <p>Shared expenses can create or reveal power imbalances in relationships. The person who pays often feels entitled to make decisions, while the person who owes money may feel obligated or resentful.</p>

      <p>This dynamic is particularly pronounced when there are income disparities. The higher earner might feel burdened by always paying more, while the lower earner might feel inadequate or dependent.</p>

      <h2>Building Trust Through Transparency</h2>
      <p>Transparency in shared expenses builds trust and reduces anxiety. When everyone can see what's been spent and who owes what, it eliminates suspicion and second-guessing.</p>

      <p>Use tools that provide clear, accessible records of all transactions. This transparency serves as a neutral third party, removing the emotional charge from money conversations.</p>

      <h2>The Role of Technology</h2>
      <p>Modern expense-splitting apps do more than just math—they serve important psychological functions:</p>
      <ul>
        <li>They create emotional distance from money discussions</li>
        <li>They provide objective records that prevent memory disputes</li>
        <li>They automate uncomfortable reminders about payments</li>
        <li>They make the invisible visible, reducing anxiety about fairness</li>
      </ul>

      <h2>Strategies for Healthy Expense Sharing</h2>
      <p>To maintain psychological well-being while sharing expenses:</p>
      <ul>
        <li>Establish clear expectations upfront</li>
        <li>Communicate openly about financial situations</li>
        <li>Use neutral tools to track and manage expenses</li>
        <li>Address imbalances promptly before resentment builds</li>
        <li>Respect different money values and scripts</li>
        <li>Focus on the relationship, not just the money</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Understanding the psychology behind shared expenses helps us navigate these situations with empathy and effectiveness. By recognizing the emotional dimensions of money and implementing systems that address psychological needs, we can maintain both financial clarity and strong relationships.</p>
    `
  }
};

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const post = blogPosts[slug];

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#333333] mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-[#FF007F] hover:text-[#00CFFF] font-semibold">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Facets Background */}
      <div className="fixed inset-0 z-0 opacity-30">
        <Image
          src="/images/facets.png"
          alt="Background pattern"
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10">
        {/* Back Button */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#666666] hover:text-[#FF007F] transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </div>

        {/* Article Container */}
        <article className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Article Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
            >
              {/* Category Badge */}
              <div className="px-8 pt-8">
                <span className="inline-block px-4 py-2 bg-[#FF007F] text-white text-sm font-semibold rounded-full">
                  {post.category}
                </span>
              </div>

              {/* Article Header */}
              <div className="px-8 pt-6 pb-8 border-b border-gray-200">
                <h1 className="text-4xl md:text-5xl font-bold text-[#333333] mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-[#666666] text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#FF007F] font-medium">{post.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="px-8 py-12">
                <div
                  className="prose prose-lg max-w-none prose-headings:text-[#333333] prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-[#666666] prose-p:leading-relaxed prose-p:mb-6 prose-ul:text-[#666666] prose-ul:my-6 prose-li:mb-2 prose-strong:text-[#333333] prose-strong:font-semibold prose-a:text-[#FF007F] prose-a:no-underline hover:prose-a:text-[#00CFFF]"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>

              {/* Tags */}
              <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3 flex-wrap">
                  <Tag className="w-5 h-5 text-[#666666]" />
                  {post.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white border border-gray-200 text-[#666666] text-sm rounded-full hover:border-[#FF007F] hover:text-[#FF007F] transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share Buttons */}
              <div className="px-8 py-6 border-t border-gray-200">
                <p className="text-sm font-semibold text-[#333333] mb-4">Share this article:</p>
                <div className="flex gap-3">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-lg transition-colors font-medium text-sm"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </a>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#EA4335] hover:bg-[#D93025] text-white rounded-lg transition-colors font-medium text-sm">
                    <Mail className="w-4 h-4" />
                    Email
                  </button>
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] hover:bg-[#1A91DA] text-white rounded-lg transition-colors font-medium text-sm"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] hover:bg-[#095196] text-white rounded-lg transition-colors font-medium text-sm"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                </div>
              </div>

              {/* Author Bio */}
              <div className="px-8 py-8 bg-gray-50 border-t border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FF007F] to-[#4A90E2] rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {post.author.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#333333] mb-2">{post.author}</h3>
                    <p className="text-[#666666] leading-relaxed">{post.authorBio}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Related Posts Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-16"
            >
              <h2 className="text-3xl font-bold text-[#333333] mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(blogPosts)
                  .filter(([key]) => key !== slug)
                  .slice(0, 2)
                  .map(([key, relatedPost]) => (
                    <Link key={key} href={`/blog/${key}`}>
                      <div className="group bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                        <div className="p-6 flex flex-col flex-1">
                          <span className="inline-block px-3 py-1 bg-[#FF007F] text-white text-xs font-semibold rounded-full mb-3 w-fit">
                            {relatedPost.category}
                          </span>
                          <h3 className="text-xl font-bold text-[#333333] mb-3 group-hover:text-[#FF007F] transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h3>
                          <p className="text-[#666666] text-sm mb-4 line-clamp-3 flex-1">
                            {relatedPost.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                          </p>
                          <div className="flex items-center gap-4 text-xs text-[#999999] mt-auto">
                            <span>{relatedPost.date}</span>
                            <span>•</span>
                            <span>{relatedPost.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </motion.div>
          </div>
        </article>
      </div>
    </div>
  );
}
