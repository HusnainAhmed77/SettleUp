import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default function ProPage() {
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">SettleUp Pro</h1>
          <p className="text-xl text-gray-600">
            Unlock premium features and support our mission.
          </p>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="border border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Free</h2>
            <p className="text-3xl font-bold mb-6">$0<span className="text-lg font-normal text-gray-600">/month</span></p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Unlimited expenses</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Unlimited groups</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Mobile apps</span>
              </li>
            </ul>
            <button className="w-full border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition">
              Get Started
            </button>
          </div>
          <div className="border-2 border-blue-600 rounded-lg p-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
              Popular
            </div>
            <h2 className="text-2xl font-bold mb-4">Pro</h2>
            <p className="text-3xl font-bold mb-6">$2.99<span className="text-lg font-normal text-gray-600">/month</span></p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Everything in Free</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Currency conversion</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Receipt scanning</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Charts and graphs</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Priority support</span>
              </li>
            </ul>
            <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
