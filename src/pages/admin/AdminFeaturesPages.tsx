import React, { useState } from 'react';
import {
  Award,
  Check,
  Edit3,
  Gift,
  Heart,
  Layers,
  MailOpen,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { GiftWrapVisual, GreetingCardPreview } from '../../components/GiftExperiencePanel';
import {
  BundleItemSpec,
  GiftCardDesign,
  GiftWrapOption,
  LoyaltyReward,
  OrderStatus,
  PlushieBundle,
} from '../../types/store';

/* =========================================================
   1. GIFT WRAPPING MANAGEMENT
   ========================================================= */
export const AdminGiftWrappingPage: React.FC = () => {
  const { giftWraps, saveGiftWrap, deleteGiftWrap, formatPrice } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(99);
  const [paperColor, setPaperColor] = useState('#F4DDE3');
  const [ribbonColor, setRibbonColor] = useState('#C98F9D');
  const [pattern, setPattern] = useState<'dots' | 'stripes' | 'pastel'>('dots');
  const [enabled, setEnabled] = useState(true);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setSubtitle('');
    setDescription('');
    setPrice(99);
    setPaperColor('#F4DDE3');
    setRibbonColor('#C98F9D');
    setPattern('dots');
    setEnabled(true);
  };

  const handleEdit = (w: GiftWrapOption) => {
    setEditingId(w.id);
    setName(w.name);
    setSubtitle(w.subtitle);
    setDescription(w.description);
    setPrice(w.price);
    setPaperColor(w.paperColor);
    setRibbonColor(w.ribbonColor);
    setPattern(w.pattern);
    setEnabled(w.enabled);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const payload: GiftWrapOption = {
      id: editingId || `wrap-${Date.now()}`,
      name: name.trim(),
      subtitle: subtitle.trim() || 'Signature satin-ribbon keepsake wrapping',
      description:
        description.trim() ||
        'Carefully folded pastel wrapping sealed with a dusty-rose ribbon bow.',
      price: Math.max(0, Number(price)),
      paperColor,
      ribbonColor,
      pattern,
      enabled,
      sortOrder: editingId
        ? giftWraps.find((g) => g.id === editingId)?.sortOrder ?? giftWraps.length + 1
        : giftWraps.length + 1,
    };
    saveGiftWrap(payload);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#765B55]">
          Gift Wrapping Management
        </h1>
        <p className="font-body text-sm text-[#765B55]/75">
          Add, edit, price, and enable wrapping styles shown in Cart and Checkout.
        </p>
      </div>

      {/* Form + Live Visual */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
      >
        <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Style Name (e.g. Velvet Rose)"
            className="px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs"
          />
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Short Subtitle"
            className="px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs sm:col-span-2"
          />
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Price (₹)"
            className="px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs tabular-nums"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Full wrapping description"
            className="px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs sm:col-span-2"
          />
          <select
            value={pattern}
            onChange={(e) => setPattern(e.target.value as 'dots' | 'stripes' | 'pastel')}
            className="px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs"
          >
            <option value="dots">Dotted Tissue</option>
            <option value="stripes">Satin Stripes</option>
            <option value="pastel">Pastel Box</option>
          </select>
          <div className="flex items-center gap-3 px-2">
            <label className="flex items-center gap-1.5 text-xs font-ui text-[#765B55]">
              Paper
              <input
                type="color"
                value={paperColor}
                onChange={(e) => setPaperColor(e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border-0"
              />
            </label>
            <label className="flex items-center gap-1.5 text-xs font-ui text-[#765B55]">
              Ribbon
              <input
                type="color"
                value={ribbonColor}
                onChange={(e) => setRibbonColor(e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border-0"
              />
            </label>
          </div>
          <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap items-center justify-between gap-3 pt-1">
            <label className="inline-flex items-center gap-2 text-xs font-ui text-[#765B55] cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
              />
              <span>Visible &amp; selectable in Cart / Checkout</span>
            </label>
            <div className="flex gap-2">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-xl border border-[#765B55]/20 text-xs font-ui text-[#765B55] cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#C98F9D] text-white font-ui text-xs font-medium cursor-pointer"
              >
                {editingId ? 'Save Wrapping Style' : '+ Add Wrapping Style'}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col items-center justify-center p-4 rounded-2xl bg-[#FFF8EF] border border-[#765B55]/10 gap-2">
          <GiftWrapVisual
            wrap={{
              name: name || 'Preview',
              paperColor,
              ribbonColor,
              pattern,
            }}
          />
          <p className="font-ui text-xs font-medium text-[#765B55]">{name || 'Live Box Preview'}</p>
          <p className="font-ui text-[11px] text-[#C98F9D] tabular-nums">+{formatPrice(price)}</p>
        </div>
      </form>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {giftWraps.map((w) => (
          <div
            key={w.id}
            className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-5 flex flex-col justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <GiftWrapVisual wrap={w} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold text-[#765B55]">{w.name}</h3>
                  <span className="font-ui text-xs font-semibold text-[#C98F9D] tabular-nums">
                    {formatPrice(w.price)}
                  </span>
                </div>
                <p className="font-body text-xs text-[#765B55]/75 mt-1">{w.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#765B55]/10">
              <button
                type="button"
                onClick={() => saveGiftWrap({ ...w, enabled: !w.enabled })}
                className={`px-3 py-1 rounded-lg text-[11px] font-ui font-medium cursor-pointer ${
                  w.enabled ? 'bg-[#F4DDE3] text-[#765B55]' : 'bg-[#FFF8EF] text-[#765B55]/50'
                }`}
              >
                {w.enabled ? 'Active' : 'Disabled'}
              </button>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleEdit(w)}
                  className="p-1.5 rounded-lg text-[#765B55]/70 hover:text-[#C98F9D] cursor-pointer"
                  aria-label={`Edit ${w.name}`}
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteGiftWrap(w.id)}
                  className="p-1.5 rounded-lg text-[#765B55]/50 hover:text-[#C98F9D] cursor-pointer"
                  aria-label={`Delete ${w.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================
   2. GIFT MESSAGE & GREETING CARD MANAGEMENT
   ========================================================= */
export const AdminGiftMessagesPage: React.FC = () => {
  const {
    giftCardDesigns,
    giftMessageConfig,
    saveGiftCardDesign,
    deleteGiftCardDesign,
    updateGiftMessageConfig,
    orders,
  } = useStore();

  const [maxLen, setMaxLen] = useState(giftMessageConfig.maxLength);
  const [notesEnabled, setNotesEnabled] = useState(giftMessageConfig.enabled);
  const [showArchive, setShowArchive] = useState(false);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [bgColor, setBgColor] = useState('#FFF8EF');
  const [ribbonColor, setRibbonColor] = useState('#F4DDE3');
  const [accentColor, setAccentColor] = useState('#C98F9D');
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateGiftMessageConfig({
      enabled: notesEnabled,
      maxLength: Math.max(40, Math.min(500, Number(maxLen))),
    });
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const card: GiftCardDesign = {
      id: editingCardId || `card-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || 'Soft keepsake greeting card',
      badgeText: badgeText.trim() || title.trim(),
      bgColor,
      borderColor: accentColor,
      ribbonColor,
      accentColor,
      enabled: true,
    };
    saveGiftCardDesign(card);
    setEditingCardId(null);
    setTitle('');
    setSubtitle('');
    setBadgeText('');
  };

  const ordersWithNotes = orders.filter(
    (o) =>
      (showArchive || !o.isDemoSeed) &&
      (o.giftSelection?.message || o.giftSelection?.cardDesignTitle)
  );
  const archiveNotesCount = orders.filter(
    (o) => o.isDemoSeed && (o.giftSelection?.message || o.giftSelection?.cardDesignTitle)
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#765B55]">
          Gift Message &amp; Card Management
        </h1>
        <p className="font-body text-sm text-[#765B55]/75">
          Configure greeting card designs, character limits, and inspect customer gift notes attached to orders.
        </p>
      </div>

      {/* Global Gift Note Config */}
      <form
        onSubmit={handleSaveConfig}
        className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-6 flex flex-wrap items-end justify-between gap-4"
      >
        <div className="flex flex-wrap items-center gap-6">
          <label className="inline-flex items-center gap-2 text-xs font-ui font-medium text-[#765B55] cursor-pointer">
            <input
              type="checkbox"
              checked={notesEnabled}
              onChange={(e) => setNotesEnabled(e.target.checked)}
            />
            <span>Enable Personalised Gift Notes in Cart &amp; Checkout</span>
          </label>
          <div>
            <label className="block font-ui text-[11px] text-[#765B55]/70 mb-1">
              Message Character Limit
            </label>
            <input
              type="number"
              min={40}
              max={500}
              value={maxLen}
              onChange={(e) => setMaxLen(Number(e.target.value))}
              className="w-28 px-3 py-1.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs tabular-nums"
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-5 py-2 rounded-xl bg-[#C98F9D] text-white font-ui text-xs font-medium cursor-pointer"
        >
          Save Note Settings
        </button>
      </form>

      {/* Card Design Builder */}
      <form
        onSubmit={handleSaveCard}
        className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
      >
        <div className="lg:col-span-6 space-y-3">
          <h2 className="font-display text-xl font-semibold text-[#765B55]">
            {editingCardId ? 'Edit Greeting Card Design' : 'Add Greeting Card Design'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Card Title (e.g. Congratulations)"
              className="px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs"
            />
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              placeholder="Header Script (e.g. Warmest Wishes ♥)"
              className="px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs"
            />
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Subtitle description"
              className="px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs sm:col-span-2"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-1.5 text-xs font-ui text-[#765B55]">
              Paper
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-7 h-7 rounded border-0 cursor-pointer"
              />
            </label>
            <label className="flex items-center gap-1.5 text-xs font-ui text-[#765B55]">
              Ribbon
              <input
                type="color"
                value={ribbonColor}
                onChange={(e) => setRibbonColor(e.target.value)}
                className="w-7 h-7 rounded border-0 cursor-pointer"
              />
            </label>
            <label className="flex items-center gap-1.5 text-xs font-ui text-[#765B55]">
              Accent
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-7 h-7 rounded border-0 cursor-pointer"
              />
            </label>
            <button
              type="submit"
              className="ml-auto px-5 py-2 rounded-xl bg-[#C98F9D] text-white font-ui text-xs font-medium cursor-pointer"
            >
              {editingCardId ? 'Update Design' : '+ Add Card Design'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-6">
          <GreetingCardPreview
            design={{
              id: 'preview',
              title: title || 'Card Preview',
              subtitle: subtitle || 'Preview',
              badgeText: badgeText || title || 'With Love ♥',
              bgColor,
              borderColor: accentColor,
              ribbonColor,
              accentColor,
              enabled: true,
            }}
            recipientName="Aarohi"
            senderName="Meera"
            message="Wishing you the softest mornings and biggest hugs!"
          />
        </div>
      </form>

      {/* Card Templates List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {giftCardDesigns.map((c) => (
          <div
            key={c.id}
            className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-4 space-y-3"
          >
            <div className="h-2 rounded-full" style={{ backgroundColor: c.ribbonColor }} />
            <div>
              <h3 className="font-display text-lg font-semibold text-[#765B55]">{c.title}</h3>
              <p className="font-body text-xs text-[#765B55]/70 line-clamp-2">{c.subtitle}</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#765B55]/10">
              <button
                type="button"
                onClick={() => saveGiftCardDesign({ ...c, enabled: !c.enabled })}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-ui font-medium cursor-pointer ${
                  c.enabled ? 'bg-[#F4DDE3] text-[#765B55]' : 'bg-[#FFF8EF] text-[#765B55]/50'
                }`}
              >
                {c.enabled ? 'Enabled' : 'Disabled'}
              </button>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCardId(c.id);
                    setTitle(c.title);
                    setSubtitle(c.subtitle);
                    setBadgeText(c.badgeText);
                    setBgColor(c.bgColor);
                    setRibbonColor(c.ribbonColor);
                    setAccentColor(c.accentColor);
                  }}
                  className="p-1.5 text-[#765B55]/70 hover:text-[#C98F9D] cursor-pointer"
                  aria-label={`Edit ${c.title}`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteGiftCardDesign(c.id)}
                  className="p-1.5 text-[#765B55]/50 hover:text-[#C98F9D] cursor-pointer"
                  aria-label={`Delete ${c.title}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gift Notes Attached to Orders */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold text-[#765B55] flex items-center gap-2">
            <MailOpen className="w-5 h-5 text-[#C98F9D]" />
            <span>Personalised Gift Notes on Orders</span>
          </h2>
          {archiveNotesCount > 0 && (
            <button
              type="button"
              onClick={() => setShowArchive((prev) => !prev)}
              className="px-3.5 py-1.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs font-ui text-[#765B55] cursor-pointer"
            >
              {showArchive
                ? 'Hide Reference Archive'
                : `Show Reference Archive (${archiveNotesCount})`}
            </button>
          )}
        </div>

        {ordersWithNotes.length === 0 ? (
          <p className="font-body text-xs text-[#765B55]/70">
            No live customer gift notes recorded yet. Order gift messages will appear here once backend order submission connects.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ordersWithNotes.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#765B55]/10 space-y-2 text-xs font-body"
              >
                <div className="flex items-center justify-between font-ui font-semibold text-[#765B55]">
                  <span>{ord.id} · {ord.customerName}</span>
                  <span className="text-[#C98F9D]">{ord.giftSelection?.cardDesignTitle}</span>
                </div>
                <p className="text-[#765B55]/75">
                  To: <strong>{ord.giftSelection?.recipientName || 'Recipient'}</strong> · From:{' '}
                  <strong>{ord.giftSelection?.senderName || ord.customerName}</strong>
                </p>
                <p className="italic text-[#765B55]">“{ord.giftSelection?.message}”</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================
   3. BUNDLE MANAGEMENT
   ========================================================= */
export const AdminBundlesPage: React.FC = () => {
  const {
    bundles,
    products,
    getBundlePricing,
    saveBundle,
    deleteBundle,
    buildBundleConfig,
    updateBuildBundleConfig,
    formatPrice,
  } = useStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('Gift Set');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [overridePrice, setOverridePrice] = useState<string>('');
  const [selectedSpecs, setSelectedSpecs] = useState<BundleItemSpec[]>([
    { productId: products[0]?.id || 'HM-101', quantity: 1 },
    { productId: products[1]?.id || 'HM-102', quantity: 1 },
  ]);

  const toggleProductInBundle = (productId: string) => {
    setSelectedSpecs((prev) => {
      const exists = prev.find((s) => s.productId === productId);
      if (exists) return prev.filter((s) => s.productId !== productId);
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const handleSaveBundle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || selectedSpecs.length < 2) return;
    const cleanOverride = overridePrice.trim() ? Number(overridePrice) : undefined;
    const payload: PlushieBundle = {
      id: editingId || `BND-${Date.now()}`,
      slug: name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-'),
      name: name.trim(),
      subtitle: subtitle.trim() || `${selectedSpecs.length} curated companions`,
      description: description.trim() || 'Handpicked plushie combo set.',
      tag: tag.trim() || undefined,
      items: selectedSpecs,
      discountPercent: Math.max(0, Math.min(60, Number(discountPercent))),
      overridePrice: cleanOverride && cleanOverride > 0 ? cleanOverride : undefined,
      active: true,
      featured: true,
    };
    saveBundle(payload);
    setEditingId(null);
    setName('');
    setSubtitle('');
    setDescription('');
    setOverridePrice('');
  };

  const startEdit = (b: PlushieBundle) => {
    setEditingId(b.id);
    setName(b.name);
    setSubtitle(b.subtitle);
    setDescription(b.description);
    setTag(b.tag || '');
    setDiscountPercent(b.discountPercent);
    setOverridePrice(b.overridePrice ? String(b.overridePrice) : '');
    setSelectedSpecs(b.items);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#765B55]">
          Plushie Bundles &amp; Combo Offers
        </h1>
        <p className="font-body text-sm text-[#765B55]/75">
          Create curated plushie bundles, adjust bundle discounts, and configure Build Your Own Bundle tiers.
        </p>
      </div>

      {/* Create / Edit Curated Bundle */}
      <form
        onSubmit={handleSaveBundle}
        className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-6 space-y-5"
      >
        <h2 className="font-display text-xl font-semibold text-[#765B55]">
          {editingId ? 'Edit Plushie Bundle' : 'Create New Plushie Bundle'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Bundle Name"
            className="px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs"
          />
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Included items subtitle"
            className="px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs sm:col-span-2"
          />
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Tag (e.g. Gift Favourite)"
            className="px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Editorial description"
            className="px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs sm:col-span-2"
          />
          <div>
            <label className="block font-ui text-[10px] text-[#765B55]/70 mb-0.5">
              Discount % (0 = Combined Price)
            </label>
            <input
              type="number"
              min={0}
              max={60}
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs tabular-nums"
            />
          </div>
          <div>
            <label className="block font-ui text-[10px] text-[#765B55]/70 mb-0.5">
              Optional Fixed Price (₹)
            </label>
            <input
              type="number"
              min={0}
              value={overridePrice}
              onChange={(e) => setOverridePrice(e.target.value)}
              placeholder="Leave blank to use %"
              className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs tabular-nums"
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-ui text-xs font-medium text-[#765B55]">
            Select Plushies in Bundle (min 2 products):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1">
            {products.map((prod) => {
              const spec = selectedSpecs.find((s) => s.productId === prod.id);
              return (
                <div
                  key={prod.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs ${
                    spec
                      ? 'border-[#C98F9D] bg-[#F4DDE3]/30'
                      : 'border-[#765B55]/10 bg-[#FFF8EF]/60'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleProductInBundle(prod.id)}
                    className="flex items-center gap-2 text-left min-w-0 flex-1 cursor-pointer"
                  >
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                        spec
                          ? 'bg-[#C98F9D] border-[#C98F9D] text-white'
                          : 'border-[#765B55]/30 bg-[#FFFFFF]'
                      }`}
                    >
                      {spec && <Check className="w-3 h-3" />}
                    </span>
                    <span className="truncate font-ui text-[#765B55]">{prod.name}</span>
                  </button>
                  {spec && (
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={spec.quantity}
                      onChange={(e) =>
                        setSelectedSpecs((prev) =>
                          prev.map((s) =>
                            s.productId === prod.id
                              ? { ...s, quantity: Math.max(1, Number(e.target.value)) }
                              : s
                          )
                        )
                      }
                      className="w-12 px-1.5 py-1 rounded-lg bg-[#FFFFFF] border border-[#765B55]/15 text-center text-xs tabular-nums"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setName('');
                setSubtitle('');
                setDescription('');
              }}
              className="px-4 py-2 rounded-xl border border-[#765B55]/20 text-xs font-ui cursor-pointer"
            >
              Cancel Edit
            </button>
          )}
          <button
            type="submit"
            disabled={selectedSpecs.length < 2}
            className="px-5 py-2.5 rounded-xl bg-[#C98F9D] text-white font-ui text-xs font-medium disabled:opacity-45 cursor-pointer"
          >
            {editingId ? 'Save Bundle Changes' : '+ Create Bundle'}
          </button>
        </div>
      </form>

      {/* Curated Bundles Table */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#765B55]/10 bg-[#FFF8EF]/70 text-[11px] font-ui uppercase text-[#765B55]/70">
                <th className="py-3 px-4">Bundle</th>
                <th className="py-3 px-4">Included Plushies</th>
                <th className="py-3 px-4 text-right">Combined</th>
                <th className="py-3 px-4 text-right">Bundle Price</th>
                <th className="py-3 px-4 text-right">Set Stock</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#765B55]/8 text-xs font-body">
              {bundles.map((b) => {
                const pricing = getBundlePricing(b);
                return (
                  <tr key={b.id}>
                    <td className="py-3 px-4">
                      <p className="font-display text-sm font-semibold text-[#765B55]">{b.name}</p>
                      <p className="text-[11px] text-[#C98F9D]">
                        {b.tag || 'Bundle'} · {pricing.savings > 0 ? `${pricing.discountPercentEffective}% off` : 'Standard'}
                      </p>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-[#765B55]/80 line-clamp-2">
                        {pricing.components
                          .map((c) => `${c.quantity}× ${c.product.name}`)
                          .join(', ')}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-right font-ui tabular-nums text-[#765B55]/60">
                      {formatPrice(pricing.combinedPrice)}
                    </td>
                    <td className="py-3 px-4 text-right font-ui font-semibold tabular-nums text-[#765B55]">
                      {formatPrice(pricing.finalPrice)}
                    </td>
                    <td className="py-3 px-4 text-right font-ui tabular-nums">
                      {pricing.availableStock} sets
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => saveBundle({ ...b, active: !b.active })}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-ui mr-2 cursor-pointer ${
                          b.active ? 'bg-[#F4DDE3] text-[#765B55]' : 'bg-[#FFF8EF] text-[#765B55]/50'
                        }`}
                      >
                        {b.active ? 'Active' : 'Paused'}
                      </button>
                      <button
                        type="button"
                        onClick={() => startEdit(b)}
                        className="p-1.5 text-[#765B55]/70 hover:text-[#C98F9D] cursor-pointer"
                        aria-label={`Edit ${b.name}`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteBundle(b.id)}
                        className="p-1.5 text-[#765B55]/50 hover:text-[#C98F9D] cursor-pointer"
                        aria-label={`Delete ${b.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Build Your Own Bundle Tiers Config */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#765B55] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#C98F9D]" />
              <span>Build Your Own Bundle Settings</span>
            </h2>
            <p className="font-body text-xs text-[#765B55]/75">
              Control custom builder availability and tier savings on the Bundles page.
            </p>
          </div>
          <label className="inline-flex items-center gap-2 text-xs font-ui font-medium text-[#765B55] cursor-pointer">
            <input
              type="checkbox"
              checked={buildBundleConfig.enabled}
              onChange={(e) =>
                updateBuildBundleConfig({ ...buildBundleConfig, enabled: e.target.checked })
              }
            />
            <span>Custom Builder Enabled</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {buildBundleConfig.tiers.map((tier) => (
            <div
              key={tier.count}
              className="p-4 rounded-xl bg-[#FFF8EF] border border-[#765B55]/10 space-y-2"
            >
              <p className="font-ui text-xs font-semibold text-[#765B55]">{tier.label}</p>
              <div className="flex items-center justify-between gap-2">
                <span className="font-body text-xs text-[#765B55]/75">Discount %</span>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={tier.discountPercent}
                  onChange={(e) =>
                    updateBuildBundleConfig({
                      ...buildBundleConfig,
                      tiers: buildBundleConfig.tiers.map((t) =>
                        t.count === tier.count
                          ? { ...t, discountPercent: Math.max(0, Number(e.target.value)) }
                          : t
                      ),
                    })
                  }
                  className="w-20 px-2.5 py-1 rounded-lg bg-[#FFFFFF] border border-[#765B55]/15 text-xs tabular-nums"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   4. LOYALTY PROGRAMME MANAGEMENT
   ========================================================= */
export const AdminLoyaltyPage: React.FC = () => {
  const {
    loyaltySettings,
    updateLoyaltySettings,
    loyaltyRewards,
    saveLoyaltyReward,
    deleteLoyaltyReward,
    loyaltyAccounts,
    loyaltyTransactions,
    adjustCustomerLoyaltyPoints,
    formatPrice,
  } = useStore();

  const [pointsPer100, setPointsPer100] = useState(loyaltySettings.pointsPer100Inr);
  const [firstOrderBonus, setFirstOrderBonus] = useState(loyaltySettings.firstOrderBonusPoints);
  const [expiryMonths, setExpiryMonths] = useState(loyaltySettings.pointsExpiryMonths);
  const [progEnabled, setProgEnabled] = useState(loyaltySettings.enabled);
  const [eligibleStatuses, setEligibleStatuses] = useState<OrderStatus[]>(
    loyaltySettings.eligibleOrderStatuses
  );

  // Reward creation form
  const [rwdTitle, setRwdTitle] = useState('');
  const [rwdDesc, setRwdDesc] = useState('');
  const [rwdPoints, setRwdPoints] = useState(150);
  const [rwdType, setRwdType] = useState<LoyaltyReward['rewardType']>('discount_flat');
  const [rwdDiscountValue, setRwdDiscountValue] = useState(100);
  const [rwdMinOrder, setRwdMinOrder] = useState(799);

  // Authorised manual adjustment
  const [adjEmail, setAdjEmail] = useState('');
  const [adjDelta, setAdjDelta] = useState<number>(50);
  const [adjNote, setAdjNote] = useState('');
  const [showArchive, setShowArchive] = useState(false);

  const toggleStatus = (st: OrderStatus) => {
    setEligibleStatuses((prev) =>
      prev.includes(st) ? prev.filter((x) => x !== st) : [...prev, st]
    );
  };

  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault();
    updateLoyaltySettings({
      ...loyaltySettings,
      enabled: progEnabled,
      pointsPer100Inr: Math.max(0, Number(pointsPer100)),
      firstOrderBonusPoints: Math.max(0, Number(firstOrderBonus)),
      pointsExpiryMonths: Math.max(1, Number(expiryMonths)),
      eligibleOrderStatuses: eligibleStatuses.length > 0 ? eligibleStatuses : ['Delivered'],
    });
  };

  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rwdTitle.trim()) return;
    saveLoyaltyReward({
      id: `RWD-${Date.now()}`,
      title: rwdTitle.trim(),
      description: rwdDesc.trim() || 'HUGS & HEARTS REWARDS member perk.',
      pointsRequired: Math.max(10, Number(rwdPoints)),
      rewardType: rwdType,
      discountValue: Math.max(0, Number(rwdDiscountValue)),
      minOrder: Math.max(0, Number(rwdMinOrder)),
      active: true,
    });
    setRwdTitle('');
    setRwdDesc('');
  };

  const handleAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = adjustCustomerLoyaltyPoints(adjEmail, Number(adjDelta), adjNote);
    if (ok) {
      setAdjNote('');
    }
  };

  const displayedAccounts = showArchive
    ? loyaltyAccounts
    : loyaltyAccounts.filter((a) => !a.isDemoSeed);
  const archiveAccountCount = loyaltyAccounts.filter((a) => a.isDemoSeed).length;

  const displayedTx = showArchive
    ? loyaltyTransactions
    : loyaltyTransactions.filter((t) => !t.isDemoSeed);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#765B55]">
            Loyalty Programme Management
          </h1>
          <p className="font-body text-sm text-[#765B55]/75">
            Configure {loyaltySettings.programmeName}, redeemable rewards, and audited customer balances.
          </p>
        </div>
        {archiveAccountCount > 0 && (
          <button
            type="button"
            onClick={() => setShowArchive((prev) => !prev)}
            className="px-3.5 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs font-ui text-[#765B55] hover:border-[#C98F9D] cursor-pointer"
          >
            {showArchive
              ? 'Hide Reference Archive'
              : `Show Reference Archive (${archiveAccountCount})`}
          </button>
        )}
      </div>

      {/* Rules Config */}
      <form
        onSubmit={handleSaveRules}
        className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-6 space-y-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-[#765B55] flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#C98F9D]" />
            <span>Earning &amp; Expiry Rules</span>
          </h2>
          <label className="inline-flex items-center gap-2 text-xs font-ui text-[#765B55] cursor-pointer">
            <input
              type="checkbox"
              checked={progEnabled}
              onChange={(e) => setProgEnabled(e.target.checked)}
            />
            <span>Programme Enabled</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-ui text-xs text-[#765B55] mb-1">
              Points Earned per ₹100
            </label>
            <input
              type="number"
              min={0}
              value={pointsPer100}
              onChange={(e) => setPointsPer100(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs tabular-nums"
            />
          </div>
          <div>
            <label className="block font-ui text-xs text-[#765B55] mb-1">
              First Purchase Bonus Points
            </label>
            <input
              type="number"
              min={0}
              value={firstOrderBonus}
              onChange={(e) => setFirstOrderBonus(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs tabular-nums"
            />
          </div>
          <div>
            <label className="block font-ui text-xs text-[#765B55] mb-1">
              Points Validity (Months)
            </label>
            <input
              type="number"
              min={1}
              value={expiryMonths}
              onChange={(e) => setExpiryMonths(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs tabular-nums"
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-ui text-xs text-[#765B55]">
            Eligible Order Statuses to Award Points (Duplicate awards prevented; Cancelled/Refunded auto-reverse):
          </p>
          <div className="flex flex-wrap gap-2">
            {(['Confirmed', 'Packed with Love', 'Out for Delivery', 'Delivered'] as OrderStatus[]).map(
              (st) => {
                const active = eligibleStatuses.includes(st);
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => toggleStatus(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-ui border cursor-pointer ${
                      active
                        ? 'bg-[#C98F9D] border-[#C98F9D] text-white'
                        : 'bg-[#FFF8EF] border-[#765B55]/15 text-[#765B55]'
                    }`}
                  >
                    {st}
                  </button>
                );
              }
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-[#C98F9D] text-white font-ui text-xs font-medium cursor-pointer"
          >
            Save Loyalty Rules
          </button>
        </div>
      </form>

      {/* Rewards Management */}
      <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-6 space-y-5">
        <h2 className="font-display text-xl font-semibold text-[#765B55] flex items-center gap-2">
          <Award className="w-5 h-5 text-[#C98F9D]" />
          <span>Redeemable Rewards</span>
        </h2>

        <form onSubmit={handleAddReward} className="grid grid-cols-1 sm:grid-cols-6 gap-3">
          <input
            type="text"
            required
            value={rwdTitle}
            onChange={(e) => setRwdTitle(e.target.value)}
            placeholder="Reward Title"
            className="px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs"
          />
          <input
            type="text"
            value={rwdDesc}
            onChange={(e) => setRwdDesc(e.target.value)}
            placeholder="Description"
            className="px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs sm:col-span-2"
          />
          <select
            value={rwdType}
            onChange={(e) => setRwdType(e.target.value as LoyaltyReward['rewardType'])}
            className="px-2.5 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs"
          >
            <option value="discount_flat">Flat ₹ Off</option>
            <option value="free_gift_wrap">Free Gift Wrap</option>
            <option value="free_shipping">Free Shipping</option>
          </select>
          <div className="grid grid-cols-2 gap-1.5">
            <input
              type="number"
              min={10}
              value={rwdPoints}
              onChange={(e) => setRwdPoints(Number(e.target.value))}
              placeholder="Pts"
              title="Points Required"
              className="px-2.5 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs tabular-nums"
            />
            <input
              type="number"
              min={0}
              value={rwdDiscountValue}
              onChange={(e) => setRwdDiscountValue(Number(e.target.value))}
              placeholder="₹ Value"
              title="Discount Value"
              className="px-2.5 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs tabular-nums"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#C98F9D] text-white font-ui text-xs font-medium inline-flex items-center justify-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Reward</span>
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {loyaltyRewards.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-xl bg-[#FFF8EF] border border-[#765B55]/10 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="font-ui text-xs font-semibold text-[#765B55]">{r.title}</p>
                <p className="font-body text-[11px] text-[#765B55]/75">{r.description}</p>
                <p className="font-ui text-[11px] text-[#C98F9D] font-medium tabular-nums mt-0.5">
                  {r.pointsRequired} pts · Min {formatPrice(r.minOrder)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => saveLoyaltyReward({ ...r, active: !r.active })}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-ui cursor-pointer ${
                    r.active ? 'bg-[#F4DDE3] text-[#765B55]' : 'bg-[#FFFFFF] text-[#765B55]/50'
                  }`}
                >
                  {r.active ? 'Active' : 'Paused'}
                </button>
                <button
                  type="button"
                  onClick={() => deleteLoyaltyReward(r.id)}
                  className="p-1.5 text-[#765B55]/50 hover:text-[#C98F9D] cursor-pointer"
                  aria-label={`Delete ${r.title}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Authorised Manual Points Adjustment */}
      <form
        onSubmit={handleAdjustment}
        className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-6 space-y-4"
      >
        <div>
          <h2 className="font-display text-xl font-semibold text-[#765B55] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#C98F9D]" />
            <span>Authorised Manual Points Adjustment</span>
          </h2>
          <p className="font-body text-xs text-[#765B55]/75">
            Every adjustment requires a customer email and mandatory audit reason, recorded permanently in the ledger below.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="email"
            required
            value={adjEmail}
            onChange={(e) => setAdjEmail(e.target.value)}
            placeholder="Customer Email"
            className="px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs"
          />
          <input
            type="number"
            required
            value={adjDelta}
            onChange={(e) => setAdjDelta(Number(e.target.value))}
            placeholder="Delta (e.g. 50 or -25)"
            className="px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs tabular-nums"
          />
          <input
            type="text"
            required
            value={adjNote}
            onChange={(e) => setAdjNote(e.target.value)}
            placeholder="Mandatory Audit Reason"
            className="px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-[#765B55] text-white font-ui text-xs font-medium cursor-pointer"
          >
            Record Adjustment
          </button>
        </div>
      </form>

      {/* Customer Balances & Audit Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-6 space-y-3">
          <h3 className="font-display text-xl font-semibold text-[#765B55]">
            Customer Points Balances ({displayedAccounts.length})
          </h3>
          {displayedAccounts.length === 0 ? (
            <p className="font-body text-xs text-[#765B55]/70">
              No live customer loyalty balances yet. Toggle Reference Archive above or record an authorised adjustment.
            </p>
          ) : (
            <div className="space-y-2">
              {displayedAccounts.map((acc) => (
                <div
                  key={acc.customerEmail}
                  className="p-3 rounded-xl bg-[#FFF8EF] border border-[#765B55]/10 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-ui font-semibold text-[#765B55] truncate">
                      {acc.customerName}{' '}
                      {acc.isDemoSeed && (
                        <span className="text-[10px] text-[#765B55]/50 font-normal">Archive</span>
                      )}
                    </p>
                    <p className="text-[#765B55]/70 truncate">{acc.customerEmail}</p>
                  </div>
                  <span className="font-ui font-semibold text-[#C98F9D] tabular-nums shrink-0">
                    {acc.pointsBalance} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-6 space-y-3">
          <h3 className="font-display text-xl font-semibold text-[#765B55]">
            Points Transaction Ledger ({displayedTx.length})
          </h3>
          {displayedTx.length === 0 ? (
            <p className="font-body text-xs text-[#765B55]/70">
              No live transactions logged yet.
            </p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {displayedTx.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl bg-[#FFF8EF] border border-[#765B55]/10 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-[#765B55]">{tx.description}</p>
                    <p className="text-[11px] text-[#765B55]/65">
                      {tx.customerEmail} · {tx.createdAt}
                    </p>
                    {tx.auditNote && (
                      <p className="text-[11px] text-[#C98F9D]">Audit: {tx.auditNote}</p>
                    )}
                  </div>
                  <span className="font-ui font-semibold text-[#765B55] tabular-nums shrink-0">
                    {tx.points >= 0 ? `+${tx.points}` : tx.points}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
