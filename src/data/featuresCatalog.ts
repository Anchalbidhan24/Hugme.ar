import {
  BuildBundleConfig,
  CustomerLoyaltyAccount,
  GiftCardDesign,
  GiftMessageConfig,
  GiftSelection,
  GiftWrapOption,
  LoyaltyReward,
  LoyaltySettings,
  LoyaltyTransaction,
  PlushieBundle,
} from '../types/store';

export const INITIAL_GIFT_WRAPS: GiftWrapOption[] = [
  {
    id: 'wrap-blush',
    name: 'Classic Blush Pink',
    subtitle: 'Signature blush tissue & dusty-rose satin bow',
    description:
      'Hand-folded soft blush paper sealed with a delicate dusty-rose ribbon bow and wax heart sticker.',
    price: 79,
    paperColor: '#F4DDE3',
    ribbonColor: '#C98F9D',
    pattern: 'dots',
    enabled: true,
    sortOrder: 1,
  },
  {
    id: 'wrap-cream',
    name: 'Soft Cream & Ribbon',
    subtitle: 'Warm ivory keepsake wrap with cocoa-cream weave',
    description:
      'Cream cotton-textured gift paper tied cleanly with a double dusty-rose satin bow for timeless gifting.',
    price: 99,
    paperColor: '#FFF8EF',
    ribbonColor: '#C98F9D',
    pattern: 'stripes',
    enabled: true,
    sortOrder: 2,
  },
  {
    id: 'wrap-pastel',
    name: 'Dreamy Pastel Gift Wrap',
    subtitle: 'Lavender-peach keepsake box & satin ribbon tie',
    description:
      'Rigid pastel keepsake gift box lined in cloud tissue and finished with a soft cocoa-rose ribbon.',
    price: 129,
    paperColor: '#E9E2F5',
    ribbonColor: '#765B55',
    pattern: 'pastel',
    enabled: true,
    sortOrder: 3,
  },
];

export const INITIAL_GIFT_CARD_DESIGNS: GiftCardDesign[] = [
  {
    id: 'card-with-love',
    title: 'With Love',
    subtitle: 'Cream card with delicate blush ribbon border',
    badgeText: 'With Love ♥',
    bgColor: '#FFF8EF',
    borderColor: '#C98F9D',
    ribbonColor: '#F4DDE3',
    accentColor: '#C98F9D',
    enabled: true,
  },
  {
    id: 'card-sending-hugs',
    title: 'Sending Hugs',
    subtitle: 'Dreamy lavender tint with warm cocoa script',
    badgeText: 'Sending Hugs',
    bgColor: '#F8F5FC',
    borderColor: '#C98F9D',
    ribbonColor: '#E9E2F5',
    accentColor: '#765B55',
    enabled: true,
  },
  {
    id: 'card-just-for-you',
    title: 'Just for You',
    subtitle: 'Soft peach glow with stitched frame accents',
    badgeText: 'Just for You',
    bgColor: '#FFF5EE',
    borderColor: '#D9A79C',
    ribbonColor: '#F4DCCB',
    accentColor: '#765B55',
    enabled: true,
  },
  {
    id: 'card-happy-birthday',
    title: 'Happy Birthday',
    subtitle: 'Blush pink celebration card with ribbon bow',
    badgeText: 'Happy Birthday!',
    bgColor: '#FDF2F5',
    borderColor: '#C98F9D',
    ribbonColor: '#F4DDE3',
    accentColor: '#C98F9D',
    enabled: true,
  },
];

export const INITIAL_GIFT_MESSAGE_CONFIG: GiftMessageConfig = {
  enabled: true,
  maxLength: 180,
};

export const DEFAULT_GIFT_SELECTION: GiftSelection = {
  wrapEnabled: false,
  wrapOptionId: INITIAL_GIFT_WRAPS[0].id,
  noteEnabled: false,
  cardDesignId: INITIAL_GIFT_CARD_DESIGNS[0].id,
  recipientName: '',
  senderName: '',
  message: '',
};

