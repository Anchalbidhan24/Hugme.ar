import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../types/store';
import { useStore } from '../context/StoreContext';
import { SafeImage } from './SafeImage';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigate, addToCart, toggleWishlist, isWishlisted, formatPrice } = useStore();
  const wishlisted = isWishlisted(product.id);

  const highlightLabel = product.isBestseller
    ? 'Bestseller'
    : product.isNewArrival
      ? 'New Arrival'
      : null;

  return (
    <article className="group bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 overflow-hidden flex flex-col transition-all duration-200 ease-boutique hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-14px_rgba(118,91,85,0.18)]">
      {/* Image area (4:3 uniform aspect) */}
      <div className="relative aspect-[4/3] bg-[#FFF8EF] overflow-hidden">
        <button
          type="button"
          onClick={() => navigate('product', { productId: product.id })}
          className="block w-full h-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C98F9D]"
          aria-label={`View ${product.name}`}
        >
          <SafeImage
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 ease-boutique group-hover:scale-[1.03]"
          />
        </button>

        {/* Wishlist Heart */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-sm ${
            wishlisted
              ? 'bg-[#C98F9D] text-white'
              : 'bg-[#FFFFFF]/90 text-[#765B55] hover:bg-[#F4DDE3]'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Single clean corner tag (max 1) */}
        {highlightLabel && (
          <span className="absolute top-3 left-3 bg-[#FFF8EF]/95 text-[#765B55] font-ui text-[11px] font-medium px-2.5 py-1 rounded-md border border-[#765B55]/10">
            {highlightLabel}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Unboxed metadata with typographic separator */}
          <div className="flex items-center justify-between gap-2 text-xs text-[#765B55]/70 font-ui mb-1">
            <span className="truncate">{product.category}</span>
            <span className="shrink-0 tabular-nums text-[#765B55]/80">
              {product.defaultSize}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate('product', { productId: product.id })}
            className="text-left w-full cursor-pointer group/title"
          >
            <h3 className="font-display text-lg font-semibold text-[#765B55] leading-snug line-clamp-1 group-hover/title:text-[#C98F9D] transition-colors">
              {product.name}
            </h3>
          </button>

          <p className="font-body text-sm text-[#765B55]/75 mt-1 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        <div className="pt-2 border-t border-[#765B55]/10 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2 tabular-nums">
              <span className="font-ui text-base font-semibold text-[#765B55]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="font-ui text-xs text-[#765B55]/50 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {product.discount > 0 && (
              <span className="font-ui text-[11px] font-medium text-[#C98F9D] tabular-nums">
                Save {product.discount}%
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] disabled:bg-[#765B55]/30 text-white font-ui text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.stock === 0 ? 'Sold Out' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
