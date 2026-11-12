import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Search, 
  Heart, 
  Layers, 
  Boxes, 
  Menu, 
  X,
  Droplets,
  User as UserIcon,
  Crown,
  ClipboardList,
  ChevronDown,
  LogOut,
  ShieldCheck,
  RotateCcw,
  Database,
  Code2,
  Download,
  Loader2
} from 'lucide-react';
import { cartModel, CartState } from '../../models/CartModel';
import { productModel } from '../../models/ProductModel';
import { userModel } from '../../models/UserModel';
import { productController } from '../../controllers/ProductController';
import { cartController } from '../../controllers/CartController';
import { skinQuizController } from '../../controllers/SkinQuizController';
import { mvcInspectorController } from '../../controllers/MVCInspectorController';
import { visualStudioModalController } from '../../controllers/VisualStudioModalController';
import { authController } from '../../controllers/AuthController';
import { notificationController } from '../../controllers/NotificationController';
import { exportProjectAsZip } from '../../utils/projectZipExporter';
import { FilterState, ProductCategory, User } from '../../types';

export const NavbarView: React.FC = () => {
  const [cartState, setCartState] = useState<CartState>(cartModel.getState());
  const [filterState, setFilterState] = useState<FilterState>(productController['filterState']);
  const [wishlistCount, setWishlistCount] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<User | null>(userModel.getCurrentUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleDownloadZip = async () => {
    try {
      setIsExporting(true);
      notificationController.show('info', 'Đang nén dự án...', 'Hệ thống đang chuẩn bị file zip cho bạn');
      await exportProjectAsZip();
      notificationController.show('success', 'Thành công', 'Đã tải GlowCare_Skincare_MVC_VisualStudio.zip về máy');
    } catch {
      notificationController.show('error', 'Lỗi', 'Không thể tạo file zip, vui lòng thử lại');
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const unsubCart = cartModel.subscribe(setCartState);
    const unsubFilter = productController.subscribeFilter(setFilterState);
    const unsubWishlist = productModel.subscribeWishlist((w) => setWishlistCount(w.size));
    const unsubUser = userModel.subscribe(setCurrentUser);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      unsubCart();
      unsubFilter();
      unsubWishlist();
      unsubUser();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const categories: ProductCategory[] = [
    'Tất cả',
    'Làm sạch',
    'Toner & Nước cân bằng',
    'Serum & Tinh chất',
    'Kem dưỡng ẩm',
    'Chống nắng',
    'Đặc trị & Tẩy da chết'
  ];

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'WAREHOUSE_STAFF':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SALES_STAFF':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CUSTOMER':
      default:
        return 'bg-rose-100 text-rose-800 border-rose-200';
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Crown className="w-3 h-3 text-amber-600" />;
      case 'WAREHOUSE_STAFF':
        return <Boxes className="w-3 h-3 text-blue-600" />;
      case 'SALES_STAFF':
        return <ClipboardList className="w-3 h-3 text-emerald-600" />;
      case 'CUSTOMER':
      default:
        return <UserIcon className="w-3 h-3 text-rose-600" />;
    }
  };

  return (
    <header 
      id="main-navbar"
      className={`sticky top-0 z-40 transition-all duration-200 ${
        isScrolled 
          ? 'bg-stone-50/90 backdrop-blur-md shadow-sm border-b border-stone-200/80' 
          : 'bg-stone-50 border-b border-stone-200'
      }`}
    >
      {/* Top Banner Notice */}
      <div id="top-announcement-bar" className="bg-gradient-to-r from-rose-950 via-stone-900 to-rose-950 text-stone-100 text-xs py-2 px-4 font-medium border-b border-rose-900/50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <button
              id="top-bar-download-btn"
              onClick={handleDownloadZip}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 hover:bg-amber-300 active:scale-95 text-stone-950 text-xs font-bold rounded-full shadow-md transition-all cursor-pointer"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 text-stone-950" />
              )}
              <span>TẢI TOÀN BỘ CODE (.ZIP CHO VISUAL STUDIO)</span>
            </button>
            <span className="hidden md:inline text-stone-300 text-[11px]">
              Kèm GlowCare.sln, schema_mssql.sql & schema_mysql.sql
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-stone-300">
            <span>Mã <b>GLOW20</b> giảm 20%</span>
            <span className="hidden md:inline">• Miễn phí giao hàng từ 499.000 ₫</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button 
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-stone-600 hover:text-stone-900 rounded-lg"
              aria-label="Mở menu điều hướng"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <a 
              id="brand-logo"
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                productController.resetFilters();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center border border-rose-200 group-hover:scale-105 transition-transform">
                <Droplets className="w-5 h-5 fill-rose-600/30" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 group-hover:text-rose-950 transition-colors">
                  GlowCare
                </span>
                <span className="text-[10px] text-stone-500 uppercase tracking-widest -mt-1 font-semibold">
                  Skincare Lab • MVC
                </span>
              </div>
            </a>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                id="navbar-search-input"
                type="text"
                value={filterState.searchQuery}
                onChange={(e) => productController.setSearchQuery(e.target.value)}
                placeholder="Tìm serum, kem chống nắng, BHA, Niacinamide..."
                className="w-full pl-10 pr-9 py-2.5 bg-stone-100/90 border border-stone-300 rounded-full text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-400 transition-all"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              {filterState.searchQuery && (
                <button
                  id="clear-search-btn"
                  onClick={() => productController.setSearchQuery('')}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-700"
                  aria-label="Xóa tìm kiếm"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Skin Quiz Button */}
            <button
              id="open-skin-quiz-btn"
              onClick={() => skinQuizController.openQuiz()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 hover:border-rose-300 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span>Chẩn Đoán Da & Routine</span>
            </button>

            {/* MVC Inspector Button */}
            <button
              id="open-mvc-inspector-btn"
              onClick={() => mvcInspectorController.toggle()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100 transition-colors shadow-xs"
              title="Kiểm tra tương tác tầng Model - View - Controller"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden xl:inline">Kiến Trúc MVC</span>
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            </button>

            {/* Visual Studio & SQL Button */}
            <button
              id="open-vs-sql-btn"
              onClick={() => visualStudioModalController.open('vscode')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 transition-colors shadow-xs"
              title="Hướng dẫn chạy dự án trên Visual Studio và CSDL SQL Server / MySQL"
            >
              <Code2 className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden xl:inline">VS & SQL</span>
              <Database className="w-3 h-3 text-rose-500 hidden sm:inline" />
            </button>

            {/* Quick Download ZIP Button */}
            <button
              id="navbar-download-zip-btn"
              onClick={handleDownloadZip}
              disabled={isExporting}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-amber-400 hover:bg-amber-300 text-stone-950 transition-colors shadow-xs cursor-pointer active:scale-95"
              title="Tải trọn bộ file .ZIP về máy"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Tải .ZIP</span>
            </button>

            {/* Stock Manager (Admin Demo) Button */}
            <button
              id="open-stock-modal-btn"
              onClick={() => productController.openStockModal()}
              className="p-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors relative"
              title="Quản lý tồn kho (Demo thay đổi dữ liệu Model)"
              aria-label="Quản lý tồn kho"
            >
              <Boxes className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              id="open-wishlist-btn"
              onClick={() => productController.openWishlistModal()}
              className="p-2.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors relative"
              title="Danh sách yêu thích"
              aria-label="Yêu thích"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="open-cart-btn"
              onClick={() => cartController.openCart()}
              className="flex items-center gap-2 pl-3 pr-4 py-2 bg-stone-900 text-white rounded-full hover:bg-stone-800 active:scale-95 transition-all shadow-sm"
              aria-label="Mở giỏ hàng"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartState.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {cartState.itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-semibold">
                {cartState.subtotal > 0
                  ? `${cartState.subtotal.toLocaleString('vi-VN')} ₫`
                  : 'Giỏ hàng'}
              </span>
            </button>

            {/* User Account & RBAC Dropdown */}
            <div className="relative">
              {currentUser ? (
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full border transition-all ${
                    userDropdownOpen
                      ? 'bg-stone-100 border-stone-400 ring-2 ring-stone-200'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                  aria-label="Menu tài khoản và phân quyền"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-stone-200 flex-shrink-0 flex items-center justify-center">
                    {currentUser.avatarUrl ? (
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-4 h-4 text-stone-600" />
                    )}
                  </div>
                  <div className="hidden md:flex flex-col items-start text-left">
                    <span className="text-xs font-bold text-stone-800 leading-none truncate max-w-[100px]">
                      {currentUser.fullName}
                    </span>
                    <span className={`text-[10px] font-semibold mt-0.5 px-1.5 py-0.2 rounded-sm border ${getRoleColor(currentUser.role)} flex items-center gap-1`}>
                      {getRoleIcon(currentUser.role)}
                      <span>{currentUser.role === 'SUPER_ADMIN' ? 'Admin' : currentUser.role === 'WAREHOUSE_STAFF' ? 'Thủ kho' : currentUser.role === 'SALES_STAFF' ? 'Sales' : 'Khách'}</span>
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>
              ) : (
                <button
                  id="open-login-btn"
                  onClick={() => authController.openAuthModal('login')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-xs"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Đăng Nhập</span>
                </button>
              )}

              {/* Dropdown Menu */}
              {userDropdownOpen && currentUser && (
                <div
                  id="user-dropdown-menu"
                  className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  {/* User Profile Card */}
                  <div className="p-3 bg-stone-50 rounded-xl mb-2 border border-stone-200/70">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-stone-200 flex-shrink-0">
                        <img
                          src={currentUser.avatarUrl || ''}
                          alt={currentUser.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-stone-900 truncate">
                          {currentUser.fullName}
                        </p>
                        <p className="text-[11px] text-stone-500 truncate">
                          @{currentUser.username} • {currentUser.email}
                        </p>
                        <span className={`inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRoleColor(currentUser.role)}`}>
                          {getRoleIcon(currentUser.role)}
                          <span>{currentUser.roleName}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions according to RBAC permissions */}
                  <div className="space-y-1">
                    {/* Order Management - Sales & Admin */}
                    {currentUser.permissions.includes('order:view_all') && (
                      <button
                        onClick={() => authController.openOrderManagementModal()}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <ClipboardList className="w-4 h-4 text-emerald-600" />
                          <span>Quản Lý Đơn Hàng</span>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">
                          Sales/Admin
                        </span>
                      </button>
                    )}

                    {/* Stock Management - Warehouse & Admin */}
                    {currentUser.permissions.includes('inventory:update_stock') && (
                      <button
                        onClick={() => productController.openStockModal()}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-blue-50 hover:text-blue-800 rounded-xl transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Boxes className="w-4 h-4 text-blue-600" />
                          <span>Quản Lý Tồn Kho</span>
                        </div>
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">
                          Kho/Admin
                        </span>
                      </button>
                    )}

                    {/* Login / Register Modal */}
                    <button
                      onClick={() => authController.openAuthModal('login')}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-stone-500" />
                      <span>Đăng Nhập / Tạo Tài Khoản Khác</span>
                    </button>

                    <div className="border-t border-stone-200 my-1 pt-1">
                      <button
                        onClick={() => authController.logout()}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng Xuất</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Categories Bar - Always clearly visible */}
        <nav id="category-nav-bar" className="flex items-center gap-1 pb-2.5 overflow-x-auto no-scrollbar border-t border-stone-200/70 pt-2 text-nowrap">
          {categories.map((cat) => {
            const isActive = filterState.category === cat;
            return (
              <button
                key={cat}
                id={`cat-nav-${cat}`}
                onClick={() => productController.setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Search & Menu Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="lg:hidden border-t border-stone-200 bg-stone-50 px-4 py-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="relative w-full">
            <input
              id="mobile-search-input"
              type="text"
              value={filterState.searchQuery}
              onChange={(e) => productController.setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm mỹ phẩm..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-100 border border-stone-300 rounded-full text-sm focus:outline-none"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          </div>

          <button
            id="mobile-quiz-btn"
            onClick={() => {
              skinQuizController.openQuiz();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-100 text-rose-900 rounded-xl text-sm font-semibold border border-rose-200"
          >
            <Sparkles className="w-4 h-4 text-rose-600" />
            Làm Chẩn Đoán Routine Da
          </button>

          {/* Mobile Download ZIP Button */}
          <button
            id="mobile-download-zip-btn"
            onClick={async () => {
              setMobileMenuOpen(false);
              await handleDownloadZip();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 bg-amber-400 active:bg-amber-300 text-stone-950 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4 text-stone-950" />
            <span>TẢI TOÀN BỘ CODE (.ZIP CHO VISUAL STUDIO)</span>
          </button>

          {/* Quick Tools for Developers */}
          <div className="grid grid-cols-2 gap-2">
            <button
              id="mobile-vs-sql-btn"
              onClick={() => {
                visualStudioModalController.open('vscode');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-semibold"
            >
              <Code2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Chạy VS & SQL</span>
            </button>
            <button
              id="mobile-mvc-btn"
              onClick={() => {
                mvcInspectorController.toggle();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-xl text-xs font-semibold"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Kiến Trúc MVC</span>
            </button>
          </div>

          {/* User Mobile Profile & RBAC Section */}
          <div className="p-3 bg-white rounded-2xl border border-stone-200 space-y-2.5">
            {currentUser ? (
              <>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                    <img
                      src={currentUser.avatarUrl || ''}
                      alt={currentUser.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-stone-900 truncate">{currentUser.fullName}</p>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRoleColor(currentUser.role)}`}>
                      {getRoleIcon(currentUser.role)}
                      <span>{currentUser.roleName}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-100">
                  <button
                    onClick={() => {
                      authController.openAuthModal('switch');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 px-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
                    <span>Đổi Vai Trò</span>
                  </button>
                  <button
                    onClick={() => {
                      authController.openAuthModal('login');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 px-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-stone-600" />
                    <span>Đổi Tài Khoản</span>
                  </button>
                </div>

                {currentUser.permissions.includes('order:view_all') && (
                  <button
                    onClick={() => {
                      authController.openOrderManagementModal();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <ClipboardList className="w-4 h-4" />
                    <span>Quản Lý Đơn Hàng (Sales/Admin)</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    authController.logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-semibold"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  authController.openAuthModal('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-rose-600 text-white rounded-xl text-xs font-semibold"
              >
                Đăng Nhập / Phân Quyền
              </button>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider px-2">Danh mục mỹ phẩm</p>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  productController.setCategory(cat);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  filterState.category === cat
                    ? 'bg-stone-900 text-white font-medium'
                    : 'text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
