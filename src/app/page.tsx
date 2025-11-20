'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { homePageService, HomePageSection } from '@/services/homePageService';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [sections, setSections] = useState<Record<string, HomePageSection>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        const allSections = await homePageService.getAllSections();
        
        // Convert array to object with section_id as key for easy access
        const sectionsMap = allSections.reduce((acc, section) => {
          acc[section.section_id] = section;
          return acc;
        }, {} as Record<string, HomePageSection>);
        
        setSections(sectionsMap);
      } catch (error) {
        console.error('Error loading page content:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchContent();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF007F] mx-auto mb-4"></div>
          <p className="text-[#666666]">Loading...</p>
        </div>
      </div>
    );
  }

  // Get sections with fallback to default content
  const hero = sections['hero'];
  const cta = sections['cta'];
  
  // Get features (feature_1, feature_2, feature_3)
  const features = [
    sections['feature_1'],
    sections['feature_2'],
    sections['feature_3']
  ].filter(Boolean);
  
  // Get testimonials (testimonial_1 through testimonial_6)
  const testimonials = [
    sections['testimonial_1'],
    sections['testimonial_2'],
    sections['testimonial_3'],
    sections['testimonial_4'],
    sections['testimonial_5'],
    sections['testimonial_6']
  ].filter(Boolean);
  
  // Get contact methods (contact_1, contact_2, contact_3)
  const contactMethods = [
    sections['contact_1'],
    sections['contact_2'],
    sections['contact_3']
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        {/* Facets Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/facets.png"
            alt="Background pattern"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Magenta Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF007F]/10 via-transparent to-[#00CFFF]/10 z-0"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[1fr_auto] gap-16 items-center justify-center">
              {/* Left Column - Content */}
              <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="w-full"
                >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#333333] leading-tight">
                    {hero?.heading || 'Less Stress When'}
                    <span className="block text-[#FF007F] mt-2">{hero?.subheading || 'Sharing Expenses'}</span>
                  </h1>

                  <p className="text-lg text-[#666666] mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                    {hero?.content || 'Keep track of your shared expenses and balances with housemates, trips, groups, friends, and family. Split bills easily and settle up with confidence.'}
                  </p>

                  {/* App Store Buttons */}
                  <div className="flex flex-wrap gap-4 mb-12 justify-center lg:justify-start">
                    <a href="#" className="inline-block">
                      <div className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-3 hover:bg-gray-800 transition-colors">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                        </svg>
                        <div className="text-left">
                          <div className="text-xs">Download on the</div>
                          <div className="text-sm font-semibold">App Store</div>
                        </div>
                      </div>
                    </a>
                    <a href="#" className="inline-block">
                      <div className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-3 hover:bg-gray-800 transition-colors">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                        </svg>
                        <div className="text-left">
                          <div className="text-xs">GET IT ON</div>
                          <div className="text-sm font-semibold">Google Play</div>
                        </div>
                      </div>
                    </a>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6 justify-center lg:justify-start">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <div className="text-4xl font-bold text-[#333333]">10M+</div>
                      <div className="text-sm text-[#666666] mt-1">users worldwide</div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      <div className="text-4xl font-bold text-[#333333]">$5B+</div>
                      <div className="text-sm text-[#666666] mt-1">expenses tracked</div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <div className="text-4xl font-bold text-[#333333]">99%</div>
                      <div className="text-sm text-[#666666] mt-1">satisfaction rate</div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Image */}
              <div className="relative flex items-center justify-center lg:justify-start">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="relative"
                >
                  {/* Hero Phone Image */}
                  <Image
                    src={hero?.image_url || "/imgs/asset2-2x-1a032de8cdb5bd11e5c3cd37ce08391497ac0f14f2bba61987.png"}
                    alt="SettleUp app on phone"
                    width={300}
                    height={600}
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </motion.div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Smart Features Section */}
      <section className="relative overflow-hidden py-20">
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

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal animation="fadeInUp">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-[#00CFFF] uppercase tracking-wider mb-3">
                FEATURES
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#333333]">
                Smart features for<br />smarter financial management
              </h2>
            </div>
          </ScrollReveal>

          {/* Feature cards - Dynamic from Appwrite */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <ScrollReveal key={feature.$id} animation="fadeInUp">
                <div 
                  className="max-w-6xl mx-auto mb-12 rounded-3xl overflow-hidden shadow-lg relative border-4"
                  style={{
                    backgroundColor: feature.background_color || '#0099CC',
                    borderColor: feature.border_color || '#FF007F',
                    backgroundImage: 'url(/images/facets.png)',
                    backgroundPosition: 'center 0px',
                    backgroundSize: '1000px',
                    backgroundRepeat: 'repeat-x'
                  }}
                >
                  <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
                    {/* Text content - alternates left/right */}
                    <div className={`p-8 lg:p-12 ${index % 2 === 0 ? 'order-2 lg:order-1' : 'order-2'}`}>
                      <h3 className="text-3xl font-bold mb-4" style={{ color: 'white' }}>
                        {feature.title}
                      </h3>
                      <p className="mb-6 leading-relaxed" style={{ color: 'white' }}>
                        {feature.description}
                      </p>
                      <button className="font-semibold flex items-center gap-2 hover:gap-3 transition-all" style={{ color: 'white' }}>
                        Try it now <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Image - alternates right/left */}
                    <div className={`p-8 lg:p-12 flex items-center justify-center ${index % 2 === 0 ? 'order-1 lg:order-2' : 'order-1'}`}>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        whileInView={{ opacity: 1, scale: 1 }} 
                        transition={{ duration: 0.6 }} 
                        viewport={{ once: true }}
                      >
                        <Image 
                          src={feature.image_url || '/imgs/asset1-2x-b7225a262a58f40d591ad168dded30b61f6c6e0daaba1b2e83.png'} 
                          alt={feature.title || 'Feature'} 
                          width={300} 
                          height={600} 
                          className="object-contain drop-shadow-2xl" 
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative overflow-hidden py-20">
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

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal animation="fadeInUp">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-[#00CFFF] uppercase tracking-wider mb-3">
                TESTIMONIALS
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#333333]">
                Loved by millions worldwide
              </h2>
            </div>
          </ScrollReveal>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dynamic Testimonials from Appwrite */}
            {testimonials.map((testimonial, index) => {
              // Get initials for avatar
              const initials = testimonial.author?.split(' ').map(word => word[0]).join('').toUpperCase() || '?';
              // Alternate gradient colors
              const gradients = [
                'from-[#00CFFF] to-[#00B8E6]',
                'from-[#FF007F] to-[#E6006F]',
                'from-[#FF007F] to-[#00CFFF]'
              ];
              const gradient = gradients[index % gradients.length];
              
              return (
                <ScrollReveal key={testimonial.$id} animation="fadeInUp">
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#FF007F] hover:border-[#E6006F] hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#FFB84D] text-[#FFB84D]" />
                      ))}
                    </div>
                    <p className="text-[#666666] mb-6 leading-relaxed italic min-h-[96px]">
                      {testimonial.content}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                        {initials}
                      </div>
                      <div>
                        <p className="font-semibold text-[#333333]">{testimonial.author}</p>
                        <p className="text-sm text-[#999999]">{testimonial.author_role}</p>
                      </div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative overflow-hidden py-20">
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

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal animation="fadeInUp">
            <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#f4f4f4] to-white rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 relative border-2 border-[#FF007F]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00CFFF] opacity-10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF007F] opacity-10 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#333333] mb-4">
                    We are here for you,<br />
                    contact us at <span className="text-[#00CFFF]">anytime</span>
                  </h2>
                  <p className="text-[#666666] text-lg">
                    Have any questions about our services or just want to talk with us? Please reach out.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {/* Dynamic Contact Methods from Appwrite */}
                  {contactMethods.map((contact, index) => {
                    // Icon SVGs
                    const icons = {
                      form: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
                      mail: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
                      phone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    };
                    
                    const iconColor = index % 2 === 0 ? '#00CFFF' : '#FF007F';
                    const borderColor = index === 1 ? 'border-[#3cc9bb] hover:border-[#35b3a7]' : 'border-[#FF007F] hover:border-[#E6006F]';
                    
                    return (
                      <motion.div key={contact.$id} whileHover={{ y: -5 }} className={`bg-white rounded-2xl p-8 shadow-lg border-2 ${borderColor} text-center transition-all duration-300`}>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`} style={{ backgroundColor: `${iconColor}1A` }}>
                          <svg className="w-8 h-8" style={{ color: iconColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {icons[contact.icon_name as keyof typeof icons] || icons.form}
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-[#333333] mb-2">{contact.title}</h3>
                        <p className="text-sm text-[#666666] mb-6">{contact.description}</p>
                        {contact.button_text && contact.button_link ? (
                          <Button variant="secondary" className="w-full" onClick={() => (window.location.href = contact.button_link!)}>
                            {contact.button_text} <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        ) : contact.link_url ? (
                          <a href={contact.link_url} className="block text-[#FF007F] font-semibold hover:text-[#E6006F] transition-colors">
                            {contact.link_text}
                          </a>
                        ) : null}
                      </motion.div>
                    );
                  })}
                </div>

                <p className="text-center text-sm text-[#666666]">
                  We'll get back to you as soon as possible. Our team is available 9am-6pm on weekdays.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
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
          <ScrollReveal animation="fadeInUp">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              {cta?.heading || 'Ready to get started?'}
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
              {cta?.content || 'Join millions of people around the world.'}
            </p>
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => (window.location.href = cta?.button_link || '/auth?mode=signup')} 
              className="bg-white text-[#FF007F] hover:bg-gray-50 px-8 py-4 rounded-xl font-semibold"
            >
              {cta?.button_text || 'Create account'}
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