export const INITIAL_BUNDLES: PlushieBundle[] = [
  {
    id: 'BND-BESTIE',
    slug: 'bestie-hug-bundle',
    name: 'Bestie Hug Bundle',
    subtitle: 'Buttercream Ribbon Teddy + Pippin Blush Lop Bunny',
    description:
      'Our two most-loved soft companions paired together for cosy sleepovers, best-friend surprises, and twin room decor.',
    tag: 'Bestseller Pair',
    items: [
      { productId: 'HM-101', quantity: 1 },
      { productId: 'HM-102', quantity: 1 },
    ],
    discountPercent: 12,
    active: true,
    featured: true,
  },
  {
    id: 'BND-TEDDY-LOVE',
    slug: 'teddy-love-set',
    name: 'Teddy Love Set',
    subtitle: 'Buttercream Teddy, Sweetheart Bear Couple & Mini Bear Charm',
    description:
      'A heartfelt trio celebrating every kind of love—pairing our signature cream teddy with the matching couple bears and bag charm.',
    tag: 'Gift Favourite',
    items: [
      { productId: 'HM-101', quantity: 1 },
      { productId: 'HM-110', quantity: 1 },
      { productId: 'HM-118', quantity: 1 },
    ],
    discountPercent: 15,
    active: true,
    featured: true,
  },
  {
    id: 'BND-HAPPINESS',
    slug: 'little-happiness-combo',
    name: 'Little Happiness Combo',
    subtitle: 'Pocket Hug Charm Trio, Strawberry Boba & Croissant Plush',
    description:
      'Desk-sized cuteness for sunny mornings—sweet boba, buttery croissant, and pastel pocket charms ready to clip and cuddle.',
    tag: 'Desk & Bag Combo',
    items: [
      { productId: 'HM-113', quantity: 1 },
      { productId: 'HM-123', quantity: 1 },
      { productId: 'HM-116', quantity: 1 },
    ],
    discountPercent: 10,
    active: true,
    featured: true,
  },
  {
    id: 'BND-DREAMY-BOX',
    slug: 'dreamy-gift-box',
    name: 'Dreamy Gift Box',
    subtitle: 'Pippin Bunny, Lilac Dream Cloud Lamb & Moonbeam Cloud',
    description:
      'Pastel bedtime softness curated in blush, cream, and lavender tones for peaceful nights and thoughtful milestone gifts.',
    tag: 'Pastel Box',
    items: [
      { productId: 'HM-102', quantity: 1 },
      { productId: 'HM-108', quantity: 1 },
      { productId: 'HM-119', quantity: 1 },
    ],
    discountPercent: 14,
    active: true,
    featured: true,
  },
  {
    id: 'BND-CUDDLE',
    slug: 'cuddle-collection',
    name: 'Cuddle Collection',
    subtitle: 'Capybara, Calico Kitten, Corgi Pup & Cinnamon Red Panda',
    description:
      'Four charming animal companions gathered in one cosy collector set—crafted with squishy mochi fill and gentle embroidered smiles.',
    tag: 'Collector Set',
    items: [
      { productId: 'HM-103', quantity: 1 },
      { productId: 'HM-104', quantity: 1 },
      { productId: 'HM-105', quantity: 1 },
      { productId: 'HM-109', quantity: 1 },
    ],
    discountPercent: 15,
    active: true,
    featured: false,
  },
];

export const INITIAL_BUILD_BUNDLE_CONFIG: BuildBundleConfig = {
  enabled: true,
  tiers: [
    { count: 2, label: '2 Plushies Duo', discountPercent: 5 },
    { count: 3, label: '3 Plushies Trio', discountPercent: 10 },
    { count: 4, label: '4 Plushies Keepsake Box', discountPercent: 15 },
  ],
};

