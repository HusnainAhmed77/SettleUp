'use client';

import { motion } from 'framer-motion';
import { Users, Heart, Shield, Zap, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import Image from 'next/image';
import ScrollReveal from '@/components/animations/ScrollReveal';
import Button from '@/components/ui/Button';
import { useState, useEffect } from 'react';
import { aboutService, AboutSection, AboutValue, TeamMember } from '@/services/aboutService';

export const dynamic = 'force-dynamic';

export default function AboutPage() {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [values, setValues] = useState<AboutValue[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAboutData() {
      try {
        const [sectionsData, valuesData, teamData] = await Promise.all([
          aboutService.getAllSections(),
          aboutService.getValues(),
          aboutService.getTeamMembers()
        ]);
        
        setSections(sectionsData);
        setValues(valuesData);
        setTeamMembers(teamData);
      } catch (error) {
        console.error('Error loading about page data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAboutData();
  }, []);

  const getSection = (sectionId: string) => {
    return sections.find(s => s.section_id === sectionId);
  };

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Users, Heart, Shield, Zap
    };
    return icons[iconName] || Users;
  };
  return (
    <div className="min-h-screen relative overflow-hidden">
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
      {/* What is SettleUp Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-3 animate-pulse"></div>
                  <div className="h-12 w-3/4 bg-gray-200 rounded mb-6 animate-pulse"></div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Content */}
                <ScrollReveal animation="fadeInLeft">
                  <div>
                    {getSection('hero')?.subheading && (
                      <p className="text-sm font-semibold text-[#FF007F] uppercase tracking-wider mb-3">
                        {getSection('hero')?.subheading}
                      </p>
                    )}
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#333333] leading-tight">
                      {getSection('hero')?.heading || 'What is SettleUp?'}
                    </h2>
                    <p className="text-lg text-[#666666] leading-relaxed">
                      {getSection('hero')?.content}
                    </p>
                  </div>
                </ScrollReveal>

                {/* Right Image */}
                <ScrollReveal animation="fadeInRight" delay={0.2}>
                  <div className="relative">
                    <Image
                      src={getSection('hero')?.image_url || '/imgs/hero-object.png'}
                      alt="About SettleUp"
                      width={1000}
                      height={1000}
                      className="object-contain"
                    />
                  </div>
                </ScrollReveal>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Core Values Section - Cards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fadeInUp">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
              {getSection('values_heading')?.heading || 'Why Choose SettleUp?'}
            </h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="h-6 w-32 mx-auto mb-2 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))
            ) : (
              values.map((value, index) => {
                const IconComponent = getIconComponent(value.icon);
                return (
                  <ScrollReveal key={value.$id} animation="fadeInUp" delay={index * 0.1}>
                    <div className="text-center p-6 rounded-xl hover:shadow-xl transition-shadow duration-300 bg-white/50 backdrop-blur-sm">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${value.color}-100 flex items-center justify-center`}>
                        <IconComponent className={`w-8 h-8 text-${value.color}-600`} />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900">{value.title}</h3>
                      <p className="text-gray-600">{value.description}</p>
                    </div>
                  </ScrollReveal>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* User-Friendly Detailed Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <ScrollReveal animation="fadeInLeft">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#333333] leading-tight">
                    {getSection('user_friendly')?.heading || 'User-Friendly'}
                  </h2>
                  <p className="text-lg text-[#666666] leading-relaxed">
                    {getSection('user_friendly')?.content}
                  </p>
                </div>
              </ScrollReveal>

              {/* Right Image */}
              <ScrollReveal animation="fadeInRight" delay={0.2}>
                <div className="relative">
                  <div className="relative rounded-full overflow-hidden shadow-2xl">
                    <div className="aspect-square bg-gradient-to-br from-[#e8f5f3] to-[#d4ebe7] flex items-center justify-center p-12">
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        {/* Smiling face with thumbs up */}
                        <circle cx="100" cy="100" r="80" fill="#FF007F" opacity="0.2" />
                        <circle cx="100" cy="100" r="60" fill="#FF007F" />
                        <circle cx="80" cy="90" r="8" fill="white" />
                        <circle cx="120" cy="90" r="8" fill="white" />
                        <path d="M 70 110 Q 100 130 130 110" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
                        {/* Thumbs up */}
                        <rect x="140" y="120" width="20" height="40" rx="5" fill="#FFB84D" />
                        <ellipse cx="150" cy="115" rx="12" ry="15" fill="#FFB84D" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 opacity-20">
                    <div className="grid grid-cols-4 gap-2">
                      {[...Array(16)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-[#FF007F] rounded-full"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Fair & Honest Detailed Section */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Image */}
              <ScrollReveal animation="fadeInLeft">
                <div className="relative">
                  <div className="relative rounded-full overflow-hidden shadow-2xl">
                    <div className="aspect-square bg-gradient-to-br from-[#ffe8f0] to-[#ffd4e5] flex items-center justify-center p-8">
                      <svg viewBox="0 0 400 400" className="w-full h-full">
                        {/* Balance scale */}
                        <circle cx="200" cy="200" r="120" fill="#FF6B9D" opacity="0.2" />
                        
                        {/* Scale base */}
                        <rect x="190" y="250" width="20" height="100" rx="5" fill="#FF6B9D" />
                        <rect x="150" y="340" width="100" height="20" rx="5" fill="#FF6B9D" />
                        
                        {/* Scale beam */}
                        <rect x="100" y="240" width="200" height="10" rx="5" fill="#FF6B9D" />
                        
                        {/* Left pan */}
                        <ellipse cx="120" cy="280" rx="40" ry="10" fill="#FFB84D" />
                        <line x1="120" y1="250" x2="120" y2="280" stroke="#FF6B9D" strokeWidth="3" />
                        
                        {/* Right pan */}
                        <ellipse cx="280" cy="280" rx="40" ry="10" fill="#FFB84D" />
                        <line x1="280" y1="250" x2="280" y2="280" stroke="#FF6B9D" strokeWidth="3" />
                        
                        {/* Decorative elements */}
                        <circle cx="80" cy="150" r="25" fill="#4A90E2" opacity="0.3" />
                        <circle cx="320" cy="180" r="30" fill="#FF6B35" opacity="0.3" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute -top-8 -right-8 w-32 h-32 opacity-20">
                    <div className="grid grid-cols-4 gap-2">
                      {[...Array(16)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-[#FF6B9D] rounded-full"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Right Content */}
              <ScrollReveal animation="fadeInRight" delay={0.2}>
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#333333] leading-tight">
                    {getSection('fair_honest')?.heading || 'Fair & Honest'}
                  </h2>
                  <p className="text-lg text-[#666666] leading-relaxed">
                    {getSection('fair_honest')?.content}
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Secure Detailed Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <ScrollReveal animation="fadeInLeft">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#333333] leading-tight">
                    {getSection('secure')?.heading || 'Secure'}
                  </h2>
                  <p className="text-lg text-[#666666] leading-relaxed">
                    {getSection('secure')?.content}
                  </p>
                </div>
              </ScrollReveal>

              {/* Right Image */}
              <ScrollReveal animation="fadeInRight" delay={0.2}>
                <div className="relative">
                  <div className="relative rounded-full overflow-hidden shadow-2xl">
                    <div className="aspect-square bg-gradient-to-br from-[#e6f0f8] to-[#d4e5f5] flex items-center justify-center p-12">
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        {/* Shield with lock */}
                        <path d="M 100 20 L 160 50 L 160 110 C 160 150, 130 170, 100 180 C 70 170, 40 150, 40 110 L 40 50 Z" fill="#4A90E2" />
                        <path d="M 100 30 L 150 55 L 150 110 C 150 145, 125 162, 100 170 C 75 162, 50 145, 50 110 L 50 55 Z" fill="#60A5FA" />
                        {/* Lock */}
                        <rect x="85" y="95" width="30" height="35" rx="3" fill="white" />
                        <path d="M 90 95 L 90 80 C 90 70, 110 70, 110 80 L 110 95" stroke="white" strokeWidth="6" fill="none" />
                        <circle cx="100" cy="110" r="5" fill="#4A90E2" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 opacity-20">
                    <div className="grid grid-cols-4 gap-2">
                      {[...Array(16)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-[#4A90E2] rounded-full"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Fast & Reliable Detailed Section */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Image */}
              <ScrollReveal animation="fadeInLeft">
                <div className="relative">
                  <div className="relative rounded-full overflow-hidden shadow-2xl">
                    <div className="aspect-square bg-gradient-to-br from-[#fff4e6] to-[#ffe8d4] flex items-center justify-center p-12">
                      <svg viewBox="0 0 200 200" className="w-full h-full">
                        {/* Lightning bolt with speed lines */}
                        <path d="M 120 20 L 70 100 L 100 100 L 80 180 L 140 90 L 110 90 Z" fill="#FFB84D" />
                        <path d="M 115 30 L 75 100 L 100 100 L 85 170 L 135 95 L 110 95 Z" fill="#FCD34D" />
                        {/* Speed lines */}
                        <line x1="30" y1="60" x2="60" y2="60" stroke="#FFB84D" strokeWidth="4" strokeLinecap="round" />
                        <line x1="140" y1="120" x2="170" y2="120" stroke="#FFB84D" strokeWidth="4" strokeLinecap="round" />
                        <line x1="20" y1="100" x2="50" y2="100" stroke="#FFB84D" strokeWidth="4" strokeLinecap="round" />
                        <line x1="150" y1="70" x2="180" y2="70" stroke="#FFB84D" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute -top-8 -right-8 w-32 h-32 opacity-20">
                    <div className="grid grid-cols-4 gap-2">
                      {[...Array(16)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-[#FFB84D] rounded-full"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Right Content */}
              <ScrollReveal animation="fadeInRight" delay={0.2}>
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#333333] leading-tight">
                    {getSection('fast_reliable')?.heading || 'Fast & Reliable'}
                  </h2>
                  <p className="text-lg text-[#666666] leading-relaxed">
                    {getSection('fast_reliable')?.content}
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fadeInUp">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
              {getSection('team_heading')?.heading || 'Meet Our Team'}
            </h2>
            <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
              {getSection('team_heading')?.subheading || "We're a passionate team of developers, designers, and support specialists working to make shared expenses easier for everyone."}
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {loading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-6 w-32 mx-auto mb-2 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-24 mx-auto mb-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))
            ) : (
              teamMembers.map((member, index) => (
                <ScrollReveal key={member.$id} animation="fadeInUp" delay={index * 0.1}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-2xl h-full flex flex-col"
                  >
                    <div className="p-8 flex flex-col flex-1">
                      {/* Avatar with gradient border */}
                      <div className="relative w-32 h-32 mx-auto mb-6 flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00CFFF] to-blue-500 rounded-full"></div>
                        <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                          <span className="text-5xl">{member.avatar}</span>
                        </div>
                      </div>

                      {/* Member Info */}
                      <div className="text-center mb-6 flex-1 flex flex-col justify-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                        <p className="text-sm font-semibold text-[#E6006F] mb-3">{member.role}</p>
                        <p className="text-sm text-gray-600 italic line-clamp-3">{member.bio}</p>
                      </div>

                      {/* Social Links */}
                      <div className="flex justify-center gap-3 pt-4 border-t border-gray-100 flex-shrink-0">
                        {member.twitter && (
                          <a
                            href={member.twitter}
                            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-colors duration-300"
                            aria-label="Twitter"
                          >
                            <Twitter className="w-4 h-4" />
                          </a>
                        )}
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-blue-700 hover:text-white flex items-center justify-center transition-colors duration-300"
                            aria-label="LinkedIn"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-[#FF007F] hover:text-white flex items-center justify-center transition-colors duration-300"
                            aria-label="Email"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))
            )}
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
