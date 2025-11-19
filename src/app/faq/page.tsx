'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { faqService, FAQ } from '@/services/faqService';

export const dynamic = 'force-dynamic';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [hero, setHero] = useState<FAQ | null>(null);
  const [cta, setCta] = useState<FAQ | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const [faqData, heroData, ctaData] = await Promise.all([
          faqService.getAllFAQs(),
          faqService.getHero(),
          faqService.getCTA()
        ]);
        setFaqs(faqData);
        setHero(heroData);
        setCta(ctaData);
      } catch (error) {
        console.error('Error loading FAQs:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchFAQs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF007F] mx-auto mb-4"></div>
          <p className="text-[#666666]">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen relative">
      {/* Facets Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/facets.png"
          alt="Background pattern"
          fill
          className="object-cover"
        />
      </div>

      {/* Magenta Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF007F]/10 via-transparent to-[#00CFFF]/10 z-0"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-gray-200/30 py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {hero?.title || 'Frequently Asked Questions'}
              </h1>
              <p className="text-lg text-[#666666]">
                {hero?.description || 'Find answers to common questions about using SettleUp'}
              </p>
            </motion.div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
              >
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg md:text-xl font-bold text-[#333333] pr-8">
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      </div>
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2">
                          <p className="text-[#666666] leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

        </main>
      </div>

      {/* Contact Section - Full Width CTA */}
      <section className="relative overflow-hidden py-20 text-white">
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              {cta?.title || 'Still have questions?'}
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
              {cta?.description || 'Can\'t find the answer you\'re looking for? Our support team is here to help.'}
            </p>
            <button
              onClick={() => (window.location.href = '/contact')}
              className="bg-white text-[#FF007F] hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg"
            >
              Contact Support
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
