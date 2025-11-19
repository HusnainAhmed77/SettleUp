"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Twitter, Facebook, Instagram, Linkedin, Heart } from "lucide-react";
import { footerService, FooterSection, FooterLink, SocialMediaLink } from "@/services/footerService";

export default function Footer() {
  const [sections, setSections] = useState<FooterSection[]>([]);
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [socialMedia, setSocialMedia] = useState<SocialMediaLink[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFooterData() {
      try {
        const [sectionsData, linksData, socialData, settingsData] = await Promise.all([
          footerService.getSections(),
          footerService.getLinks(),
          footerService.getSocialMedia(),
          footerService.getSettings()
        ]);
        
        setSections(sectionsData);
        setLinks(linksData);
        setSocialMedia(socialData);
        setSettings(settingsData);
      } catch (error) {
        console.error('Error loading footer data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchFooterData();
  }, []);

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter': return Twitter;
      case 'facebook': return Facebook;
      case 'instagram': return Instagram;
      case 'linkedin': return Linkedin;
      default: return Twitter;
    }
  };

  const getLinksBySection = (sectionId: string) => {
    return links.filter(link => link.section_id === sectionId);
  };
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1 flex flex-col items-center lg:items-start">
            <Link href="/" className="inline-block">
              <img 
                src={settings.logo_url || "/imgs/footer-logo.png"} 
                alt="SettleUp" 
                className="w-[200px] h-auto"
              />
            </Link>
          </div>

          {/* Dynamic Sections */}
          {loading ? (
            // Loading skeleton
            <>
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <div className="h-6 w-24 bg-gray-800 rounded mb-4 animate-pulse"></div>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-4 w-32 bg-gray-800 rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            sections.map((section) => (
              <div key={section.$id} className="text-center lg:text-left">
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: 'white' }}>
                  {section.heading}
                </h3>
                <ul className="space-y-3 flex flex-col items-center lg:items-start">
                  {getLinksBySection(section.section_id).map((link) => (
                    <li key={link.$id}>
                      {link.is_external ? (
                        <a
                          href={link.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:text-[#00CFFF] transition-colors inline-block hover:translate-x-1 transform duration-200"
                        >
                          {link.link_text}
                        </a>
                      ) : (
                        <Link 
                          href={link.link_url} 
                          className="text-sm hover:text-[#00CFFF] transition-colors inline-block hover:translate-x-1 transform duration-200"
                        >
                          {link.link_text}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-400">
              {settings.location_text && (
                <>
                  <span className="flex items-center gap-1">
                    {settings.location_text.includes('❤️') ? (
                      settings.location_text.split('❤️').map((part, i) => (
                        <span key={i}>
                          {part}
                          {i === 0 && <Heart className="w-4 h-4 text-red-500 fill-current inline" />}
                        </span>
                      ))
                    ) : (
                      settings.location_text
                    )}
                  </span>
                  <span>•</span>
                </>
              )}
              <span>© {new Date().getFullYear()} {settings.copyright_text || 'SettleUp, Inc.'}</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex space-x-4">
                {loading ? (
                  // Loading skeleton for social icons
                  <>
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-5 h-5 bg-gray-800 rounded animate-pulse"></div>
                    ))}
                  </>
                ) : (
                  socialMedia.map((social) => {
                    const Icon = getSocialIcon(social.platform);
                    return (
                      <a
                        key={social.$id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-[#00CFFF] transition-colors"
                        aria-label={social.platform}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })
                )}
              </div>
              <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF007F]">
                <option>English</option>
                <option>Español</option>
                <option>Français</option>
                <option>Deutsch</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
