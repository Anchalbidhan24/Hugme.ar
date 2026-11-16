import React from 'react';
import { Check, Gift, Heart, MailOpen, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { GiftCardDesign, GiftWrapOption } from '../types/store';

export const GiftWrapVisual: React.FC<{
  wrap: Pick<GiftWrapOption, 'name' | 'paperColor' | 'ribbonColor' | 'pattern'>;
  size?: 'sm' | 'md';
}> = ({ wrap, size = 'md' }) => {
  const dims = size === 'sm' ? 'w-12 h-12' : 'w-16 h-16';
  return (
    <div
      className={`${dims} rounded-2xl border border-[#765B55]/12 flex items-center justify-center shrink-0 overflow-hidden`}
      style={{ backgroundColor: '#FFF8EF' }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" className="w-11/12 h-11/12">
        {/* Soft ribbon bow loops */}
        <path
          d="M32 18 C24 8, 13 11, 16 19 C18 24, 27 21, 32 19 Z"
          fill={wrap.ribbonColor}
          opacity="0.9"
        />
        <path
          d="M32 18 C40 8, 51 11, 48 19 C46 24, 37 21, 32 19 Z"
          fill={wrap.ribbonColor}
          opacity="0.9"
        />
        {/* Box body */}
        <rect
          x="12"
          y="22"
          width="40"
          height="32"
          rx="5"
          fill={wrap.paperColor}
          stroke="#765B55"
          strokeOpacity="0.2"
          strokeWidth="1.2"
        />
        {/* Subtle pattern */}
        {wrap.pattern === 'dots' && (
          <>
            <circle cx="20" cy="34" r="1.6" fill={wrap.ribbonColor} opacity="0.45" />
            <circle cx="44" cy="34" r="1.6" fill={wrap.ribbonColor} opacity="0.45" />
            <circle cx="20" cy="46" r="1.6" fill={wrap.ribbonColor} opacity="0.45" />
            <circle cx="44" cy="46" r="1.6" fill={wrap.ribbonColor} opacity="0.45" />
          </>
        )}
        {wrap.pattern === 'stripes' && (
          <>
            <line x1="16" y1="28" x2="16" y2="52" stroke={wrap.ribbonColor} strokeOpacity="0.25" strokeWidth="1.5" />
            <line x1="48" y1="28" x2="48" y2="52" stroke={wrap.ribbonColor} strokeOpacity="0.25" strokeWidth="1.5" />
          </>
        )}
        {wrap.pattern === 'pastel' && (
          <path
            d="M12 38 Q32 45 52 38 L52 50 Q52 54 48 54 L16 54 Q12 54 12 50 Z"
            fill="#F4DCCB"
            opacity="0.6"
          />
        )}
        {/* Lid */}
        <rect
          x="10"
          y="18"
          width="44"
          height="8"
          rx="3"
          fill={wrap.paperColor}
          stroke="#765B55"
          strokeOpacity="0.22"
          strokeWidth="1.2"
        />
        {/* Vertical & Horizontal Ribbon */}
        <rect x="29" y="18" width="6" height="36" fill={wrap.ribbonColor} />
        <rect x="12" y="34" width="40" height="4.5" fill={wrap.ribbonColor} opacity="0.85" />
        {/* Center Bow Knot */}
        <circle cx="32" cy="18.5" r="3.2" fill={wrap.ribbonColor} stroke="#FFF8EF" strokeWidth="1" />
      </svg>
    </div>
  );
};

export const GreetingCardPreview: React.FC<{
  design: GiftCardDesign;
  recipientName?: string;
  senderName?: string;
  message?: string;
}> = ({ design, recipientName, senderName, message }) => {
  return (
    <div
      className="rounded-2xl border p-5 sm:p-6 shadow-sm relative overflow-hidden"
      style={{
        backgroundColor: design.bgColor,
        borderColor: `${design.borderColor}66`,
      }}
    >
      {/* Top delicate ribbon accent */}
      <div
        className="h-2 w-full rounded-full mb-4 opacity-80"
        style={{ backgroundColor: design.ribbonColor }}
      />

      <div className="rounded-xl border border-dashed p-4 sm:p-5 space-y-3" style={{ borderColor: `${design.borderColor}55` }}>
        <div className="flex items-center justify-between gap-2">
          <span
            className="font-display italic text-base font-semibold"
            style={{ color: design.accentColor }}
          >
            {design.badgeText}
          </span>
          <Heart className="w-4 h-4 fill-current shrink-0" style={{ color: design.accentColor }} />
        </div>

        <div className="space-y-2 pt-1">
          <p className="font-ui text-xs text-[#765B55]/80">
            Dear{' '}
            <span className="font-semibold text-[#765B55]">
              {recipientName?.trim() || 'Someone Special'}
            </span>
            ,
          </p>
          <p className="font-display italic text-sm sm:text-base text-[#765B55] leading-relaxed min-h-[3.25rem] break-words">
            {message?.trim()
              ? `“${message.trim()}”`
              : '“Sending you the softest hug wrapped with warmth and smiles.”'}
          </p>
          <p className="font-ui text-xs text-[#765B55]/80 text-right pt-1">
            With hugs,{' '}
            <span className="font-semibold text-[#765B55]">
              {senderName?.trim() || 'From Me ♥'}
            </span>
          </p>
        </div>

        <div className="pt-2 border-t border-[#765B55]/10 flex items-center justify-between text-[10px] font-ui text-[#765B55]/60">
          <span>HUGME.AR</span>
          <span>A hug in every little thing.</span>
        </div>
      </div>
    </div>
  );
};

export const GiftExperiencePanel: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const {
    giftWraps,
    giftCardDesigns,
    giftMessageConfig,
    giftSelection,
    setGiftSelection,
    formatPrice,
    cartTotals,
  } = useStore();

  const enabledWraps = [...giftWraps]
    .filter((w) => w.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const enabledCards = giftCardDesigns.filter((c) => c.enabled);

  const selectedWrap =
    enabledWraps.find((w) => w.id === giftSelection.wrapOptionId) || enabledWraps[0] || null;
  const selectedCard =
    enabledCards.find((c) => c.id === giftSelection.cardDesignId) || enabledCards[0] || null;

  const maxChars = Math.max(40, giftMessageConfig.maxLength || 180);

  const toggleWrap = (enabled: boolean) => {
    setGiftSelection((prev) => ({
      ...prev,
      wrapEnabled: enabled,
      wrapOptionId:
        enabled && (!prev.wrapOptionId || !enabledWraps.some((w) => w.id === prev.wrapOptionId))
          ? enabledWraps[0]?.id || null
          : prev.wrapOptionId,
    }));
  };

  const toggleNote = (enabled: boolean) => {
    setGiftSelection((prev) => ({
      ...prev,
      noteEnabled: enabled,
      cardDesignId:
        enabled && (!prev.cardDesignId || !enabledCards.some((c) => c.id === prev.cardDesignId))
          ? enabledCards[0]?.id || null
          : prev.cardDesignId,
    }));
  };

  return (
    <div className="bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-5 sm:p-6 space-y-6">
      {/* Feature 1: Gift Wrapping */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F4DDE3]/75 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-[#C98F9D]" />
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold text-[#765B55]">
                Make It a Gift
              </h3>
              <p className="font-body text-xs text-[#765B55]/75">
                Add signature keepsake wrapping with satin ribbon bows.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {giftSelection.wrapEnabled && (
              <button
                type="button"
                onClick={() => toggleWrap(false)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-ui text-[#765B55]/70 hover:text-[#C98F9D] hover:bg-[#FFF8EF] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => toggleWrap(!giftSelection.wrapEnabled)}
              disabled={enabledWraps.length === 0}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-ui font-medium transition-colors cursor-pointer whitespace-nowrap ${
                giftSelection.wrapEnabled
                  ? 'bg-[#C98F9D] text-white'
                  : 'bg-[#F4DDE3]/65 text-[#765B55] hover:bg-[#F4DDE3]'
              }`}
            >
              {giftSelection.wrapEnabled ? 'Gift Wrap Added ✓' : '+ Add Gift Wrap'}
            </button>
          </div>
        </div>

        {enabledWraps.length === 0 ? (
          <p className="font-body text-xs text-[#765B55]/65">
            Gift wrapping options are currently unavailable.
          </p>
        ) : (
          giftSelection.wrapEnabled && (
            <div className={`grid grid-cols-1 ${compact ? 'sm:grid-cols-3' : 'md:grid-cols-3'} gap-3`}>
              {enabledWraps.map((wrap) => {
                const isSelected = selectedWrap?.id === wrap.id;
                return (
                  <button
                    key={wrap.id}
                    type="button"
                    onClick={() =>
                      setGiftSelection((prev) => ({
                        ...prev,
                        wrapEnabled: true,
                        wrapOptionId: wrap.id,
                      }))
                    }
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'border-[#C98F9D] bg-[#F4DDE3]/35 shadow-sm'
                        : 'border-[#765B55]/12 bg-[#FFF8EF]/70 hover:border-[#C98F9D]/50'
                    }`}
                  >
                    <GiftWrapVisual wrap={wrap} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-ui text-xs font-semibold text-[#765B55]">
                          {wrap.name}
                        </p>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-[#C98F9D] shrink-0 mt-0.5" />
                        )}
                      </div>
                      <p className="font-body text-[11px] text-[#765B55]/75 mt-0.5 line-clamp-2">
                        {wrap.subtitle}
                      </p>
                      <p className="font-ui text-xs font-semibold text-[#C98F9D] mt-1.5 tabular-nums">
                        {cartTotals.giftWrapDiscount > 0 && isSelected ? (
                          <span>
                            <span className="line-through text-[#765B55]/50 mr-1.5">
                              {formatPrice(wrap.price)}
                            </span>
                            Complimentary (Reward)
                          </span>
                        ) : (
                          `+${formatPrice(wrap.price)}`
                        )}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* Feature 2: Personalised Gift Notes */}
      {giftMessageConfig.enabled && (
        <div className="pt-5 border-t border-[#765B55]/10 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E9E2F5]/75 flex items-center justify-center shrink-0">
                <MailOpen className="w-5 h-5 text-[#C98F9D]" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-[#765B55]">
                  Add a Personalised Note
                </h3>
                <p className="font-body text-xs text-[#765B55]/75">
                  Complimentary printed HUGME.AR greeting card tucked inside your parcel.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {giftSelection.noteEnabled && (
                <button
                  type="button"
                  onClick={() => toggleNote(false)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-ui text-[#765B55]/70 hover:text-[#C98F9D] hover:bg-[#FFF8EF] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => toggleNote(!giftSelection.noteEnabled)}
                disabled={enabledCards.length === 0}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-ui font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  giftSelection.noteEnabled
                    ? 'bg-[#C98F9D] text-white'
                    : 'bg-[#E9E2F5]/70 text-[#765B55] hover:bg-[#E9E2F5]'
                }`}
              >
                {giftSelection.noteEnabled ? 'Gift Note Added ✓' : '+ Add Gift Note'}
              </button>
            </div>
          </div>

          {giftSelection.noteEnabled && enabledCards.length > 0 && selectedCard && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Card selector & Message form */}
              <div className="lg:col-span-6 space-y-3.5">
                <div>
                  <label className="block font-ui text-xs font-medium text-[#765B55] mb-2">
                    Choose Card Design
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {enabledCards.map((card) => {
                      const active = selectedCard.id === card.id;
                      return (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() =>
                            setGiftSelection((prev) => ({
                              ...prev,
                              noteEnabled: true,
                              cardDesignId: card.id,
                            }))
                          }
                          className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                            active
                              ? 'border-[#C98F9D] bg-[#F4DDE3]/35'
                              : 'border-[#765B55]/12 bg-[#FFF8EF]/70 hover:border-[#C98F9D]/50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-display text-sm font-semibold text-[#765B55]">
                              {card.title}
                            </span>
                            <span
                              className="w-3 h-3 rounded-full border border-[#765B55]/15 shrink-0"
                              style={{ backgroundColor: card.ribbonColor }}
                            />
                          </div>
                          <p className="font-body text-[11px] text-[#765B55]/70 line-clamp-1 mt-0.5">
                            {card.subtitle}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-ui text-xs text-[#765B55] mb-1">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      maxLength={50}
                      value={giftSelection.recipientName}
                      onChange={(e) =>
                        setGiftSelection((prev) => ({ ...prev, recipientName: e.target.value }))
                      }
                      placeholder="e.g. Ananya"
                      className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs text-[#765B55]"
                    />
                  </div>
                  <div>
                    <label className="block font-ui text-xs text-[#765B55] mb-1">
                      From
                    </label>
                    <input
                      type="text"
                      maxLength={50}
                      value={giftSelection.senderName}
                      onChange={(e) =>
                        setGiftSelection((prev) => ({ ...prev, senderName: e.target.value }))
                      }
                      placeholder="Your name"
                      className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs text-[#765B55]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-ui text-xs text-[#765B55]">Your Message</label>
                    <span className="font-ui text-[11px] text-[#765B55]/60 tabular-nums">
                      {giftSelection.message.length}/{maxChars}
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={maxChars}
                    value={giftSelection.message}
                    onChange={(e) =>
                      setGiftSelection((prev) => ({
                        ...prev,
                        message: e.target.value.slice(0, maxChars),
                      }))
                    }
                    placeholder="Write a sweet message for their plushie keepsake card..."
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs text-[#765B55] leading-relaxed"
                  />
                </div>
              </div>

              {/* Live Digital Card Preview */}
              <div className="lg:col-span-6 space-y-2">
                <p className="font-ui text-xs font-medium text-[#765B55]/75">
                  Live Greeting Card Preview
                </p>
                <GreetingCardPreview
                  design={selectedCard}
                  recipientName={giftSelection.recipientName}
                  senderName={giftSelection.senderName}
                  message={giftSelection.message}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
