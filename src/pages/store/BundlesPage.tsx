import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  Gift,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SafeImage } from '../../components/SafeImage';
import { PlushieBundle, Product } from '../../types/store';

export const BundlesPage: React.FC = () => {
  const {
    bundles,
    buildBundleConfig,
    products,
    getBundlePricing,
    addBundleToCart,
    addCustomBundleToCart,
    getReservedProductQuantity,
    formatPrice,
    navigate,
    routeParams,
  } = useStore();

  const activeBundles = bundles.filter((b) => b.active);
  const [selectedBundleId, setSelectedBundleId] = useState<string | null>(
    routeParams.bundleId || null
  );

  useEffect(() => {
    if (routeParams.bundleId) {
      setSelectedBundleId(routeParams.bundleId);
    }
  }, [routeParams.bundleId]);

  const modalBundle: PlushieBundle | null = selectedBundleId
    ? activeBundles.find((b) => b.id === selectedBundleId) || null
    : null;
  const modalPricing = modalBundle ? getBundlePricing(modalBundle) : null;

  // Build Your Own Bundle state
  const tiers = [...buildBundleConfig.tiers].sort((a, b) => a.count - b.count);
  const [selectedTierCount, setSelectedTierCount] = useState<number>(tiers[1]?.count || tiers[0]?.count || 3);
  const activeTier =
    tiers.find((t) => t.count === selectedTierCount) ||
    tiers[0] || { count: 2, label: '2 Plushies Duo', discountPercent: 0 };

  const [customQuantities, setCustomQuantities] = useState<Record<string, number>>({});

  const chosenEntries: { product: Product; quantity: number }[] = Object.entries(customQuantities)
    .filter(([, qty]) => qty > 0)
    .map(([productId, quantity]) => {
      const prod = products.find((p) => p.id === productId);
      return prod ? { product: prod, quantity } : null;
    })
    .filter((x): x is { product: Product; quantity: number } => Boolean(x));

  const totalChosenCount = chosenEntries.reduce((sum, entry) => sum + entry.quantity, 0);
  const customCombinedPrice = chosenEntries.reduce(
    (sum, entry) => sum + entry.product.price * entry.quantity,
    0
  );
  const customFinalPrice =
    activeTier.discountPercent > 0
      ? Math.round(customCombinedPrice * (1 - activeTier.discountPercent / 100))
      : customCombinedPrice;
  const customSavings = Math.max(0, customCombinedPrice - customFinalPrice);

  const handleSelectTier = (count: number) => {
    setSelectedTierCount(count);
    // Trim excess selections gently if downsizing tier
    if (totalChosenCount > count) {
      let remaining = count;
      const nextMap: Record<string, number> = {};
      for (const entry of chosenEntries) {
        if (remaining <= 0) break;
        const take = Math.min(entry.quantity, remaining);
        if (take > 0) {
          nextMap[entry.product.id] = take;
          remaining -= take;
        }
      }
      setCustomQuantities(nextMap);
    }
  };

  const adjustCustomProduct = (product: Product, delta: number) => {
    const current = customQuantities[product.id] || 0;
    const nextQty = current + delta;
    if (nextQty < 0) return;

    if (delta > 0) {
      if (totalChosenCount >= activeTier.count) return;
      const reservedInCart = getReservedProductQuantity(product.id);
      if (reservedInCart + nextQty > product.stock) return;
    }

    setCustomQuantities((prev) => {
      const copy = { ...prev };
      if (nextQty <= 0) {
        delete copy[product.id];
      } else {
        copy[product.id] = nextQty;
      }
      return copy;
    });
  };

  const handleAddCustomBundle = () => {
    if (totalChosenCount !== activeTier.count) return;
    addCustomBundleToCart(chosenEntries, activeTier, true);
    setCustomQuantities({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#F4DDE3]/65 via-[#FFF8EF] to-[#E9E2F5]/55 rounded-[2rem] border border-[#C98F9D]/25 p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <p className="font-ui text-xs font-medium uppercase tracking-wider text-[#C98F9D]">
            Curated Plushie Sets &amp; Combo Offers
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#765B55] leading-tight">
            HUGME.AR Plushie Bundles
          </h1>
          <p className="font-body text-sm sm:text-base text-[#765B55]/80 leading-relaxed">
            Pair matching teddy bears, dreamy bedtime companions, and kawaii desk buddies into one thoughtful bundle—ready to wrap with a personalised card at checkout.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          {buildBundleConfig.enabled && (
            <a
              href="#build-your-own-bundle"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] text-white font-ui text-xs font-medium transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Build Your Own Bundle</span>
            </a>
          )}
          <button
            type="button"
            onClick={() => navigate('shop')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FFFFFF] border border-[#C98F9D]/40 text-[#765B55] font-ui text-xs font-medium hover:bg-[#F4DDE3]/35 transition-colors cursor-pointer"
          >
            <span>Browse Individual Plushies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Curated Bundles Grid */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <p className="font-ui text-xs font-medium uppercase tracking-wider text-[#C98F9D]">
              Ready-to-Gift Combinations
            </p>
            <h2 className="font-display text-3xl font-semibold text-[#765B55] mt-1">
              Curated Plushie Bundles ({activeBundles.length})
            </h2>
          </div>
          <p className="font-body text-xs text-[#765B55]/75">
            Every bundle checks live component stock before adding to your cart.
          </p>
        </div>

        {activeBundles.length === 0 ? (
          <div className="bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-12 text-center space-y-3">
            <Package className="w-8 h-8 text-[#C98F9D] mx-auto" />
            <h3 className="font-display text-2xl font-semibold text-[#765B55]">
              No curated bundles active right now
            </h3>
            <p className="font-body text-sm text-[#765B55]/75">
              Use our interactive builder below or explore our full plushie collection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {activeBundles.map((bundle) => {
              const pricing = getBundlePricing(bundle);
              const totalPieces = pricing.components.reduce((sum, c) => sum + c.quantity, 0);

              return (
                <article
                  key={bundle.id}
                  className="bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C98F9D]/50"
                >
                  {/* Visual Collage of Bundle Components */}
                  <button
                    type="button"
                    onClick={() => setSelectedBundleId(bundle.id)}
                    className="p-4 pb-0 text-left cursor-pointer"
                  >
                    <div
                      className={`grid gap-2 rounded-2xl overflow-hidden bg-[#FFF8EF] p-2 border border-[#765B55]/8 ${
                        pricing.components.length === 2
                          ? 'grid-cols-2'
                          : pricing.components.length === 3
                            ? 'grid-cols-3'
                            : 'grid-cols-2'
                      }`}
                    >
                      {pricing.components.slice(0, 4).map((comp) => (
                        <div
                          key={comp.product.id}
                          className="aspect-square rounded-xl overflow-hidden bg-[#FFFFFF]"
                        >
                          <SafeImage
                            src={comp.product.images[0]}
                            alt={comp.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </button>

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2 text-[11px] font-ui text-[#C98F9D] font-medium">
                        <span>
                          {bundle.tag || 'Curated Set'} · {totalPieces} Plushies
                        </span>
                        {pricing.savings > 0 && (
                          <span className="text-[#765B55] font-semibold tabular-nums">
                            Save {formatPrice(pricing.savings)} ({pricing.discountPercentEffective}% off)
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedBundleId(bundle.id)}
                        className="font-display text-2xl font-semibold text-[#765B55] hover:text-[#C98F9D] transition-colors text-left cursor-pointer"
                      >
                        {bundle.name}
                      </button>

                      <p className="font-body text-xs text-[#765B55]/80 leading-relaxed">
                        {bundle.description}
                      </p>

                      {/* Included Items List */}
                      <div className="pt-2 border-t border-[#765B55]/10 space-y-1">
                        <p className="font-ui text-[11px] uppercase tracking-wider text-[#765B55]/60">
                          Included Plushies
                        </p>
                        <ul className="space-y-1">
                          {pricing.components.map((comp) => (
                            <li
                              key={comp.product.id}
                              className="flex items-center justify-between gap-2 text-xs font-body text-[#765B55]"
                            >
                              <span className="truncate">
                                {comp.quantity}× {comp.product.name}
                              </span>
                              <span className="font-ui text-[11px] text-[#765B55]/60 tabular-nums shrink-0">
                                {formatPrice(comp.product.price * comp.quantity)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-[#765B55]/10">
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="flex items-baseline gap-2">
                          <span className="font-ui text-xl font-semibold text-[#765B55] tabular-nums">
                            {formatPrice(pricing.finalPrice)}
                          </span>
                          {pricing.savings > 0 && (
                            <span className="font-ui text-xs text-[#765B55]/50 line-through tabular-nums">
                              {formatPrice(pricing.combinedPrice)}
                            </span>
                          )}
                        </div>
                        <span className="font-ui text-[11px] text-[#765B55]/70 tabular-nums">
                          {pricing.isAvailable
                            ? `${pricing.availableStock} sets ready`
                            : 'Currently unavailable'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => addBundleToCart(bundle, true)}
                          disabled={!pricing.isAvailable}
                          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] disabled:opacity-45 text-white font-ui text-xs font-medium transition-colors cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add Bundle to Cart</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedBundleId(bundle.id)}
                          className="py-2.5 px-3.5 rounded-xl border border-[#765B55]/15 hover:border-[#C98F9D] text-[#765B55] font-ui text-xs font-medium cursor-pointer"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Interactive Build Your Own Bundle */}
      {buildBundleConfig.enabled && (
        <section
          id="build-your-own-bundle"
          className="bg-[#FFFFFF] rounded-[2rem] border border-[#C98F9D]/25 p-6 sm:p-10 space-y-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#765B55]/10 pb-6">
            <div>
              <p className="font-ui text-xs font-medium uppercase tracking-wider text-[#C98F9D]">
                Custom Plushie Hamper
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#765B55] mt-1">
                Build Your Own Bundle
              </h2>
              <p className="font-body text-sm text-[#765B55]/75 mt-1 max-w-2xl">
                Choose your bundle size, mix and match any in-stock plushies from the shelf, and enjoy automatic bundle pricing in your cart.
              </p>
            </div>

            {/* Step 1: Tier Selection */}
            <div className="flex flex-wrap gap-2">
              {tiers.map((tier) => {
                const active = tier.count === activeTier.count;
                return (
                  <button
                    key={tier.count}
                    type="button"
                    onClick={() => handleSelectTier(tier.count)}
                    className={`px-4 py-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#C98F9D] border-[#C98F9D] text-white'
                        : 'bg-[#FFF8EF] border-[#765B55]/15 text-[#765B55] hover:border-[#C98F9D]'
                    }`}
                  >
                    <p className="font-ui text-xs font-semibold">{tier.label}</p>
                    <p
                      className={`font-body text-[11px] tabular-nums ${
                        active ? 'text-white/90' : 'text-[#C98F9D]'
                      }`}
                    >
                      {tier.discountPercent > 0
                        ? `Save ${tier.discountPercent}%`
                        : 'Custom Mix'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Shelf Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => {
                const chosenQty = customQuantities[product.id] || 0;
                const reservedInCart = getReservedProductQuantity(product.id);
                const remainingForBuilder = Math.max(0, product.stock - reservedInCart - chosenQty);
                const canAddMore =
                  totalChosenCount < activeTier.count && remainingForBuilder > 0;

                return (
                  <div
                    key={product.id}
                    className={`rounded-2xl border p-3.5 flex flex-col justify-between gap-3 transition-colors ${
                      chosenQty > 0
                        ? 'border-[#C98F9D] bg-[#F4DDE3]/25'
                        : 'border-[#765B55]/10 bg-[#FFF8EF]/55'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#FFFFFF]">
                        <SafeImage
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-ui text-[10px] uppercase tracking-wider text-[#C98F9D]">
                          {product.category}
                        </p>
                        <h3 className="font-display text-base font-semibold text-[#765B55] line-clamp-1">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <span className="font-ui text-xs font-semibold text-[#765B55] tabular-nums">
                            {formatPrice(product.price)}
                          </span>
                          <span className="font-ui text-[10px] text-[#765B55]/65 tabular-nums">
                            {remainingForBuilder > 0
                              ? `${remainingForBuilder} left`
                              : 'Stock limit'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {chosenQty > 0 ? (
                      <div className="flex items-center justify-between rounded-xl bg-[#FFFFFF] border border-[#C98F9D]/40 p-1">
                        <button
                          type="button"
                          onClick={() => adjustCustomProduct(product, -1)}
                          aria-label={`Remove one ${product.name}`}
                          className="p-1.5 text-[#765B55] hover:text-[#C98F9D] cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-ui text-xs font-semibold text-[#765B55] tabular-nums">
                          {chosenQty} in box
                        </span>
                        <button
                          type="button"
                          onClick={() => adjustCustomProduct(product, 1)}
                          disabled={!canAddMore}
                          aria-label={`Add one more ${product.name}`}
                          className="p-1.5 text-[#765B55] hover:text-[#C98F9D] disabled:opacity-35 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => adjustCustomProduct(product, 1)}
                        disabled={!canAddMore}
                        className="w-full py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F4DDE3]/60 border border-[#765B55]/15 disabled:opacity-40 text-xs font-ui font-medium text-[#765B55] transition-colors cursor-pointer"
                      >
                        {totalChosenCount >= activeTier.count
                          ? 'Bundle Full'
                          : remainingForBuilder === 0
                            ? 'Out of Stock'
                            : '+ Add to Bundle'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Live Custom Bundle Tray */}
            <div className="lg:col-span-4 bg-[#FFF8EF] rounded-3xl border border-[#C98F9D]/30 p-6 space-y-5 lg:sticky lg:top-28">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-ui text-[11px] uppercase tracking-wider text-[#C98F9D] font-semibold">
                    Your Bundle Box
                  </p>
                  <h3 className="font-display text-2xl font-semibold text-[#765B55]">
                    {activeTier.label}
                  </h3>
                </div>
                <span className="font-ui text-sm font-semibold text-[#765B55] tabular-nums">
                  {totalChosenCount}/{activeTier.count}
                </span>
              </div>

              {/* Progress Dots */}
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: activeTier.count }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-colors ${
                      idx < totalChosenCount ? 'bg-[#C98F9D]' : 'bg-[#F4DDE3]'
                    }`}
                  />
                ))}
              </div>

              {chosenEntries.length === 0 ? (
                <div className="py-8 text-center rounded-2xl bg-[#FFFFFF] border border-dashed border-[#C98F9D]/40 px-4">
                  <Gift className="w-6 h-6 text-[#C98F9D] mx-auto mb-2" />
                  <p className="font-body text-xs text-[#765B55]/75">
                    Pick {activeTier.count} plushies from the left to see your live custom bundle pricing.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {chosenEntries.map((entry) => (
                    <div
                      key={entry.product.id}
                      className="flex items-center gap-3 bg-[#FFFFFF] rounded-xl border border-[#765B55]/10 p-2.5"
                    >
                      <SafeImage
                        src={entry.product.images[0]}
                        alt={entry.product.name}
                        className="w-11 h-11 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-sm font-semibold text-[#765B55] truncate">
                          {entry.product.name}
                        </p>
                        <p className="font-ui text-[11px] text-[#765B55]/70 tabular-nums">
                          Qty {entry.quantity} · {formatPrice(entry.product.price * entry.quantity)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => adjustCustomProduct(entry.product, -entry.quantity)}
                        aria-label={`Remove ${entry.product.name}`}
                        className="p-1.5 text-[#765B55]/45 hover:text-[#C98F9D] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2 pt-3 border-t border-[#765B55]/10 text-xs font-body">
                <div className="flex justify-between">
                  <span className="text-[#765B55]/75">Combined Individual Value</span>
                  <span className="font-ui font-medium tabular-nums">
                    {formatPrice(customCombinedPrice)}
                  </span>
                </div>
                {customSavings > 0 && (
                  <div className="flex justify-between text-[#C98F9D]">
                    <span>Bundle Savings ({activeTier.discountPercent}% off)</span>
                    <span className="font-ui font-semibold tabular-nums">
                      -{formatPrice(customSavings)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-[#765B55]/10 text-sm">
                  <span className="font-ui font-semibold text-[#765B55]">Bundle Price</span>
                  <span className="font-ui text-lg font-semibold text-[#765B55] tabular-nums">
                    {formatPrice(customFinalPrice)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddCustomBundle}
                disabled={totalChosenCount !== activeTier.count}
                className="w-full py-3 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] disabled:opacity-45 text-white font-ui text-xs font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {totalChosenCount === activeTier.count ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Add Custom Bundle to Cart</span>
                  </>
                ) : (
                  <span>
                    Select {activeTier.count - totalChosenCount} More Plushie
                    {activeTier.count - totalChosenCount === 1 ? '' : 's'}
                  </span>
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Bundle Detail Modal */}
      {modalBundle && modalPricing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#765B55]/40 backdrop-blur-xs"
            onClick={() => setSelectedBundleId(null)}
          />
          <div className="relative z-10 w-full max-w-2xl bg-[#FFF8EF] rounded-3xl border border-[#C98F9D]/35 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-ui text-xs font-medium uppercase tracking-wider text-[#C98F9D]">
                  {modalBundle.tag || 'HUGME.AR Bundle'}
                </p>
                <h2 className="font-display text-3xl font-semibold text-[#765B55] mt-1">
                  {modalBundle.name}
                </h2>
                <p className="font-body text-sm text-[#765B55]/80 mt-1">
                  {modalBundle.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBundleId(null)}
                aria-label="Close bundle details"
                className="p-2 rounded-full bg-[#FFFFFF] text-[#765B55] hover:bg-[#F4DDE3] cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="font-body text-sm text-[#765B55]/85 leading-relaxed">
              {modalBundle.description}
            </p>

            <div className="space-y-3">
              <p className="font-ui text-xs font-semibold uppercase tracking-wider text-[#765B55]/70">
                What’s Inside This Bundle
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {modalPricing.components.map((comp) => (
                  <button
                    key={comp.product.id}
                    type="button"
                    onClick={() => {
                      setSelectedBundleId(null);
                      navigate('product', { productId: comp.product.id });
                    }}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-[#FFFFFF] border border-[#765B55]/10 hover:border-[#C98F9D] text-left cursor-pointer"
                  >
                    <SafeImage
                      src={comp.product.images[0]}
                      alt={comp.product.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-base font-semibold text-[#765B55] truncate">
                        {comp.product.name}
                      </p>
                      <p className="font-ui text-xs text-[#765B55]/70">
                        Qty {comp.quantity} · {comp.product.dimensions}
                      </p>
                      <p className="font-ui text-xs font-semibold text-[#C98F9D] tabular-nums mt-0.5">
                        Value {formatPrice(comp.product.price * comp.quantity)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span className="font-ui text-2xl font-semibold text-[#765B55] tabular-nums">
                    {formatPrice(modalPricing.finalPrice)}
                  </span>
                  {modalPricing.savings > 0 && (
                    <span className="font-ui text-sm text-[#765B55]/50 line-through tabular-nums">
                      {formatPrice(modalPricing.combinedPrice)}
                    </span>
                  )}
                </div>
                {modalPricing.savings > 0 && (
                  <p className="font-ui text-xs text-[#C98F9D] font-medium tabular-nums">
                    You save {formatPrice(modalPricing.savings)} ({modalPricing.discountPercentEffective}% bundle offer)
                  </p>
                )}
              </div>

              <button
                type="button"
                disabled={!modalPricing.isAvailable}
                onClick={() => {
                  addBundleToCart(modalBundle, true);
                  setSelectedBundleId(null);
                }}
                className="px-6 py-3 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] disabled:opacity-45 text-white font-ui text-xs font-medium inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Bundle to Cart</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
