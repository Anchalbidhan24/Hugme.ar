import React, { useEffect, useState } from 'react';
import { Award, Eye, Gift, MailOpen, RefreshCw, Trash2, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Coupon, DemoOrder, OrderStatus, ProductReview } from '../../types/store';
import { SafeImage } from '../../components/SafeImage';

export const AdminOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus, fetchOrdersFromBackend, formatPrice } = useStore();
  const [showArchive, setShowArchive] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DemoOrder | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState('');
  const statuses: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Packed with Love',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
    'Refunded',
  ];

  const handleSync = async () => {
    setSyncing(true);
    setSyncNotice('');
    const res = await fetchOrdersFromBackend();
    setSyncing(false);
    if (!res.ok) {
      setSyncNotice(res.error || 'Could not sync orders from Supabase.');
    }
  };

  useEffect(() => {
    void handleSync();
  }, []);

  const liveOrders = orders.filter((o) => !o.isDemoSeed);
  const archiveOrders = orders.filter((o) => o.isDemoSeed);
  const displayedOrders = showArchive ? orders : liveOrders;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#765B55]">
            Orders Management
          </h1>
          <p className="font-body text-sm text-[#765B55]/75">
            Review storefront orders saved in Supabase, inspect gift wrapping &amp; notes, and manage fulfillment statuses.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F4DDE3]/70 hover:bg-[#F4DDE3] text-xs font-ui font-medium text-[#765B55] cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Refresh Orders'}</span>
          </button>
          {archiveOrders.length > 0 && (
            <button
              type="button"
              onClick={() => setShowArchive((prev) => !prev)}
              className="px-3.5 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs font-ui text-[#765B55] hover:border-[#C98F9D] cursor-pointer"
            >
              {showArchive
                ? 'Hide Reference Archive'
                : `Show Reference Archive (${archiveOrders.length})`}
            </button>
          )}
        </div>
      </div>

      {syncNotice && (
        <div className="p-3.5 rounded-2xl bg-[#F4DDE3]/65 border border-[#C98F9D]/40 text-xs font-body text-[#765B55]">
          {syncNotice}
        </div>
      )}

      {displayedOrders.length === 0 ? (
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-10 text-center space-y-2">
          <p className="font-display text-xl font-semibold text-[#765B55]">
            No live orders recorded yet
          </p>
          <p className="font-body text-xs text-[#765B55]/70">
            Completed checkout submissions are stored in your Supabase orders table and will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#765B55]/10 bg-[#FFF8EF]/70 text-[11px] font-ui uppercase text-[#765B55]/70">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Gift / Notes</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4 text-right">Status</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#765B55]/8 text-xs font-body">
                {displayedOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td className="py-3 px-4 font-ui font-semibold text-[#765B55]">
                      {ord.id}
                      {ord.isDemoSeed && (
                        <span className="ml-2 text-[10px] font-ui text-[#765B55]/50">
                          Archive
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-[#765B55]">{ord.customerName}</p>
                      <p className="text-[11px] text-[#765B55]/60">{ord.customerEmail}</p>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-[#765B55]/80">
                      {ord.giftSelection?.wrapName ? (
                        <p className="flex items-center gap-1">
                          <Gift className="w-3 h-3 text-[#C98F9D]" />
                          {ord.giftSelection.wrapName}
                        </p>
                      ) : (
                        <span className="text-[#765B55]/45">Standard parcel</span>
                      )}
                      {ord.giftSelection?.message && (
                        <p className="flex items-center gap-1 text-[#C98F9D] mt-0.5">
                          <MailOpen className="w-3 h-3" />
                          {ord.giftSelection.cardDesignTitle || 'Gift Note'}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4">{ord.date}</td>
                    <td className="py-3 px-4 text-right font-ui font-semibold tabular-nums">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#FFF8EF] border border-[#765B55]/15 text-xs font-ui text-[#765B55]"
                      >
                        {statuses.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(ord)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FFF8EF] border border-[#765B55]/15 hover:border-[#C98F9D] text-xs font-ui text-[#765B55] cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#C98F9D]" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#765B55]/40 backdrop-blur-xs"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative z-10 w-full max-w-2xl bg-[#FFF8EF] rounded-3xl border border-[#C98F9D]/35 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between gap-4 border-b border-[#765B55]/10 pb-4">
              <div>
                <p className="font-ui text-xs font-semibold uppercase tracking-wider text-[#C98F9D]">
                  Order Details
                </p>
                <h2 className="font-display text-2xl font-semibold text-[#765B55]">
                  {selectedOrder.id} · {selectedOrder.status}
                </h2>
                <p className="font-body text-xs text-[#765B55]/75">
                  {selectedOrder.customerName} ({selectedOrder.customerEmail}) · {selectedOrder.date}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full bg-[#FFFFFF] text-[#765B55] cursor-pointer"
                aria-label="Close order details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items & Bundle Breakdown */}
            <div className="space-y-2.5">
              <p className="font-ui text-xs font-semibold text-[#765B55]">Items Ordered</p>
              {selectedOrder.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#765B55]/10 flex items-start gap-3"
                >
                  <SafeImage
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-semibold text-[#765B55]">{item.name}</p>
                    <p className="font-ui text-[11px] text-[#765B55]/70">
                      {item.color} · {item.size} × {item.quantity}
                    </p>
                    {item.bundleItems && item.bundleItems.length > 0 && (
                      <p className="font-body text-[11px] text-[#C98F9D] mt-0.5">
                        Bundle contents:{' '}
                        {item.bundleItems.map((bi) => `${bi.quantity}× ${bi.name}`).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="font-ui text-xs font-semibold tabular-nums">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Gift Wrap & Note */}
            {(selectedOrder.giftSelection?.wrapName || selectedOrder.giftSelection?.message) && (
              <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#C98F9D]/30 space-y-2 text-xs font-body">
                <p className="font-ui font-semibold text-[#765B55] flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-[#C98F9D]" />
                  <span>Gift Wrapping &amp; Personalised Card</span>
                </p>
                {selectedOrder.giftSelection?.wrapName && (
                  <p>
                    <strong>Wrapping Style:</strong> {selectedOrder.giftSelection.wrapName} (
                    {selectedOrder.giftSelection.wrapPrice
                      ? formatPrice(selectedOrder.giftSelection.wrapPrice)
                      : 'Included'}
                    )
                  </p>
                )}
                {selectedOrder.giftSelection?.cardDesignTitle && (
                  <p>
                    <strong>Card Design:</strong> {selectedOrder.giftSelection.cardDesignTitle}
                  </p>
                )}
                {(selectedOrder.giftSelection?.recipientName ||
                  selectedOrder.giftSelection?.senderName) && (
                  <p>
                    <strong>To:</strong> {selectedOrder.giftSelection.recipientName || '—'} ·{' '}
                    <strong>From:</strong> {selectedOrder.giftSelection.senderName || '—'}
                  </p>
                )}
                {selectedOrder.giftSelection?.message && (
                  <p className="italic text-[#765B55] pt-1">
                    “{selectedOrder.giftSelection.message}”
                  </p>
                )}
              </div>
            )}

            {/* Totals & Loyalty Summary */}
            <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#765B55]/10 space-y-1.5 text-xs font-body">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-ui tabular-nums">{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              {(selectedOrder.giftWrapFee ?? 0) > 0 && (
                <div className="flex justify-between">
                  <span>Gift Wrapping</span>
                  <span className="font-ui tabular-nums">
                    +{formatPrice(selectedOrder.giftWrapFee || 0)}
                  </span>
                </div>
              )}
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-[#C98F9D]">
                  <span>Coupon Discount</span>
                  <span className="font-ui tabular-nums">
                    -{formatPrice(selectedOrder.discount)}
                  </span>
                </div>
              )}
              {(selectedOrder.loyaltyDiscount ?? 0) > 0 && (
                <div className="flex justify-between text-[#C98F9D]">
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    {selectedOrder.loyaltyRewardTitle || 'Loyalty Reward'}
                  </span>
                  <span className="font-ui tabular-nums">
                    -{formatPrice(selectedOrder.loyaltyDiscount || 0)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-ui tabular-nums">
                  {selectedOrder.shipping === 0
                    ? 'Free'
                    : formatPrice(selectedOrder.shipping)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#765B55]/10 text-sm font-ui font-semibold text-[#765B55]">
                <span>Total ({selectedOrder.paymentMethod})</span>
                <span className="tabular-nums">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminCustomersPage: React.FC = () => {
  const { customers, formatPrice } = useStore();
  const [showArchive, setShowArchive] = useState(false);

  const liveCustomers = customers.filter((c) => !c.isDemoSeed);
  const archiveCustomers = customers.filter((c) => c.isDemoSeed);
  const displayedCustomers = showArchive ? customers : liveCustomers;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#765B55]">
            Customer Directory
          </h1>
          <p className="font-body text-sm text-[#765B55]/75">
            Registered HUGME.AR customer profiles and activity.
          </p>
        </div>
        {archiveCustomers.length > 0 && (
          <button
            type="button"
            onClick={() => setShowArchive((prev) => !prev)}
            className="px-3.5 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs font-ui text-[#765B55] hover:border-[#C98F9D] cursor-pointer"
          >
            {showArchive
              ? 'Hide Reference Archive'
              : `Show Reference Archive (${archiveCustomers.length})`}
          </button>
        )}
      </div>

      {displayedCustomers.length === 0 ? (
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-10 text-center space-y-2">
          <p className="font-display text-xl font-semibold text-[#765B55]">
            No registered customer accounts yet
          </p>
          <p className="font-body text-xs text-[#765B55]/70">
            Customer profiles created in this browser or synced once accounts go live will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#765B55]/10 bg-[#FFF8EF]/70 text-[11px] font-ui uppercase text-[#765B55]/70">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Orders</th>
                  <th className="py-3 px-4 text-right">Total Spent</th>
                  <th className="py-3 px-4 text-right">Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#765B55]/8 text-xs font-body">
                {displayedCustomers.map((c) => (
                  <tr key={c.id}>
                    <td className="py-3 px-4">
                      <p className="font-ui font-medium text-[#765B55]">
                        {c.name}
                        {c.isDemoSeed && (
                          <span className="ml-2 text-[10px] font-ui text-[#765B55]/50">
                            Archive
                          </span>
                        )}
                      </p>
                      <p className="text-[11px] text-[#765B55]/60">{c.email}</p>
                    </td>
                    <td className="py-3 px-4">{c.city}</td>
                    <td className="py-3 px-4">{c.joinedDate}</td>
                    <td className="py-3 px-4 text-right font-ui tabular-nums">{c.ordersCount}</td>
                    <td className="py-3 px-4 text-right font-ui font-semibold tabular-nums">
                      {formatPrice(c.totalSpent)}
                    </td>
                    <td className="py-3 px-4 text-right font-ui text-[#C98F9D] font-medium">
                      {c.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminCouponsPage: React.FC = () => {
  const { coupons, saveCoupon, toggleCouponActive, deleteCoupon, formatPrice } = useStore();
  const [code, setCode] = useState('');
  const [desc, setDesc] = useState('');
  const [value, setValue] = useState(10);
  const [type, setType] = useState<'percentage' | 'flat'>('percentage');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    const c: Coupon = {
      id: `CPN-${Date.now()}`,
      code: code.trim().toUpperCase(),
      description: desc.trim() || 'Storefront promo code',
      discountType: type,
      discountValue: Number(value),
      minOrder: 799,
      active: true,
      expiryDate: '31 Dec 2026',
    };
    saveCoupon(c);
    setCode('');
    setDesc('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#765B55]">
          Coupon Management
        </h1>
        <p className="font-body text-sm text-[#765B55]/75">
          Manage promotional codes active across Cart and Checkout.
        </p>
      </div>

      <form
        onSubmit={handleAdd}
        className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-5 grid grid-cols-1 sm:grid-cols-5 gap-3"
      >
        <input
          type="text"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="CODE (e.g. TEDDY20)"
          className="px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs uppercase"
        />
        <input
          type="text"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description"
          className="px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs sm:col-span-2"
        />
        <div className="flex gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'percentage' | 'flat')}
            className="px-2 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs"
          >
            <option value="percentage">%</option>
            <option value="flat">₹</option>
          </select>
          <input
            type="number"
            min={1}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs tabular-nums"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-[#C98F9D] text-white font-ui text-xs font-medium cursor-pointer"
        >
          + Create Coupon
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coupons.map((cpn) => (
          <div
            key={cpn.id}
            className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-ui text-base font-semibold text-[#765B55]">{cpn.code}</span>
              <button
                type="button"
                onClick={() => toggleCouponActive(cpn.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-ui font-medium cursor-pointer ${
                  cpn.active ? 'bg-[#F4DDE3] text-[#765B55]' : 'bg-[#FFF8EF] text-[#765B55]/50'
                }`}
              >
                {cpn.active ? 'Active' : 'Paused'}
              </button>
            </div>
            <p className="font-body text-xs text-[#765B55]/80">{cpn.description}</p>
            <div className="flex items-center justify-between pt-2 border-t border-[#765B55]/10 text-xs font-ui">
              <span className="tabular-nums text-[#C98F9D] font-medium">
                {cpn.discountType === 'percentage'
                  ? `${cpn.discountValue}% off`
                  : `${formatPrice(cpn.discountValue)} off`}
              </span>
              <button
                type="button"
                onClick={() => deleteCoupon(cpn.id)}
                className="text-[#765B55]/50 hover:text-[#C98F9D] cursor-pointer"
                aria-label={`Delete ${cpn.code}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminReviewsPage: React.FC = () => {
  const { reviews, updateReviewStatus } = useStore();
  const [showArchive, setShowArchive] = useState(false);

  const liveReviews = reviews.filter((r) => !r.isDemoSeed);
  const archiveReviews = reviews.filter((r) => r.isDemoSeed);
  const displayedReviews = showArchive ? reviews : liveReviews;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#765B55]">
            Reviews Management
          </h1>
          <p className="font-body text-sm text-[#765B55]/75">
            Moderate verified customer feedback when product reviews are connected.
          </p>
        </div>
        {archiveReviews.length > 0 && (
          <button
            type="button"
            onClick={() => setShowArchive((prev) => !prev)}
            className="px-3.5 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs font-ui text-[#765B55] hover:border-[#C98F9D] cursor-pointer"
          >
            {showArchive
              ? 'Hide Reference Archive'
              : `Show Reference Archive (${archiveReviews.length})`}
          </button>
        )}
      </div>

      {displayedReviews.length === 0 ? (
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-10 text-center space-y-2">
          <p className="font-display text-xl font-semibold text-[#765B55]">
            No customer reviews submitted yet
          </p>
          <p className="font-body text-xs text-[#765B55]/70">
            Verified buyer reviews will appear here for moderation once connected.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <p className="font-ui text-xs text-[#C98F9D] font-medium">
                  {rev.productName} · {rev.rating}/5 Stars
                  {rev.isDemoSeed && (
                    <span className="ml-2 text-[10px] font-ui text-[#765B55]/50">Archive</span>
                  )}
                </p>
                <h3 className="font-display text-lg font-semibold text-[#765B55]">{rev.title}</h3>
                <p className="font-body text-xs text-[#765B55]/80">{rev.comment}</p>
                <p className="font-ui text-[11px] text-[#765B55]/60">
                  By {rev.customerName} ({rev.city}) · {rev.date}
                </p>
              </div>

              <select
                value={rev.status}
                onChange={(e) =>
                  updateReviewStatus(rev.id, e.target.value as ProductReview['status'])
                }
                className="px-3 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs font-ui text-[#765B55] self-start sm:self-center"
              >
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Hidden">Hidden</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const AdminHomepagePage: React.FC = () => {
  const { homepageContent, updateHomepageContent } = useStore();
  const [form, setForm] = useState(homepageContent);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomepageContent(form);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#765B55]">
          Homepage Content Management
        </h1>
        <p className="font-body text-sm text-[#765B55]/75">
          Update the announcement bar, hero copy, and brand story displayed on the storefront.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-6 sm:p-8 space-y-4"
      >
        <div>
          <label className="block font-ui text-xs text-[#765B55] mb-1">Announcement Bar Text</label>
          <input
            type="text"
            value={form.announcementText}
            onChange={(e) => setForm({ ...form, announcementText: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm"
          />
        </div>
        <div>
          <label className="block font-ui text-xs text-[#765B55] mb-1">Hero Heading</label>
          <input
            type="text"
            value={form.heroHeading}
            onChange={(e) => setForm({ ...form, heroHeading: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm"
          />
        </div>
        <div>
          <label className="block font-ui text-xs text-[#765B55] mb-1">Hero Description</label>
          <textarea
            rows={2}
            value={form.heroDescription}
            onChange={(e) => setForm({ ...form, heroDescription: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm"
          />
        </div>
        <div>
          <label className="block font-ui text-xs text-[#765B55] mb-1">Brand Story Heading</label>
          <input
            type="text"
            value={form.storyHeading}
            onChange={(e) => setForm({ ...form, storyHeading: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm"
          />
        </div>
        <div>
          <label className="block font-ui text-xs text-[#765B55] mb-1">Brand Story Description</label>
          <textarea
            rows={3}
            value={form.storyDescription}
            onChange={(e) => setForm({ ...form, storyDescription: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-[#C98F9D] text-white font-ui text-xs font-medium cursor-pointer"
        >
          Save Homepage Content
        </button>
      </form>
    </div>
  );
};

export const AdminBannersPage: React.FC = () => {
  const { banners, saveBanner } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#765B55]">
          Banners Management
        </h1>
        <p className="font-body text-sm text-[#765B55]/75">
          Manage and toggle active promotional banners.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((bnr) => (
          <div
            key={bnr.id}
            className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 overflow-hidden"
          >
            <div className="aspect-[16/9] bg-[#FFF8EF]">
              <SafeImage src={bnr.image} alt={bnr.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold text-[#765B55]">{bnr.title}</h3>
                <button
                  type="button"
                  onClick={() => saveBanner({ ...bnr, active: !bnr.active })}
                  className={`px-3 py-1 rounded-lg text-xs font-ui font-medium cursor-pointer ${
                    bnr.active ? 'bg-[#F4DDE3] text-[#765B55]' : 'bg-[#FFF8EF] text-[#765B55]/50'
                  }`}
                >
                  {bnr.active ? 'Active' : 'Inactive'}
                </button>
              </div>
              <p className="font-body text-xs text-[#765B55]/80">{bnr.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminSubscribersPage: React.FC = () => {
  const { subscribers } = useStore();
  const [showArchive, setShowArchive] = useState(false);

  const liveSubscribers = subscribers.filter((s) => !s.isDemoSeed);
  const archiveSubscribers = subscribers.filter((s) => s.isDemoSeed);
  const displayedSubscribers = showArchive ? subscribers : liveSubscribers;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#765B55]">
            Newsletter Subscribers
          </h1>
          <p className="font-body text-sm text-[#765B55]/75">
            Subscribers collected via storefront newsletter forms.
          </p>
        </div>
        {archiveSubscribers.length > 0 && (
          <button
            type="button"
            onClick={() => setShowArchive((prev) => !prev)}
            className="px-3.5 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs font-ui text-[#765B55] hover:border-[#C98F9D] cursor-pointer"
          >
            {showArchive
              ? 'Hide Reference Archive'
              : `Show Reference Archive (${archiveSubscribers.length})`}
          </button>
        )}
      </div>

      {displayedSubscribers.length === 0 ? (
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-10 text-center space-y-2">
          <p className="font-display text-xl font-semibold text-[#765B55]">
            No newsletter sign-ups recorded in this session
          </p>
          <p className="font-body text-xs text-[#765B55]/70">
            Emails entered in the storefront newsletter forms are stored locally in this browser.
          </p>
        </div>
      ) : (
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#765B55]/10 bg-[#FFF8EF]/70 text-[11px] font-ui uppercase text-[#765B55]/70">
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#765B55]/8 text-xs font-body">
              {displayedSubscribers.map((s) => (
                <tr key={s.id}>
                  <td className="py-3 px-4 font-ui font-medium text-[#765B55]">
                    {s.email}
                    {s.isDemoSeed && (
                      <span className="ml-2 text-[10px] font-ui text-[#765B55]/50">Archive</span>
                    )}
                  </td>
                  <td className="py-3 px-4">{s.source}</td>
                  <td className="py-3 px-4 text-right">{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export const AdminEnquiriesPage: React.FC = () => {
  const { enquiries, markEnquiryReplied, fetchEnquiriesFromBackend } = useStore();
  const [showArchive, setShowArchive] = useState(false);

  useEffect(() => {
    void fetchEnquiriesFromBackend();
  }, []);

  const liveEnquiries = enquiries.filter((e) => !e.isDemoSeed);
  const archiveEnquiries = enquiries.filter((e) => e.isDemoSeed);
  const displayedEnquiries = showArchive ? enquiries : liveEnquiries;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#765B55]">
            Customer Enquiries
          </h1>
          <p className="font-body text-sm text-[#765B55]/75">
            Messages submitted from the storefront Contact Us page appear here.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void fetchEnquiriesFromBackend()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F4DDE3]/70 hover:bg-[#F4DDE3] text-xs font-ui font-medium text-[#765B55] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          {archiveEnquiries.length > 0 && (
            <button
              type="button"
              onClick={() => setShowArchive((prev) => !prev)}
              className="px-3.5 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-xs font-ui text-[#765B55] hover:border-[#C98F9D] cursor-pointer"
            >
              {showArchive
                ? 'Hide Reference Archive'
                : `Show Reference Archive (${archiveEnquiries.length})`}
            </button>
          )}
        </div>
      </div>

      {displayedEnquiries.length === 0 ? (
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-10 text-center space-y-2">
          <p className="font-display text-xl font-semibold text-[#765B55]">
            No customer enquiries yet
          </p>
          <p className="font-body text-xs text-[#765B55]/70">
            Messages sent through the Contact Us form will show up here for follow-up.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedEnquiries.map((enq) => (
            <div
              key={enq.id}
              className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-ui">
                  <span className="font-semibold text-[#765B55]">{enq.name}</span>
                  <span className="text-[#765B55]/50">·</span>
                  <span className="text-[#765B55]/70">{enq.email}</span>
                  <span className="text-[#765B55]/50">·</span>
                  <span className="text-[#C98F9D] font-medium">{enq.status}</span>
                  {enq.isDemoSeed && (
                    <span className="text-[10px] text-[#765B55]/50">· Archive</span>
                  )}
                </div>
                <h3 className="font-display text-lg font-semibold text-[#765B55]">{enq.subject}</h3>
                <p className="font-body text-sm text-[#765B55]/80">{enq.message}</p>
              </div>
              {enq.status === 'New' && (
                <button
                  type="button"
                  onClick={() => markEnquiryReplied(enq.id)}
                  className="px-4 py-2 rounded-xl bg-[#F4DDE3] text-[#765B55] font-ui text-xs font-medium shrink-0 cursor-pointer"
                >
                  Mark Replied
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const AdminSettingsPage: React.FC = () => {
  const { siteSettings, updateSiteSettings, resetDemoData } = useStore();
  const [form, setForm] = useState(siteSettings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(form);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-[#765B55]">
          Website Settings
        </h1>
        <p className="font-body text-sm text-[#765B55]/75">
          Manage HUGME.AR storefront configuration and shipping preferences.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-6 sm:p-8 space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-ui text-xs text-[#765B55] mb-1">Brand Name</label>
            <input
              type="text"
              value={form.brandName}
              onChange={(e) => setForm({ ...form, brandName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm"
            />
          </div>
          <div>
            <label className="block font-ui text-xs text-[#765B55] mb-1">Tagline</label>
            <input
              type="text"
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm"
            />
          </div>
          <div>
            <label className="block font-ui text-xs text-[#765B55] mb-1">Support Email</label>
            <input
              type="email"
              value={form.supportEmail}
              onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm"
            />
          </div>
          <div>
            <label className="block font-ui text-xs text-[#765B55] mb-1">Support Phone</label>
            <input
              type="text"
              value={form.supportPhone}
              onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm"
            />
          </div>
          <div>
            <label className="block font-ui text-xs text-[#765B55] mb-1">
              Free Shipping Threshold (INR)
            </label>
            <input
              type="number"
              value={form.freeShippingThreshold}
              onChange={(e) =>
                setForm({ ...form, freeShippingThreshold: Number(e.target.value) })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm tabular-nums"
            />
          </div>
          <div>
            <label className="block font-ui text-xs text-[#765B55] mb-1">
              Standard Shipping Fee (INR)
            </label>
            <input
              type="number"
              value={form.standardShippingFee}
              onChange={(e) =>
                setForm({ ...form, standardShippingFee: Number(e.target.value) })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm tabular-nums"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6 pt-2">
          <label className="inline-flex items-center gap-2 text-xs font-ui text-[#765B55] cursor-pointer">
            <input
              type="checkbox"
              checked={form.codEnabled}
              onChange={(e) => setForm({ ...form, codEnabled: e.target.checked })}
              className="accent-[#C98F9D]"
            />
            <span>Enable Cash on Delivery</span>
          </label>
          <label className="inline-flex items-center gap-2 text-xs font-ui text-[#765B55] cursor-pointer">
            <input
              type="checkbox"
              checked={form.onlinePayDemoEnabled}
              onChange={(e) => setForm({ ...form, onlinePayDemoEnabled: e.target.checked })}
              className="accent-[#C98F9D]"
            />
            <span>Enable Online Payment</span>
          </label>
        </div>

        <div className="pt-4 flex flex-wrap gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#C98F9D] text-white font-ui text-xs font-medium cursor-pointer"
          >
            Save Website Settings
          </button>
          <button
            type="button"
            onClick={resetDemoData}
            className="px-5 py-2.5 rounded-xl border border-[#765B55]/20 text-[#765B55] font-ui text-xs font-medium cursor-pointer"
          >
            Restore Default Catalog
          </button>
        </div>
      </form>
    </div>
  );
};
