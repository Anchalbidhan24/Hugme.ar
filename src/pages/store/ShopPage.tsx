import React, { useMemo, useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/ProductCard';
import { SafeImage } from '../../components/SafeImage';

interface ShopPageProps {
  mode: 'shop' | 'categories' | 'new-arrivals' | 'bestsellers' | 'gift-collection';
}

export const ShopPage: React.FC<ShopPageProps> = ({ mode }) => {
  const { products, categories, routeParams, navigate } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(
    routeParams.category || 'All'
  );
  const [selectedGiftTag, setSelectedGiftTag] = useState<string>(
    routeParams.giftTag || 'All'
  );
  const [searchTerm, setSearchTerm] = useState<string>(routeParams.searchQuery || '');
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');

  useEffect(() => {
    setSelectedCategory(routeParams.category || 'All');
  }, [routeParams.category]);

  useEffect(() => {
    setSelectedGiftTag(routeParams.giftTag || 'All');
  }, [routeParams.giftTag]);

  useEffect(() => {
    if (routeParams.searchQuery !== undefined) {
      setSearchTerm(routeParams.searchQuery);
    }
  }, [routeParams.searchQuery]);

  const pageMeta = {
    shop: {
      kicker: 'HUGME.AR',
      title: 'Shop All Plushies',
      subtitle: 'Every teddy bear, floppy bunny, capybara, and kawaii companion in one cosy shelf.',
    },
    categories: {
      kicker: 'Browse By Collection',
      title: 'Plushie Categories',
      subtitle: 'Pick a collection below to explore soft companions crafted for every personality.',
    },
    'new-arrivals': {
      kicker: 'Just Landed',
      title: 'New Arrivals',
      subtitle: 'Our newest dreamy plushies, freshly arrived and ready for endless hugs.',
    },
    bestsellers: {
      kicker: 'Most Loved',
      title: 'Bestsellers',
      subtitle: 'Community favourites that bring daily smiles and thoughtful gifting moments.',
    },
    'gift-collection': {
      kicker: 'Curated For Loved Ones',
      title: 'Gift Collection',
      subtitle: 'Thoughtful plushie pairings for birthdays, couples, best friends, and sweet surprises.',
    },
  }[mode];

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (mode === 'new-arrivals') {
      list = list.filter((p) => p.isNewArrival);
    } else if (mode === 'bestsellers') {
      list = list.filter((p) => p.isBestseller);
    } else if (mode === 'gift-collection') {
      list = list.filter((p) => Boolean(p.giftTag) || p.category === 'Gift Sets');
    }

    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (selectedGiftTag !== 'All') {
      list = list.filter((p) => p.giftTag === selectedGiftTag);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }

    list = list.filter((p) => p.price <= maxPrice);

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => Number(b.isNewArrival) - Number(a.isNewArrival));
    }

    return list;
  }, [products, mode, selectedCategory, selectedGiftTag, searchTerm, maxPrice, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedGiftTag('All');
    setSearchTerm('');
    setMaxPrice(6000);
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="bg-[#F4DDE3]/45 rounded-3xl border border-[#C98F9D]/20 p-8 sm:p-10">
        <p className="font-ui text-xs font-medium tracking-wider uppercase text-[#C98F9D]">
          {pageMeta.kicker}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#765B55] mt-1">
          {pageMeta.title}
        </h1>
        <p className="font-body text-base text-[#765B55]/80 mt-2 max-w-2xl">
          {pageMeta.subtitle}
        </p>
      </div>

      {/* Category Cards Showcase on Categories Mode */}
      {mode === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.slug);
                navigate('shop', { category: cat.slug });
              }}
              className="group bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 overflow-hidden text-left hover:border-[#C98F9D] transition-all cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden bg-[#FFF8EF]">
                <SafeImage
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h2 className="font-display text-xl font-semibold text-[#765B55] group-hover:text-[#C98F9D]">
                  {cat.name}
                </h2>
                <p className="font-body text-sm text-[#765B55]/75 mt-1">
                  {cat.description}
                </p>
                <p className="font-ui text-xs text-[#C98F9D] font-medium mt-3">
                  {products.filter((p) => p.category === cat.slug).length} Plushies →
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-4 sm:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#C98F9D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by name or style..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm text-[#765B55] placeholder:text-[#765B55]/45 focus:outline-none focus:ring-2 focus:ring-[#C98F9D]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#765B55]/60 hover:text-[#765B55] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Price & Sort Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-ui text-[#765B55]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C98F9D]" />
              <span className="whitespace-nowrap">Max: ₹{maxPrice.toLocaleString('en-IN')}</span>
              <input
                type="range"
                min={500}
                max={6000}
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="accent-[#C98F9D] w-24 sm:w-32 cursor-pointer"
              />
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              aria-label="Sort products"
              className="px-3.5 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs font-ui text-[#765B55] focus:outline-none focus:ring-2 focus:ring-[#C98F9D] cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#765B55]/10">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-ui font-medium transition-colors cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-[#C98F9D] text-white'
                : 'bg-[#FFF8EF] text-[#765B55] hover:bg-[#F4DDE3]'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3 py-1.5 rounded-lg text-xs font-ui font-medium transition-colors cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-[#C98F9D] text-white'
                  : 'bg-[#FFF8EF] text-[#765B55] hover:bg-[#F4DDE3]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Gift Tag Filter when on Gift Collection */}
        {mode === 'gift-collection' && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#765B55]/10">
            <span className="font-ui text-xs text-[#765B55]/70 mr-1">Gift Occasion:</span>
            {(['All', 'Birthday', 'Couple', 'Friendship', 'Surprise'] as const).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedGiftTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-ui font-medium transition-colors cursor-pointer ${
                  selectedGiftTag === tag
                    ? 'bg-[#765B55] text-white'
                    : 'bg-[#F4DCCB]/50 text-[#765B55] hover:bg-[#F4DCCB]'
                }`}
              >
                {tag === 'All' ? 'All Occasions' : `${tag} Gifts`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-ui text-[#765B55]/75">
        <span className="tabular-nums">
          Showing {filteredProducts.length} plushie{filteredProducts.length === 1 ? '' : 's'}
        </span>
        {(selectedCategory !== 'All' || selectedGiftTag !== 'All' || searchTerm || maxPrice < 6000) && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-[#C98F9D] hover:underline font-medium cursor-pointer"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-12 text-center">
          <h3 className="font-display text-2xl font-semibold text-[#765B55]">
            No plushies matched those filters
          </h3>
          <p className="font-body text-sm text-[#765B55]/75 mt-2">
            Try clearing your search or expanding your price range to see more companions.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 px-5 py-2.5 rounded-xl bg-[#C98F9D] text-white font-ui text-xs font-medium cursor-pointer"
          >
            Show All Plushies
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