export const INITIAL_LOYALTY_SETTINGS: LoyaltySettings = {
  programmeName: 'HUGS & HEARTS REWARDS',
  tagline: 'Every order brings you closer to another little hug.',
  enabled: true,
  pointsPer100Inr: 5,
  firstOrderBonusPoints: 100,
  eligibleOrderStatuses: ['Delivered'],
  pointsExpiryMonths: 12,
  tiers: [
    {
      id: 'tier-warm-hug',
      name: 'Warm Hug',
      minPoints: 0,
      perk: 'Earn 5 Hug Points per ₹100 on eligible completed orders',
    },
    {
      id: 'tier-blush-bestie',
      name: 'Blush Bestie',
      minPoints: 300,
      perk: 'Early access to seasonal drops + complimentary gift note upgrades',
    },
    {
      id: 'tier-cuddle-vip',
      name: 'Cuddle Collector',
      minPoints: 800,
      perk: 'Priority dispatch & exclusive birthday bonus reward eligibility',
    },
  ],
};

export const INITIAL_LOYALTY_REWARDS: LoyaltyReward[] = [
  {
    id: 'RWD-100',
    title: '₹100 Hugs Voucher',
    description: 'Take ₹100 off eligible orders above ₹799.',
    pointsRequired: 150,
    rewardType: 'discount_flat',
    discountValue: 100,
    minOrder: 799,
    active: true,
  },
  {
    id: 'RWD-WRAP',
    title: 'Complimentary Gift Wrapping',
    description: 'Enjoy any HUGME.AR signature gift wrap at ₹0.',
    pointsRequired: 120,
    rewardType: 'free_gift_wrap',
    discountValue: 129,
    minOrder: 599,
    active: true,
  },
  {
    id: 'RWD-SHIP',
    title: 'Free Express Shipping',
    description: 'Complimentary shipping on orders of any cart value.',
    pointsRequired: 100,
    rewardType: 'free_shipping',
    discountValue: 99,
    minOrder: 399,
    active: true,
  },
  {
    id: 'RWD-250',
    title: '₹250 Keepsake Credit',
    description: 'Redeem ₹250 off plushies & bundles on orders above ₹1,599.',
    pointsRequired: 350,
    rewardType: 'discount_flat',
    discountValue: 250,
    minOrder: 1599,
    active: true,
  },
];

export const INITIAL_LOYALTY_ACCOUNTS: CustomerLoyaltyAccount[] = [
  {
    customerId: 'CUST-1001',
    customerName: 'Ananya Sharma',
    customerEmail: 'ananya.sharma@hugme-archive.local',
    pointsBalance: 195,
    lifetimePoints: 195,
    hasEarnedFirstOrderBonus: true,
    updatedAt: '25 Oct 2026',
    isDemoSeed: true,
  },
  {
    customerId: 'CUST-1003',
    customerName: 'Kavya Mehta',
    customerEmail: 'kavya.mehta@hugme-archive.local',
    pointsBalance: 140,
    lifetimePoints: 140,
    hasEarnedFirstOrderBonus: true,
    updatedAt: '12 Nov 2026',
    isDemoSeed: true,
  },
];

export const INITIAL_LOYALTY_TRANSACTIONS: LoyaltyTransaction[] = [
  {
    id: 'LTX-1001',
    customerId: 'CUST-1001',
    customerEmail: 'ananya.sharma@hugme-archive.local',
    orderId: 'HUG-2026-7905',
    type: 'first_order_bonus',
    points: 100,
    balanceAfter: 100,
    description: 'First completed purchase welcome bonus (HUG-2026-7905)',
    actor: 'system',
    createdAt: '25 Oct 2026',
    isDemoSeed: true,
  },
  {
    id: 'LTX-1002',
    customerId: 'CUST-1001',
    customerEmail: 'ananya.sharma@hugme-archive.local',
    orderId: 'HUG-2026-7905',
    type: 'earn',
    points: 95,
    balanceAfter: 195,
    description: 'Earned points for delivered order HUG-2026-7905',
    actor: 'system',
    createdAt: '25 Oct 2026',
    isDemoSeed: true,
  },
  {
    id: 'LTX-1003',
    customerId: 'CUST-1003',
    customerEmail: 'kavya.mehta@hugme-archive.local',
    type: 'first_order_bonus',
    points: 140,
    balanceAfter: 140,
    description: 'Completed purchase rewards summary',
    actor: 'system',
    createdAt: '12 Nov 2026',
    isDemoSeed: true,
  },
];
