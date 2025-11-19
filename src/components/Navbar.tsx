"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import { navbarService, NavLink, NavButton } from "@/services/navbarService";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [loginButton, setLoginButton] = useState<NavButton | null>(null);
  const [signupButton, setSignupButton] = useState<NavButton | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Mock user state - replace with actual auth state
  const isLoggedIn = false;
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "",
  };

  const isActive = (path: string) => pathname === path;

  // Fetch navigation links and buttons from Appwrite
  useEffect(() => {
    async function fetchNavData() {
      try {
        const [links, buttons] = await Promise.all([
          navbarService.getAllLinks(),
          navbarService.getButtons()
        ]);
        
        setNavLinks(links);
        setLoginButton(buttons.login || null);
        setSignupButton(buttons.signup || null);
      } catch (error) {
        console.error('Error loading navigation data:', error);
        // Fallback to default links if Appwrite fails
        setNavLinks([
          { $id: '1', label: 'Home', href: '/', order: 0, is_active: true },
          { $id: '2', label: 'Dashboard', href: '/dashboard', order: 1, is_active: true },
          { $id: '3', label: 'About', href: '/about', order: 2, is_active: true },
          { $id: '4', label: 'Features', href: '/features', order: 3, is_active: true },
          { $id: '5', label: 'FAQ', href: '/faq', order: 4, is_active: true },
          { $id: '6', label: 'Blog', href: '/blog', order: 5, is_active: true },
        ]);
        setLoginButton({ $id: '1', button_type: 'login', label: 'Log in', href: '/auth?mode=signin', is_active: true });
        setSignupButton({ $id: '2', button_type: 'signup', label: 'Sign up', href: '/auth?mode=signup', is_active: true });
      } finally {
        setLoading(false);
      }
    }
    
    fetchNavData();
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/imgs/logo-settleup.png"
              alt="SettleUp logo"
              width={150}
              height={40}
              className="object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {loading ? (
              // Loading skeleton
              <div className="flex space-x-1">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-9 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : (
              navLinks.map((link) => (
                <Link
                  key={link.$id}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive(link.href)
                      ? "text-[#00CFFF]"
                      : "text-gray-700 hover:text-[#00CFFF] hover:bg-[#00CFFF]/10"
                  )}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00CFFF]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))
            )}
          </div>

          {/* Right Side - Auth or User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
                >
                  <Avatar src={user.avatar} alt={user.name} size="sm" />
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-gray-500 transition-transform",
                    userMenuOpen && "rotate-180"
                  )} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                    >
                      <Link
                        href="/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <div className="border-t border-gray-200 my-2" />
                      <button
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                {loginButton && (
                  <Link
                    href={loginButton.href}
                    className="text-gray-700 hover:text-[#00CFFF] font-medium transition-colors px-4 py-2 rounded-lg hover:bg-[#00CFFF]/10"
                  >
                    {loginButton.label}
                  </Link>
                )}
                {signupButton && (
                  <Link
                    href={signupButton.href}
                    className="bg-[#FF007F] text-white px-6 py-2.5 rounded-lg hover:bg-[#E6006F] font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    {signupButton.label}
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 border-t border-gray-200">
                <div className="flex flex-col space-y-1">
                  {loading ? (
                    // Mobile loading skeleton
                    <div className="space-y-2">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    navLinks.map((link) => (
                      <Link
                        key={link.$id}
                        href={link.href}
                        className={cn(
                          "px-4 py-3 text-base font-medium rounded-lg transition-colors",
                          isActive(link.href)
                            ? "text-[#00CFFF] bg-[#00CFFF]/10"
                            : "text-gray-700 hover:text-[#00CFFF] hover:bg-[#00CFFF]/10"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))
                  )}
                  
                  <div className="pt-4 mt-4 border-t border-gray-200 flex flex-col space-y-2">
                    {isLoggedIn ? (
                      <>
                        <Link
                          href="/dashboard"
                          className="px-4 py-3 text-base font-medium text-gray-700 hover:text-[#00CFFF] hover:bg-[#00CFFF]/10 rounded-lg transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/settings"
                          className="px-4 py-3 text-base font-medium text-gray-700 hover:text-[#00CFFF] hover:bg-[#00CFFF]/10 rounded-lg transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Settings
                        </Link>
                        <button
                          className="px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                        >
                          Log out
                        </button>
                      </>
                    ) : (
                      <>
                        {loginButton && (
                          <Link
                            href={loginButton.href}
                            className="px-4 py-3 text-base font-medium text-gray-700 hover:text-[#00CFFF] hover:bg-[#00CFFF]/10 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {loginButton.label}
                          </Link>
                        )}
                        {signupButton && (
                          <Link
                            href={signupButton.href}
                            className="bg-[#FF007F] text-white px-6 py-3 rounded-lg hover:bg-[#E6006F] font-semibold transition-all text-center shadow-md"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {signupButton.label}
                          </Link>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
