import React from 'react';
import { Gift, MailOpen, Minus, Plus, ShoppingBag, Trash2, X, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { SafeImage } from './SafeImage';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartTotals,
    updateCartQuantity,
    removeFromCart,
    formatPrice,
    siteSettings,
    navigate,
  } = useStore();

  if (!isCartOpen) return null;

  const freeThreshold = siteSettings.freeShippingThreshold;
  const remaining = Math.max(0, freeThreshold - cartTotals.itemsSubtotal);
  const progress = Math.min(100, (cartTotals.itemsSubtotal / freeThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#765B55]/35 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <aside
        aria-label="Shopping Bag"
        className="relative z-10 w-full max-w-md bg-[#FFF8EF] h-full shadow-2xl border-l border-[#765B55]/15 flex flex-col"
      >
        {/* Top bar */}
        <div className="px-6 py-4 bg-[#FFFFFF] border-b border-[#765B55]/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#C98F9D]" />
            <h2 className="font-display text-xl font-semibold text-[#765B55]">
              Your Hug Bag
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full text-[#765B55] hover:bg-[#F4DDE3]/70 transition-colors cursor-pointer"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free shipping progress */}
        <div className="px-6 py-3 bg-[#F4DDE3]/50 border-b border-[#C98F9D]/20">
          <p className="font-ui text-xs text-[#765B55] mb-1.5">
            {remaining === 0 && cart.length > 0 ? (
              <span className="font-medium">Yay! You unlocked complimentary shipping ♡</span>
            ) : (
              <span>
                Add <strong className="tabular-nums">{formatPrice(remaining)}</strong> more for complimentary shipping
              </span>
            )}
          </p>
          <div className="h-1.5 w-full bg-[#FFFFFF] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C98F9D] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#F4DDE3] flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-[#C98F9D]" />
              </div>
              <h3 className="font-display text-xl font-semibold text-[#765B55]">
                Your bag is waiting for a cuddle
              </h3>
              <p className="font-body text-sm text-[#765B55]/75 mt-1.5 max-w-xs">
                Explore our teddy bears, bunnies, and curated bundles to fill your bag.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('shop');
                }}
                className="mt-5 px-5 py-2.5 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] text-white font-ui text-sm font-medium transition-colors cursor-pointer"
              >
                Browse Plushies
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const isBundle = item.itemType === 'bundle' || item.itemType === 'custom-bundle';
              return (
                <div
                  key={`${item.productId}-${item.selectedColor}-${item.selectedSize}`}
                  className="bg-[#FFFFFF] p-3.5 rounded-2xl border border-[#765B55]/10 flex gap-3.5"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      if (isBundle) {
                        navigate('bundles');
                      } else {
                        navigate('product', { productId: item.productId });
                      }
                    }}
                    className="w-20 h-20 rounded-xl overflow-hidden bg-[#FFF8EF] shrink-0 cursor-pointer"
                  >
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-display text-sm font-semibold text-[#765B55] truncate">
                          {item.name}
                        </h4>
                        <p className="font-ui text-[11px] text-[#765B55]/70">
                          {item.selectedColor} · {item.selectedSize}
                        </p>
                        {isBundle && item.bundleItems && (
                          <p className="font-body text-[11px] text-[#765B55]/70 mt-1 line-clamp-2">
                            Includes: {item.bundleItems.map((b) => `${b.quantity}× ${b.name}`).join(', ')}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(item.productId, item.selectedColor, item.selectedSize)
                        }
                        aria-label={`Remove ${item.name}`}
                        className="text-[#765B55]/50 hover:text-[#C98F9D] p-1 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="inline-flex items-center rounded-lg border border-[#765B55]/15 bg-[#FFF8EF]">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.productId, item.selectedColor, item.selectedSize, -1)
                          }
                          aria-label="Decrease quantity"
                          className="p-1.5 text-[#765B55] hover:text-[#C98F9D] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 font-ui text-xs font-medium tabular-nums text-[#765B55]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.productId, item.selectedColor, item.selectedSize, 1)
                          }
                          aria-label="Increase quantity"
                          className="p-1.5 text-[#765B55] hover:text-[#C98F9D] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-ui text-sm font-semibold text-[#765B55] tabular-nums">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        {cart.length > 0 && (
          <div className="p-6 bg-[#FFFFFF] border-t border-[#765B55]/10 space-y-2.5">
            {(cartTotals.activeGiftWrap || cartTotals.activeGiftCard) && (
              <div className="space-y-1 pb-2 border-b border-[#765B55]/10 text-xs font-body text-[#765B55]/85">
                {cartTotals.activeGiftWrap && (
                  <p className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-[#C98F9D]" />
                      {cartTotals.activeGiftWrap.name}
                    </span>
                    <span className="font-ui font-medium tabular-nums">
                      {cartTotals.giftWrapFee === 0 ? 'Free' : formatPrice(cartTotals.giftWrapFee)}
                    </span>
                  </p>
                )}
                {cartTotals.activeGiftCard && (
                  <p className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5">
                      <MailOpen className="w-3.5 h-3.5 text-[#C98F9D]" />
                      Gift Note ({cartTotals.activeGiftCard.title})
                    </span>
                    <span className="font-ui text-[#C98F9D]">Included</span>
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="font-ui text-sm text-[#765B55]/80">Subtotal</span>
              <span className="font-ui text-lg font-semibold text-[#765B55] tabular-nums">
                {formatPrice(cartTotals.itemsSubtotal + cartTotals.giftWrapFee)}
              </span>
            </div>
            <p className="font-body text-xs text-[#765B55]/65">
              Gift wrapping, personalised notes, promo codes, and loyalty rewards can be customised in Cart &amp; Checkout.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('cart');
                }}
                className="px-4 py-2.5 rounded-xl border border-[#C98F9D] text-[#765B55] hover:bg-[#F4DDE3]/40 font-ui text-xs font-medium transition-colors cursor-pointer"
              >
                View Cart
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('checkout');
                }}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] text-white font-ui text-xs font-medium transition-colors cursor-pointer"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
