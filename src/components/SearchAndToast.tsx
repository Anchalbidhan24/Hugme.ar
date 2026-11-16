import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SafeImage } from './SafeImage';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, navigate, formatPrice } = useStore();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const trimmed = query.trim().toLowerCase();
  const matches = trimmed
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.category.toLowerCase().includes(trimmed) ||
          p.shortDescription.toLowerCase().includes(trimmed)
      )
    : products.slice(0, 6);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchOpen(false);
    navigate('shop', { searchQuery: query.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div
        className="fixed inset-0 bg-[#765B55]/35 backdrop-blur-xs"
        onClick={() => setIsSearchOpen(false)}
      />
      <div className="relative z-10 w-full max-w-2xl bg-[#FFF8EF] rounded-3xl border border-[#765B55]/15 shadow-2xl overflow-hidden">
        <form onSubmit={handleSubmit} className="flex items-center gap-3 px-5 py-4 bg-[#FFFFFF] border-b border-[#765B55]/10">
          <Search className="w-5 h-5 text-[#C98F9D] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teddy bears, bunnies, capybaras, gift sets..."
            className="flex-1 bg-transparent text-sm text-[#765B55] placeholder:text-[#765B55]/45 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-full text-[#765B55]/70 hover:bg-[#F4DDE3]/70 cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </form>

        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
          <div className="flex items-center justify-between text-xs font-ui text-[#765B55]/70">
            <span>{trimmed ? `Results for "${query}"` : 'Popular Companions'}</span>
            <button
              type="button"
              onClick={handleSubmit}
              className="text-[#C98F9D] hover:underline font-medium cursor-pointer"
            >
              View all in Shop →
            </button>
          </div>

          {matches.length === 0 ? (
            <p className="py-8 text-center font-body text-sm text-[#765B55]/70">
              No plushies found matching “{query}”. Try searching for “Bunny”, “Teddy”, or “Capybara”.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {matches.slice(0, 6).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate('product', { productId: item.id })}
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FFFFFF] border border-[#765B55]/10 hover:border-[#C98F9D] text-left transition-colors cursor-pointer"
                >
                  <SafeImage
                    src={item.images[0]}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-display text-sm font-semibold text-[#765B55] truncate">
                      {item.name}
                    </p>
                    <p className="font-ui text-xs text-[#765B55]/65">
                      {item.category} · <span className="tabular-nums font-medium text-[#C98F9D]">{formatPrice(item.price)}</span>
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useStore();
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto px-4 py-3 rounded-2xl shadow-lg border text-xs font-ui font-medium flex items-center gap-2 transition-all ${
            toast.tone === 'success'
              ? 'bg-[#FFFFFF] border-[#C98F9D]/40 text-[#765B55]'
              : toast.tone === 'cocoa'
                ? 'bg-[#765B55] border-[#765B55] text-[#FFF8EF]'
                : 'bg-[#F4DDE3] border-[#C98F9D]/40 text-[#765B55]'
          }`}
        >
          <span>{toast.text}</span>
        </div>
      ))}
    </div>
  );
};
