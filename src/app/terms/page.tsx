import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default function TermsPage() {
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
          <h2 className="text-3xl font-bold mb-4">SettleUp Terms of Service</h2>
          <p className="text-gray-600 mb-8">Last updated: February 8th, 2024</p>
          
          <div className="space-y-8 text-gray-700">
            <section>
              <h3 className="text-xl font-semibold mb-3">Who can use SettleUp</h3>
              <p>
                You may use our services only if you agree to these Terms of Service and to the processing of your information as described in our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>. You may not use SettleUp if you are barred from receiving services under the laws of the applicable jurisdiction, if we previously banned your account for violation of these terms, or if you are under the age of 13.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Description</h3>
              <p>
                SettleUp® (the Service) is a service designed to help you track informal debts, expenses, and bills, by allowing users to enter notes about who they owe, who owes them and why. The Service keeps track of the sharing math, provides informal sharing advice, and stores this data for later use. You agree that this service is provided AS-IS and on an AS AVAILABLE basis.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Informal debts</h3>
              <p>
                The website allows users who share a group or are friends on the service to post debts and payments as they please, using wiki-style rules with no explicit permissions. These are calculated into a determination of debts by the Service. You agree that you understand these debts are not legally binding, and represent informal information sharing among roommates, friends, or family. You agree that the Service cannot guarantee the accuracy of information entered by users.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Conditions of use</h3>
              <p>
                You agree that you will use the Service for its intended purpose, and in compliance with all applicable laws and regulations: local, state, and national, and international, as applicable. You agree not to use the service in a fraudulent, disruptive, aggressive, manipulative, for money laundering, or any other inappropriate matter. SettleUp reserves the right, but has no obligation, to investigate your use of the service for compliance with appropriate use and terminate your access to the Service, or in order to comply with law, regulation, legal process or government request.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">No warranty</h3>
              <p className="font-semibold">
                SettleUp Inc. does not represent that the Service is error-free, complete, or can be relied upon. THE SERVICE IS PROVIDED 'AS IS' AND 'AS AVAILABLE' WITH NO WARRANTY OF ANY KIND AND YOU ARE USING THE SERVICE AT YOUR OWN RISK. SPLITWISE INC DISCLAIMS ANY WARRANTY, IMPLIED OR OTHERWISE, REGARDING THE SERVICE, INCLUDING WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR NON-INFRINGEMENT, INCLUDING FOR SPLITWISE PRO.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">User Posted Content</h3>
              <p>
                When using SettleUp's products and services, you may have the ability to post content (e.g., payment descriptions, comments, Group/User Avatars, expense receipts). You are solely responsible for all content that you provide, post, upload or submit. We are not responsible for evaluating the accuracy, truthfulness, usefulness, legality, safety, morality or applicability of any content posted by users on SettleUp.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">SettleUp Content Standards</h3>
              <p className="mb-3">When sharing content on SettleUp, you may not share content that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You do not have the right to share, or that is invasive of another person's right of privacy or right of publicity</li>
                <li>Is false, misleading, or deceptive</li>
                <li>Is obscene, harmful, abusive, or offensive. We do not allow nudity on SettleUp</li>
                <li>Incites violence or hatred toward an individual or group of individuals</li>
                <li>Is illegal, such as criminal activity, terrorism, obscenity, child pornography, human exploitation, gambling, drug use, firearms or ammunition, and piracy</li>
                <li>Is spammy, or promotes or engages in Pyramid schemes, network marketing, and referral marketing programs</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Privacy and Security</h3>
              <p>
                In order to provide the services to you we collect some of your Personal Information. We describe our collection and use of personal information in our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>. Please review this policy. You must agree to the processing of your data as laid out in that policy in order to use our services. You must be 13 years or older to use this service. You are responsible for preventing unauthorized access to your account.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Paid subscriptions</h3>
              <p>
                Some users may have access to purchasing "SettleUp Pro," a paid monthly or annual subscription that may include several extra features such as increased cloud storage, receipt scanning, reduced advertisements, and other additional features or services. If you have issues with our SettleUp® Pro subscription or would like to request a refund, please email support@settleup.com (we reserve the right to offer or refuse refunds at our sole discretion).
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">External payment services</h3>
              <p className="mb-3">
                Some users may have the ability to access, link to, or integrate with external payment services that enable you to send and receive payments. These services include but are not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>PayPal:</strong> Features built on PayPal's API for US residents only</li>
                <li><strong>Venmo:</strong> Deep links and APIs for legitimate US users of Venmo</li>
                <li><strong>Open banking payments:</strong> Bank-to-bank payments facilitated by third party vendors</li>
                <li><strong>Other payment services:</strong> Links to services like Paytm and others</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-3">Jurisdiction</h3>
              <p>
                You agree that this entire agreement (including <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>) shall be interpreted according to the laws of the State of Massachusetts.
              </p>
            </section>

            <section className="border-t pt-6">
              <p className="text-sm text-gray-600">
                For questions about these Terms of Service, please contact us at <a href="mailto:support@settleup.com" className="text-blue-600 hover:underline">support@settleup.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
