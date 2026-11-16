import React, { useEffect, useState } from 'react';
import {
  Award,
  CheckCircle2,
  Clock,
  Gift,
  Heart,
  LogOut,
  MapPin,
  Package,
  Plus,
  Search,
  Sparkles,
  Trash2,
  User,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BearMascotSvg, BrandLogo } from '../../components/BrandLogo';

export const AuthPage: React.FC<{ mode: 'login' | 'register' | 'forgot-password' }> = ({
  mode,
}) => {
  const { navigate, loginCustomerDemo, registerCustomerDemo } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      loginCustomerDemo(email);
      navigate('account');
    } else if (mode === 'register') {
      registerCustomerDemo(name, email, phone);
      navigate('account');
    } else {
      setResetSent(true);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center pb-1">
            <BrandLogo variant="primary" size="lg" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-[#765B55]">
            {mode === 'login'
              ? 'Welcome Back'
              : mode === 'register'
                ? 'Join HUGME.AR'
                : 'Reset Password'}
          </h1>
          <p className="font-body text-xs text-[#765B55]/75">
            {mode === 'login'
              ? 'Sign in to manage your saved addresses, wishlist, and Hug Points.'
              : mode === 'register'
                ? 'Save your contact and delivery preferences for faster checkout.'
                : 'Enter your email address to check account recovery availability.'}
          </p>
        </div>

        {mode === 'forgot-password' && resetSent ? (
          <div className="p-4 rounded-2xl bg-[#F4DDE3]/50 text-center space-y-3">
            <p className="font-body text-sm text-[#765B55]">
              Password recovery emails require an active account server and are currently unavailable.
            </p>
            <button
              type="button"
              onClick={() => {
                setResetSent(false);
                navigate('login');
              }}
              className="font-ui text-xs font-medium text-[#C98F9D] underline cursor-pointer"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block font-ui text-xs text-[#765B55] mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm text-[#765B55]"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs text-[#765B55] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 00000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm text-[#765B55]"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block font-ui text-xs text-[#765B55] mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm text-[#765B55]"
              />
            </div>

            {mode !== 'forgot-password' && (
              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-ui text-xs text-[#765B55]">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => navigate('forgot-password')}
                      className="font-ui text-xs text-[#C98F9D] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm text-[#765B55]"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] text-white font-ui text-sm font-medium transition-colors cursor-pointer"
            >
              {mode === 'login'
                ? 'Sign In'
                : mode === 'register'
                  ? 'Create Account'
                  : 'Continue'}
            </button>
          </form>
        )}

        <p className="font-body text-[11px] text-center text-[#765B55]/60">
          Profile details are stored in this browser until live account authentication is connected.
        </p>

        <div className="pt-4 border-t border-[#765B55]/10 text-center text-xs font-ui text-[#765B55]/75">
          {mode === 'login' ? (
            <>
              New to HUGME.AR?{' '}
              <button
                type="button"
                onClick={() => navigate('register')}
                className="text-[#C98F9D] font-medium hover:underline cursor-pointer"
              >
                Create Account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('login')}
                className="text-[#C98F9D] font-medium hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const AccountPage: React.FC<{
  initialTab?: 'overview' | 'profile' | 'addresses' | 'orders' | 'loyalty';
}> = ({ initialTab = 'overview' }) => {
  const {
    customerSession,
    logoutCustomerDemo,
    updateCustomerProfile,
    addCustomerAddress,
    removeCustomerAddress,
    wishlist,
    orders,
    fetchOrdersFromBackend,
    loyaltySettings,
    loyaltyRewards,
    currentCustomerLoyalty,
    setSelectedLoyaltyRewardId,
    formatPrice,
    navigate,
    routeParams,
    showToast,
  } = useStore();

  const [tab, setTab] = useState<'overview' | 'profile' | 'addresses' | 'orders' | 'loyalty'>(
    initialTab
  );

  useEffect(() => {
    if (
      routeParams.accountTab &&
      ['overview', 'profile', 'addresses', 'orders', 'loyalty'].includes(routeParams.accountTab)
    ) {
      setTab(
        routeParams.accountTab as 'overview' | 'profile' | 'addresses' | 'orders' | 'loyalty'
      );
    } else {
      setTab(initialTab);
    }
  }, [initialTab, routeParams.accountTab]);

  useEffect(() => {
    if (customerSession.isLoggedIn && tab === 'orders' && customerSession.email) {
      void fetchOrdersFromBackend(customerSession.email);
    }
  }, [customerSession.isLoggedIn, customerSession.email, tab]);

  const [profName, setProfName] = useState(customerSession.name);
  const [profEmail, setProfEmail] = useState(customerSession.email);
  const [profPhone, setProfPhone] = useState(customerSession.phone);

  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPin, setAddrPin] = useState('');

  if (!customerSession.isLoggedIn) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-8 space-y-4">
          <BearMascotSvg className="w-12 h-12 mx-auto" />
          <h1 className="font-display text-3xl font-semibold text-[#765B55]">
            Your HUGME.AR Account
          </h1>
          <p className="font-body text-sm text-[#765B55]/80">
            Sign in or create a profile to keep your saved delivery addresses, favourite plushies, and Hugs &amp; Hearts points together.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('login')}
              className="px-5 py-2.5 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] text-white font-ui text-xs font-medium cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => navigate('register')}
              className="px-5 py-2.5 rounded-xl border border-[#C98F9D] text-[#765B55] font-ui text-xs font-medium cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const pointsBalance = currentCustomerLoyalty.account?.pointsBalance ?? 0;
  const activeRewards = loyaltyRewards
    .filter((r) => r.active)
    .sort((a, b) => a.pointsRequired - b.pointsRequired);
  const myOrders = orders.filter(
    (o) =>
      !o.isDemoSeed &&
      o.customerEmail.toLowerCase() === customerSession.email.toLowerCase()
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile(profName, profEmail, profPhone);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet.trim() || !addrCity.trim()) return;
    addCustomerAddress({
      label: addrLabel,
      fullName: customerSession.name || 'Recipient',
      phone: customerSession.phone || '',
      street: addrStreet,
      city: addrCity,
      state: addrState || 'Maharashtra',
      pincode: addrPin || '400050',
      country: 'India',
      isDefault: customerSession.addresses.length === 0,
    });
    setAddrStreet('');
    setAddrCity('');
    setAddrState('');
    setAddrPin('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Account Navigation */}
        <aside className="lg:col-span-3 bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-5 space-y-2">
          <div className="pb-4 mb-2 border-b border-[#765B55]/10">
            <p className="font-display text-xl font-semibold text-[#765B55]">
              {customerSession.name || 'HUGME.AR Member'}
            </p>
            <p className="font-ui text-xs text-[#765B55]/65 truncate">{customerSession.email}</p>
            <p className="font-ui text-xs font-semibold text-[#C98F9D] mt-1 tabular-nums">
              {currentCustomerLoyalty.currentTier.name} · {pointsBalance.toLocaleString('en-IN')} pts
            </p>
          </div>

          {(
            [
              { id: 'overview', label: 'Account Overview', icon: User },
              { id: 'loyalty', label: 'Hugs & Hearts Rewards', icon: Heart },
              { id: 'profile', label: 'My Profile', icon: User },
              { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
              { id: 'orders', label: 'My Orders', icon: Package },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-ui font-medium transition-colors cursor-pointer ${
                  tab === item.id
                    ? 'bg-[#F4DDE3] text-[#765B55] font-semibold'
                    : 'text-[#765B55]/80 hover:bg-[#FFF8EF]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#C98F9D]" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 mt-2 border-t border-[#765B55]/10">
            <button
              type="button"
              onClick={logoutCustomerDemo}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-ui font-medium text-[#765B55]/75 hover:bg-[#F4DDE3]/45 hover:text-[#765B55] transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-[#C98F9D]" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-9 bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-6 sm:p-8">
          {tab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl font-semibold text-[#765B55]">
                  Hello, {(customerSession.name || 'Friend').split(' ')[0]} ♡
                </h1>
                <p className="font-body text-sm text-[#765B55]/75 mt-1">
                  Manage your profile, delivery addresses, saved plushies, and Hugs &amp; Hearts points from one cosy place.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#FFF8EF] border border-[#765B55]/10">
                  <p className="font-ui text-xs text-[#765B55]/70">Hug Points</p>
                  <p className="font-display text-2xl font-semibold text-[#C98F9D] mt-1 tabular-nums">
                    {pointsBalance.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-[#F4DDE3]/45 border border-[#765B55]/10">
                  <p className="font-ui text-xs text-[#765B55]/70">Loyalty Tier</p>
                  <p className="font-display text-xl font-semibold text-[#765B55] mt-1">
                    {currentCustomerLoyalty.currentTier.name}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-[#FFF8EF] border border-[#765B55]/10">
                  <p className="font-ui text-xs text-[#765B55]/70">Wishlist Items</p>
                  <p className="font-display text-2xl font-semibold text-[#765B55] mt-1 tabular-nums">
                    {wishlist.length}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-[#E9E2F5]/55 border border-[#765B55]/10">
                  <p className="font-ui text-xs text-[#765B55]/70">Saved Addresses</p>
                  <p className="font-display text-2xl font-semibold text-[#765B55] mt-1 tabular-nums">
                    {customerSession.addresses.length}
                  </p>
                </div>
              </div>

              {/* Loyalty Progress Strip */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#F4DDE3]/45 to-[#FFF8EF] border border-[#C98F9D]/25 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-ui text-xs font-semibold uppercase tracking-wider text-[#C98F9D]">
                      {loyaltySettings.programmeName}
                    </p>
                    <p className="font-body text-xs text-[#765B55]/80 mt-0.5">
                      {loyaltySettings.tagline}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTab('loyalty')}
                    className="font-ui text-xs font-medium text-[#C98F9D] hover:underline cursor-pointer"
                  >
                    Open Rewards Wallet →
                  </button>
                </div>
                <div className="h-2 rounded-full bg-[#FFFFFF] overflow-hidden border border-[#765B55]/10">
                  <div
                    className="h-full rounded-full bg-[#C98F9D]"
                    style={{ width: `${currentCustomerLoyalty.progressPercent}%` }}
                  />
                </div>
                <p className="font-ui text-[11px] text-[#765B55]/75 tabular-nums">
                  {currentCustomerLoyalty.pointsToNextTier > 0
                    ? `${currentCustomerLoyalty.pointsToNextTier} points away from your next reward or tier milestone.`
                    : 'You have reached our highest milestone—enjoy every perk!'}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('wishlist')}
                  className="px-5 py-2.5 rounded-xl bg-[#F4DDE3] text-[#765B55] font-ui text-xs font-medium cursor-pointer"
                >
                  View Wishlist ({wishlist.length})
                </button>
                <button
                  type="button"
                  onClick={() => navigate('shop')}
                  className="px-5 py-2.5 rounded-xl bg-[#C98F9D] text-white font-ui text-xs font-medium cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}

          {tab === 'loyalty' && (
            <div className="space-y-8">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#765B55]/10 pb-5">
                <div>
                  <p className="font-ui text-xs font-medium uppercase tracking-wider text-[#C98F9D]">
                    {loyaltySettings.programmeName}
                  </p>
                  <h2 className="font-display text-3xl font-semibold text-[#765B55] mt-1">
                    My Hugs &amp; Hearts Wallet
                  </h2>
                  <p className="font-display italic text-sm text-[#765B55]/80 mt-0.5">
                    “{loyaltySettings.tagline}”
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('loyalty')}
                  className="px-4 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 hover:border-[#C98F9D] text-xs font-ui font-medium text-[#765B55] cursor-pointer"
                >
                  Programme Rules &amp; Tiers
                </button>
              </div>

              {/* Balance + Tier Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#F4DDE3]/55 to-[#FFF8EF] border border-[#C98F9D]/25 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-ui text-xs text-[#765B55]/75">Available Balance</span>
                    <Sparkles className="w-4 h-4 text-[#C98F9D]" />
                  </div>
                  <p className="font-display text-4xl font-semibold text-[#765B55] tabular-nums">
                    {pointsBalance.toLocaleString('en-IN')}{' '}
                    <span className="text-base font-ui text-[#C98F9D]">Hug Points</span>
                  </p>
                  <p className="font-body text-xs text-[#765B55]/75 tabular-nums">
                    Lifetime earned: {(currentCustomerLoyalty.account?.lifetimePoints ?? 0).toLocaleString('en-IN')} pts · Valid for {loyaltySettings.pointsExpiryMonths} months
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#FFF8EF] border border-[#765B55]/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-ui text-xs text-[#765B55]/75">Current Tier</span>
                    <Award className="w-4 h-4 text-[#C98F9D]" />
                  </div>
                  <p className="font-display text-2xl font-semibold text-[#765B55]">
                    {currentCustomerLoyalty.currentTier.name}
                  </p>
                  <p className="font-body text-xs text-[#765B55]/80">
                    {currentCustomerLoyalty.currentTier.perk}
                  </p>
                  <div className="space-y-1 pt-1">
                    <div className="h-2 rounded-full bg-[#F4DDE3]/70 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#C98F9D]"
                        style={{ width: `${currentCustomerLoyalty.progressPercent}%` }}
                      />
                    </div>
                    <p className="font-ui text-[11px] text-[#765B55]/70 tabular-nums">
                      {currentCustomerLoyalty.pointsToNextTier > 0
                        ? `${currentCustomerLoyalty.pointsToNextTier} pts until next unlock`
                        : 'Top milestone unlocked'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Redeemable Rewards */}
              <div className="space-y-3">
                <h3 className="font-display text-2xl font-semibold text-[#765B55]">
                  Available Rewards
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeRewards.map((r) => {
                    const eligible = pointsBalance >= r.pointsRequired;
                    return (
                      <div
                        key={r.id}
                        className="p-4 rounded-2xl bg-[#FFF8EF]/70 border border-[#765B55]/10 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0 space-y-1">
                          <p className="font-ui text-sm font-semibold text-[#765B55] flex items-center gap-1.5">
                            <Gift className="w-3.5 h-3.5 text-[#C98F9D] shrink-0" />
                            <span className="truncate">{r.title}</span>
                          </p>
                          <p className="font-body text-xs text-[#765B55]/75">{r.description}</p>
                          <p className="font-ui text-[11px] text-[#C98F9D] font-semibold tabular-nums">
                            {r.pointsRequired} pts
                            {r.minOrder > 0 ? ` · Min order ${formatPrice(r.minOrder)}` : ''}
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={!eligible}
                          onClick={() => {
                            setSelectedLoyaltyRewardId(r.id);
                            showToast(`Selected ${r.title} for your cart ♡`, 'success');
                            navigate('cart');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] disabled:opacity-45 text-white font-ui text-xs font-medium shrink-0 cursor-pointer"
                        >
                          {eligible ? 'Apply in Cart' : 'Locked'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Points History */}
              <div className="space-y-3">
                <h3 className="font-display text-2xl font-semibold text-[#765B55]">
                  Points History
                </h3>
                {currentCustomerLoyalty.transactions.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-[#FFF8EF] border border-[#765B55]/10 text-center space-y-2">
                    <Clock className="w-6 h-6 text-[#C98F9D] mx-auto" />
                    <p className="font-body text-sm text-[#765B55]/80">
                      No Hug Points activity recorded on this account yet.
                    </p>
                    <p className="font-body text-xs text-[#765B55]/65">
                      Points are awarded automatically once completed orders reach{' '}
                      <strong>{loyaltySettings.eligibleOrderStatuses.join(' / ')}</strong> status (+
                      {loyaltySettings.firstOrderBonusPoints} welcome bonus on your first purchase).
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-[#765B55]/10 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#FFF8EF] border-b border-[#765B55]/10 text-[11px] font-ui uppercase text-[#765B55]/70">
                          <th className="py-3 px-4">Activity</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4 text-right">Points</th>
                          <th className="py-3 px-4 text-right">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#765B55]/8 text-xs font-body">
                        {currentCustomerLoyalty.transactions.map((tx) => (
                          <tr key={tx.id}>
                            <td className="py-3 px-4">
                              <p className="font-medium text-[#765B55]">{tx.description}</p>
                              {tx.auditNote && (
                                <p className="text-[11px] text-[#765B55]/60">Note: {tx.auditNote}</p>
                              )}
                            </td>
                            <td className="py-3 px-4 text-[#765B55]/75">{tx.createdAt}</td>
                            <td
                              className={`py-3 px-4 text-right font-ui font-semibold tabular-nums ${
                                tx.points >= 0 ? 'text-[#C98F9D]' : 'text-[#765B55]'
                              }`}
                            >
                              {tx.points >= 0 ? `+${tx.points}` : tx.points}
                            </td>
                            <td className="py-3 px-4 text-right font-ui tabular-nums text-[#765B55]">
                              {tx.balanceAfter}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5 max-w-lg">
              <h2 className="font-display text-2xl font-semibold text-[#765B55]">My Profile</h2>
              <div>
                <label className="block font-ui text-xs text-[#765B55] mb-1">Full Name</label>
                <input
                  type="text"
                  value={profName}
                  onChange={(e) => setProfName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm"
                />
              </div>
              <div>
                <label className="block font-ui text-xs text-[#765B55] mb-1">Email</label>
                <input
                  type="email"
                  value={profEmail}
                  onChange={(e) => setProfEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm"
                />
              </div>
              <div>
                <label className="block font-ui text-xs text-[#765B55] mb-1">Phone</label>
                <input
                  type="tel"
                  value={profPhone}
                  onChange={(e) => setProfPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#C98F9D] text-white font-ui text-xs font-medium cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          )}

          {tab === 'addresses' && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-[#765B55]">
                Saved Addresses
              </h2>
              {customerSession.addresses.length === 0 ? (
                <p className="font-body text-sm text-[#765B55]/75">
                  No delivery addresses saved yet. Add your first address below.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customerSession.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#765B55]/10 flex justify-between gap-3"
                    >
                      <div className="text-xs font-body space-y-1">
                        <p className="font-ui font-semibold text-[#765B55]">
                          {addr.label} {addr.isDefault && '· Default'}
                        </p>
                        <p>{addr.fullName}</p>
                        <p>{addr.street}</p>
                        <p>
                          {addr.city}, {addr.state} {addr.pincode}
                        </p>
                        {addr.phone && <p>{addr.phone}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCustomerAddress(addr.id)}
                        className="text-[#765B55]/50 hover:text-[#C98F9D] self-start cursor-pointer"
                        aria-label="Delete address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <form
                onSubmit={handleAddAddress}
                className="pt-4 border-t border-[#765B55]/10 space-y-3 max-w-xl"
              >
                <h3 className="font-ui text-sm font-semibold text-[#765B55] flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#C98F9D]" /> Add New Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={addrLabel}
                    onChange={(e) => setAddrLabel(e.target.value)}
                    placeholder="Label (e.g. Home, Studio)"
                    className="px-3.5 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs"
                  />
                  <input
                    type="text"
                    required
                    value={addrStreet}
                    onChange={(e) => setAddrStreet(e.target.value)}
                    placeholder="Street Address"
                    className="px-3.5 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs"
                  />
                  <input
                    type="text"
                    required
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    placeholder="City"
                    className="px-3.5 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={addrState}
                      onChange={(e) => setAddrState(e.target.value)}
                      placeholder="State"
                      className="px-3.5 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs"
                    />
                    <input
                      type="text"
                      value={addrPin}
                      onChange={(e) => setAddrPin(e.target.value)}
                      placeholder="Pincode"
                      className="px-3.5 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C98F9D] text-white font-ui text-xs font-medium cursor-pointer"
                >
                  Save Address
                </button>
              </form>
            </div>
          )}

          {tab === 'orders' && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-semibold text-[#765B55]">My Orders</h2>
              {myOrders.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#FFF8EF] border border-[#765B55]/10 text-center space-y-3">
                  <Package className="w-8 h-8 text-[#C98F9D] mx-auto" />
                  <p className="font-display text-xl font-semibold text-[#765B55]">
                    No orders placed yet
                  </p>
                  <p className="font-body text-sm text-[#765B55]/75 max-w-md mx-auto">
                    Your confirmed HUGME.AR orders placed with {customerSession.email} will appear here automatically.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('shop')}
                    className="mt-2 px-5 py-2.5 rounded-xl bg-[#C98F9D] text-white font-ui text-xs font-medium cursor-pointer"
                  >
                    Explore Plushies
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl bg-[#FFF8EF] border border-[#765B55]/10 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-ui text-sm font-semibold text-[#765B55]">{ord.id}</p>
                        <p className="font-body text-xs text-[#765B55]/75">
                          {ord.date} · {ord.status}
                        </p>
                      </div>
                      <span className="font-ui text-sm font-semibold text-[#C98F9D] tabular-nums">
                        {formatPrice(ord.total)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const OrderTrackingPreviewPage: React.FC = () => {
  const { orders, fetchOrderByIdFromBackend, routeParams, formatPrice } = useStore();
  const [query, setQuery] = useState(routeParams.orderId || '');
  const [submittedQuery, setSubmittedQuery] = useState(routeParams.orderId || '');
  const [isSearching, setIsSearching] = useState(false);
  const [lookupError, setLookupError] = useState('');

  useEffect(() => {
    if (routeParams.orderId) {
      const targetId = routeParams.orderId;
      setQuery(targetId);
      setSubmittedQuery(targetId);
      setIsSearching(true);
      setLookupError('');
      fetchOrderByIdFromBackend(targetId).then((res) => {
        setIsSearching(false);
        if (!res.ok && res.code !== 'NOT_FOUND') {
          setLookupError(res.error || '');
        }
      });
    }
  }, [routeParams.orderId]);

  const matched = submittedQuery.trim()
    ? orders.find((o) => !o.isDemoSeed && o.id.toLowerCase() === submittedQuery.trim().toLowerCase())
    : undefined;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim();
    setSubmittedQuery(clean);
    if (!clean) return;
    setIsSearching(true);
    setLookupError('');
    const res = await fetchOrderByIdFromBackend(clean);
    setIsSearching(false);
    if (!res.ok && res.code !== 'NOT_FOUND') {
      setLookupError(res.error || '');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-2">
        <p className="font-ui text-xs font-medium uppercase tracking-wider text-[#C98F9D]">
          HUGME.AR Order Tracking
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#765B55]">
          Track Your Plushie Parcel
        </h1>
        <p className="font-body text-sm text-[#765B55]/75">
          Enter your HUGME.AR Order ID below to check dispatch and delivery milestones.
        </p>
      </div>

      <form
        onSubmit={handleTrack}
        className="bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-6 space-y-3"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#C98F9D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Order ID (e.g. HUG-2026-0001)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm text-[#765B55]"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-2.5 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] disabled:opacity-60 text-white font-ui text-xs font-medium transition-colors cursor-pointer shrink-0"
          >
            {isSearching ? 'Searching...' : 'Track Parcel'}
          </button>
        </div>
        {lookupError && (
          <p className="font-body text-xs text-[#C98F9D]">{lookupError}</p>
        )}
      </form>

      {submittedQuery && !isSearching && !matched && (
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-8 text-center space-y-2">
          <Package className="w-8 h-8 text-[#C98F9D] mx-auto" />
          <h2 className="font-display text-xl font-semibold text-[#765B55]">
            No parcel found for “{submittedQuery}”
          </h2>
          <p className="font-body text-sm text-[#765B55]/75 max-w-md mx-auto">
            Please double-check your Order ID or contact care@hugme.ar for assistance with an existing dispatch.
          </p>
        </div>
      )}

      {matched && (
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#765B55]/10">
            <div>
              <h2 className="font-display text-2xl font-semibold text-[#765B55]">
                {matched.id}
              </h2>
              <p className="font-body text-xs text-[#765B55]/75">
                {matched.customerName} · {matched.shippingAddress}
              </p>
            </div>
            <div className="text-right">
              <span className="font-ui text-xs font-semibold text-[#C98F9D] bg-[#F4DDE3] px-3 py-1 rounded-lg">
                {matched.status}
              </span>
              <p className="font-ui text-sm font-semibold mt-1 tabular-nums text-[#765B55]">
                {formatPrice(matched.total)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {matched.trackingSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    step.completed
                      ? 'bg-[#C98F9D] text-white'
                      : 'bg-[#FFF8EF] border border-[#765B55]/20 text-[#765B55]/40'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <p
                    className={`font-ui text-sm font-medium ${
                      step.completed ? 'text-[#765B55]' : 'text-[#765B55]/50'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="font-body text-xs text-[#765B55]/65">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

