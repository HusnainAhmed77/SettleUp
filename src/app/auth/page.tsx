'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Facebook, Chrome } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const [isSignUp, setIsSignUp] = useState(mode !== 'signin');
  const router = useRouter();

  useEffect(() => {
    // Update state when URL changes
    setIsSignUp(mode !== 'signin');
  }, [mode]);

  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign up:', signUpData);
    // Handle sign up logic
    router.push('/dashboard');
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign in:', signInData);
    // Handle sign in logic
    router.push('/dashboard');
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
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

      {/* Main Container */}
      <div className="relative w-full max-w-5xl h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="relative w-full h-full flex">
          {/* Animated Panels Container */}
          <AnimatePresence mode="wait">
            {isSignUp ? (
              <motion.div
                key="signup-layout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex"
              >
                {/* Left Panel - Teal (Welcome Back) */}
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="w-2/5 bg-gradient-to-br from-[#FF007F] to-[#00CFFF] text-white p-12 flex flex-col justify-center items-center relative overflow-hidden"
                >
                  {/* Decorative Circles */}
                  <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full" />
                  <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full" />
                  
                  <div className="relative z-10 text-center">
                    <h2 className="text-4xl font-bold mb-4">Hello, Friend!</h2>
                    <p className="text-white/90 mb-8 text-lg">
                      Enter your personal details and<br />
                      start your journey with us
                    </p>
                    <button
                      onClick={toggleMode}
                      className="px-12 py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-[#FF007F] transition-all duration-300 text-lg"
                    >
                      SIGN IN
                    </button>
                  </div>
                </motion.div>

                {/* Right Panel - White (Sign Up Form) */}
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="w-3/5 bg-white p-12 flex flex-col justify-center"
                >
                  <div className="max-w-md mx-auto w-full">
                    <h2 className="text-4xl font-bold text-[#FF007F] mb-2 text-center">
                      Create Account
                    </h2>
                    
                    {/* Social Login */}
                    <div className="flex justify-center gap-4 my-6">
                      <button className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#FF007F] hover:text-[#FF007F] transition-colors">
                        <Facebook className="w-5 h-5" />
                      </button>
                      <button className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#FF007F] hover:text-[#FF007F] transition-colors">
                        <Chrome className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-center text-gray-500 text-sm mb-6">
                      or use your email for registration:
                    </p>

                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Name"
                          value={signUpData.name}
                          onChange={(e) => setSignUpData({...signUpData, name: e.target.value})}
                          className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF007F]"
                          required
                        />
                      </div>

                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          placeholder="Email"
                          value={signUpData.email}
                          onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                          className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF007F]"
                          required
                        />
                      </div>

                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="password"
                          placeholder="Password"
                          value={signUpData.password}
                          onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                          className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF007F]"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-[#FF007F] hover:bg-[#00CFFF] text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl mt-6"
                      >
                        SIGN UP
                      </button>
                    </form>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="signin-layout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex"
              >
                {/* Left Panel - White (Sign In Form) */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="w-3/5 bg-white p-12 flex flex-col justify-center"
                >
                  <div className="max-w-md mx-auto w-full">
                    <h2 className="text-4xl font-bold text-[#FF007F] mb-2 text-center">
                      Sign In
                    </h2>
                    
                    {/* Social Login */}
                    <div className="flex justify-center gap-4 my-6">
                      <button className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#FF007F] hover:text-[#FF007F] transition-colors">
                        <Facebook className="w-5 h-5" />
                      </button>
                      <button className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#FF007F] hover:text-[#FF007F] transition-colors">
                        <Chrome className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-center text-gray-500 text-sm mb-6">
                      or use your email account:
                    </p>

                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          placeholder="Email"
                          value={signInData.email}
                          onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                          className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF007F]"
                          required
                        />
                      </div>

                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="password"
                          placeholder="Password"
                          value={signInData.password}
                          onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                          className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF007F]"
                          required
                        />
                      </div>

                      <div className="text-center">
                        <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-[#FF007F]">
                          Forgot your password?
                        </Link>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-[#FF007F] hover:bg-[#00CFFF] text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl mt-6"
                      >
                        SIGN IN
                      </button>
                    </form>
                  </div>
                </motion.div>

                {/* Right Panel - Teal (Hello Friend) */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  className="w-2/5 bg-gradient-to-br from-[#FF007F] to-[#00CFFF] text-white p-12 flex flex-col justify-center items-center relative overflow-hidden"
                >
                  {/* Decorative Circles */}
                  <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full" />
                  <div className="absolute bottom-20 left-10 w-40 h-40 bg-white/10 rounded-full" />
                  
                  <div className="relative z-10 text-center">
                    <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
                    <p className="text-white/90 mb-8 text-lg">
                      To keep connected with us please<br />
                      login with your personal info
                    </p>
                    <button
                      onClick={toggleMode}
                      className="px-12 py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-[#FF007F] transition-all duration-300 text-lg"
                    >
                      SIGN UP
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
