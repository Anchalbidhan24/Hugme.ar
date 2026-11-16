import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal, ToastContainer } from './components/SearchAndToast';
import { BackToTop } from './components/BackToTop';
import { HomePage } from './pages/store/HomePage';
import { ShopPage } from './pages/store/ShopPage';
import { ProductDetailPage } from './pages/store/ProductDetailPage';
import { BundlesPage } from './pages/store/BundlesPage';
import { LoyaltyPage } from './pages/store/LoyaltyPage';
import {
  CartPage,
  CheckoutPreviewPage,
  WishlistPage,
} from './pages/store/WishlistAndCartPages';
import {
  AccountPage,
  AuthPage,
  OrderTrackingPreviewPage,
} from './pages/store/AuthAndAccountPages';
import {
  AboutPage,
  ContactPage,
  FaqPage,
  PolicyPage,
} from './pages/store/ContentPages';
import { AdminLayout, AdminLoginPage } from './pages/admin/AdminLoginAndLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import {
  AdminCategoriesPage,
  AdminInventoryPage,
  AdminProductFormPage,
  AdminProductsPage,
} from './pages/admin/AdminCatalogPages';
import {
  AdminBundlesPage,
  AdminGiftMessagesPage,
  AdminGiftWrappingPage,
  AdminLoyaltyPage,
} from './pages/admin/AdminFeaturesPages';
import {
  AdminBannersPage,
  AdminCouponsPage,
  AdminCustomersPage,
  AdminEnquiriesPage,
  AdminHomepagePage,
  AdminOrdersPage,
  AdminReviewsPage,
  AdminSettingsPage,
  AdminSubscribersPage,
} from './pages/admin/AdminOpsAndContentPages';

const AppRouter: React.FC = () => {
  const { route, adminLoggedIn, isCartOpen, isSearchOpen } = useStore();

  const isAdminRoute = route.startsWith('admin-');

  if (route === 'admin-login' || (isAdminRoute && !adminLoggedIn)) {
    return (
      <>
        <AdminLoginPage />
        <ToastContainer />
      </>
    );
  }

  if (isAdminRoute) {
    const renderAdminContent = () => {
      switch (route) {
        case 'admin-dashboard':
          return <AdminDashboardPage />;
        case 'admin-products':
          return <AdminProductsPage />;
        case 'admin-product-form':
          return <AdminProductFormPage />;
        case 'admin-categories':
          return <AdminCategoriesPage />;
        case 'admin-bundles':
          return <AdminBundlesPage />;
        case 'admin-gift-wrapping':
          return <AdminGiftWrappingPage />;
        case 'admin-gift-messages':
          return <AdminGiftMessagesPage />;
        case 'admin-loyalty':
          return <AdminLoyaltyPage />;
        case 'admin-orders':
          return <AdminOrdersPage />;
        case 'admin-customers':
          return <AdminCustomersPage />;
        case 'admin-inventory':
          return <AdminInventoryPage />;
        case 'admin-coupons':
          return <AdminCouponsPage />;
        case 'admin-reviews':
          return <AdminReviewsPage />;
        case 'admin-homepage':
          return <AdminHomepagePage />;
        case 'admin-banners':
          return <AdminBannersPage />;
        case 'admin-subscribers':
          return <AdminSubscribersPage />;
        case 'admin-enquiries':
          return <AdminEnquiriesPage />;
        case 'admin-settings':
          return <AdminSettingsPage />;
        default:
          return <AdminDashboardPage />;
      }
    };

    return (
      <>
        <AdminLayout>{renderAdminContent()}</AdminLayout>
        <ToastContainer />
      </>
    );
  }

  const renderStoreContent = () => {
    switch (route) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage mode="shop" />;
      case 'categories':
        return <ShopPage mode="categories" />;
      case 'new-arrivals':
        return <ShopPage mode="new-arrivals" />;
      case 'bestsellers':
        return <ShopPage mode="bestsellers" />;
      case 'gift-collection':
        return <ShopPage mode="gift-collection" />;
      case 'bundles':
        return <BundlesPage />;
      case 'loyalty':
        return <LoyaltyPage />;
      case 'product':
        return <ProductDetailPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPreviewPage />;
      case 'login':
        return <AuthPage mode="login" />;
      case 'register':
        return <AuthPage mode="register" />;
      case 'forgot-password':
        return <AuthPage mode="forgot-password" />;
      case 'account':
        return <AccountPage initialTab="overview" />;
      case 'orders':
        return <AccountPage initialTab="orders" />;
      case 'order-tracking':
        return <OrderTrackingPreviewPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'faq':
        return <FaqPage />;
      case 'privacy-policy':
        return <PolicyPage type="privacy-policy" />;
      case 'terms':
        return <PolicyPage type="terms" />;
      case 'shipping-policy':
        return <PolicyPage type="shipping-policy" />;
      case 'return-policy':
        return <PolicyPage type="return-policy" />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8EF] text-[#765B55]">
      <Header />
      <main className="flex-1">{renderStoreContent()}</main>
      <Footer />
      <BackToTop hidden={isCartOpen || isSearchOpen} routeKey={route} />
      <CartDrawer />
      <SearchModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppRouter />
    </StoreProvider>
  );
}
