import React from 'react';
import {
  AlertCircle,
  ArrowRight,
  Clock,
  IndianRupee,
  Package,
  ShoppingCart,
  Users,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminDashboardPage: React.FC = () => {
  const { products, orders, customers, enquiries, formatPrice, navigate } = useStore();

  const liveOrders = orders.filter((o) => !o.isDemoSeed);
  const liveCustomers = customers.filter((c) => !c.isDemoSeed);
  const liveEnquiries = enquiries.filter((e) => !e.isDemoSeed);

  const totalSales = liveOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = liveOrders.filter((o) => o.status === 'Pending').length;
  const lowStockProducts = products.filter((p) => p.stock <= 10);

  const kpis = [
    {
      label: 'Recorded Sales',
      value: formatPrice(totalSales),
      note: 'From live storefront orders',
      icon: IndianRupee,
      bg: 'bg-[#F4DDE3]/60',
    },
    {
      label: 'Orders',
      value: String(liveOrders.length),
      note: 'Active storefront orders',
      icon: ShoppingCart,
      bg: 'bg-[#E9E2F5]/70',
    },
    {
      label: 'Customers',
      value: String(liveCustomers.length),
      note: 'Registered profiles',
      icon: Users,
      bg: 'bg-[#F4DCCB]/70',
    },
    {
      label: 'Catalog Products',
      value: String(products.length),
      note: 'Active plushies',
      icon: Package,
      bg: 'bg-[#FFFFFF]',
    },
    {
      label: 'Pending',
      value: String(pendingOrders),
      note: 'Awaiting dispatch',
      icon: Clock,
      bg: 'bg-[#FFFFFF]',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-[#765B55]">
            HUGME.AR Overview
          </h1>
          <p className="font-body text-sm text-[#765B55]/75">
            Catalog inventory, storefront settings, and live workspace activity.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('admin-product-form')}
          className="px-4 py-2.5 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] text-white font-ui text-xs font-medium cursor-pointer self-start"
        >
          + Add New Plushie
        </button>
      </div>

      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className={`${kpi.bg} rounded-2xl border border-[#765B55]/10 p-5 space-y-2`}
            >
              <div className="flex items-center justify-between">
                <span className="font-ui text-xs text-[#765B55]/75">{kpi.label}</span>
                <Icon className="w-4 h-4 text-[#C98F9D] shrink-0" />
              </div>
              <p className="font-display text-2xl font-semibold text-[#765B55] tabular-nums">
                {kpi.value}
              </p>
              <p className="font-body text-[11px] text-[#765B55]/65">{kpi.note}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-7 bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-[#765B55]">
              Recent Orders
            </h2>
            <button
              type="button"
              onClick={() => navigate('admin-orders')}
              className="inline-flex items-center gap-1 font-ui text-xs text-[#C98F9D] hover:underline cursor-pointer"
            >
              Manage orders <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {liveOrders.length === 0 ? (
            <div className="py-10 text-center space-y-1.5 border border-dashed border-[#765B55]/15 rounded-2xl bg-[#FFF8EF]/50 px-4">
              <p className="font-ui text-xs font-medium text-[#765B55]">
                No live storefront orders recorded yet
              </p>
              <p className="font-body text-xs text-[#765B55]/65">
                Online checkout processing is offline until payment and backend services are connected.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#765B55]/10 text-[11px] font-ui text-[#765B55]/65 uppercase">
                    <th className="py-2.5 pr-3">Order ID</th>
                    <th className="py-2.5 pr-3">Customer</th>
                    <th className="py-2.5 pr-3">Status</th>
                    <th className="py-2.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#765B55]/8 text-xs font-body">
                  {liveOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#FFF8EF]/60">
                      <td className="py-3 pr-3 font-ui font-medium text-[#765B55]">{ord.id}</td>
                      <td className="py-3 pr-3">{ord.customerName}</td>
                      <td className="py-3 pr-3">
                        <span className="font-ui text-[11px] text-[#C98F9D] font-medium">
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3 text-right font-ui font-semibold tabular-nums">
                        {formatPrice(ord.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock & Enquiries */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-[#765B55] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#C98F9D]" />
                Low Stock Watch
              </h2>
              <button
                type="button"
                onClick={() => navigate('admin-inventory')}
                className="font-ui text-xs text-[#C98F9D] hover:underline cursor-pointer"
              >
                Manage Stock
              </button>
            </div>
            <div className="space-y-2.5">
              {lowStockProducts.length === 0 ? (
                <p className="font-body text-xs text-[#765B55]/65">
                  All catalog items are stocked above threshold.
                </p>
              ) : (
                lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#FFF8EF] text-xs"
                  >
                    <span className="font-ui font-medium text-[#765B55] truncate pr-2">
                      {p.name}
                    </span>
                    <span className="font-ui font-semibold text-[#C98F9D] tabular-nums shrink-0">
                      {p.stock} left
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-[#FFFFFF] rounded-2xl border border-[#765B55]/10 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-[#765B55]">
                Latest Enquiries
              </h2>
              <button
                type="button"
                onClick={() => navigate('admin-enquiries')}
                className="font-ui text-xs text-[#C98F9D] hover:underline cursor-pointer"
              >
                Open Inbox
              </button>
            </div>
            {liveEnquiries.length === 0 ? (
              <p className="font-body text-xs text-[#765B55]/65">
                No new enquiries submitted in this session.
              </p>
            ) : (
              liveEnquiries.slice(0, 2).map((enq) => (
                <div key={enq.id} className="p-3 rounded-xl bg-[#FFF8EF] text-xs space-y-1">
                  <div className="flex justify-between font-ui font-medium text-[#765B55]">
                    <span>{enq.name}</span>
                    <span className="text-[#C98F9D]">{enq.status}</span>
                  </div>
                  <p className="font-body text-[#765B55]/75 line-clamp-1">{enq.subject}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
