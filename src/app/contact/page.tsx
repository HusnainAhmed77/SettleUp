'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 lg:p-8">
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

      <div className="grid lg:grid-cols-2 max-w-7xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10">
        {/* Left Side - Contact Info */}
        <div className="bg-gradient-to-br from-[#FF007F] to-[#00CFFF] text-white p-8 lg:p-12 flex flex-col justify-center items-center text-center relative rounded-3xl lg:rounded-l-3xl lg:rounded-r-none">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-lg z-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-lg text-white/90 mb-10 leading-relaxed">
              Not sure what you need? The team at SplitWise will be happy to listen to you and suggest event ideas you hadn't considered!
            </p>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email</h3>
                  <a 
                    href="mailto:support@settleup.com" 
                    className="text-white/90 hover:text-white transition-colors"
                  >
                    support@settleup.com
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Support</h3>
                  <a 
                    href="tel:+12125551234" 
                    className="text-white/90 hover:text-white transition-colors"
                  >
                    +1 (212) 555-1234
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Decorative circles */}
          <div className="absolute bottom-8 right-8 opacity-20">
            <div className="w-32 h-32 border-4 border-white rounded-full" />
            <div className="w-24 h-24 border-4 border-white rounded-full absolute top-4 left-4" />
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="bg-white p-8 lg:p-16 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl mx-auto w-full"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#333333] mb-2">
                We'd love to hear from you!
              </h2>
              <p className="text-[#666666]">
                Let's get in touch
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name and Company */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-[#333333] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#FF007F] focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-[#333333] mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#FF007F] focus:outline-none transition-colors"
                    placeholder="Your Company"
                  />
                </div>
              </div>

              {/* Email and Phone */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#333333] mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#FF007F] focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[#333333] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#FF007F] focus:outline-none transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-[#333333] mb-2">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#FF007F] focus:outline-none transition-colors"
                  placeholder="123 Main St, City, State"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#333333] mb-2">
                  Your Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#FF007F] focus:outline-none transition-colors resize-none"
                  placeholder="Type your message here..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#FF007F] hover:bg-[#00CFFF] text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                <span>Send Message</span>
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Success Message */}
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 border-2 border-green-200 rounded-lg text-green-700 text-center font-medium"
                >
                  ✓ Message sent successfully! We'll get back to you soon.
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
