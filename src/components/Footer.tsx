"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Twitter, Facebook, Instagram, Linkedin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1 flex flex-col">
            <Link href="/" className="inline-block">
              <img 
                src="/imgs/footer-logo.png" 
                alt="SettleUp" 
                className="w-[200px] h-auto"
              />
            </Link>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: 'white' }}>Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard" className="text-sm hover:text-[#00CFFF] transition-colors inline-block hover:translate-x-1 transform duration-200">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-sm hover:text-[#00CFFF] transition-colors inline-block hover:translate-x-1 transform duration-200">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm hover:text-[#00CFFF] transition-colors inline-block hover:translate-x-1 transform duration-200">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: 'white' }}>Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm hover:text-[#00CFFF] transition-colors inline-block hover:translate-x-1 transform duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm hover:text-[#00CFFF] transition-colors inline-block hover:translate-x-1 transform duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-[#00CFFF] transition-colors inline-block hover:translate-x-1 transform duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: 'white' }}>Support</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://feedback.splitwise.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-[#00CFFF] transition-colors inline-block hover:translate-x-1 transform duration-200"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="https://status.splitwise.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-[#00CFFF] transition-colors inline-block hover:translate-x-1 transform duration-200"
                >
                  Site Status
                </a>
              </li>
              <li>
                <Link href="/security" className="text-sm hover:text-[#00CFFF] transition-colors inline-block hover:translate-x-1 transform duration-200">
                  Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: 'white' }}>Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-sm hover:text-[#00CFFF] transition-colors inline-block hover:translate-x-1 transform duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm hover:text-[#00CFFF] transition-colors inline-block hover:translate-x-1 transform duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/pay" className="text-sm hover:text-[#00CFFF] transition-colors inline-block hover:translate-x-1 transform duration-200">
                  Payment Services
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> in Providence, RI
              </span>
              <span>•</span>
              <span>© {new Date().getFullYear()} SettleUp, Inc.</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex space-x-4">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#00CFFF] transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#00CFFF] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#00CFFF] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#00CFFF] transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
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
