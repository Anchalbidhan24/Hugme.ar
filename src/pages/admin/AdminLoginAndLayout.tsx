import React, { useState } from 'react';
import {
  ArrowLeft,
  Award,
  FolderTree,
  Gift,
  Image as ImageIcon,
  Inbox,
  Layers,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Mail,
  MailOpen,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Star,
  Store,
  Tag,
  Users,
  Boxes,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../../components/BrandLogo';
import { RouteKey } from '../../types/store';

export const AdminLoginPage: React.FC = () => {
  const { loginAdminDemo, navigate } = useStore();
  const [email, setEmail] = useState('studio@hugme.ar');
  const [password, setPassword] = useState('studio-access');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAdminDemo();
  };

  return (
    <div className="min-h-screen bg-[#FFF8EF] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FFFFFF] rounded-3xl border border-[#765B55]/10 p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center pb-1">
            <BrandLogo variant="primary" size="lg" />
          </div>
          <p className="font-ui text-xs font-medium uppercase tracking-wider text-[#C98F9D]">
            HUGME.AR Management
          </p>
          <h1 className="font-display text-3xl font-semibold text-[#765B55]">
            Studio Workspace
          </h1>
          <p className="font-body text-xs text-[#765B55]/75">
            Manage catalog, content, and storefront preferences. Changes save in this browser until live backend sync is connected.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-ui text-xs text-[#765B55] mb-1">Studio Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm text-[#765B55]"
            />
          </div>
          <div>
            <label className="block font-ui text-xs text-[#765B55] mb-1">Access Passcode</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 text-sm text-[#765B55]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#C98F9D] hover:bg-[#b87b8a] text-white font-ui text-sm font-medium transition-colors cursor-pointer"
          >
            Open Studio Workspace
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate('home')}
          className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-ui text-[#765B55]/75 hover:text-[#C98F9D] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Storefront</span>
        </button>
      </div>
    </div>
  );
};

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { route, navigate, logoutAdminDemo } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: { label: string; route: RouteKey; icon: React.ComponentType<{ className?: string }> }[] = [
    { label: 'Dashboard', route: 'admin-dashboard', icon: LayoutDashboard },
    { label: 'Products', route: 'admin-products', icon: Package },
    { label: 'Categories', route: 'admin-categories', icon: FolderTree },
    { label: 'Bundles', route: 'admin-bundles', icon: Layers },
    { label: 'Gift Wrapping', route: 'admin-gift-wrapping', icon: Gift },
    { label: 'Gift Notes & Cards', route: 'admin-gift-messages', icon: MailOpen },
    { label: 'Loyalty Rewards', route: 'admin-loyalty', icon: Award },
    { label: 'Orders', route: 'admin-orders', icon: ShoppingCart },
    { label: 'Customers', route: 'admin-customers', icon: Users },
    { label: 'Reviews', route: 'admin-reviews', icon: Star },
    { label: 'Coupons', route: 'admin-coupons', icon: Tag },
    { label: 'Inventory', route: 'admin-inventory', icon: Boxes },
    { label: 'Homepage Content', route: 'admin-homepage', icon: LayoutTemplate },
    { label: 'Banners', route: 'admin-banners', icon: ImageIcon },
    { label: 'Newsletter Subscribers', route: 'admin-subscribers', icon: Mail },
    { label: 'Enquiries', route: 'admin-enquiries', icon: Inbox },
    { label: 'Website Settings', route: 'admin-settings', icon: Settings },
  ];

  const activeTitle =
    route === 'admin-product-form'
      ? 'Add / Edit Product'
      : navItems.find((n) => n.route === route)?.label || 'Dashboard';

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#FFFFFF] border-r border-[#765B55]/10">
      <div className="px-5 py-5 border-b border-[#765B55]/10 flex items-center justify-between">
        <BrandLogo onClick={() => navigate('admin-dashboard')} size="sm" />
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-[#765B55] hover:bg-[#F4DDE3]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-4 py-2.5 bg-[#F4DDE3]/45 border-b border-[#C98F9D]/20 text-[11px] font-ui text-[#765B55]">
        HUGME.AR Studio · Browser Workspace
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            route === item.route ||
            (route === 'admin-product-form' && item.route === 'admin-products');
          return (
            <button
              key={item.route}
              type="button"
              onClick={() => {
                setSidebarOpen(false);
                navigate(item.route);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-ui font-medium transition-colors cursor-pointer text-left ${
                active
                  ? 'bg-[#F4DDE3] text-[#765B55] font-semibold'
                  : 'text-[#765B55]/80 hover:bg-[#FFF8EF]'
              }`}
            >
              <Icon className="w-4 h-4 text-[#C98F9D] shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#765B55]/10 space-y-1.5">
        <button
          type="button"
          onClick={() => navigate('home')}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-ui font-medium text-[#765B55] hover:bg-[#FFF8EF] cursor-pointer"
        >
          <Store className="w-4 h-4 text-[#C98F9D]" />
          <span>View Storefront</span>
        </button>
        <button
          type="button"
          onClick={logoutAdminDemo}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-ui font-medium text-[#765B55]/80 hover:bg-[#F4DDE3]/50 cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-[#C98F9D]" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF8EF] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#765B55]/35"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-10 w-64 h-full">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-[#FFFFFF] border-b border-[#765B55]/10 h-16 px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#765B55] hover:bg-[#F4DDE3]/60 cursor-pointer"
              aria-label="Open management menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-ui text-[#765B55]/70 truncate">
              <span>HUGME.AR Studio</span>
              <span>/</span>
              <span className="text-[#765B55] font-semibold truncate">{activeTitle}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('home')}
            className="px-3.5 py-2 rounded-xl bg-[#FFF8EF] border border-[#765B55]/15 hover:border-[#C98F9D] text-xs font-ui font-medium text-[#765B55] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Open Storefront
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};
