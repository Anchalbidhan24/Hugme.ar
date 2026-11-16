import React, { useState } from 'react';
import {
  ArrowRight,
  Gift,
  Heart,
  Instagram,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { IMG, INSTAGRAM_GALLERY } from '../../data/mockCatalog';
import { ProductCard } from '../../components/ProductCard';
import { SafeImage } from '../../components/SafeImage';
import { BrandLogo } from '../../components/BrandLogo';

export const HomePage: React.FC = () => {
  const {
    navigate,
    categories,
    products,
    bundles,
    getBundlePricing,
    addBundleToCart,
    loyaltySettings,
    formatPrice,
    homepageContent,
    subscribeNewsletter,
  } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const featuredBundles = bundles.filter((b) => b.active && b.featured).slice(0, 3);

  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 6);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 3);

  const giftOccasions: {
    title: string;
    subtitle: string;
    tag: 'Birthday' | 'Couple' | 'Friendship' | 'Surprise';
    image: string;
    bg: string;
  }[] = [
    {
      title: 'Birthday Gifts',
      subtitle: 'Ribbon-tied bears & keepsake hampers to celebrate their day',
      tag: 'Birthday',
      image: IMG.giftHamper,
      bg: 'bg-[#F4DDE3]/55',
    },
    {
      title: 'Couple Gifts',
      subtitle: 'Matching twin plushie pairs holding stitched felt hearts',
      tag: 'Couple',
      image: IMG.couple,
      bg: 'bg-[#E9E2F5]/65',
    },
    {
      title: 'Friendship Gifts',
      subtitle: 'Bag charms, boba duos & desk buddies for your favourite human',
      tag: 'Friendship',
      image: IMG.miniCharm,
      bg: 'bg-[#F4DCCB]/65',
    },
    {
      title: 'Surprise Gifts',
      subtitle: 'Oversized hug bears & sleepy bunnies delivered with care',
      tag: 'Surprise',
      image: IMG.bunny,
      bg: 'bg-[#F4DDE3]/55',
    },
  ];

  const pillars = [
    {
      icon: Heart,
      title: 'Adorable Designs',
      desc: 'Rosy cheeks, rounded ears, and gentle embroidered smiles.',
    },
    {
      icon: Sparkles,
      title: 'Soft & Cosy Companions',
      desc: 'Cloud-grade plush fleece chosen for warmth and comfort.',
    },
    {
      icon: Gift,
      title: 'Thoughtful Gifting',
      desc: 'Every order can be paired with keepsake boxes and gift notes.',
    },
    {
      icon: ShieldCheck,
      title: 'Carefully Selected',
      desc: 'Each character passes softness, stitching, and hug checks.',
    },
    {
      icon: Truck,
      title: 'Beautiful Experience',
      desc: 'From soft blush wrapping to doorstep arrival, made special.',
    },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    subscribeNewsletter(newsletterEmail, 'Homepage Newsletter');
    setNewsletterEmail('');
  };

  return (
    <div className="space-y-20 pb-8">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#F4DDE3]/45 via-[#FFF8EF] to-[#FFF8EF] pt-8 sm:pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch bg-[#FFFFFF] rounded-[2rem] border border-[#765B55]/10 overflow-hidden shadow-[0_20px_50px_-24px_rgba(118,91,85,0.2)]">
            {/* Hero Copy */}
            <div className="lg:col-span-5 p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
              <p className="font-ui text-xs font-medium tracking-wider uppercase text-[#C98F9D] mb-3">
                HUGME.AR · A hug in every little thing
              </p>
              <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#765B55] leading-[1.12] tracking-tight">
                {homepageContent.heroHeading}
              </h1>
              <p className="font-body text-base sm:text-lg text-[#765B55]/80 mt-5 leading-relaxed max-w-md">
                {homepageContent.heroDescription}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => navigate('shop')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] text-white font-ui text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>{homepageContent.heroPrimaryCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('categories')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FFF8EF] hover:bg-[#F4DDE3]/60 border border-[#C98F9D]/40 text-[#765B55] font-ui text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>{homepageContent.heroSecondaryCta}</span>
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-[#765B55]/10 flex items-center gap-4 text-xs font-ui text-[#765B55]/75">
                <span>Little toys, bigger hugs</span>
                <span aria-hidden="true">·</span>
                <span>Cloud-Soft Micro-Plush</span>
                <span aria-hidden="true">·</span>
                <span>Gift-Ready Packaging</span>
              </div>
            </div>

            {/* Hero Media */}
            <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[420px] lg:min-h-[520px] bg-[#F4DDE3]/30">
              <SafeImage
                src={IMG.hero}
                alt="HUGME.AR dreamy plushie collection on sunlit cream linen"
                className="w-full h-full lg:absolute lg:inset-0 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-ui text-xs font-medium tracking-wider uppercase text-[#C98F9D]">
              Curated Shelves
            </p>
            <h2 className="font-display text-3xl font-semibold text-[#765B55] mt-1">
              Shop by Category
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('categories')}
            className="inline-flex items-center gap-1.5 font-ui text-sm font-medium text-[#C98F9D] hover:text-[#765B55] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>View all collections</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => navigate('shop', { category: cat.slug })}
              className="group bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 overflow-hidden text-left transition-all duration-200 ease-boutique hover:-translate-y-0.5 hover:border-[#C98F9D]/50 cursor-pointer"
            >
              <div className="aspect-[4/3] bg-[#FFF8EF] overflow-hidden">
                <SafeImage
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-3.5 sm:p-4">
                <h3 className="font-display text-base sm:text-lg font-semibold text-[#765B55] group-hover:text-[#C98F9D] transition-colors">
                  {cat.name}
                </h3>
                <p className="font-body text-xs text-[#765B55]/70 mt-0.5 line-clamp-1">
                  {cat.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-ui text-xs font-medium tracking-wider uppercase text-[#C98F9D]">
              Most Hugged Companions
            </p>
            <h2 className="font-display text-3xl font-semibold text-[#765B55] mt-1">
              Bestsellers
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('bestsellers')}
            className="inline-flex items-center gap-1.5 font-ui text-sm font-medium text-[#C98F9D] hover:text-[#765B55] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>Shop all bestsellers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="bg-[#F4DDE3]/45 border-y border-[#C98F9D]/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden border border-[#FFFFFF] shadow-lg aspect-[4/3]">
                <SafeImage
                  src={IMG.teddy}
                  alt="Buttercream Ribbon Teddy from HUGME.AR"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="lg:col-span-6 space-y-5">
              <div className="pb-1">
                <BrandLogo variant="secondary" size="lg" />
              </div>
              <p className="font-ui text-xs font-medium tracking-wider uppercase text-[#C98F9D]">
                Our Story
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#765B55] leading-tight">
                {homepageContent.storyHeading}
              </h2>
              <p className="font-body text-base sm:text-lg text-[#765B55]/85 leading-relaxed">
                {homepageContent.storyDescription}
              </p>
              <p className="font-body text-sm text-[#765B55]/75 leading-relaxed">
                Whether tucked beside a pillow, perched on a study desk, or tied with a satin ribbon for someone you adore, each companion carries a little note of warmth.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate('about')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FFFFFF] hover:bg-[#FFF8EF] border border-[#C98F9D]/40 text-[#765B55] font-ui text-sm font-medium transition-colors cursor-pointer"
                >
                  <span>Read Our Story</span>
                  <ArrowRight className="w-4 h-4 text-[#C98F9D]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-ui text-xs font-medium tracking-wider uppercase text-[#C98F9D]">
              Freshly Unboxed
            </p>
            <h2 className="font-display text-3xl font-semibold text-[#765B55] mt-1">
              New Arrivals
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('new-arrivals')}
            className="inline-flex items-center gap-1.5 font-ui text-sm font-medium text-[#C98F9D] hover:text-[#765B55] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>See all new arrivals</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* GIFT COLLECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-ui text-xs font-medium tracking-wider uppercase text-[#C98F9D]">
              Wrapped With Care
            </p>
            <h2 className="font-display text-3xl font-semibold text-[#765B55] mt-1">
              Gift Collection
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('gift-collection')}
            className="inline-flex items-center gap-1.5 font-ui text-sm font-medium text-[#C98F9D] hover:text-[#765B55] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>Explore gift collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {giftOccasions.map((gift) => (
            <button
              key={gift.tag}
              type="button"
              onClick={() => navigate('gift-collection', { giftTag: gift.tag })}
              className={`group rounded-2xl border border-[#765B55]/10 overflow-hidden text-left transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${gift.bg}`}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <SafeImage
                  src={gift.image}
                  alt={gift.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-semibold text-[#765B55]">
                  {gift.title}
                </h3>
                <p className="font-body text-sm text-[#765B55]/80 mt-1 leading-relaxed">
                  {gift.subtitle}
                </p>
                <span className="inline-flex items-center gap-1 font-ui text-xs font-medium text-[#C98F9D] mt-3">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* PLUSHIE BUNDLES & HUGS & HEARTS REWARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="font-ui text-xs font-medium tracking-wider uppercase text-[#C98F9D]">
              Better Together · Build or Choose a Set
            </p>
            <h2 className="font-display text-3xl font-semibold text-[#765B55] mt-1">
              Plushie Bundles &amp; Combo Sets
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('bundles')}
            className="inline-flex items-center gap-1.5 font-ui text-sm font-medium text-[#C98F9D] hover:text-[#765B55] transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>Explore all bundles &amp; custom builder</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredBundles.map((bundle) => {
            const pricing = getBundlePricing(bundle);
            return (
              <div
                key={bundle.id}
                className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => navigate('bundles', { bundleId: bundle.id })}
                    className="grid grid-cols-2 gap-2 rounded-xl bg-[#FFF8EF] p-2 w-full cursor-pointer"
                  >
                    {pricing.components.slice(0, 2).map((comp) => (
                      <div key={comp.product.id} className="aspect-square rounded-lg overflow-hidden">
                        <SafeImage
                          src={comp.product.images[0]}
                          alt={comp.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </button>
                  <div>
                    <p className="font-ui text-[11px] font-medium text-[#C98F9D]">
                      {bundle.tag || 'Plushie Bundle'}
                      {pricing.savings > 0 && ` · Save ${pricing.discountPercentEffective}%`}
                    </p>
                    <h3 className="font-display text-xl font-semibold text-[#765B55] mt-0.5">
                      {bundle.name}
                    </h3>
                    <p className="font-body text-xs text-[#765B55]/75 mt-1 line-clamp-2">
                      {bundle.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#765B55]/10">
                  <div className="flex items-baseline gap-2">
                    <span className="font-ui text-base font-semibold text-[#765B55] tabular-nums">
                      {formatPrice(pricing.finalPrice)}
                    </span>
                    {pricing.savings > 0 && (
                      <span className="font-ui text-xs text-[#765B55]/45 line-through tabular-nums">
                        {formatPrice(pricing.combinedPrice)}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    disabled={!pricing.isAvailable}
                    onClick={() => addBundleToCart(bundle, true)}
                    className="px-3.5 py-2 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] disabled:opacity-45 text-white font-ui text-xs font-medium cursor-pointer"
                  >
                    Add Bundle
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* HUGS & HEARTS REWARDS Banner */}
        {loyaltySettings.enabled && (
          <div className="rounded-3xl bg-gradient-to-r from-[#F4DDE3]/65 via-[#FFF8EF] to-[#E9E2F5]/65 border border-[#C98F9D]/25 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <p className="font-ui text-xs font-semibold uppercase tracking-wider text-[#C98F9D]">
                {loyaltySettings.programmeName}
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#765B55]">
                {loyaltySettings.tagline}
              </h3>
              <p className="font-body text-sm text-[#765B55]/80">
                Earn {loyaltySettings.pointsPer100Inr} Hug Points per ₹100 spent plus a +{loyaltySettings.firstOrderBonusPoints} welcome bonus on your first completed purchase—redeem for vouchers, free gift wrap, or express shipping.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('loyalty')}
              className="px-6 py-3 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] text-white font-ui text-xs font-medium inline-flex items-center gap-2 shrink-0 cursor-pointer self-start md:self-auto"
            >
              <span>Explore Hugs &amp; Hearts</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* WHY CHOOSE HUGME.AR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="font-ui text-xs font-medium tracking-wider uppercase text-[#C98F9D]">
              The HUGME.AR Promise
            </p>
            <h2 className="font-display text-3xl font-semibold text-[#765B55] mt-1">
              Why Choose HUGME.AR?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {pillars.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="text-center p-4 rounded-2xl bg-[#FFF8EF]/70 border border-[#765B55]/8"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#F4DDE3] text-[#765B55] flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-[#765B55]">
                    {item.title}
                  </h3>
                  <p className="font-body text-xs text-[#765B55]/75 mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INSTAGRAM GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-ui text-xs font-medium tracking-wider uppercase text-[#C98F9D]">
              @hugme.ar
            </p>
            <h2 className="font-display text-3xl font-semibold text-[#765B55] mt-1">
              Moments Made Softer
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 font-ui text-xs text-[#765B55]/75">
            <Instagram className="w-4 h-4 text-[#C98F9D]" />
            Share your hug with #MyHugmeAR
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {INSTAGRAM_GALLERY.map((post) => (
            <button
              key={post.id}
              type="button"
              onClick={() => navigate('shop')}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-[#765B55]/10 bg-[#FFFFFF] cursor-pointer"
            >
              <SafeImage
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#765B55]/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p className="font-body text-xs text-white leading-snug text-left">
                  {post.caption}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#F4DDE3] via-[#F4DCCB]/75 to-[#E9E2F5] p-8 sm:p-12 border border-[#C98F9D]/25 text-center">
          <div className="flex justify-center mb-4">
            <BrandLogo variant="secondary" size="md" />
          </div>
          <p className="font-ui text-xs font-medium tracking-wider uppercase text-[#765B55]/80">
            Join the Cuddle Club
          </p>
          <h2 className="font-display text-3xl font-semibold text-[#765B55] mt-2">
            Get Sweet Notes &amp; First Dibs on New Plushies
          </h2>
          <p className="font-body text-sm sm:text-base text-[#765B55]/80 mt-2 max-w-xl mx-auto">
            Receive early access to seasonal teddy drops, keepsake gift hampers, and cosy updates from HUGME.AR.
          </p>

          <form
            onSubmit={handleNewsletterSubmit}
            className="mt-6 max-w-md mx-auto flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-xl bg-[#FFFFFF] border border-[#765B55]/15 text-sm text-[#765B55] placeholder:text-[#765B55]/45 focus:outline-none focus:ring-2 focus:ring-[#C98F9D]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#765B55] hover:bg-[#5e4742] text-white font-ui text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Subscribe ♡
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
