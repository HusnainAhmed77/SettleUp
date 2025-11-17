import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default function SecurityPage() {
  return (
    <div className="min-h-screen relative">
      {/* Facets Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/facets.png"
          alt="Background pattern"
          fill
          className="object-cover"
        />
      </div>

      {/* Magenta Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#FF007F]/10 via-transparent to-[#00CFFF]/10 z-0"></div>

      <div className="relative z-10">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Security at SettleUp</h1>
          <p className="text-xl text-gray-600 mb-12">
            Your data security and privacy are our top priorities. Here's how we protect your information.
          </p>

          <div className="space-y-8">
            <div className="border-l-4 border-teal-500 pl-6">
              <h2 className="text-2xl font-semibold mb-3">🔒 Encryption</h2>
              <p className="text-gray-700">
                All data transmitted between your device and our servers is encrypted using
                industry-standard SSL/TLS protocols. Your passwords are hashed using strong
                cryptographic algorithms and are never stored in plain text.
              </p>
            </div>

            <div className="border-l-4 border-teal-500 pl-6">
              <h2 className="text-2xl font-semibold mb-3">🛡️ Secure Infrastructure</h2>
              <p className="text-gray-700">
                Your data is stored on secure servers with multiple layers of protection,
                including firewalls, access controls, and regular security monitoring. We use
                industry-leading cloud providers with robust security certifications.
              </p>
            </div>

            <div className="border-l-4 border-teal-500 pl-6">
              <h2 className="text-2xl font-semibold mb-3">👥 Access Controls</h2>
              <p className="text-gray-700">
                We implement strict access controls to ensure that only authorized personnel
                can access user data, and only when necessary for support or maintenance purposes.
                All access is logged and monitored.
              </p>
            </div>

            <div className="border-l-4 border-teal-500 pl-6">
              <h2 className="text-2xl font-semibold mb-3">🔍 Regular Audits</h2>
              <p className="text-gray-700">
                We conduct regular security audits and penetration testing to identify and
                address potential vulnerabilities. Our security practices are continuously
                reviewed and updated to meet evolving threats.
              </p>
            </div>

            <div className="border-l-4 border-teal-500 pl-6">
              <h2 className="text-2xl font-semibold mb-3">📋 Compliance</h2>
              <p className="text-gray-700">
                We comply with industry standards and regulations including GDPR, CCPA, and
                other data protection laws to protect your privacy rights. We are transparent
                about how we collect, use, and protect your data.
              </p>
            </div>

            <div className="border-l-4 border-teal-500 pl-6">
              <h2 className="text-2xl font-semibold mb-3">🔐 Two-Factor Authentication</h2>
              <p className="text-gray-700">
                We offer two-factor authentication (2FA) to add an extra layer of security
                to your account. We strongly recommend enabling this feature to protect
                your account from unauthorized access.
              </p>
            </div>
          </div>

          <div className="mt-12 p-6 bg-teal-50 rounded-lg border-2 border-teal-200">
            <h3 className="text-xl font-semibold mb-2">🚨 Report a Security Issue</h3>
            <p className="text-gray-700 mb-4">
              If you discover a security vulnerability or have security concerns, please report
              them responsibly to our security team. We take all reports seriously and will
              respond promptly.
            </p>
            <p className="text-gray-700">
              Email: <a href="mailto:security@settleup.com" className="text-teal-600 hover:underline font-semibold">security@settleup.com</a>
            </p>
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Learn More</h3>
            <ul className="space-y-2">
              <li>
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Read our Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-blue-600 hover:underline">
                  Review our Terms of Service
                </a>
              </li>
              <li>
                <a href="/contact" className="text-blue-600 hover:underline">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
