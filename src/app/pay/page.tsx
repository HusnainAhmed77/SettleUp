import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default function PagePage() {
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
        <h1 className="text-4xl font-bold mb-8">Our #1 requested feature is here:Pay your friends directly in Splitwise.</h1>
        <div className="max-w-4xl space-y-6">
          <p className="text-gray-700">You are sending Earl E. Phant</p>
        </div>
      </main>
      </div>
    </div>
  );
}
