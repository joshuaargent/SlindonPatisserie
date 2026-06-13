'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { mainNav } from '@/lib/constants';
import { siteConfig } from '@/lib/constants';
import { Menu, X, Phone, ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart';

// ============================================
// Navbar Component - Slindon Patisserie
// ============================================

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const itemCount = useCartStore((state) => state.getItemCount());

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 right-0 left-0 z-[50] transition-all duration-200',
          isScrolled 
            ? 'bg-[#F7F2E9]/95 border-b border-[#E8DDD0] backdrop-blur-md shadow-sm' 
            : 'bg-[#F7F2E9]'
        )}
        style={{ transform: 'translateZ(0)' }}
      >
        <nav className="container">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-[#8B1E22] text-xl md:text-2xl font-serif font-semibold">
                {siteConfig.name}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-1 md:flex">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'text-white bg-[#8B1E22]'
                      : 'text-[#8B1E22] hover:text-white hover:bg-[#8B1E22]'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Cart Icon */}
              <Link
                href="/cart"
                className={cn(
                  'relative ml-2 rounded-lg p-2 transition-colors',
                  pathname === '/cart'
                    ? 'bg-[#8B1E22] text-white'
                    : 'text-[#8B1E22] hover:bg-[#8B1E22]/10'
                )}
                aria-label="View cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#D0A246] text-white text-xs font-bold flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>
              
              {/* Account Icon */}
              <Link
                href="/login"
                className={cn(
                  'rounded-lg p-2 transition-colors',
                  pathname === '/account' || pathname === '/login' || pathname === '/register'
                    ? 'bg-[#8B1E22] text-white'
                    : 'text-[#8B1E22] hover:bg-[#8B1E22]/10'
                )}
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </Link>
              
              {/* Phone CTA */}
              <a
                href={`tel:${siteConfig.phone}`}
                className="ml-2 inline-flex items-center gap-2 rounded-lg bg-[#D0A246] px-4 py-2 text-sm font-medium text-[#3A2C2A] transition-colors hover:bg-[#E0B256]"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden lg:inline">{siteConfig.phone}</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="rounded-lg p-2 text-[#8B1E22] transition-colors hover:bg-[#8B1E22]/10 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-[#F7F2E9] fixed inset-0 z-[45] pt-16 md:hidden"
            style={{ transform: 'translateZ(0)' }}
          >
            <nav className="container py-6">
              <div className="flex flex-col gap-1">
                {mainNav.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center rounded-lg px-4 py-3 text-base font-medium transition-colors',
                        pathname === item.href
                          ? 'text-white bg-[#8B1E22]'
                          : 'text-[#8B1E22] hover:text-white hover:bg-[#8B1E22]'
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Mobile Cart & Account */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-[#E8DDD0]">
                  <Link
                    href="/cart"
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-3 bg-[#8B1E22] text-white font-medium"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Cart {itemCount > 0 && `(${itemCount})`}
                  </Link>
                  <Link
                    href="/login"
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-3 border border-[#8B1E22] text-[#8B1E22] font-medium"
                  >
                    <User className="h-5 w-5" />
                    Account
                  </Link>
                </div>
              </div>

              {/* Mobile Menu Footer */}
              <div className="mt-8 border-t border-[#E8DDD0] pt-8">
                {/* Phone CTA */}
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="mb-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#D0A246] px-4 py-3 text-lg font-medium text-[#3A2C2A] transition-colors hover:bg-[#E0B256]"
                >
                  <Phone className="h-5 w-5" />
                  <span>Call Us: {siteConfig.phone}</span>
                </a>
                
                <div className="flex items-center justify-center gap-4">
                  <a
                    href={siteConfig.links.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#8B1E22] hover:text-[#D0A246] p-2 transition-colors"
                    aria-label="YouTube"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                  <a
                    href={siteConfig.links.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#8B1E22] hover:text-[#D0A246] p-2 transition-colors"
                    aria-label="Instagram"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}
