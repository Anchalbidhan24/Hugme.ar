export type RouteKey =
  | 'home'
  | 'shop'
  | 'product'
  | 'categories'
  | 'new-arrivals'
  | 'bestsellers'
  | 'gift-collection'
  | 'bundles'
  | 'loyalty'
  | 'wishlist'
  | 'cart'
  | 'checkout'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'account'
  | 'orders'
  | 'order-tracking'
  | 'about'
  | 'contact'
  | 'faq'
  | 'privacy-policy'
  | 'terms'
  | 'shipping-policy'
  | 'return-policy'
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-products'
  | 'admin-product-form'
  | 'admin-categories'
  | 'admin-bundles'
  | 'admin-gift-wrapping'
  | 'admin-gift-messages'
  | 'admin-loyalty'
  | 'admin-orders'
  | 'admin-customers'
  | 'admin-inventory'
  | 'admin-coupons'
  | 'admin-reviews'
  | 'admin-homepage'
  | 'admin-banners'
  | 'admin-subscribers'
  | 'admin-enquiries'
  | 'admin-settings';

export type CurrencyCode = 'INR' | 'USD' | 'EUR';

export interface Product {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  price: number; // INR
  originalPrice: number; // INR
  discount: number; // percentage
  rating: number;
  reviewCount: number;
  sizes: string[];
  defaultSize: string;
  material: string;
  colors: { name: string; hex: string }[];
  defaultColor: string;
  stock: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  isNewArrival: boolean;
  isBestseller: boolean;
  giftTag?: 'Birthday' | 'Couple' | 'Friendship' | 'Surprise';
  careInstructions: string;
  dimensions: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  accentColor: string;
  featured: boolean;
}

export interface CartBundleComponent {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  itemType?: 'product' | 'bundle' | 'custom-bundle';
  bundleId?: string;
  bundleItems?: CartBundleComponent[];
}

export interface GiftWrapOption {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number; // INR
  paperColor: string;
  ribbonColor: string;
  pattern: 'dots' | 'stripes' | 'pastel';
  enabled: boolean;
  sortOrder: number;
}

export interface GiftCardDesign {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  bgColor: string;
  borderColor: string;
  ribbonColor: string;
  accentColor: string;
  enabled: boolean;
}

export interface GiftMessageConfig {
  enabled: boolean;
  maxLength: number;
}

export interface GiftSelection {
  wrapEnabled: boolean;
  wrapOptionId: string | null;
  noteEnabled: boolean;
  cardDesignId: string | null;
  recipientName: string;
  senderName: string;
  message: string;
}

export interface BundleItemSpec {
  productId: string;
  quantity: number;
}

export interface PlushieBundle {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  tag?: string;
  items: BundleItemSpec[];
  discountPercent: number; // 0 = no discount configured
  overridePrice?: number; // optional fixed discounted price
  active: boolean;
  featured: boolean;
}

export interface BuildBundleTier {
  count: number;
  label: string;
  discountPercent: number;
}

export interface BuildBundleConfig {
  enabled: boolean;
  tiers: BuildBundleTier[];
}

export interface LoyaltyTier {
  id: string;
  name: string;
  minPoints: number;
  perk: string;
}

export interface LoyaltySettings {
  programmeName: string;
  tagline: string;
  enabled: boolean;
  pointsPer100Inr: number;
  firstOrderBonusPoints: number;
  eligibleOrderStatuses: OrderStatus[];
  pointsExpiryMonths: number;
  tiers: LoyaltyTier[];
}

export interface LoyaltyReward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  rewardType: 'discount_flat' | 'free_shipping' | 'free_gift_wrap';
  discountValue: number;
  minOrder: number;
  active: boolean;
}

export interface CustomerLoyaltyAccount {
  customerId: string;
  customerName: string;
  customerEmail: string;
  pointsBalance: number;
  lifetimePoints: number;
  hasEarnedFirstOrderBonus: boolean;
  updatedAt: string;
  isDemoSeed?: boolean;
}

export interface LoyaltyTransaction {
  id: string;
  customerId: string;
  customerEmail: string;
  orderId?: string;
  type: 'earn' | 'first_order_bonus' | 'redeem' | 'refund_reversal' | 'admin_adjustment';
  points: number;
  balanceAfter: number;
  description: string;
  auditNote?: string;
  actor: 'system' | 'customer' | 'admin';
  createdAt: string;
  isDemoSeed?: boolean;
}

export interface CustomerAddress {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface CustomerSession {
  isLoggedIn: boolean;
  id: string;
  name: string;
  email: string;
  phone: string;
  memberSince: string;
  addresses: CustomerAddress[];
}

export interface OrderItemSummary {
  productId: string;
  name: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  itemType?: 'product' | 'bundle' | 'custom-bundle';
  bundleItems?: CartBundleComponent[];
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Packed with Love'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

export interface DemoOrder {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  date: string;
  items: OrderItemSummary[];
  subtotal: number;
  giftWrapFee?: number;
  discount: number;
  loyaltyDiscount?: number;
  loyaltyRewardTitle?: string;
  loyaltyPointsRedeemed?: number;
  shipping: number;
  total: number;
  paymentMethod: 'Cash on Delivery' | 'Online Payment';
  status: OrderStatus;
  shippingAddress: string;
  giftSelection?: {
    wrapName?: string;
    wrapPrice?: number;
    cardDesignTitle?: string;
    recipientName?: string;
    senderName?: string;
    message?: string;
  };
  trackingSteps: { title: string; date: string; completed: boolean }[];
  isDemoSeed?: boolean;
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  joinedDate: string;
  status: 'Active' | 'VIP';
  isDemoSeed?: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  city: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Hidden';
  isDemoSeed?: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrder: number;
  active: boolean;
  expiryDate: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'New' | 'Replied';
  isDemoSeed?: boolean;
}

export interface Subscriber {
  id: string;
  email: string;
  date: string;
  source: string;
  isDemoSeed?: boolean;
}

export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  targetRoute: RouteKey;
  image: string;
  active: boolean;
}

export interface HomepageContent {
  announcementText: string;
  heroHeading: string;
  heroDescription: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  storyHeading: string;
  storyDescription: string;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  codEnabled: boolean;
  onlinePayDemoEnabled: boolean;
  storeNotice: string;
}
