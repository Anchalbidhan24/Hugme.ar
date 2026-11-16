import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Gift,
  Heart,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SafeImage } from '../../components/SafeImage';
import { ProductCard } from '../../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const {
    products,
    routeParams,
    navigate,
    goBack,
    addToCart,
    toggleWishlist,
    isWishlisted,
    formatPrice,
  } = useStore();

  const product =
    products.find((p) => p.id === routeParams.productId) || products[0];

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.defaultColor);
  const [selectedSize, setSelectedSize] = useState(product.defaultSize);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'dimensions' | 'care'>('details');

  useEffect(() => {
    setActiveImage(0);
    setSelectedColor(product.defaultColor);
    setSelectedSize(product.defaultSize);
    setQuantity(1);
    setPincodeStatus(null);
  }, [product]);

  const wishlisted = isWishlisted(product.id);

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.isBestseller))
    .slice(0, 3);

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pincode.trim();
    if (!/^\d{6}$/.test(clean)) {
      setPincodeStatus('Please enter a valid 6-digit Indian pincode (e.g. 400050).');
      return;
    }
    setPincodeStatus(
      `Estimated delivery to ${clean}: 3–5 business days · Keepsake gift wrapping available.`
    );
  };

  const handleBuyNow = () => {
    addToCart(product, {
      color: selectedColor,
      size: selectedSize,
      quantity,
      openDrawer: false,
    });
    navigate('checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-14">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-ui text-[#765B55]/70">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-1 hover:text-[#C98F9D] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <span>/</span>
        <button
          type="button"
          onClick={() => navigate('shop', { category: product.category })}
          className="hover:text-[#C98F9D] cursor-pointer"
        >
          {product.category}
        </button>
        <span>/</span>
        <span className="text-[#765B55] font-medium truncate">{product.name}</span>
      </div>

      {/* Main PDP Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Sticky Gallery */}
        <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-28">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-[#FFFFFF] border border-[#765B55]/10">
            <SafeImage
              src={product.images[activeImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-4 gap-3">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImage(idx)}
                className={`aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImage === idx
                    ? 'border-[#C98F9D] shadow-sm'
                    : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <SafeImage
                  src={img}
                  alt={`${product.name} view ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Purchase Module */}
        <div className="lg:col-span-5 bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-2 text-xs font-ui text-[#765B55]/70">
              <span>{product.category}</span>
              <span
                className={`font-medium ${
                  product.stockStatus === 'In Stock'
                    ? 'text-[#765B55]'
                    : 'text-[#C98F9D]'
                }`}
              >
                {product.stockStatus} ({product.stock} left)
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#765B55] mt-2 leading-tight">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2.5 mt-3 text-xs font-ui text-[#765B55]/75">
              <span>{product.defaultSize}</span>
              <span aria-hidden="true">·</span>
              <span>{product.material}</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pb-5 border-b border-[#765B55]/10 tabular-nums">
            <span className="font-ui text-2xl sm:text-3xl font-semibold text-[#765B55]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="font-ui text-base text-[#765B55]/45 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.discount > 0 && (
              <span className="font-ui text-xs font-semibold text-[#C98F9D] bg-[#F4DDE3] px-2.5 py-1 rounded-md">
                {product.discount}% OFF
              </span>
            )}
          </div>

          <p className="font-body text-sm sm:text-base text-[#765B55]/85 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Colour Selector */}
          <div className="space-y-2">
            <p className="font-ui text-xs font-medium text-[#765B55]">
              Colour: <span className="text-[#C98F9D]">{selectedColor}</span>
            </p>
            <div className="flex flex-wrap gap-2.5">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-ui transition-colors cursor-pointer ${
                    selectedColor === c.name
                      ? 'border-[#C98F9D] bg-[#F4DDE3]/45 text-[#765B55] font-medium'
                      : 'border-[#765B55]/15 bg-[#FFF8EF] text-[#765B55]/80 hover:border-[#C98F9D]/50'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-[#765B55]/20"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <p className="font-ui text-xs font-medium text-[#765B55]">
              Size: <span className="text-[#C98F9D]">{selectedSize}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-ui transition-colors cursor-pointer ${
                    selectedSize === s
                      ? 'border-[#C98F9D] bg-[#C98F9D] text-white font-medium'
                      : 'border-[#765B55]/15 bg-[#FFF8EF] text-[#765B55] hover:border-[#C98F9D]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center rounded-xl border border-[#765B55]/15 bg-[#FFF8EF] h-11">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 text-[#765B55] hover:text-[#C98F9D] cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 font-ui text-sm font-medium tabular-nums text-[#765B55]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 text-[#765B55] hover:text-[#C98F9D] cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  addToCart(product, { color: selectedColor, size: selectedSize, quantity })
                }
                disabled={product.stock === 0}
                className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] disabled:bg-[#765B55]/30 text-white font-ui text-sm font-medium transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label="Toggle wishlist"
                className={`h-11 w-11 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                  wishlisted
                    ? 'bg-[#F4DDE3] border-[#C98F9D] text-[#C98F9D]'
                    : 'bg-[#FFF8EF] border-[#765B55]/15 text-[#765B55] hover:border-[#C98F9D]'
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="w-full h-11 rounded-xl bg-[#765B55] hover:bg-[#5e4742] text-white font-ui text-sm font-medium transition-colors cursor-pointer"
            >
              Proceed to Checkout
            </button>
          </div>

          {/* Delivery Pincode Checker */}
          <div className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#765B55]/10 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-ui font-medium text-[#765B55]">
              <MapPin className="w-4 h-4 text-[#C98F9D]" />
              <span>Check Estimated Delivery</span>
            </div>
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter 6-digit pincode (e.g. 400050)"
                className="flex-1 px-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#765B55]/15 text-xs text-[#765B55] focus:outline-none focus:ring-2 focus:ring-[#C98F9D]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#F4DDE3] hover:bg-[#C98F9D] hover:text-white text-[#765B55] font-ui text-xs font-medium transition-colors cursor-pointer"
              >
                Check
              </button>
            </form>
            {pincodeStatus && (
              <p className="font-body text-xs text-[#765B55] flex items-start gap-1.5 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C98F9D] shrink-0 mt-0.5" />
                <span>{pincodeStatus}</span>
              </p>
            )}
          </div>

          {/* Quick Trust Highlights */}
          <div className="grid grid-cols-2 gap-3 text-xs font-body text-[#765B55]/80 pt-1">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C98F9D]" />
              <span>Free shipping above ₹999</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C98F9D]" />
              <span>Keepsake gift wrap ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <section className="bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-6 sm:p-8">
        <div className="flex flex-wrap gap-2 border-b border-[#765B55]/10 pb-4 mb-6">
          {(
            [
              { id: 'details', label: 'Product Story & Details' },
              { id: 'dimensions', label: 'Material & Dimensions' },
              { id: 'care', label: 'Care Instructions' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl font-ui text-xs font-medium transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#F4DDE3] text-[#765B55] font-semibold'
                  : 'text-[#765B55]/70 hover:bg-[#FFF8EF]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'details' && (
          <div className="space-y-3 max-w-3xl">
            <h2 className="font-display text-2xl font-semibold text-[#765B55]">
              About {product.name}
            </h2>
            <p className="font-body text-base text-[#765B55]/85 leading-relaxed">
              {product.fullDescription}
            </p>
          </div>
        )}

        {activeTab === 'dimensions' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl text-sm">
            <div className="p-4 rounded-2xl bg-[#FFF8EF]">
              <p className="font-ui text-xs text-[#765B55]/65">Material</p>
              <p className="font-body font-medium text-[#765B55] mt-1">{product.material}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FFF8EF]">
              <p className="font-ui text-xs text-[#765B55]/65">Dimensions</p>
              <p className="font-body font-medium text-[#765B55] mt-1">{product.dimensions}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FFF8EF]">
              <p className="font-ui text-xs text-[#765B55]/65">Available Sizes</p>
              <p className="font-body font-medium text-[#765B55] mt-1">{product.sizes.join(', ')}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FFF8EF]">
              <p className="font-ui text-xs text-[#765B55]/65">Product Code</p>
              <p className="font-body font-medium text-[#765B55] mt-1">{product.id}</p>
            </div>
          </div>
        )}

        {activeTab === 'care' && (
          <div className="space-y-3 max-w-2xl">
            <h3 className="font-display text-xl font-semibold text-[#765B55]">
              Keeping Your Plushie Soft &amp; Happy
            </h3>
            <p className="font-body text-base text-[#765B55]/85 leading-relaxed">
              {product.careInstructions}
            </p>
          </div>
        )}
      </section>

      {/* Craftsmanship & Gifting Promise */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-6 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#F4DDE3]/70 text-[#765B55] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#C98F9D]" />
          </div>
          <h3 className="font-display text-lg font-semibold text-[#765B55]">
            Cloud-Soft Micro-Plush
          </h3>
          <p className="font-body text-sm text-[#765B55]/80 leading-relaxed">
            Dense, comforting plush fleece paired with gentle hypoallergenic stuffing crafted to hold its cuddle-ready shape.
          </p>
        </div>

        <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-6 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#E9E2F5]/70 text-[#765B55] flex items-center justify-center">
            <Gift className="w-5 h-5 text-[#C98F9D]" />
          </div>
          <h3 className="font-display text-lg font-semibold text-[#765B55]">
            Ribbon-Tied Keepsake Ready
          </h3>
          <p className="font-body text-sm text-[#765B55]/80 leading-relaxed">
            Arrives tucked in blush tissue paper with a dusty-rose satin ribbon finish, ready to brighten birthdays and surprises.
          </p>
        </div>

        <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-6 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#F4DCCB]/70 text-[#765B55] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#C98F9D]" />
          </div>
          <h3 className="font-display text-lg font-semibold text-[#765B55]">
            Gentle Embroidered Details
          </h3>
          <p className="font-body text-sm text-[#765B55]/80 leading-relaxed">
            Every companion goes through stitching, softness, and expression checks before leaving our Mumbai studio.
          </p>
        </div>
      </section>

      {/* Related Products */}
      <section className="space-y-6">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#765B55]">
          You May Also Love
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((rel) => (
            <ProductCard key={rel.id} product={rel} />
          ))}
        </div>
      </section>
    </div>
  );
};
