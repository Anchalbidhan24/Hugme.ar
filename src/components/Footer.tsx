import React, { useState } from 'react';
import { Instagram, Mail, Phone, MapPin, ShieldCheck, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BrandLogo } from './BrandLogo';
import { CurrencyCode } from '../types/store';

export const Footer: React.FC = () => {
  const { navigate, subscribeNewsletter, currency, setCurrency, siteSettings } = useStore();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    subscribeNewsletter(email, 'Footer Signup');
    setEmail('');
  };

  return (
    <footer className="bg-[#F4DDE3]/45 border-t border-[#C98F9D]/25 text-[#765B55] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex flex-col items-start gap-2">
              <BrandLogo onClick={() => navigate('home')} variant="secondary" size="lg" />
            </div>
            <p className="font-body text-sm text-[#765B55]/80 leading-relaxed max-w-sm">
              Little toys, bigger hugs. Handpicked cream teddy bears, floppy bunnies, and kawaii companions crafted to bring warmth to every doorstep.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="#instagram"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('home');
                }}
                aria-label="HUGME.AR Instagram"
                className="w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#765B55]/10 flex items-center justify-center text-[#765B55] hover:bg-[#C98F9D] hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => navigate('contact')}
                aria-label="Email HUGME.AR"
                className="w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#765B55]/10 flex items-center justify-center text-[#765B55] hover:bg-[#C98F9D] hover:text-white transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-ui text-xs font-semibold tracking-wider uppercase text-[#765B55]/70">
              Collections
            </h3>
            <ul className="space-y-2 font-body text-sm">
              <li>
                <button onClick={() => navigate('shop')} className="hover:text-[#C98F9D] cursor-pointer">
                  Shop All
                </button>
              </li>
              <li>
                <button onClick={() => navigate('new-arrivals')} className="hover:text-[#C98F9D] cursor-pointer">
                  New Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => navigate('bestsellers')} className="hover:text-[#C98F9D] cursor-pointer">
                  Bestsellers
                </button>
              </li>
              <li>
                <button onClick={() => navigate('gift-collection')} className="hover:text-[#C98F9D] cursor-pointer">
                  Gift Collection
                </button>
              </li>
              <li>
                <button onClick={() => navigate('bundles')} className="hover:text-[#C98F9D] cursor-pointer">
                  Plushie Bundles
                </button>
              </li>
              <li>
                <button onClick={() => navigate('about')} className="hover:text-[#C98F9D] cursor-pointer">
                  Our Story
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Policies */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-ui text-xs font-semibold tracking-wider uppercase text-[#765B55]/70">
              Customer Care &amp; Policies
            </h3>
            <ul className="space-y-2 font-body text-sm">
              <li>
                <button onClick={() => navigate('loyalty')} className="hover:text-[#C98F9D] cursor-pointer">
                  Hugs &amp; Hearts Rewards
                </button>
              </li>
              <li>
                <button onClick={() => navigate('order-tracking')} className="hover:text-[#C98F9D] cursor-pointer">
                  Track Order
                </button>
              </li>
              <li>
                <button onClick={() => navigate('faq')} className="hover:text-[#C98F9D] cursor-pointer">
                  FAQ
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-[#C98F9D] cursor-pointer">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shipping-policy')} className="hover:text-[#C98F9D] cursor-pointer">
                  Shipping Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('return-policy')} className="hover:text-[#C98F9D] cursor-pointer">
                  Return &amp; Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('privacy-policy')} className="hover:text-[#C98F9D] cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('terms')} className="hover:text-[#C98F9D] cursor-pointer">
                  Terms &amp; Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-ui text-xs font-semibold tracking-wider uppercase text-[#765B55]/70">
              Cuddle Club Notes
            </h3>
            <p className="font-body text-sm text-[#765B55]/80">
              Be the first to meet limited drops and gift hamper releases.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 min-w-0 px-3.5 py-2 rounded-xl bg-[#FFFFFF] border border-[#765B55]/15 text-sm text-[#765B55] placeholder:text-[#765B55]/45 focus:outline-none focus:ring-2 focus:ring-[#C98F9D]"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="px-3.5 py-2 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] text-white transition-colors cursor-pointer shrink-0"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2 space-y-1.5 text-xs font-body text-[#765B55]/80">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C98F9D]" />
                <span>{siteSettings.supportEmail}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C98F9D]" />
                <span>{siteSettings.supportPhone}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C98F9D]" />
                <span>Bandra West, Mumbai · India</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#765B55]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-ui text-[#765B55]/75">
          <p>© 2026 HUGME.AR. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-4">
            <label className="inline-flex items-center gap-1.5">
              <span>Currency:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-[#FFFFFF] border border-[#765B55]/15 rounded-lg px-2 py-1 text-xs text-[#765B55] focus:outline-none focus:ring-1 focus:ring-[#C98F9D] cursor-pointer"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </label>

            <button
              type="button"
              onClick={() => navigate('admin-login')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFFFFF] border border-[#765B55]/15 hover:border-[#C98F9D] text-[#765B55] font-medium transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#C98F9D]" />
              <span>Store Management</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
