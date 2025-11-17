import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default function PrivacyPage() {
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
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-3xl font-bold mb-4">SettleUp Inc. Privacy Statement</h2>
          <p className="text-gray-600 mb-8">Last updated: November 3rd, 2025</p>
          
          <div className="space-y-8 text-gray-700">
            <section>
              <h3 className="text-xl font-semibold mb-3">Scope</h3>
              <p>
                This Privacy Statement describes how SettleUp Inc. (&quot;SettleUp,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses, and shares information about you when you use our websites, mobile applications, and other online products and services (collectively, the &quot;Services&quot;).
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3 uppercase">Data We Collect and How We Use It</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Registration information</h4>
                  <p>
                    When you sign up for an account with SettleUp, you will be asked for your name, email address, phone number, and a password. We require you to provide an email address so that we can contact you about your account and so that you can access your data from any device.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">User-generated content</h4>
                  <p>
                    When using the service, you may provide us with information concerning shared expenses and payments, including group names, expense descriptions and amounts, payments, comments, receipt images, and notes. This information will be shared with contacts you specify in the course of using the service.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Device and location information</h4>
                  <p>
                    When you download or use SettleUp, we will receive information about your device and approximate location, your browser, your operating system and app version.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3 uppercase">How We Use Data</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>To record informal records of expenses, IOUs, and payments</li>
                <li>To fulfill your requests for certain products and services</li>
                <li>To help your SettleUp contacts manage their SettleUp relationship with you</li>
                <li>To respond to your inquiries about our services</li>
                <li>To detect and protect against errors, fraud, or other criminal activity</li>
                <li>To verify your identity in the event you contact us for assistance</li>
                <li>To communicate with you about new features and important news</li>
                <li>To enforce our <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a></li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3 uppercase">How We Share Your Information</h3>
              <p className="mb-3">We may share your information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To respond to subpoenas, court orders, or bona-fide legal processes</li>
                <li>To investigate, prevent, or take action regarding violations of our Terms of Service</li>
                <li>To respond to claims that any posting or other content violates the rights of third parties</li>
                <li>In an emergency, to protect the health and safety of our users</li>
                <li>As otherwise required by any applicable law</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3 uppercase">Security</h3>
              <p>
                We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no security system is impenetrable and we cannot guarantee the security of our systems 100%.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3 uppercase">Cookies</h3>
              <p>
                We use cookies and similar technologies to help provide, protect, and improve our Services. Cookies are small data files stored on your device that help us improve our Services and your experience.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3 uppercase">Choice and Access</h3>
              <p>
                You may choose not to provide your personal information, but then you might not be able to take advantage of many of our service features. You can access and update your account information at any time from your <a href="/settings" className="text-blue-600 hover:underline">Account Settings</a> page.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3 uppercase">Changes</h3>
              <p>
                We may update this Privacy Statement from time to time. If we make material changes, we will notify you by email or through the Services.
              </p>
            </section>

            <section className="border-t pt-6 mt-8">
              <h3 className="text-xl font-semibold mb-3 uppercase">Contact Us</h3>
              <p>
                If you have any questions about this Privacy Statement, please contact us at{' '}
                <a href="mailto:privacy@settleup.com" className="text-blue-600 hover:underline">
                  privacy@settleup.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
