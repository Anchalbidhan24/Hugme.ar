import React, { useState } from 'react';
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BrandLogo } from './BrandLogo';
import { RouteKey } from '../types/store';

export const Header: React.FC = () => {
  const {
    route,
    navigate,
    cart,
    wishlist,
    homepageContent,
    setIsCartOpen,
    setIsSearchOpen,
    customerSession,
  } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems: { label: string; route: RouteKey }[] = [
    { label: 'Home', route: 'home' },
    { label: 'Shop All', route: 'shop' },
    { label: 'Collections', route: 'categories' },
    { label: 'Bundles', route: 'bundles' },
    { label: 'New Arrivals', route: 'new-arrivals' },
    { label: 'Bestsellers', route: 'bestsellers' },
    { label: 'Gift Collection', route: 'gift-collection' },
    { label: 'Hugs & Hearts', route: 'loyalty' },
    { label: 'About Us', route: 'about' },
    { label: 'Track Order', route: 'order-tracking' },
  ];

  const handleNav = (r: RouteKey) => {
    setMenuOpen(false);
    navigate(r);
  };

  return (
    <div className="sticky top-0 z-40">
      {/* Slim Announcement Bar (unchanged) */}
      <div className="bg-[#F4DDE3] text-[#765B55] h-8 px-4 flex items-center justify-center border-b border-[#C98F9D]/20">
        <p className="font-ui text-xs font-medium tracking-wide truncate text-center">
          {homepageContent.announcementText}
        </p>
      </div>

      {/* Main Sticky Three-Section Boutique Header */}
      <header className="bg-[#FFF8EF]/95 backdrop-blur-md border-b border-[#765B55]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[72px] sm:min-h-[82px] md:min-h-[90px] lg:min-h-[98px] py-2 flex items-center justify-between gap-3 sm:gap-5 lg:gap-8">
          {/* LEFT: Hamburger Menu + Primary Bear Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl text-[#765B55] hover:bg-[#F4DDE3]/60 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <BrandLogo onClick={() => handleNav('home')} variant="primary" size="md" />
          </div>

          {/* CENTRE: Full Available Space — Satin Ribbon Bow + Prominent Tagline */}
          <div className="hidden sm:flex flex-1 min-w-0 items-center justify-center px-2 sm:px-4">
            <div className="animate-header-fade flex flex-col items-center justify-center text-center select-none max-w-full">
              <div className="flex items-center justify-center gap-2 md:gap-3 max-w-full">
                <span
                  className="hidden lg:inline-block w-7 xl:w-10 h-px bg-[#F4DDE3]"
                  aria-hidden="true"
                />
                <p className="font-display italic text-[19px] md:text-[28px] lg:text-[32px] xl:text-[36px] text-[#765B55] leading-[1.15] tracking-[0.01em] whitespace-nowrap">
                  A hug in every little thing.
                  <span
                    className="text-[#C98F9D] not-italic ml-1.5 text-[14px] md:text-[18px] lg:text-[20px] xl:text-[22px] align-middle"
                    aria-hidden="true"
                  >
                    ♥
                  </span>
                </p>
                <span
                  className="hidden lg:inline-block w-7 xl:w-10 h-px bg-[#F4DDE3]"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Search, Account, Wishlist, Cart Icons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search plushies"
              className="p-2.5 rounded-full text-[#765B55] hover:bg-[#F4DDE3]/70 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </button>

            <button
              type="button"
              onClick={() => handleNav(customerSession.isLoggedIn ? 'account' : 'login')}
              aria-label="Customer account"
              className="p-2.5 rounded-full text-[#765B55] hover:bg-[#F4DDE3]/70 transition-colors cursor-pointer relative"
            >
              <User className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              {customerSession.isLoggedIn && (
                <span className="sr-only">Signed in as {customerSession.name}</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleNav('wishlist')}
              aria-label="Wishlist"
              className="p-2.5 rounded-full text-[#765B55] hover:bg-[#F4DDE3]/70 transition-colors cursor-pointer relative"
            >
              <Heart className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#E9E2F5] text-[#765B55] font-ui text-[10px] font-semibold flex items-center justify-center tabular-nums">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Open shopping cart"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#C98F9D] hover:bg-[#b87b8a] text-white font-ui text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="tabular-nums font-semibold">({cartCount})</span>
            </button>
          </div>
        </div>

        {/* Navigation Drawer (Responsive for Mobile, Tablet & Desktop) */}
        {menuOpen && (
          <nav
            aria-label="Main navigation"
            className="bg-[#FFF8EF] border-t border-[#765B55]/10 px-4 sm:px-6 lg:px-8 py-4 shadow-lg"
          >
            <div className="max-w-7xl mx-auto space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#765B55]/10">
                <BrandLogo onClick={() => handleNav('home')} variant="primary" size="sm" />
                <p className="font-display italic text-sm text-[#765B55]/85 sm:hidden">
                  A hug in every little thing. <span className="text-[#C98F9D] not-italic">♥</span>
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-5 gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.route}
                    type="button"
                    onClick={() => handleNav(item.route)}
                    className={`px-3 py-2.5 rounded-xl font-ui text-xs font-medium text-center transition-colors cursor-pointer ${
                      route === item.route
                        ? 'bg-[#F4DDE3] text-[#765B55] font-semibold'
                        : 'bg-[#FFFFFF] border border-[#765B55]/10 text-[#765B55] hover:bg-[#F4DDE3]/50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        )}
      </header>
    </div>
  );
};
