import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_BANNERS,
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_CUSTOMERS,
  INITIAL_ENQUIRIES,
  INITIAL_HOMEPAGE_CONTENT,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_SITE_SETTINGS,
  INITIAL_SUBSCRIBERS,
  DEFAULT_CUSTOMER_SESSION,
  resolveAssetUrl,
} from '../data/mockCatalog';
import {
  DEFAULT_GIFT_SELECTION,
  INITIAL_BUILD_BUNDLE_CONFIG,
  INITIAL_BUNDLES,
  INITIAL_GIFT_CARD_DESIGNS,
  INITIAL_GIFT_MESSAGE_CONFIG,
  INITIAL_GIFT_WRAPS,
  INITIAL_LOYALTY_ACCOUNTS,
  INITIAL_LOYALTY_REWARDS,
  INITIAL_LOYALTY_SETTINGS,
  INITIAL_LOYALTY_TRANSACTIONS,
} from '../data/featuresCatalog';
import {
  BannerItem,
  BuildBundleConfig,
  BuildBundleTier,
  CartBundleComponent,
  CartItem,
  Category,
  Coupon,
  CurrencyCode,
  CustomerAddress,
  CustomerLoyaltyAccount,
  CustomerRecord,
  CustomerSession,
  DemoOrder,
  Enquiry,
  GiftCardDesign,
  GiftMessageConfig,
  GiftSelection,
  GiftWrapOption,
  HomepageContent,
  LoyaltyReward,
  LoyaltySettings,
  LoyaltyTier,
  LoyaltyTransaction,
  OrderStatus,
  PlushieBundle,
  Product,
  ProductReview,
  RouteKey,
  SiteSettings,
  Subscriber,
} from '../types/store';

interface RouteParams {
  productId?: string;
  bundleId?: string;
  category?: string;
  giftTag?: string;
  orderId?: string;
  accountTab?: 'overview' | 'profile' | 'addresses' | 'orders' | 'loyalty' | 'order-detail';
  searchQuery?: string;
}

interface ToastMessage {
  id: number;
  text: string;
  tone?: 'rose' | 'cocoa' | 'success';
}

export interface BundlePricingSummary {
  bundle: PlushieBundle;
  components: { product: Product; quantity: number }[];
  combinedPrice: number;
  finalPrice: number;
  savings: number;
  discountPercentEffective: number;
  availableStock: number;
  isAvailable: boolean;
}

export interface CartTotalsSummary {
  itemsSubtotal: number;
  originalSubtotal: number;
  catalogAndBundleSavings: number;
  activeGiftWrap: GiftWrapOption | null;
  activeGiftCard: GiftCardDesign | null;
  rawGiftWrapFee: number;
  giftWrapDiscount: number;
  giftWrapFee: number;
  activeCoupon: Coupon | null;
  couponDiscount: number;
  activeLoyaltyReward: LoyaltyReward | null;
  loyaltyDiscount: number;
  shipping: number;
  total: number;
  estimatedPointsToEarn: number;
}

export interface PlaceOrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  streetAddress: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  paymentMethod: 'Cash on Delivery' | 'Online Payment';
}

export interface BackendResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
  code?: string;
}

interface StoreContextValue {
  route: RouteKey;
  routeParams: RouteParams;
  navigate: (route: RouteKey, params?: RouteParams) => void;
  goBack: () => void;

  // Data collections
  products: Product[];
  categories: Category[];
  orders: DemoOrder[];
  customers: CustomerRecord[];
  reviews: ProductReview[];
  coupons: Coupon[];
  enquiries: Enquiry[];
  subscribers: Subscriber[];
  banners: BannerItem[];
  homepageContent: HomepageContent;
  siteSettings: SiteSettings;

  // Feature 1 & 2: Gift Wrapping & Personalised Gift Notes
  giftWraps: GiftWrapOption[];
  giftCardDesigns: GiftCardDesign[];
  giftMessageConfig: GiftMessageConfig;
  giftSelection: GiftSelection;
  setGiftSelection: React.Dispatch<React.SetStateAction<GiftSelection>>;
  clearGiftSelection: () => void;

  // Feature 3: Plushie Bundles & Custom Builder
  bundles: PlushieBundle[];
  buildBundleConfig: BuildBundleConfig;
  getBundlePricing: (bundle: PlushieBundle) => BundlePricingSummary;
  addBundleToCart: (bundle: PlushieBundle, openDrawer?: boolean) => void;
  addCustomBundleToCart: (
    chosen: { product: Product; quantity: number }[],
    tier: BuildBundleTier,
    openDrawer?: boolean
  ) => void;

  // Feature 4: HUGS & HEARTS REWARDS Loyalty Programme
  loyaltySettings: LoyaltySettings;
  loyaltyRewards: LoyaltyReward[];
  loyaltyAccounts: CustomerLoyaltyAccount[];
  loyaltyTransactions: LoyaltyTransaction[];
  selectedLoyaltyRewardId: string;
  setSelectedLoyaltyRewardId: (rewardId: string) => void;
  currentCustomerLoyalty: {
    account: CustomerLoyaltyAccount | null;
    currentTier: LoyaltyTier;
    nextTier: LoyaltyTier | null;
    pointsToNextTier: number;
    progressPercent: number;
    transactions: LoyaltyTransaction[];
  };

  // Customer preferences & session
  cart: CartItem[];
  cartTotals: CartTotalsSummary;
  wishlist: string[];
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (inrAmount: number) => string;
  customerSession: CustomerSession;
  adminLoggedIn: boolean;
  appliedCouponCode: string;
  setAppliedCouponCode: (code: string) => void;

  // UI overlays
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  toasts: ToastMessage[];
  showToast: (text: string, tone?: 'rose' | 'cocoa' | 'success') => void;

