import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Gift,
  Heart,
  Info,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { DemoOrder } from '../../types/store';
import { SafeImage } from '../../components/SafeImage';
import { GiftExperiencePanel, GreetingCardPreview } from '../../components/GiftExperiencePanel';

export const WishlistPage: React.FC = () => {
  const {
    products,
    wishlist,
    toggleWishlist,
    moveWishlistToCart,
    navigate,
    formatPrice,
  } = useStore();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#765B55]/10 pb-6">
        <div>
          <p className="font-ui text-xs font-medium uppercase tracking-wider text-[#C98F9D]">
            Saved Companions
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#765B55] mt-1">
            My Wishlist ({savedProducts.length})
          </h1>
        </div>
        <button
          type="button"
          onClick={() => navigate('shop')}
          className="font-ui text-xs font-medium text-[#C98F9D] hover:underline cursor-pointer"
        >
          Continue Shopping →
        </button>
      </div>

      {savedProducts.length === 0 ? (
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F4DDE3] flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7 text-[#C98F9D]" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-[#765B55]">
            Your wishlist is empty
          </h2>
          <p className="font-body text-sm text-[#765B55]/75 mt-2 max-w-md mx-auto">
            Tap the heart icon on any plushie you love to save it here for later.
          </p>
          <button
            type="button"
            onClick={() => navigate('shop')}
            className="mt-6 px-6 py-3 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] text-white font-ui text-xs font-medium cursor-pointer"
          >
            Explore Plushies
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 overflow-hidden flex flex-col"
            >
              <button
                type="button"
                onClick={() => navigate('product', { productId: product.id })}
                className="aspect-[4/3] bg-[#FFF8EF] overflow-hidden cursor-pointer"
              >
                <SafeImage
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </button>
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <p className="font-ui text-xs text-[#765B55]/70">{product.category}</p>
                  <h3 className="font-display text-lg font-semibold text-[#765B55] mt-0.5">
                    {product.name}
                  </h3>
                  <p className="font-ui text-base font-semibold text-[#C98F9D] mt-1 tabular-nums">
                    {formatPrice(product.price)}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#765B55]/10">
                  <button
                    type="button"
                    onClick={() => moveWishlistToCart(product)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] text-white font-ui text-xs font-medium cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Remove from wishlist"
                    className="p-2.5 rounded-xl border border-[#765B55]/15 text-[#765B55]/70 hover:text-[#C98F9D] hover:border-[#C98F9D] cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const LoyaltyRedemptionBox: React.FC = () => {
  const {
    loyaltySettings,
    loyaltyRewards,
    customerSession,
    currentCustomerLoyalty,
    selectedLoyaltyRewardId,
    setSelectedLoyaltyRewardId,
    cartTotals,
    formatPrice,
    navigate,
    showToast,
  } = useStore();

  if (!loyaltySettings.enabled) return null;

  const activeRewards = loyaltyRewards
    .filter((r) => r.active)
    .sort((a, b) => a.pointsRequired - b.pointsRequired);
  const balance = currentCustomerLoyalty.account?.pointsBalance ?? 0;

  return (
    <div className="pt-3 border-t border-[#765B55]/10 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-ui text-xs font-medium text-[#765B55] flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-[#C98F9D]" />
          Hugs &amp; Hearts Rewards
        </span>
        {customerSession.isLoggedIn ? (
          <span className="font-ui text-[11px] font-semibold text-[#C98F9D] tabular-nums">
            {balance.toLocaleString('en-IN')} pts available
          </span>
        ) : (
          <button
            type="button"
            onClick={() => navigate('login')}
            className="font-ui text-[11px] font-medium text-[#C98F9D] hover:underline cursor-pointer"
          >
            Sign in to redeem
          </button>
        )}
      </div>

      {customerSession.isLoggedIn ? (
        <div className="space-y-1.5">
          {activeRewards.map((reward) => {
            const isSelected = selectedLoyaltyRewardId === reward.id;
            const hasPoints = balance >= reward.pointsRequired;
            const meetsMin = cartTotals.itemsSubtotal >= reward.minOrder;
            const disabled = !hasPoints || !meetsMin;

            return (
              <button
                key={reward.id}
                type="button"
                disabled={disabled && !isSelected}
                onClick={() => {
                  if (isSelected) {
                    setSelectedLoyaltyRewardId('');
                    showToast('Loyalty reward removed', 'cocoa');
                    return;
                  }
                  setSelectedLoyaltyRewardId(reward.id);
                  showToast(`Applied ${reward.title} ♡`, 'success');
                }}
                className={`w-full p-2.5 rounded-xl border text-left transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'border-[#C98F9D] bg-[#F4DDE3]/45'
                    : 'border-[#765B55]/12 bg-[#FFF8EF]/70 hover:border-[#C98F9D]/50'
                }`}
              >
                <div className="min-w-0">
                  <p className="font-ui text-xs font-semibold text-[#765B55] truncate">
                    {reward.title}
                  </p>
                  <p className="font-body text-[11px] text-[#765B55]/70 tabular-nums">
                    {reward.pointsRequired} pts
                    {reward.minOrder > 0 ? ` · Min ${formatPrice(reward.minOrder)}` : ''}
                  </p>
                </div>
                <span className="font-ui text-[11px] font-semibold text-[#C98F9D] shrink-0">
                  {isSelected
                    ? 'Applied ✓'
                    : !hasPoints
                      ? `Need ${reward.pointsRequired - balance}`
                      : !meetsMin
                        ? 'Min not met'
                        : 'Apply'}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <p className="font-body text-[11px] text-[#765B55]/75">
          Earn <strong className="tabular-nums">{cartTotals.estimatedPointsToEarn} Hug Points</strong> on eligible orders once completed.{' '}
          <button
            type="button"
            onClick={() => navigate('loyalty')}
            className="text-[#C98F9D] underline cursor-pointer"
          >
            Learn more
          </button>
        </p>
      )}
    </div>
  );
};

export const CartPage: React.FC = () => {
  const {
    cart,
    cartTotals,
    updateCartQuantity,
    removeFromCart,
    coupons,
    appliedCouponCode,
    setAppliedCouponCode,
    giftSelection,
    loyaltySettings,
    formatPrice,
    navigate,
    showToast,
  } = useStore();

  const [couponInput, setCouponInput] = useState(appliedCouponCode);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setAppliedCouponCode('');
      return;
    }
    const found = coupons.find((c) => c.code.toUpperCase() === code && c.active);
    if (!found) {
      showToast('Promo code not recognised. Available codes: HUGME10, CUDDLE200.', 'cocoa');
      return;
    }
    if (cartTotals.itemsSubtotal < found.minOrder) {
      showToast(
        `Add ${formatPrice(found.minOrder - cartTotals.itemsSubtotal)} more to use ${found.code}`,
        'cocoa'
      );
      return;
    }
    setAppliedCouponCode(found.code);
    showToast(`Promo code ${found.code} applied ♡`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#765B55]/10 pb-6">
        <div>
          <p className="font-ui text-xs font-medium uppercase tracking-wider text-[#C98F9D]">
            HUGME.AR Bag
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#765B55] mt-1">
            Shopping Cart
          </h1>
        </div>
        <button
          type="button"
          onClick={() => navigate('shop')}
          className="inline-flex items-center gap-1.5 font-ui text-xs font-medium text-[#765B55] hover:text-[#C98F9D] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F4DDE3] flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-7 h-7 text-[#C98F9D]" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-[#765B55]">
            Your shopping cart is empty
          </h2>
          <p className="font-body text-sm text-[#765B55]/75 mt-2">
            Explore our teddy bears, bunnies, and curated plushie bundles to start your collection.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('shop')}
              className="px-6 py-3 rounded-xl bg-[#C98F9D] text-white font-ui text-xs font-medium cursor-pointer"
            >
              Shop Plushies
            </button>
            <button
              type="button"
              onClick={() => navigate('bundles')}
              className="px-6 py-3 rounded-xl border border-[#C98F9D] text-[#765B55] font-ui text-xs font-medium cursor-pointer"
            >
              Explore Bundles
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List & Gift Options */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-4">
              {cart.map((item) => {
                const isBundle =
                  item.itemType === 'bundle' || item.itemType === 'custom-bundle';

                return (
                  <div
                    key={`${item.productId}-${item.selectedColor}-${item.selectedSize}`}
                    className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        isBundle
                          ? navigate('bundles', {
                              bundleId: item.itemType === 'bundle' ? item.bundleId : undefined,
                            })
                          : navigate('product', { productId: item.productId })
                      }
                      className="w-24 h-24 rounded-xl overflow-hidden bg-[#FFF8EF] shrink-0 cursor-pointer"
                    >
                      <SafeImage
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </button>

                    <div className="flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() =>
                          isBundle
                            ? navigate('bundles', {
                                bundleId: item.itemType === 'bundle' ? item.bundleId : undefined,
                              })
                            : navigate('product', { productId: item.productId })
                        }
                        className="font-display text-lg font-semibold text-[#765B55] hover:text-[#C98F9D] text-left cursor-pointer"
                      >
                        {item.name}
                      </button>
                      <p className="font-ui text-xs text-[#765B55]/70 mt-0.5">
                        {isBundle
                          ? `${item.selectedColor} · ${item.selectedSize}`
                          : `Colour: ${item.selectedColor} · Size: ${item.selectedSize}`}
                      </p>

                      {isBundle && item.bundleItems && item.bundleItems.length > 0 && (
                        <ul className="mt-2 pl-3 border-l-2 border-[#F4DDE3] space-y-0.5 text-[11px] font-body text-[#765B55]/80">
                          {item.bundleItems.map((bi) => (
                            <li key={bi.productId}>
                              {bi.quantity}× {bi.name}
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="font-ui text-sm font-medium text-[#765B55] tabular-nums">
                          {formatPrice(item.price)} each
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="font-ui text-xs text-[#765B55]/45 line-through tabular-nums">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5">
                      <div className="inline-flex items-center rounded-xl border border-[#765B55]/15 bg-[#FFF8EF]">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(
                              item.productId,
                              item.selectedColor,
                              item.selectedSize,
                              -1
                            )
                          }
                          className="p-2 text-[#765B55] hover:text-[#C98F9D] cursor-pointer"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 font-ui text-sm font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(
                              item.productId,
                              item.selectedColor,
                              item.selectedSize,
                              1
                            )
                          }
                          className="p-2 text-[#765B55] hover:text-[#C98F9D] cursor-pointer"
                          aria-label="Increase"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-ui text-base font-semibold text-[#765B55] tabular-nums min-w-[80px] text-right">
                        {formatPrice(item.price * item.quantity)}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(item.productId, item.selectedColor, item.selectedSize)
                        }
                        aria-label="Remove item"
                        className="p-2 text-[#765B55]/50 hover:text-[#C98F9D] cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Feature 1 & 2: Gift Wrapping & Personalised Gift Notes */}
            <GiftExperiencePanel />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-6 space-y-5 lg:sticky lg:top-28">
            <h2 className="font-display text-2xl font-semibold text-[#765B55]">
              Order Summary
            </h2>

            {/* Coupon Box */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="block font-ui text-xs font-medium text-[#765B55]">
                Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Try HUGME10"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs text-[#765B55] uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#F4DDE3] hover:bg-[#C98F9D] hover:text-white text-[#765B55] font-ui text-xs font-medium transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {coupons
                  .filter((c) => c.active)
                  .map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setCouponInput(c.code);
                        if (cartTotals.itemsSubtotal >= c.minOrder) {
                          setAppliedCouponCode(c.code);
                          showToast(`Applied ${c.code}`, 'success');
                        } else {
                          showToast(
                            `Min order ${formatPrice(c.minOrder)} for ${c.code}`,
                            'cocoa'
                          );
                        }
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-ui text-[#C98F9D] hover:underline cursor-pointer"
                    >
                      <Tag className="w-3 h-3" />
                      {c.code}
                    </button>
                  ))}
              </div>
            </form>

            {/* Loyalty Rewards Redemption */}
            <LoyaltyRedemptionBox />

            <div className="space-y-2.5 pt-3 border-t border-[#765B55]/10 text-sm font-body">
              <div className="flex justify-between">
                <span className="text-[#765B55]/75">Items Subtotal</span>
                <span className="font-ui font-medium tabular-nums">
                  {formatPrice(cartTotals.itemsSubtotal)}
                </span>
              </div>

              {cartTotals.catalogAndBundleSavings > 0 && (
                <div className="flex justify-between text-[#C98F9D]">
                  <span>Catalog &amp; Bundle Savings</span>
                  <span className="font-ui font-medium tabular-nums">
                    -{formatPrice(cartTotals.catalogAndBundleSavings)}
                  </span>
                </div>
              )}

              {cartTotals.activeGiftWrap && (
                <div className="flex justify-between">
                  <span className="text-[#765B55]/75 truncate pr-2">
                    Gift Wrap ({cartTotals.activeGiftWrap.name})
                  </span>
                  <span className="font-ui font-medium tabular-nums shrink-0">
                    {cartTotals.giftWrapFee === 0
                      ? 'Complimentary'
                      : `+${formatPrice(cartTotals.giftWrapFee)}`}
                  </span>
                </div>
              )}

              {giftSelection.noteEnabled && cartTotals.activeGiftCard && (
                <div className="flex justify-between text-xs">
                  <span className="text-[#765B55]/75 truncate pr-2">
                    Greeting Card ({cartTotals.activeGiftCard.title})
                  </span>
                  <span className="font-ui font-medium text-[#C98F9D] shrink-0">
                    Complimentary
                  </span>
                </div>
              )}

              {cartTotals.couponDiscount > 0 && (
                <div className="flex justify-between text-[#C98F9D]">
                  <span>Coupon ({cartTotals.activeCoupon?.code})</span>
                  <span className="font-ui font-medium tabular-nums">
                    -{formatPrice(cartTotals.couponDiscount)}
                  </span>
                </div>
              )}

              {cartTotals.loyaltyDiscount > 0 && cartTotals.activeLoyaltyReward && (
                <div className="flex justify-between text-[#C98F9D]">
                  <span className="truncate pr-2">
                    Reward ({cartTotals.activeLoyaltyReward.title})
                  </span>
                  <span className="font-ui font-medium tabular-nums shrink-0">
                    -{formatPrice(cartTotals.loyaltyDiscount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-[#765B55]/75">Estimated Shipping</span>
                <span className="font-ui font-medium tabular-nums">
                  {cartTotals.shipping === 0
                    ? 'Complimentary'
                    : formatPrice(cartTotals.shipping)}
                </span>
              </div>

              <div className="flex justify-between pt-3 border-t border-[#765B55]/10 text-base">
                <span className="font-ui font-semibold text-[#765B55]">Estimated Total</span>
                <span className="font-ui text-lg font-semibold text-[#765B55] tabular-nums">
                  {formatPrice(cartTotals.total)}
                </span>
              </div>
            </div>

            {loyaltySettings.enabled && cartTotals.estimatedPointsToEarn > 0 && (
              <div className="p-3 rounded-2xl bg-[#FFF8EF] border border-[#C98F9D]/25 flex items-center gap-2.5 text-xs font-body text-[#765B55]/85">
                <Sparkles className="w-4 h-4 text-[#C98F9D] shrink-0" />
                <span>
                  Earn an estimated{' '}
                  <strong className="tabular-nums text-[#765B55]">
                    +{cartTotals.estimatedPointsToEarn} Hug Points
                  </strong>{' '}
                  once order delivery completes.
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => navigate('checkout')}
              className="w-full py-3.5 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] text-white font-ui text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const CheckoutPreviewPage: React.FC = () => {
  const {
    cart,
    cartTotals,
    coupons,
    appliedCouponCode,
    setAppliedCouponCode,
    customerSession,
    giftSelection,
    loyaltySettings,
    placeOrder,
    formatPrice,
    navigate,
    showToast,
  } = useStore();

  const defaultAddr = customerSession.addresses[0];

  const [fullName, setFullName] = useState(customerSession.name || '');
  const [email, setEmail] = useState(customerSession.email || '');
  const [phone, setPhone] = useState(customerSession.phone || '');
  const [address, setAddress] = useState(defaultAddr?.street || '');
  const [city, setCity] = useState(defaultAddr?.city || '');
  const [stateName, setStateName] = useState(defaultAddr?.state || '');
  const [pincode, setPincode] = useState(defaultAddr?.pincode || '');
  const [country, setCountry] = useState(defaultAddr?.country || 'India');
  const [couponInput, setCouponInput] = useState(appliedCouponCode);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<DemoOrder | null>(null);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setAppliedCouponCode('');
      return;
    }
    const found = coupons.find((c) => c.code.toUpperCase() === code && c.active);
    if (!found) {
      showToast('Promo code not recognised', 'cocoa');
      return;
    }
    if (cartTotals.itemsSubtotal < found.minOrder) {
      showToast(
        `Add ${formatPrice(found.minOrder - cartTotals.itemsSubtotal)} more to use ${found.code}`,
        'cocoa'
      );
      return;
    }
    setAppliedCouponCode(found.code);
    showToast(`Promo code ${found.code} applied ♡`, 'success');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('Please add at least one plushie before placing your order', 'cocoa');
      return;
    }
    setSubmitError('');
    setIsSubmitting(true);
    const result = await placeOrder({
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      streetAddress: address,
      city,
      state: stateName,
      pincode,
      country,
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment',
    });
    setIsSubmitting(false);

    if (!result.ok || !result.data) {
      const msg = result.error || 'Unable to save your order right now.';
      setSubmitError(msg);
      showToast(msg, 'cocoa');
      return;
    }

    setConfirmedOrder(result.data);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <form
          onSubmit={handlePlaceOrder}
          className="lg:col-span-7 space-y-6"
        >
          <div className="bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-6 sm:p-8 space-y-6">
            <div>
              <p className="font-ui text-xs font-medium uppercase tracking-wider text-[#C98F9D]">
                HUGME.AR
              </p>
              <h1 className="font-display text-3xl font-semibold text-[#765B55] mt-1">
                Checkout
              </h1>
            </div>

            {/* Customer Details */}
            <div className="space-y-4">
              <h2 className="font-ui text-xs font-semibold uppercase tracking-wider text-[#C98F9D]">
                01. Customer Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-ui text-xs text-[#765B55] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm text-[#765B55]"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs text-[#765B55] mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm text-[#765B55]"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs text-[#765B55] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm text-[#765B55]"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-4 pt-4 border-t border-[#765B55]/10">
              <h2 className="font-ui text-xs font-semibold uppercase tracking-wider text-[#C98F9D]">
                02. Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-ui text-xs text-[#765B55] mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / Apartment / Street"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm text-[#765B55]"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs text-[#765B55] mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm text-[#765B55]"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs text-[#765B55] mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm text-[#765B55]"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs text-[#765B55] mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm text-[#765B55]"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs text-[#765B55] mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm text-[#765B55]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 03. Gift Wrapping & Personalised Notes */}
          {cart.length > 0 && <GiftExperiencePanel compact />}

          {/* 04. Payment Method Selection */}
          <div className="bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-6 sm:p-8 space-y-4">
            <h2 className="font-ui text-xs font-semibold uppercase tracking-wider text-[#C98F9D]">
              04. Payment Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border text-left transition-colors cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-[#C98F9D] bg-[#F4DDE3]/45'
                    : 'border-[#765B55]/15 bg-[#FFF8EF]'
                }`}
              >
                <p className="font-ui text-sm font-medium text-[#765B55]">
                  Cash on Delivery
                </p>
                <p className="font-body text-xs text-[#765B55]/70 mt-1">
                  Pay comfortably upon doorstep arrival
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('online')}
                className={`p-4 rounded-2xl border text-left transition-colors cursor-pointer ${
                  paymentMethod === 'online'
                    ? 'border-[#C98F9D] bg-[#F4DDE3]/45'
                    : 'border-[#765B55]/15 bg-[#FFF8EF]'
                }`}
              >
                <p className="font-ui text-sm font-medium text-[#765B55]">
                  Online Payment
                </p>
                <p className="font-body text-xs text-[#765B55]/70 mt-1">
                  UPI, Cards &amp; NetBanking
                </p>
              </button>
            </div>
            <p className="flex items-start gap-2 text-xs font-body text-[#765B55]/70 pt-1">
              <Info className="w-3.5 h-3.5 text-[#C98F9D] shrink-0 mt-0.5" />
              <span>
                Your order details, shipping address, and gift notes are saved securely upon submission. Online card/UPI payment links are confirmed separately if Online Payment is chosen.
              </span>
            </p>

            {submitError && (
              <div className="p-3.5 rounded-2xl bg-[#F4DDE3]/75 border border-[#C98F9D]/50 text-xs font-body text-[#765B55]">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="w-full py-3.5 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] disabled:opacity-60 text-white font-ui text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isSubmitting ? 'Placing Your Order...' : 'Place Order'}</span>
            </button>
          </div>
        </form>

        {/* Summary Column */}
        <div className="lg:col-span-5 bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-6 sm:p-8 space-y-5 lg:sticky lg:top-28">
          <h2 className="font-display text-2xl font-semibold text-[#765B55]">
            Order Summary
          </h2>

          {cart.length === 0 ? (
            <div className="py-6 text-center space-y-3">
              <p className="font-body text-sm text-[#765B55]/75">No plushies in your cart yet.</p>
              <button
                type="button"
                onClick={() => navigate('shop')}
                className="px-4 py-2 rounded-xl bg-[#F4DDE3] text-[#765B55] font-ui text-xs font-medium cursor-pointer"
              >
                Browse Plushies
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => {
                const isBundle =
                  item.itemType === 'bundle' || item.itemType === 'custom-bundle';
                return (
                  <div
                    key={`${item.productId}-${item.selectedColor}-${item.selectedSize}`}
                    className="flex items-start gap-3 pb-3 border-b border-[#765B55]/10"
                  >
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm font-semibold text-[#765B55] truncate">
                        {item.name}
                      </p>
                      <p className="font-ui text-[11px] text-[#765B55]/65">
                        {item.selectedColor} · {item.selectedSize} × {item.quantity}
                      </p>
                      {isBundle && item.bundleItems && (
                        <p className="font-body text-[11px] text-[#765B55]/70 mt-0.5 line-clamp-2">
                          Includes: {item.bundleItems.map((bi) => `${bi.quantity}× ${bi.name}`).join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="font-ui text-sm font-medium tabular-nums text-[#765B55]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Coupon field */}
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Coupon code (e.g. HUGME10)"
              className="flex-1 px-3.5 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs text-[#765B55] uppercase"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="px-4 py-2 rounded-xl bg-[#F4DDE3] text-[#765B55] font-ui text-xs font-medium cursor-pointer"
            >
              Apply
            </button>
          </div>

          <LoyaltyRedemptionBox />

          {/* Totals */}
          <div className="space-y-2 pt-3 border-t border-[#765B55]/10 text-sm font-body">
            <div className="flex justify-between">
              <span className="text-[#765B55]/75">Items Subtotal</span>
              <span className="font-ui font-medium tabular-nums">
                {formatPrice(cartTotals.itemsSubtotal)}
              </span>
            </div>

            {cartTotals.activeGiftWrap && (
              <div className="flex justify-between">
                <span className="text-[#765B55]/75 truncate pr-2">
                  Gift Wrap ({cartTotals.activeGiftWrap.name})
                </span>
                <span className="font-ui font-medium tabular-nums shrink-0">
                  {cartTotals.giftWrapFee === 0
                    ? 'Complimentary'
                    : `+${formatPrice(cartTotals.giftWrapFee)}`}
                </span>
              </div>
            )}

            {giftSelection.noteEnabled && cartTotals.activeGiftCard && (
              <div className="flex justify-between text-xs">
                <span className="text-[#765B55]/75 truncate pr-2">
                  Gift Card ({cartTotals.activeGiftCard.title})
                </span>
                <span className="font-ui font-medium text-[#C98F9D] shrink-0">Complimentary</span>
              </div>
            )}

            {cartTotals.couponDiscount > 0 && (
              <div className="flex justify-between text-[#C98F9D]">
                <span>Promo Code ({cartTotals.activeCoupon?.code})</span>
                <span className="font-ui font-medium tabular-nums">
                  -{formatPrice(cartTotals.couponDiscount)}
                </span>
              </div>
            )}

            {cartTotals.loyaltyDiscount > 0 && cartTotals.activeLoyaltyReward && (
              <div className="flex justify-between text-[#C98F9D]">
                <span className="truncate pr-2">
                  Reward ({cartTotals.activeLoyaltyReward.title})
                </span>
                <span className="font-ui font-medium tabular-nums shrink-0">
                  -{formatPrice(cartTotals.loyaltyDiscount)}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-[#765B55]/75">Shipping</span>
              <span className="font-ui font-medium tabular-nums">
                {cartTotals.shipping === 0 ? 'Free' : formatPrice(cartTotals.shipping)}
              </span>
            </div>

            <div className="flex justify-between pt-3 border-t border-[#765B55]/10 text-base">
              <span className="font-ui font-semibold text-[#765B55]">Order Total</span>
              <span className="font-ui text-lg font-semibold text-[#765B55] tabular-nums">
                {formatPrice(cartTotals.total)}
              </span>
            </div>
          </div>

          {loyaltySettings.enabled && cartTotals.estimatedPointsToEarn > 0 && (
            <p className="text-[11px] font-ui text-[#765B55]/75 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C98F9D] shrink-0" />
              <span>
                Estimated{' '}
                <strong className="tabular-nums">+{cartTotals.estimatedPointsToEarn} Hug Points</strong>{' '}
                earned upon order delivery.
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Confirmed Order Modal */}
      {confirmedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#765B55]/40 backdrop-blur-xs"
            onClick={() => setConfirmedOrder(null)}
          />
          <div className="relative z-10 w-full max-w-xl bg-[#FFF8EF] rounded-3xl border border-[#C98F9D]/40 p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-2.5 text-[#C98F9D]">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <p className="font-ui text-xs font-semibold uppercase tracking-wider">
                Order Confirmed · {confirmedOrder.id}
              </p>
            </div>
            <h2 className="font-display text-2xl font-semibold text-[#765B55]">
              Thank You for Your Order ♡
            </h2>
            <p className="font-body text-sm text-[#765B55]/80">
              Your HUGME.AR order has been recorded! Keep your Order ID handy to follow every step from packing to doorstep delivery.
            </p>

            <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-4 space-y-2 text-xs font-body text-[#765B55]">
              <p><strong>Order ID:</strong> {confirmedOrder.id}</p>
              <p><strong>Recipient:</strong> {confirmedOrder.customerName}</p>
              <p><strong>Email:</strong> {confirmedOrder.customerEmail}</p>
              <p><strong>Address:</strong> {confirmedOrder.shippingAddress}</p>
              <p><strong>Payment Method:</strong> {confirmedOrder.paymentMethod}</p>
              <p><strong>Status:</strong> {confirmedOrder.status}</p>
              {confirmedOrder.giftSelection?.wrapName && (
                <p className="flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-[#C98F9D]" />
                  <span>
                    <strong>Gift Wrap:</strong> {confirmedOrder.giftSelection.wrapName} (
                    {confirmedOrder.giftWrapFee === 0
                      ? 'Complimentary'
                      : formatPrice(confirmedOrder.giftWrapFee || 0)}
                    )
                  </span>
                </p>
              )}
              {confirmedOrder.loyaltyRewardTitle && (
                <p className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#C98F9D]" />
                  <span>
                    <strong>Loyalty Reward:</strong> {confirmedOrder.loyaltyRewardTitle} (
                    {confirmedOrder.loyaltyPointsRedeemed || 0} pts)
                  </span>
                </p>
              )}
              <p className="pt-2 border-t border-[#765B55]/10 font-ui text-sm font-semibold tabular-nums">
                Order Total: {formatPrice(confirmedOrder.total)}
              </p>
            </div>

            {confirmedOrder.giftSelection?.cardDesignTitle &&
              cartTotals &&
              confirmedOrder.giftSelection.message && (
                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#C98F9D]/25 space-y-1 text-xs font-body text-[#765B55]">
                  <p className="font-ui font-semibold text-[#C98F9D]">
                    Personalised Gift Card ({confirmedOrder.giftSelection.cardDesignTitle})
                  </p>
                  {(confirmedOrder.giftSelection.recipientName ||
                    confirmedOrder.giftSelection.senderName) && (
                    <p>
                      To: {confirmedOrder.giftSelection.recipientName || '—'} · From:{' '}
                      {confirmedOrder.giftSelection.senderName || '—'}
                    </p>
                  )}
                  <p className="italic">“{confirmedOrder.giftSelection.message}”</p>
                </div>
              )}

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const oid = confirmedOrder.id;
                  setConfirmedOrder(null);
                  navigate('order-tracking', { orderId: oid });
                }}
                className="flex-1 py-2.5 rounded-xl border border-[#C98F9D] text-[#765B55] font-ui text-xs font-medium cursor-pointer"
              >
                Track Parcel
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmedOrder(null);
                  navigate('shop');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#C98F9D] text-white font-ui text-xs font-medium cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

