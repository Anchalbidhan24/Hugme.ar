import React from 'react';
import {
  ArrowRight,
  Award,
  Clock,
  Gift,
  Heart,
  Info,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const LoyaltyPage: React.FC = () => {
  const {
    loyaltySettings,
    loyaltyRewards,
    customerSession,
    currentCustomerLoyalty,
    navigate,
    formatPrice,
    setSelectedLoyaltyRewardId,
    showToast,
  } = useStore();

  const activeRewards = loyaltyRewards
    .filter((r) => r.active)
    .sort((a, b) => a.pointsRequired - b.pointsRequired);

  const sortedTiers = [...loyaltySettings.tiers].sort((a, b) => a.minPoints - b.minPoints);
  const balance = currentCustomerLoyalty.account?.pointsBalance ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#F4DDE3]/75 via-[#FFF8EF] to-[#E9E2F5]/70 rounded-[2rem] border border-[#C98F9D]/30 p-8 sm:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-ui font-semibold uppercase tracking-wider text-[#C98F9D]">
              <Heart className="w-4 h-4 fill-current" />
              <span>HUGME.AR Loyalty Programme</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#765B55] leading-tight">
              {loyaltySettings.programmeName}
            </h1>
            <p className="font-display italic text-xl text-[#C98F9D]">
              “{loyaltySettings.tagline}”
            </p>
            <p className="font-body text-sm sm:text-base text-[#765B55]/85 leading-relaxed max-w-2xl">
              Collect Hug Points whenever you adopt plushies or curate gifts from HUGME.AR. Redeem your points in your cart for plushie vouchers, complimentary gift wrapping, or free express shipping.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              {customerSession.isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => navigate('account', { accountTab: 'loyalty' })}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] text-white font-ui text-xs font-medium cursor-pointer"
                >
                  <span>View My Points ({balance.toLocaleString('en-IN')} pts)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate('login')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] text-white font-ui text-xs font-medium cursor-pointer"
                >
                  <span>Sign In to View Points</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate('shop')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFFFFF] border border-[#C98F9D]/40 text-[#765B55] font-ui text-xs font-medium hover:bg-[#F4DDE3]/40 cursor-pointer"
              >
                <span>Shop Plushies</span>
              </button>
            </div>
          </div>

          {/* Live Member Card / Quick Overview */}
          <div className="lg:col-span-5 bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-6 sm:p-7 space-y-5 shadow-sm">
            {customerSession.isLoggedIn ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-ui text-xs text-[#765B55]/65">Current Balance</p>
                    <p className="font-display text-4xl font-semibold text-[#765B55] tabular-nums mt-0.5">
                      {balance.toLocaleString('en-IN')} <span className="text-lg text-[#C98F9D]">pts</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-ui text-xs text-[#765B55]/65">Tier</p>
                    <p className="font-display text-xl font-semibold text-[#C98F9D]">
                      {currentCustomerLoyalty.currentTier.name}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-ui text-[#765B55]/80">
                    <span>Progress to next unlock</span>
                    <span className="tabular-nums font-semibold">
                      {currentCustomerLoyalty.pointsToNextTier > 0
                        ? `${currentCustomerLoyalty.pointsToNextTier} pts away`
                        : 'Top milestone unlocked'}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[#F4DDE3]/70 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#C98F9D] transition-all duration-300"
                      style={{ width: `${currentCustomerLoyalty.progressPercent}%` }}
                    />
                  </div>
                </div>

                <p className="font-body text-xs text-[#765B55]/75">
                  {currentCustomerLoyalty.currentTier.perk}
                </p>
              </>
            ) : (
              <div className="space-y-3">
                <p className="font-ui text-xs font-semibold uppercase tracking-wider text-[#C98F9D]">
                  Member Highlights
                </p>
                <p className="font-display text-2xl font-semibold text-[#765B55]">
                  +{loyaltySettings.firstOrderBonusPoints} Welcome Hug Points
                </p>
                <p className="font-body text-sm text-[#765B55]/80">
                  Earn {loyaltySettings.pointsPer100Inr} points per ₹100 spent plus a{' '}
                  {loyaltySettings.firstOrderBonusPoints}-point bonus after your first completed purchase.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('register')}
                  className="w-full py-2.5 rounded-xl bg-[#F4DDE3] hover:bg-[#C98F9D] hover:text-white text-[#765B55] font-ui text-xs font-medium transition-colors cursor-pointer"
                >
                  Create Account to Join
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How Earning Works */}
      <section className="space-y-6">
        <div>
          <p className="font-ui text-xs font-medium uppercase tracking-wider text-[#C98F9D]">
            Simple &amp; Transparent Rules
          </p>
          <h2 className="font-display text-3xl font-semibold text-[#765B55] mt-1">
            How Hug Points Work
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-6 space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F4DDE3] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#C98F9D]" />
            </div>
            <h3 className="font-display text-xl font-semibold text-[#765B55]">
              Earn on Every Purchase
            </h3>
            <p className="font-body text-xs text-[#765B55]/80 leading-relaxed">
              Earn <strong className="tabular-nums">{loyaltySettings.pointsPer100Inr} Hug Points</strong> for every ₹100 of eligible plushie spend once your order reaches{' '}
              <strong>{loyaltySettings.eligibleOrderStatuses.join(' / ')}</strong> status.
            </p>
          </div>

          <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-6 space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#E9E2F5] flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#C98F9D]" />
            </div>
            <h3 className="font-display text-xl font-semibold text-[#765B55]">
              First Order Bonus
            </h3>
            <p className="font-body text-xs text-[#765B55]/80 leading-relaxed">
              Receive a one-time welcome gift of{' '}
              <strong className="tabular-nums">+{loyaltySettings.firstOrderBonusPoints} Hug Points</strong>{' '}
              when your first order completes delivery.
            </p>
          </div>

          <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-6 space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F4DCCB]/75 flex items-center justify-center">
              <Gift className="w-5 h-5 text-[#C98F9D]" />
            </div>
            <h3 className="font-display text-xl font-semibold text-[#765B55]">
              Redeem in Cart
            </h3>
            <p className="font-body text-xs text-[#765B55]/80 leading-relaxed">
              Apply eligible rewards directly inside your Cart or Checkout to unlock vouchers, free wrapping, or complimentary shipping.
            </p>
          </div>

          <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-6 space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF8EF] border border-[#765B55]/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#C98F9D]" />
            </div>
            <h3 className="font-display text-xl font-semibold text-[#765B55]">
              Fair Protection Rules
            </h3>
            <p className="font-body text-xs text-[#765B55]/80 leading-relaxed">
              Points stay valid for{' '}
              <strong className="tabular-nums">{loyaltySettings.pointsExpiryMonths} months</strong>. Points from cancelled or refunded orders are automatically reversed.
            </p>
          </div>
        </div>
      </section>

      {/* Rewards Catalogue */}
      <section className="space-y-6">
        <div>
          <p className="font-ui text-xs font-medium uppercase tracking-wider text-[#C98F9D]">
            Spend Your Hug Points
          </p>
          <h2 className="font-display text-3xl font-semibold text-[#765B55] mt-1">
            Available Rewards
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {activeRewards.map((reward) => {
            const Icon =
              reward.rewardType === 'free_shipping'
                ? Truck
                : reward.rewardType === 'free_gift_wrap'
                  ? Gift
                  : Award;
            const eligible = customerSession.isLoggedIn && balance >= reward.pointsRequired;

            return (
              <div
                key={reward.id}
                className="bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-6 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-[#F4DDE3]/75 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#C98F9D]" />
                    </div>
                    <span className="font-ui text-xs font-semibold text-[#C98F9D] tabular-nums">
                      {reward.pointsRequired} pts
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-[#765B55]">
                    {reward.title}
                  </h3>
                  <p className="font-body text-xs text-[#765B55]/80 leading-relaxed">
                    {reward.description}
                  </p>
                  {reward.minOrder > 0 && (
                    <p className="font-ui text-[11px] text-[#765B55]/60 tabular-nums">
                      Min order {formatPrice(reward.minOrder)}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!customerSession.isLoggedIn) {
                      navigate('login');
                      return;
                    }
                    if (!eligible) {
                      showToast(
                        `Collect ${reward.pointsRequired - balance} more points to unlock this reward`,
                        'cocoa'
                      );
                      return;
                    }
                    setSelectedLoyaltyRewardId(reward.id);
                    showToast(`Selected ${reward.title} for your cart ♡`, 'success');
                    navigate('cart');
                  }}
                  className={`w-full py-2.5 rounded-xl font-ui text-xs font-medium transition-colors cursor-pointer ${
                    eligible
                      ? 'bg-[#C98F9D] hover:bg-[#b87b8a] text-white'
                      : 'bg-[#FFF8EF] border border-[#765B55]/15 text-[#765B55]'
                  }`}
                >
                  {!customerSession.isLoggedIn
                    ? 'Sign In to Redeem'
                    : eligible
                      ? 'Apply in Cart'
                      : `Need ${reward.pointsRequired - balance} more pts`}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tiers Breakdown */}
      <section className="bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-6 sm:p-10 space-y-6">
        <div>
          <p className="font-ui text-xs font-medium uppercase tracking-wider text-[#C98F9D]">
            Membership Milestones
          </p>
          <h2 className="font-display text-3xl font-semibold text-[#765B55] mt-1">
            Hugs &amp; Hearts Tiers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sortedTiers.map((tier) => {
            const isCurrent =
              customerSession.isLoggedIn && currentCustomerLoyalty.currentTier.id === tier.id;
            return (
              <div
                key={tier.id}
                className={`p-5 rounded-2xl border space-y-2 ${
                  isCurrent
                    ? 'bg-[#F4DDE3]/45 border-[#C98F9D]'
                    : 'bg-[#FFF8EF]/70 border-[#765B55]/10'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-xl font-semibold text-[#765B55]">
                    {tier.name}
                  </h3>
                  <span className="font-ui text-xs font-semibold text-[#C98F9D] tabular-nums">
                    {tier.minPoints}+ pts
                  </span>
                </div>
                <p className="font-body text-xs text-[#765B55]/80 leading-relaxed">{tier.perk}</p>
                {isCurrent && (
                  <p className="font-ui text-[11px] font-semibold text-[#C98F9D] pt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Your Current Tier
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <p className="flex items-start gap-2 text-xs font-body text-[#765B55]/70 pt-2">
          <Info className="w-4 h-4 text-[#C98F9D] shrink-0 mt-0.5" />
          <span>
            Live loyalty point balances, duplicate-award verification, and reward redemptions will sync securely with our backend database when online accounts go live.
          </span>
        </p>
      </section>
    </div>
  );
};