  // Cart & Wishlist Actions
  getReservedProductQuantity: (productId: string) => number;
  addToCart: (
    product: Product,
    options?: { color?: string; size?: string; quantity?: number; openDrawer?: boolean }
  ) => void;
  removeFromCart: (productId: string, color: string, size: string) => void;
  updateCartQuantity: (productId: string, color: string, size: string, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  moveWishlistToCart: (product: Product) => void;

  // Customer Actions
  loginCustomerDemo: (email?: string, name?: string) => void;
  registerCustomerDemo: (name: string, email: string, phone: string) => void;
  logoutCustomerDemo: () => void;
  updateCustomerProfile: (name: string, email: string, phone: string) => void;
  addCustomerAddress: (addr: Omit<CustomerAddress, 'id'>) => void;
  removeCustomerAddress: (id: string) => void;
  addDemoReview: (review: Omit<ProductReview, 'id' | 'date' | 'status'>) => void;
  submitEnquiry: (
    enquiry: Omit<Enquiry, 'id' | 'date' | 'status'>
  ) => Promise<BackendResult<Enquiry>>;
  subscribeNewsletter: (email: string, source?: string) => Promise<void>;
  placeOrder: (payload: PlaceOrderPayload) => Promise<BackendResult<DemoOrder>>;
  fetchOrdersFromBackend: (email?: string) => Promise<BackendResult<DemoOrder[]>>;
  fetchOrderByIdFromBackend: (orderId: string) => Promise<BackendResult<DemoOrder>>;
  fetchEnquiriesFromBackend: () => Promise<BackendResult<Enquiry[]>>;

  // Admin Actions (Frontend state + Supabase sync)
  loginAdminDemo: () => void;
  logoutAdminDemo: () => void;
  saveProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateProductStock: (productId: string, stock: number) => void;
  saveCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  saveCoupon: (coupon: Coupon) => void;
  toggleCouponActive: (couponId: string) => void;
  deleteCoupon: (couponId: string) => void;
  updateReviewStatus: (reviewId: string, status: ProductReview['status']) => void;
  updateHomepageContent: (content: HomepageContent) => void;
  saveBanner: (banner: BannerItem) => void;
  updateSiteSettings: (settings: SiteSettings) => void;
  markEnquiryReplied: (id: string) => void;

  // Admin Feature Management Actions
  saveGiftWrap: (wrap: GiftWrapOption) => void;
  deleteGiftWrap: (id: string) => void;
  saveGiftCardDesign: (card: GiftCardDesign) => void;
  deleteGiftCardDesign: (id: string) => void;
  updateGiftMessageConfig: (config: GiftMessageConfig) => void;
  saveBundle: (bundle: PlushieBundle) => void;
  deleteBundle: (bundleId: string) => void;
  updateBuildBundleConfig: (config: BuildBundleConfig) => void;
  updateLoyaltySettings: (settings: LoyaltySettings) => void;
  saveLoyaltyReward: (reward: LoyaltyReward) => void;
  deleteLoyaltyReward: (rewardId: string) => void;
  adjustCustomerLoyaltyPoints: (
    customerEmail: string,
    delta: number,
    auditNote: string
  ) => boolean;

  resetDemoData: () => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota issues gracefully
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<RouteKey>('home');
  const [routeParams, setRouteParams] = useState<RouteParams>({});
  const [historyStack, setHistoryStack] = useState<{ route: RouteKey; params: RouteParams }[]>([]);

  const [products, setProducts] = useState<Product[]>(() =>
    readStorage('hugmear_products', INITIAL_PRODUCTS).map((p) => ({
      ...p,
      images: p.images.map((img) => resolveAssetUrl(img)).filter(Boolean),
    }))
  );
  const [categories, setCategories] = useState<Category[]>(() =>
    readStorage('hugmear_categories', INITIAL_CATEGORIES).map((c) => ({
      ...c,
      image: resolveAssetUrl(c.image),
    }))
  );
  const [orders, setOrders] = useState<DemoOrder[]>(() =>
    readStorage('hugmear_orders', INITIAL_ORDERS).map((o) => ({
      ...o,
      paymentMethod: o.paymentMethod.includes('Cash') ? 'Cash on Delivery' : 'Online Payment',
      items: o.items.map((item) => ({ ...item, image: resolveAssetUrl(item.image) })),
      isDemoSeed: o.isDemoSeed ?? INITIAL_ORDERS.some((seed) => seed.id === o.id),
    }))
  );
  const [customers] = useState<CustomerRecord[]>(() =>
    readStorage('hugmear_customers', INITIAL_CUSTOMERS).map((c) => ({
      ...c,
      isDemoSeed: c.isDemoSeed ?? INITIAL_CUSTOMERS.some((seed) => seed.id === c.id),
    }))
  );
  const [reviews, setReviews] = useState<ProductReview[]>(() =>
    readStorage('hugmear_reviews', INITIAL_REVIEWS).map((r) => ({
      ...r,
      city: r.city.replace(/\s*\(Sample Review\)/i, ''),
      isDemoSeed: r.isDemoSeed ?? INITIAL_REVIEWS.some((seed) => seed.id === r.id),
    }))
  );
  const [coupons, setCoupons] = useState<Coupon[]>(() =>
    readStorage('hugmear_coupons', INITIAL_COUPONS).map((c) => ({
      ...c,
      description: c.description.replace(/\s*\(Demo Coupon\)/i, ''),
    }))
  );
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() =>
    readStorage('hugmear_enquiries', INITIAL_ENQUIRIES).map((e) => ({
      ...e,
      isDemoSeed: e.isDemoSeed ?? INITIAL_ENQUIRIES.some((seed) => seed.id === e.id),
    }))
  );
  const [subscribers, setSubscribers] = useState<Subscriber[]>(() =>
    readStorage('hugmear_subscribers', INITIAL_SUBSCRIBERS).map((s) => ({
      ...s,
      isDemoSeed: s.isDemoSeed ?? INITIAL_SUBSCRIBERS.some((seed) => seed.id === s.id),
    }))
  );
  const [banners, setBanners] = useState<BannerItem[]>(() =>
    readStorage('hugmear_banners', INITIAL_BANNERS).map((b) => ({
      ...b,
      image: resolveAssetUrl(b.image),
    }))
  );
  const [homepageContent, setHomepageContent] = useState<HomepageContent>(() =>
    readStorage('hugmear_homepage', INITIAL_HOMEPAGE_CONTENT)
  );
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const stored = readStorage('hugmear_settings', INITIAL_SITE_SETTINGS);
    return {
      ...stored,
      supportEmail:
        stored.supportEmail === 'hello@hugme-ar.example'
          ? INITIAL_SITE_SETTINGS.supportEmail
          : stored.supportEmail,
      storeNotice: stored.storeNotice.includes('Frontend Storefront Preview')
        ? INITIAL_SITE_SETTINGS.storeNotice
        : stored.storeNotice,
    };
  });

  // Feature 1 & 2 state
  const [giftWraps, setGiftWraps] = useState<GiftWrapOption[]>(() =>
    readStorage('hugmear_gift_wraps', INITIAL_GIFT_WRAPS)
  );
  const [giftCardDesigns, setGiftCardDesigns] = useState<GiftCardDesign[]>(() =>
    readStorage('hugmear_gift_cards', INITIAL_GIFT_CARD_DESIGNS)
  );
  const [giftMessageConfig, setGiftMessageConfig] = useState<GiftMessageConfig>(() =>
    readStorage('hugmear_gift_msg_config', INITIAL_GIFT_MESSAGE_CONFIG)
  );
  const [giftSelection, setGiftSelection] = useState<GiftSelection>(() =>
    readStorage('hugmear_gift_selection', DEFAULT_GIFT_SELECTION)
  );

  // Feature 3 state
  const [bundles, setBundles] = useState<PlushieBundle[]>(() =>
    readStorage('hugmear_bundles', INITIAL_BUNDLES)
  );
  const [buildBundleConfig, setBuildBundleConfig] = useState<BuildBundleConfig>(() =>
    readStorage('hugmear_build_bundle_cfg', INITIAL_BUILD_BUNDLE_CONFIG)
  );

  // Feature 4 state
  const [loyaltySettings, setLoyaltySettings] = useState<LoyaltySettings>(() =>
    readStorage('hugmear_loyalty_settings', INITIAL_LOYALTY_SETTINGS)
  );
  const [loyaltyRewards, setLoyaltyRewards] = useState<LoyaltyReward[]>(() =>
    readStorage('hugmear_loyalty_rewards', INITIAL_LOYALTY_REWARDS)
  );
  const [loyaltyAccounts, setLoyaltyAccounts] = useState<CustomerLoyaltyAccount[]>(() =>
    readStorage('hugmear_loyalty_accounts', INITIAL_LOYALTY_ACCOUNTS)
  );
  const [loyaltyTransactions, setLoyaltyTransactions] = useState<LoyaltyTransaction[]>(() =>
    readStorage('hugmear_loyalty_tx', INITIAL_LOYALTY_TRANSACTIONS)
  );
  const [selectedLoyaltyRewardId, setSelectedLoyaltyRewardId] = useState<string>(() =>
    readStorage('hugmear_loyalty_selected_reward', '')
  );

  const [cart, setCart] = useState<CartItem[]>(() =>
    readStorage<CartItem[]>('hugmear_cart', []).map((item) => ({
      ...item,
      image: resolveAssetUrl(item.image),
      bundleItems: item.bundleItems?.map((bi) => ({ ...bi, image: resolveAssetUrl(bi.image) })),
    }))
  );
  const [wishlist, setWishlist] = useState<string[]>(() =>
    readStorage('hugmear_wishlist', ['HM-101', 'HM-102', 'HM-110'])
  );
  const [currency, setCurrency] = useState<CurrencyCode>(() =>
    readStorage('hugmear_currency', 'INR')
  );
  const [customerSession, setCustomerSession] = useState<CustomerSession>(() =>
    readStorage('hugmear_customer_session', DEFAULT_CUSTOMER_SESSION)
  );
  const [adminLoggedIn, setAdminLoggedIn] = useState<boolean>(() =>
    readStorage('hugmear_admin_session', false)
  );
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>(() =>
    readStorage('hugmear_coupon', '')
  );

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist to localStorage
  useEffect(() => writeStorage('hugmear_products', products), [products]);
  useEffect(() => writeStorage('hugmear_categories', categories), [categories]);
  useEffect(() => writeStorage('hugmear_orders', orders), [orders]);
  useEffect(() => writeStorage('hugmear_reviews', reviews), [reviews]);
  useEffect(() => writeStorage('hugmear_coupons', coupons), [coupons]);
  useEffect(() => writeStorage('hugmear_enquiries', enquiries), [enquiries]);
  useEffect(() => writeStorage('hugmear_subscribers', subscribers), [subscribers]);
  useEffect(() => writeStorage('hugmear_banners', banners), [banners]);
  useEffect(() => writeStorage('hugmear_homepage', homepageContent), [homepageContent]);
  useEffect(() => writeStorage('hugmear_settings', siteSettings), [siteSettings]);
  useEffect(() => writeStorage('hugmear_gift_wraps', giftWraps), [giftWraps]);
  useEffect(() => writeStorage('hugmear_gift_cards', giftCardDesigns), [giftCardDesigns]);
  useEffect(() => writeStorage('hugmear_gift_msg_config', giftMessageConfig), [giftMessageConfig]);
  useEffect(() => writeStorage('hugmear_gift_selection', giftSelection), [giftSelection]);
  useEffect(() => writeStorage('hugmear_bundles', bundles), [bundles]);
  useEffect(() => writeStorage('hugmear_build_bundle_cfg', buildBundleConfig), [buildBundleConfig]);
  useEffect(() => writeStorage('hugmear_loyalty_settings', loyaltySettings), [loyaltySettings]);
  useEffect(() => writeStorage('hugmear_loyalty_rewards', loyaltyRewards), [loyaltyRewards]);
  useEffect(() => writeStorage('hugmear_loyalty_accounts', loyaltyAccounts), [loyaltyAccounts]);
  useEffect(() => writeStorage('hugmear_loyalty_tx', loyaltyTransactions), [loyaltyTransactions]);
  useEffect(
    () => writeStorage('hugmear_loyalty_selected_reward', selectedLoyaltyRewardId),
    [selectedLoyaltyRewardId]
  );
  useEffect(() => writeStorage('hugmear_cart', cart), [cart]);
  useEffect(() => writeStorage('hugmear_wishlist', wishlist), [wishlist]);
  useEffect(() => writeStorage('hugmear_currency', currency), [currency]);
  useEffect(() => writeStorage('hugmear_customer_session', customerSession), [customerSession]);
  useEffect(() => writeStorage('hugmear_admin_session', adminLoggedIn), [adminLoggedIn]);
  useEffect(() => writeStorage('hugmear_coupon', appliedCouponCode), [appliedCouponCode]);

  const showToast = (text: string, tone: 'rose' | 'cocoa' | 'success' = 'rose') => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, text, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const navigate = (nextRoute: RouteKey, params: RouteParams = {}) => {
    setHistoryStack((prev) => [...prev.slice(-15), { route, params: routeParams }]);
    setRoute(nextRoute);
    setRouteParams(params);
    setIsSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (historyStack.length > 0) {
      const last = historyStack[historyStack.length - 1];
      setHistoryStack((prev) => prev.slice(0, -1));
      setRoute(last.route);
      setRouteParams(last.params);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('home');
    }
  };

  const formatPrice = (inrAmount: number): string => {
    if (currency === 'USD') {
      const usd = (inrAmount / 84).toFixed(2);
      return `$${usd}`;
    }
    if (currency === 'EUR') {
      const eur = (inrAmount / 91).toFixed(2);
      return `€${eur}`;
    }
    return `₹${Math.round(inrAmount).toLocaleString('en-IN')}`;
  };

  const getReservedProductQuantity = (productId: string): number => {
    return cart.reduce((sum, item) => {
      if (item.itemType === 'bundle' || item.itemType === 'custom-bundle') {
        const comp = item.bundleItems?.find((b) => b.productId === productId);
        return sum + (comp ? comp.quantity * item.quantity : 0);
      }
      return item.productId === productId ? sum + item.quantity : sum;
    }, 0);
  };

  const getBundlePricing = (bundle: PlushieBundle): BundlePricingSummary => {
    const components: { product: Product; quantity: number }[] = [];
    let allPresent = bundle.items.length > 0;
    let availableStock = Infinity;

    for (const spec of bundle.items) {
      const prod = products.find((p) => p.id === spec.productId);
      if (!prod || spec.quantity <= 0) {
        allPresent = false;
        availableStock = 0;
        continue;
      }
      components.push({ product: prod, quantity: spec.quantity });
      const possible = Math.floor(prod.stock / spec.quantity);
      availableStock = Math.min(availableStock, possible);
    }

    if (!allPresent || availableStock === Infinity) {
      availableStock = 0;
    }

    const combinedPrice = components.reduce(
      (sum, c) => sum + c.product.price * c.quantity,
      0
    );

    let finalPrice = combinedPrice;
    if (bundle.overridePrice && bundle.overridePrice > 0 && bundle.overridePrice < combinedPrice) {
      finalPrice = Math.round(bundle.overridePrice);
    } else if (bundle.discountPercent > 0) {
      finalPrice = Math.round(combinedPrice * (1 - bundle.discountPercent / 100));
    }

    const savings = Math.max(0, combinedPrice - finalPrice);
    const discountPercentEffective =
      combinedPrice > 0 && savings > 0 ? Math.round((savings / combinedPrice) * 100) : 0;

    return {
      bundle,
      components,
      combinedPrice,
      finalPrice,
      savings,
      discountPercentEffective,
      availableStock,
      isAvailable: bundle.active && allPresent && availableStock > 0,
    };
  };

  const addToCart = (
    product: Product,
    options?: { color?: string; size?: string; quantity?: number; openDrawer?: boolean }
  ) => {
    const qty = options?.quantity ?? 1;
    const alreadyReserved = getReservedProductQuantity(product.id);
    if (alreadyReserved + qty > product.stock) {
      showToast(
        product.stock <= 0
          ? `${product.name} is currently out of stock`
          : `Only ${Math.max(0, product.stock - alreadyReserved)} more of ${product.name} available`,
        'cocoa'
      );
      return;
    }

    const selectedColor = options?.color || product.defaultColor;
    const selectedSize = options?.size || product.defaultSize;
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          (item.itemType ?? 'product') === 'product' &&
          item.productId === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );
      if (existing) {
        return prev.map((item) =>
          (item.itemType ?? 'product') === 'product' &&
          item.productId === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          image: product.images[0],
          price: product.price,
          originalPrice: product.originalPrice,
          selectedColor,
          selectedSize,
          quantity: qty,
          itemType: 'product',
        },
      ];
    });
    showToast(`Added ${product.name} to your hug bag ♡`, 'rose');
    if (options?.openDrawer !== false) {
      setIsCartOpen(true);
    }
  };

  const addBundleToCart = (bundle: PlushieBundle, openDrawer = true) => {
    const pricing = getBundlePricing(bundle);
    if (!pricing.isAvailable) {
      showToast(`${bundle.name} is currently unavailable due to stock`, 'cocoa');
      return;
    }

    // Check remaining stock considering items already in cart
    for (const comp of pricing.components) {
      const reserved = getReservedProductQuantity(comp.product.id);
      if (reserved + comp.quantity > comp.product.stock) {
        showToast(
          `Not enough stock remaining for ${comp.product.name} in this bundle`,
          'cocoa'
        );
        return;
      }
    }

    const bundleComponents: CartBundleComponent[] = pricing.components.map((c) => ({
      productId: c.product.id,
      name: c.product.name,
      image: c.product.images[0],
      quantity: c.quantity,
      unitPrice: c.product.price,
    }));

    const sizeLabel = `${bundleComponents.reduce((s, c) => s + c.quantity, 0)} Plushies Bundle`;

    setCart((prev) => {
      const existing = prev.find(
        (item) => item.itemType === 'bundle' && item.productId === bundle.id
      );
      if (existing) {
        return prev.map((item) =>
          item.itemType === 'bundle' && item.productId === bundle.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: bundle.id,
          bundleId: bundle.id,
          name: bundle.name,
          image: bundleComponents[0]?.image || '',
          price: pricing.finalPrice,
          originalPrice: pricing.combinedPrice,
          selectedColor: 'Curated Set',
          selectedSize: sizeLabel,
          quantity: 1,
          itemType: 'bundle',
          bundleItems: bundleComponents,
        },
      ];
    });

    showToast(`Added ${bundle.name} to your hug bag ♡`, 'rose');
    if (openDrawer) setIsCartOpen(true);
  };

  const addCustomBundleToCart = (
    chosen: { product: Product; quantity: number }[],
    tier: BuildBundleTier,
    openDrawer = true
  ) => {
    const totalCount = chosen.reduce((sum, c) => sum + c.quantity, 0);
    if (totalCount !== tier.count) {
      showToast(`Please choose ${tier.count} plushies for your custom bundle`, 'cocoa');
      return;
    }

    for (const c of chosen) {
      const reserved = getReservedProductQuantity(c.product.id);
      if (reserved + c.quantity > c.product.stock) {
        showToast(`Not enough stock left for ${c.product.name}`, 'cocoa');
        return;
      }
    }

    const combinedPrice = chosen.reduce((sum, c) => sum + c.product.price * c.quantity, 0);
    const finalPrice =
      tier.discountPercent > 0
        ? Math.round(combinedPrice * (1 - tier.discountPercent / 100))
        : combinedPrice;

    const components: CartBundleComponent[] = chosen.map((c) => ({
      productId: c.product.id,
      name: c.product.name,
      image: c.product.images[0],
      quantity: c.quantity,
      unitPrice: c.product.price,
    }));

    const signature = components
      .map((c) => `${c.productId}x${c.quantity}`)
      .sort()
      .join('|');
    const customId = `CUSTOM-${tier.count}-${signature}`;

    setCart((prev) => {
      const existing = prev.find(
        (item) => item.itemType === 'custom-bundle' && item.productId === customId
      );
      if (existing) {
        return prev.map((item) =>
          item.itemType === 'custom-bundle' && item.productId === customId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: customId,
          bundleId: customId,
          name: `Custom ${tier.label}`,
          image: components[0]?.image || '',
          price: finalPrice,
          originalPrice: combinedPrice,
          selectedColor: 'Build Your Own',
          selectedSize: `${tier.count} Plushies`,
          quantity: 1,
          itemType: 'custom-bundle',
          bundleItems: components,
        },
      ];
    });

    showToast(`Added your Custom ${tier.label} to cart ♡`, 'rose');
    if (openDrawer) setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, color: string, size: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.productId === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
          )
      )
    );
  };

  const updateCartQuantity = (productId: string, color: string, size: string, delta: number) => {
    if (delta > 0) {
      const target = cart.find(
        (item) =>
          item.productId === productId &&
          item.selectedColor === color &&
          item.selectedSize === size
      );
      if (target) {
        if (target.itemType === 'bundle' || target.itemType === 'custom-bundle') {
          for (const comp of target.bundleItems || []) {
            const prod = products.find((p) => p.id === comp.productId);
            const reserved = getReservedProductQuantity(comp.productId);
            if (!prod || reserved + comp.quantity * delta > prod.stock) {
              showToast(`Maximum available stock reached for ${comp.name}`, 'cocoa');
              return;
            }
          }
        } else {
          const prod = products.find((p) => p.id === productId);
          const reserved = getReservedProductQuantity(productId);
          if (prod && reserved + delta > prod.stock) {
            showToast(`Only ${prod.stock} units of ${prod.name} in stock`, 'cocoa');
            return;
          }
        }
      }
    }

    setCart((prev) =>
      prev
        .map((item) => {
          if (
            item.productId === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
          ) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCouponCode('');
    setSelectedLoyaltyRewardId('');
    setGiftSelection(DEFAULT_GIFT_SELECTION);
  };

  const clearGiftSelection = () => {
    setGiftSelection(DEFAULT_GIFT_SELECTION);
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const toggleWishlist = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(`Removed ${product?.name || 'item'} from wishlist`, 'cocoa');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Saved ${product?.name || 'item'} to your wishlist ♡`, 'rose');
        return [...prev, productId];
      }
    });
  };

  const moveWishlistToCart = (product: Product) => {
    addToCart(product, { openDrawer: true });
    setWishlist((prev) => prev.filter((id) => id !== product.id));
  };

  // Loyalty lookup for active signed-in customer
  const activeLoyaltyAccount: CustomerLoyaltyAccount | null = customerSession.isLoggedIn
    ? loyaltyAccounts.find(
        (acc) => acc.customerEmail.toLowerCase() === customerSession.email.toLowerCase()
      ) || {
        customerId: customerSession.id,
        customerName: customerSession.name || 'HUGME.AR Member',
        customerEmail: customerSession.email,
        pointsBalance: 0,
        lifetimePoints: 0,
        hasEarnedFirstOrderBonus: false,
        updatedAt: 'Today',
        isDemoSeed: false,
      }
    : null;

  const sortedTiers = [...loyaltySettings.tiers].sort((a, b) => a.minPoints - b.minPoints);
  const currentBalance = activeLoyaltyAccount?.pointsBalance ?? 0;
  const currentTier: LoyaltyTier =
    [...sortedTiers].reverse().find((t) => currentBalance >= t.minPoints) ||
    sortedTiers[0] || {
      id: 'tier-default',
      name: 'Warm Hug',
      minPoints: 0,
      perk: 'Earn points on eligible orders',
    };

  const activeRewardsSorted = loyaltyRewards
    .filter((r) => r.active)
    .sort((a, b) => a.pointsRequired - b.pointsRequired);
  const nextUnlockableReward = activeRewardsSorted.find((r) => r.pointsRequired > currentBalance);
  const nextTier = sortedTiers.find((t) => t.minPoints > currentBalance) || null;
  const targetThreshold = nextUnlockableReward?.pointsRequired ?? nextTier?.minPoints ?? null;
  const pointsToNextTier = targetThreshold ? Math.max(0, targetThreshold - currentBalance) : 0;
  const progressPercent = targetThreshold
    ? Math.min(100, Math.round((currentBalance / targetThreshold) * 100))
    : 100;

  const customerTransactions = customerSession.isLoggedIn
    ? loyaltyTransactions.filter(
        (tx) => tx.customerEmail.toLowerCase() === customerSession.email.toLowerCase()
      )
    : [];

  // Unified Cart Totals Calculation (single source of truth across Drawer, Cart, Checkout)
  const itemsSubtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const originalSubtotal = cart.reduce((sum, i) => sum + i.originalPrice * i.quantity, 0);
  const catalogAndBundleSavings = Math.max(0, originalSubtotal - itemsSubtotal);

  const activeGiftWrap =
    giftSelection.wrapEnabled && giftSelection.wrapOptionId
      ? giftWraps.find((w) => w.id === giftSelection.wrapOptionId && w.enabled) || null
      : null;

  const activeGiftCard =
    giftSelection.noteEnabled && giftMessageConfig.enabled && giftSelection.cardDesignId
      ? giftCardDesigns.find((c) => c.id === giftSelection.cardDesignId && c.enabled) || null
      : null;

  const rawGiftWrapFee = itemsSubtotal > 0 && activeGiftWrap ? activeGiftWrap.price : 0;

  const activeCoupon =
    coupons.find(
      (c) =>
        c.code.toUpperCase() === appliedCouponCode.toUpperCase() &&
        c.active &&
        itemsSubtotal >= c.minOrder
    ) || null;

  const rawCouponDiscount = activeCoupon
    ? activeCoupon.discountType === 'percentage'
      ? Math.round((itemsSubtotal * activeCoupon.discountValue) / 100)
      : activeCoupon.discountValue
    : 0;
  const couponDiscount = Math.min(itemsSubtotal, Math.max(0, rawCouponDiscount));

  const activeLoyaltyReward =
    loyaltySettings.enabled &&
    customerSession.isLoggedIn &&
    selectedLoyaltyRewardId
      ? loyaltyRewards.find(
          (r) =>
            r.id === selectedLoyaltyRewardId &&
            r.active &&
            currentBalance >= r.pointsRequired &&
            itemsSubtotal >= r.minOrder
        ) || null
      : null;

  const giftWrapDiscount =
    activeLoyaltyReward?.rewardType === 'free_gift_wrap' && rawGiftWrapFee > 0
      ? rawGiftWrapFee
      : 0;
  const giftWrapFee = Math.max(0, rawGiftWrapFee - giftWrapDiscount);

  const loyaltyDiscount =
    activeLoyaltyReward?.rewardType === 'discount_flat'
      ? Math.min(activeLoyaltyReward.discountValue, Math.max(0, itemsSubtotal - couponDiscount))
      : 0;

  const shipping =
    itemsSubtotal === 0 ||
    itemsSubtotal >= siteSettings.freeShippingThreshold ||
    activeLoyaltyReward?.rewardType === 'free_shipping'
      ? 0
      : siteSettings.standardShippingFee;

  const total = Math.max(
    0,
    itemsSubtotal + giftWrapFee - couponDiscount - loyaltyDiscount + shipping
  );

  const eligibleSpendForPoints = Math.max(0, itemsSubtotal - couponDiscount - loyaltyDiscount);
  const estimatedPointsToEarn =
    loyaltySettings.enabled && eligibleSpendForPoints > 0
      ? Math.floor((eligibleSpendForPoints / 100) * loyaltySettings.pointsPer100Inr)
      : 0;

  const cartTotals: CartTotalsSummary = {
    itemsSubtotal,
    originalSubtotal,
    catalogAndBundleSavings,
    activeGiftWrap,
    activeGiftCard,
    rawGiftWrapFee,
    giftWrapDiscount,
    giftWrapFee,
    activeCoupon,
    couponDiscount,
    activeLoyaltyReward,
    loyaltyDiscount,
    shipping,
    total,
    estimatedPointsToEarn,
  };

  // Customer session actions
  const loginCustomerDemo = (email?: string, name?: string) => {
    const cleanEmail = email?.trim() || 'guest@hugme.ar';
    const derivedName =
      name?.trim() ||
      cleanEmail
        .split('@')[0]
        .replace(/[._-]+/g, ' ')
        .replace(/\b\w/g, (ch) => ch.toUpperCase());
    setCustomerSession((prev) => ({
      ...prev,
      isLoggedIn: true,
      email: cleanEmail,
      name: prev.name || derivedName,
    }));
    showToast('Welcome back to HUGME.AR ♡', 'success');
  };

  const registerCustomerDemo = (name: string, email: string, phone: string) => {
    setCustomerSession((prev) => ({
      ...prev,
      isLoggedIn: true,
      name: name.trim() || 'HUGME.AR Member',
      email: email.trim() || prev.email,
      phone: phone.trim() || prev.phone,
      memberSince: 'November 2026',
    }));
    showToast('Account profile saved for this browser session ♡', 'success');
  };

  const logoutCustomerDemo = () => {
    setCustomerSession((prev) => ({ ...prev, isLoggedIn: false }));
    setSelectedLoyaltyRewardId('');
    showToast('Signed out successfully', 'cocoa');
    navigate('home');
  };

  const updateCustomerProfile = (name: string, email: string, phone: string) => {
    setCustomerSession((prev) => ({ ...prev, name, email, phone }));
    showToast('Profile details updated', 'success');
  };

  const addCustomerAddress = (addr: Omit<CustomerAddress, 'id'>) => {
    const newAddr: CustomerAddress = { ...addr, id: `addr-${Date.now()}` };
    setCustomerSession((prev) => ({
      ...prev,
      addresses: addr.isDefault
        ? [...prev.addresses.map((a) => ({ ...a, isDefault: false })), newAddr]
        : [...prev.addresses, newAddr],
    }));
    showToast('Delivery address saved', 'success');
  };

  const removeCustomerAddress = (id: string) => {
    setCustomerSession((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((a) => a.id !== id),
    }));
    showToast('Address removed', 'cocoa');
  };

  const addDemoReview = (review: Omit<ProductReview, 'id' | 'date' | 'status'>) => {
    const newReview: ProductReview = {
      ...review,
      id: `REV-${Date.now()}`,
      date: 'Just now',
      status: 'Approved',
      isDemoSeed: false,
    };
    setReviews((prev) => [newReview, ...prev]);
    showToast('Thank you for sharing your note ♡', 'success');
  };

  const placeOrder = async (payload: PlaceOrderPayload): Promise<BackendResult<DemoOrder>> => {
    if (cart.length === 0) {
      return { ok: false, code: 'EMPTY_CART', error: 'Your shopping cart is empty.' };
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customerSession.id || 'guest',
          customerName: payload.customerName,
          customerEmail: payload.customerEmail,
          customerPhone: payload.customerPhone,
          streetAddress: payload.streetAddress,
          city: payload.city,
          state: payload.state,
          pincode: payload.pincode,
          country: payload.country,
          paymentMethod: payload.paymentMethod,
          subtotal: cartTotals.itemsSubtotal,
          giftWrapFee: cartTotals.giftWrapFee,
          couponCode: cartTotals.activeCoupon?.code || null,
          discount: cartTotals.couponDiscount,
          loyaltyRewardId: cartTotals.activeLoyaltyReward?.id || null,
          loyaltyRewardTitle: cartTotals.activeLoyaltyReward?.title || null,
          loyaltyPointsRedeemed: cartTotals.activeLoyaltyReward?.pointsRequired || 0,
          loyaltyDiscount: cartTotals.loyaltyDiscount,
          shipping: cartTotals.shipping,
          total: cartTotals.total,
          giftSelection:
            cartTotals.activeGiftWrap ||
            (giftSelection.noteEnabled && cartTotals.activeGiftCard)
              ? {
                  wrapName: cartTotals.activeGiftWrap?.name,
                  wrapPrice: cartTotals.giftWrapFee,
                  cardDesignTitle:
                    giftSelection.noteEnabled && cartTotals.activeGiftCard
                      ? cartTotals.activeGiftCard.title
                      : undefined,
                  recipientName: giftSelection.noteEnabled ? giftSelection.recipientName : undefined,
                  senderName: giftSelection.noteEnabled ? giftSelection.senderName : undefined,
                  message: giftSelection.noteEnabled ? giftSelection.message : undefined,
                }
              : undefined,
          items: cart.map((item) => ({
            productId: item.productId,
            name: item.name,
            image: item.image,
            color: item.selectedColor,
            size: item.selectedSize,
            quantity: item.quantity,
            price: item.price,
            itemType: item.itemType || 'product',
            bundleItems: item.bundleItems,
          })),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json?.ok || !json.order) {
        return {
          ok: false,
          code: json?.code || 'ORDER_SAVE_FAILED',
          error: json?.error || 'Could not save your order to Supabase.',
        };
      }

      const savedOrder: DemoOrder = {
        ...json.order,
        items: Array.isArray(json.order.items)
          ? json.order.items.map((it: DemoOrder['items'][number]) => ({
              ...it,
              image: resolveAssetUrl(it.image),
            }))
          : [],
        isDemoSeed: false,
      };

      setOrders((prev) => [savedOrder, ...prev.filter((o) => o.id !== savedOrder.id)]);
      clearCart();
      showToast(`Order ${savedOrder.id} saved & confirmed ♡`, 'success');
      return { ok: true, data: savedOrder };
    } catch {
      return {
        ok: false,
        code: 'NETWORK_ERROR',
        error: 'Unable to reach the backend server. Please verify the server is running.',
      };
    }
  };

  const fetchOrdersFromBackend = async (email?: string): Promise<BackendResult<DemoOrder[]>> => {
    try {
      const qs = email ? `?email=${encodeURIComponent(email)}` : '';
      const res = await fetch(`/api/orders${qs}`);
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        return {
          ok: false,
          code: json?.code || 'FETCH_FAILED',
          error: json?.error || 'Failed to load orders from Supabase.',
        };
      }

      const fetched: DemoOrder[] = (json.orders || []).map((o: DemoOrder) => ({
        ...o,
        items: (o.items || []).map((it) => ({ ...it, image: resolveAssetUrl(it.image) })),
        isDemoSeed: false,
      }));

      setOrders((prev) => {
        const archive = prev.filter((o) => o.isDemoSeed);
        return [...fetched, ...archive];
      });
      return { ok: true, data: fetched };
    } catch {
      return { ok: false, code: 'NETWORK_ERROR', error: 'Unable to reach backend server.' };
    }
  };

  const fetchOrderByIdFromBackend = async (orderId: string): Promise<BackendResult<DemoOrder>> => {
    const clean = orderId.trim();
    if (!clean) {
      return { ok: false, code: 'INVALID_ID', error: 'Enter an Order ID.' };
    }
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(clean)}`);
      const json = await res.json();
      if (!res.ok || !json?.ok || !json.order) {
        return {
          ok: false,
          code: json?.code || 'NOT_FOUND',
          error: json?.error || `No order found for ${clean}.`,
        };
      }
      const order: DemoOrder = {
        ...json.order,
        items: (json.order.items || []).map((it: DemoOrder['items'][number]) => ({
          ...it,
          image: resolveAssetUrl(it.image),
        })),
        isDemoSeed: false,
      };
      setOrders((prev) => [order, ...prev.filter((o) => o.id !== order.id)]);
      return { ok: true, data: order };
    } catch {
      return { ok: false, code: 'NETWORK_ERROR', error: 'Unable to reach backend server.' };
    }
  };

  const fetchEnquiriesFromBackend = async (): Promise<BackendResult<Enquiry[]>> => {
    try {
      const res = await fetch('/api/enquiries');
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        return {
          ok: false,
          code: json?.code || 'FETCH_FAILED',
          error: json?.error || 'Failed to load enquiries from Supabase.',
        };
      }
      const fetched: Enquiry[] = (json.enquiries || []).map((e: Enquiry) => ({
        ...e,
        isDemoSeed: false,
      }));
      setEnquiries((prev) => {
        const archive = prev.filter((e) => e.isDemoSeed);
        return [...fetched, ...archive];
      });
      return { ok: true, data: fetched };
    } catch {
      return { ok: false, code: 'NETWORK_ERROR', error: 'Unable to reach backend server.' };
    }
  };

  const submitEnquiry = async (
    enquiry: Omit<Enquiry, 'id' | 'date' | 'status'>
  ): Promise<BackendResult<Enquiry>> => {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiry),
      });
      const json = await res.json();
      if (!res.ok || !json?.ok || !json.enquiry) {
        const errMsg = json?.error || 'Could not submit your enquiry right now.';
        showToast(errMsg, 'cocoa');
        return { ok: false, code: json?.code || 'ENQUIRY_FAILED', error: errMsg };
      }
      const saved: Enquiry = { ...json.enquiry, isDemoSeed: false };
      setEnquiries((prev) => [saved, ...prev]);
      showToast('Thank you! Your message has been saved ♡', 'success');
      return { ok: true, data: saved };
    } catch {
      const errMsg = 'Unable to reach backend server while sending your enquiry.';
      showToast(errMsg, 'cocoa');
      return { ok: false, code: 'NETWORK_ERROR', error: errMsg };
    }
  };

  const subscribeNewsletter = async (email: string, source = 'Homepage Newsletter') => {
    const clean = email.trim().toLowerCase();
    if (!clean || !clean.includes('@')) {
      showToast('Please enter a valid email address', 'cocoa');
      return;
    }

    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: clean, source }),
      });
      const json = await res.json();
      if (!res.ok || !json?.ok || !json.subscriber) {
        showToast(json?.error || 'Could not save subscription right now', 'cocoa');
        return;
      }
      if (json.alreadySubscribed) {
        showToast('You are already subscribed to HUGME.AR notes ♡', 'rose');
        return;
      }
      setSubscribers((prev) => [
        { ...json.subscriber, isDemoSeed: false },
        ...prev.filter((s) => s.email.toLowerCase() !== clean),
      ]);
      showToast('Welcome to the HUGME.AR Cuddle Club ♡', 'success');
    } catch {
      showToast('Unable to reach backend server for newsletter signup', 'cocoa');
    }
  };

  // Admin actions
  const loginAdminDemo = () => {
    setAdminLoggedIn(true);
    showToast('Signed in to HUGME.AR Studio Management', 'success');
    navigate('admin-dashboard');
  };

  const logoutAdminDemo = () => {
    setAdminLoggedIn(false);
    showToast('Signed out of HUGME.AR Admin', 'cocoa');
    navigate('home');
  };

  const saveProduct = (product: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) => (p.id === product.id ? product : p));
      }
      return [product, ...prev];
    });
    showToast(`Saved "${product.name}"`, 'success');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed from catalog', 'cocoa');
  };

  const updateProductStock = (productId: string, stock: number) => {
    const cleanStock = Math.max(0, stock);
    const status: Product['stockStatus'] =
      cleanStock === 0 ? 'Out of Stock' : cleanStock <= 10 ? 'Low Stock' : 'In Stock';
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: cleanStock, stockStatus: status } : p))
    );
  };

  const saveCategory = (category: Category) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === category.id);
      if (exists) return prev.map((c) => (c.id === category.id ? category : c));
      return [...prev, category];
    });
    showToast(`Saved category "${category.name}"`, 'success');
  };

  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    showToast('Category removed', 'cocoa');
  };

  // Order status update with idempotent HUGS & HEARTS REWARDS points engine + Supabase sync
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));

    if (targetOrder && !targetOrder.isDemoSeed) {
      fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }).catch(() => {
        // Silent background sync fallback
      });
    }

    if (!targetOrder || !loyaltySettings.enabled) {
      showToast(`Updated ${orderId} status to ${status}`, 'success');
      return;
    }

    const netAwardedForOrder = loyaltyTransactions
      .filter(
        (tx) =>
          tx.orderId === orderId &&
          (tx.type === 'earn' || tx.type === 'first_order_bonus' || tx.type === 'refund_reversal')
      )
      .reduce((sum, tx) => sum + tx.points, 0);

    const existingAccount = loyaltyAccounts.find(
      (a) => a.customerEmail.toLowerCase() === targetOrder.customerEmail.toLowerCase()
    );
    const baseAccount: CustomerLoyaltyAccount = existingAccount || {
      customerId: targetOrder.customerId,
      customerName: targetOrder.customerName,
      customerEmail: targetOrder.customerEmail,
      pointsBalance: 0,
      lifetimePoints: 0,
      hasEarnedFirstOrderBonus: false,
      updatedAt: '14 Nov 2026',
      isDemoSeed: targetOrder.isDemoSeed,
    };

    const nowLabel = '14 Nov 2026';

    // 1. Refund / Cancellation reversal
    if ((status === 'Cancelled' || status === 'Refunded') && netAwardedForOrder > 0) {
      const reversedPoints = -netAwardedForOrder;
      const nextBalance = Math.max(0, baseAccount.pointsBalance + reversedPoints);
      const nextLifetime = Math.max(0, baseAccount.lifetimePoints + reversedPoints);
      const reversalTx: LoyaltyTransaction = {
        id: `LTX-${Date.now()}`,
        customerId: baseAccount.customerId,
        customerEmail: baseAccount.customerEmail,
        orderId,
        type: 'refund_reversal',
        points: reversedPoints,
        balanceAfter: nextBalance,
        description: `Points reversed due to ${status.toLowerCase()} order (${orderId})`,
        actor: 'system',
        createdAt: nowLabel,
        isDemoSeed: targetOrder.isDemoSeed,
      };
      setLoyaltyAccounts((prev) => {
        const exists = prev.some(
          (a) => a.customerEmail.toLowerCase() === baseAccount.customerEmail.toLowerCase()
        );
        const updated: CustomerLoyaltyAccount = {
          ...baseAccount,
          pointsBalance: nextBalance,
          lifetimePoints: nextLifetime,
          updatedAt: nowLabel,
        };
        return exists
          ? prev.map((a) =>
              a.customerEmail.toLowerCase() === baseAccount.customerEmail.toLowerCase()
                ? updated
                : a
            )
          : [updated, ...prev];
      });
      setLoyaltyTransactions((prev) => [reversalTx, ...prev]);
      showToast(`Order ${orderId} ${status}; ${netAwardedForOrder} pts reversed`, 'cocoa');
      return;
    }

    // 2. Award points strictly once when status reaches configured eligibleOrderStatuses
    if (loyaltySettings.eligibleOrderStatuses.includes(status) && netAwardedForOrder === 0) {
      const eligibleSpend = Math.max(
        0,
        targetOrder.subtotal - targetOrder.discount - (targetOrder.loyaltyDiscount || 0)
      );
      const earnPts = Math.floor((eligibleSpend / 100) * loyaltySettings.pointsPer100Inr);
      const giveFirstBonus =
        !baseAccount.hasEarnedFirstOrderBonus && loyaltySettings.firstOrderBonusPoints > 0;
      const bonusPts = giveFirstBonus ? loyaltySettings.firstOrderBonusPoints : 0;
      const totalAdded = earnPts + bonusPts;

      if (totalAdded > 0) {
        const newTransactions: LoyaltyTransaction[] = [];
        let runningBalance = baseAccount.pointsBalance;

        if (bonusPts > 0) {
          runningBalance += bonusPts;
          newTransactions.push({
            id: `LTX-${Date.now()}-B`,
            customerId: baseAccount.customerId,
            customerEmail: baseAccount.customerEmail,
            orderId,
            type: 'first_order_bonus',
            points: bonusPts,
            balanceAfter: runningBalance,
            description: `First completed purchase bonus (${orderId})`,
            actor: 'system',
            createdAt: nowLabel,
            isDemoSeed: targetOrder.isDemoSeed,
          });
        }
        if (earnPts > 0) {
          runningBalance += earnPts;
          newTransactions.push({
            id: `LTX-${Date.now()}-E`,
            customerId: baseAccount.customerId,
            customerEmail: baseAccount.customerEmail,
            orderId,
            type: 'earn',
            points: earnPts,
            balanceAfter: runningBalance,
            description: `Earned on ${status.toLowerCase()} order (${orderId})`,
            actor: 'system',
            createdAt: nowLabel,
            isDemoSeed: targetOrder.isDemoSeed,
          });
        }

        const updated: CustomerLoyaltyAccount = {
          ...baseAccount,
          pointsBalance: runningBalance,
          lifetimePoints: baseAccount.lifetimePoints + totalAdded,
          hasEarnedFirstOrderBonus: baseAccount.hasEarnedFirstOrderBonus || giveFirstBonus,
          updatedAt: nowLabel,
        };

        setLoyaltyAccounts((prev) => {
          const exists = prev.some(
            (a) => a.customerEmail.toLowerCase() === baseAccount.customerEmail.toLowerCase()
          );
          return exists
            ? prev.map((a) =>
                a.customerEmail.toLowerCase() === baseAccount.customerEmail.toLowerCase()
                  ? updated
                  : a
              )
            : [updated, ...prev];
        });
        setLoyaltyTransactions((prev) => [...newTransactions.reverse(), ...prev]);
        showToast(
          `Updated ${orderId} to ${status} (+${totalAdded} Hug Points awarded)`,
          'success'
        );
        return;
      }
    }

    showToast(`Updated ${orderId} status to ${status}`, 'success');
  };

  const saveCoupon = (coupon: Coupon) => {
    setCoupons((prev) => {
      const exists = prev.some((c) => c.id === coupon.id);
      if (exists) return prev.map((c) => (c.id === coupon.id ? coupon : c));
      return [coupon, ...prev];
    });
    showToast(`Coupon ${coupon.code} saved`, 'success');
  };

  const toggleCouponActive = (couponId: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === couponId ? { ...c, active: !c.active } : c))
    );
  };

  const deleteCoupon = (couponId: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    showToast('Coupon deleted', 'cocoa');
  };

  const updateReviewStatus = (reviewId: string, status: ProductReview['status']) => {
    setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, status } : r)));
    showToast(`Review marked as ${status}`, 'success');
  };

  const updateHomepageContent = (content: HomepageContent) => {
    setHomepageContent(content);
    showToast('Homepage copy updated ♡', 'success');
  };

  const saveBanner = (banner: BannerItem) => {
    setBanners((prev) => {
      const exists = prev.some((b) => b.id === banner.id);
      if (exists) return prev.map((b) => (b.id === banner.id ? banner : b));
      return [...prev, banner];
    });
    showToast('Banner updated', 'success');
  };

  const updateSiteSettings = (settings: SiteSettings) => {
    setSiteSettings(settings);
    showToast('Website settings saved', 'success');
  };

  const markEnquiryReplied = (id: string) => {
    const target = enquiries.find((e) => e.id === id);
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status: 'Replied' } : e)));
    if (target && !target.isDemoSeed) {
      fetch(`/api/enquiries/${encodeURIComponent(id)}`, { method: 'PATCH' }).catch(() => {});
    }
    showToast('Enquiry marked as replied', 'success');
  };

  // Admin Feature Management Actions
  const saveGiftWrap = (wrap: GiftWrapOption) => {
    setGiftWraps((prev) => {
      const exists = prev.some((w) => w.id === wrap.id);
      return exists ? prev.map((w) => (w.id === wrap.id ? wrap : w)) : [...prev, wrap];
    });
    showToast(`Saved wrapping style "${wrap.name}"`, 'success');
  };

  const deleteGiftWrap = (id: string) => {
    setGiftWraps((prev) => prev.filter((w) => w.id !== id));
    showToast('Wrapping option removed', 'cocoa');
  };

  const saveGiftCardDesign = (card: GiftCardDesign) => {
    setGiftCardDesigns((prev) => {
      const exists = prev.some((c) => c.id === card.id);
      return exists ? prev.map((c) => (c.id === card.id ? card : c)) : [...prev, card];
    });
    showToast(`Saved greeting card "${card.title}"`, 'success');
  };

  const deleteGiftCardDesign = (id: string) => {
    setGiftCardDesigns((prev) => prev.filter((c) => c.id !== id));
    showToast('Greeting card design removed', 'cocoa');
  };

  const updateGiftMessageConfig = (config: GiftMessageConfig) => {
    setGiftMessageConfig(config);
    showToast('Gift note settings updated', 'success');
  };

  const saveBundle = (bundle: PlushieBundle) => {
    setBundles((prev) => {
      const exists = prev.some((b) => b.id === bundle.id);
      return exists ? prev.map((b) => (b.id === bundle.id ? bundle : b)) : [bundle, ...prev];
    });
    showToast(`Saved bundle "${bundle.name}"`, 'success');
  };

  const deleteBundle = (bundleId: string) => {
    setBundles((prev) => prev.filter((b) => b.id !== bundleId));
    showToast('Bundle removed', 'cocoa');
  };

  const updateBuildBundleConfig = (config: BuildBundleConfig) => {
    setBuildBundleConfig(config);
    showToast('Build Your Own Bundle settings updated', 'success');
  };

  const updateLoyaltySettings = (settings: LoyaltySettings) => {
    setLoyaltySettings(settings);
    showToast('Loyalty rules saved', 'success');
  };

  const saveLoyaltyReward = (reward: LoyaltyReward) => {
    setLoyaltyRewards((prev) => {
      const exists = prev.some((r) => r.id === reward.id);
      return exists ? prev.map((r) => (r.id === reward.id ? reward : r)) : [reward, ...prev];
    });
    showToast(`Saved reward "${reward.title}"`, 'success');
  };

  const deleteLoyaltyReward = (rewardId: string) => {
    setLoyaltyRewards((prev) => prev.filter((r) => r.id !== rewardId));
    showToast('Reward removed', 'cocoa');
  };

  const adjustCustomerLoyaltyPoints = (
    customerEmail: string,
    delta: number,
    auditNote: string
  ): boolean => {
    const cleanEmail = customerEmail.trim().toLowerCase();
    const cleanNote = auditNote.trim();
    if (!cleanEmail || !cleanNote || !Number.isInteger(delta) || delta === 0) {
      showToast('Enter a valid email, non-zero whole points, and an audit reason.', 'cocoa');
      return false;
    }

    const existing = loyaltyAccounts.find((a) => a.customerEmail.toLowerCase() === cleanEmail);
    const matchingCustomer = customers.find((c) => c.email.toLowerCase() === cleanEmail);

    const prevBalance = existing?.pointsBalance ?? 0;
    const nextBalance = Math.max(0, prevBalance + delta);
    const actualDelta = nextBalance - prevBalance;
    const nowLabel = '14 Nov 2026';

    const account: CustomerLoyaltyAccount = existing
      ? {
          ...existing,
          pointsBalance: nextBalance,
          lifetimePoints:
            actualDelta > 0 ? existing.lifetimePoints + actualDelta : existing.lifetimePoints,
          updatedAt: nowLabel,
        }
      : {
          customerId: matchingCustomer?.id || `CUST-${Date.now()}`,
          customerName: matchingCustomer?.name || cleanEmail.split('@')[0],
          customerEmail: cleanEmail,
          pointsBalance: nextBalance,
          lifetimePoints: Math.max(0, actualDelta),
          hasEarnedFirstOrderBonus: false,
          updatedAt: nowLabel,
          isDemoSeed: false,
        };

    const tx: LoyaltyTransaction = {
      id: `LTX-${Date.now()}`,
      customerId: account.customerId,
      customerEmail: account.customerEmail,
      type: 'admin_adjustment',
      points: actualDelta,
      balanceAfter: nextBalance,
      description: `Authorised studio points adjustment (${actualDelta > 0 ? `+${actualDelta}` : actualDelta} pts)`,
      auditNote: cleanNote,
      actor: 'admin',
      createdAt: nowLabel,
      isDemoSeed: account.isDemoSeed,
    };

    setLoyaltyAccounts((prev) =>
      existing
        ? prev.map((a) => (a.customerEmail.toLowerCase() === cleanEmail ? account : a))
        : [account, ...prev]
    );
    setLoyaltyTransactions((prev) => [tx, ...prev]);
    showToast(`Adjusted ${cleanEmail} by ${actualDelta > 0 ? `+${actualDelta}` : actualDelta} pts`, 'success');
    return true;
  };

  const resetDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setOrders(INITIAL_ORDERS);
    setReviews(INITIAL_REVIEWS);
    setCoupons(INITIAL_COUPONS);
    setEnquiries(INITIAL_ENQUIRIES);
    setSubscribers(INITIAL_SUBSCRIBERS);
    setBanners(INITIAL_BANNERS);
    setHomepageContent(INITIAL_HOMEPAGE_CONTENT);
    setSiteSettings(INITIAL_SITE_SETTINGS);
    setGiftWraps(INITIAL_GIFT_WRAPS);
    setGiftCardDesigns(INITIAL_GIFT_CARD_DESIGNS);
    setGiftMessageConfig(INITIAL_GIFT_MESSAGE_CONFIG);
    setBundles(INITIAL_BUNDLES);
    setBuildBundleConfig(INITIAL_BUILD_BUNDLE_CONFIG);
    setLoyaltySettings(INITIAL_LOYALTY_SETTINGS);
    setLoyaltyRewards(INITIAL_LOYALTY_REWARDS);
    setLoyaltyAccounts(INITIAL_LOYALTY_ACCOUNTS);
    setLoyaltyTransactions(INITIAL_LOYALTY_TRANSACTIONS);
    showToast('Catalog and storefront content restored', 'cocoa');
  };

  return (
    <StoreContext.Provider
      value={{
        route,
        routeParams,
        navigate,
        goBack,
        products,
        categories,
        orders,
        customers,
        reviews,
        coupons,
        enquiries,
        subscribers,
        banners,
        homepageContent,
        siteSettings,
        giftWraps,
        giftCardDesigns,
        giftMessageConfig,
        giftSelection,
        setGiftSelection,
        clearGiftSelection,
        bundles,
        buildBundleConfig,
        getBundlePricing,
        addBundleToCart,
        addCustomBundleToCart,
        loyaltySettings,
        loyaltyRewards,
        loyaltyAccounts,
        loyaltyTransactions,
        selectedLoyaltyRewardId,
        setSelectedLoyaltyRewardId,
        currentCustomerLoyalty: {
          account: activeLoyaltyAccount,
          currentTier,
          nextTier,
          pointsToNextTier,
          progressPercent,
          transactions: customerTransactions,
        },
        cart,
        cartTotals,
        wishlist,
        currency,
        setCurrency,
        formatPrice,
        customerSession,
        adminLoggedIn,
        appliedCouponCode,
        setAppliedCouponCode,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        toasts,
        showToast,
        getReservedProductQuantity,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isWishlisted,
        moveWishlistToCart,
        loginCustomerDemo,
        registerCustomerDemo,
        logoutCustomerDemo,
        updateCustomerProfile,
        addCustomerAddress,
        removeCustomerAddress,
        addDemoReview,
        submitEnquiry,
        subscribeNewsletter,
        placeOrder,
        fetchOrdersFromBackend,
        fetchOrderByIdFromBackend,
        fetchEnquiriesFromBackend,
        loginAdminDemo,
        logoutAdminDemo,
        saveProduct,
        deleteProduct,
        updateProductStock,
        saveCategory,
        deleteCategory,
        updateOrderStatus,
        saveCoupon,
        toggleCouponActive,
        deleteCoupon,
        updateReviewStatus,
        updateHomepageContent,
        saveBanner,
        updateSiteSettings,
        markEnquiryReplied,
        saveGiftWrap,
        deleteGiftWrap,
        saveGiftCardDesign,
        deleteGiftCardDesign,
        updateGiftMessageConfig,
        saveBundle,
        deleteBundle,
        updateBuildBundleConfig,
        updateLoyaltySettings,
        saveLoyaltyReward,
        deleteLoyaltyReward,
        adjustCustomerLoyaltyPoints,
        resetDemoData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
};
