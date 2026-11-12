import React, { useState, useEffect, useMemo } from 'react';
import { NavbarView } from './components/NavbarView';
import { HeroBannerView } from './components/HeroBannerView';
import { ProductFilterView } from './components/ProductFilterView';
import { ProductCardView } from './components/ProductCardView';
import { ProductDetailModalView } from './components/ProductDetailModalView';
import { CartDrawerView } from './components/CartDrawerView';
import { CheckoutModalView } from './components/CheckoutModalView';
import { OrderSuccessModalView } from './components/OrderSuccessModalView';
import { SkinQuizModalView } from './components/SkinQuizModalView';
import { WishlistView } from './components/WishlistView';
import { AdminStockModalView } from './components/AdminStockModalView';
import { AuthModalView } from './components/AuthModalView';
import { OrderManagementModalView } from './components/OrderManagementModalView';
import { MVCInspectorView } from './components/MVCInspectorView';
import { VisualStudioSqlModalView } from './components/VisualStudioSqlModalView';
import { ToastView } from './components/ToastView';
import { FooterView } from './components/FooterView';

import { productModel } from '../models/ProductModel';
import { productController, DEFAULT_FILTERS } from '../controllers/ProductController';
import { skinQuizController } from '../controllers/SkinQuizController';
import { Product, FilterState } from '../types';
import { Sparkles, X, RotateCcw, PackageSearch } from 'lucide-react';

export const HomeView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS });
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsubProd = productModel.subscribe(setProducts);
    const unsubFilter = productController.subscribeFilter(setFilters);
    const unsubWishlist = productModel.subscribeWishlist(setWishlist);

    return () => {
      unsubProd();
      unsubFilter();
      unsubWishlist();
    };
  }, []);

  // Compute filtered products using Model logic
  const filteredProducts = useMemo(() => {
    return productModel.filterAndSort(filters);
  }, [products, filters]);

  // Active filter count (excluding default)
  const activeFiltersCount = [
    filters.category !== 'Tất cả',
    filters.skinType !== 'Tất cả',
    filters.keyIngredient !== 'Tất cả',
    filters.searchQuery !== '',
    filters.onlyInStock,
    filters.priceRange[1] < 600000,
  ].filter(Boolean).length;

  return (
    <div id="glowcare-app-root" className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-rose-100 selection:text-rose-900">
      {/* Toast Notification Container */}
      <ToastView />

      {/* Navigation View */}
      <NavbarView />

      {/* Hero Banner View */}
      <HeroBannerView />

      {/* Main Catalog Section */}
      <main id="catalog-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Catalog Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-700">
                Danh Mục Mỹ Phẩm Chọn Lọc
              </span>
              {activeFiltersCount > 0 && (
                <span className="text-[11px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                  {activeFiltersCount} bộ lọc đang áp dụng
                </span>
              )}
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              {filters.category === 'Tất cả' ? 'Tất Cả Sản Phẩm Chăm Sóc Da' : filters.category}
            </h2>
          </div>

          {/* Quick Routine Quiz Callout */}
          <button
            id="catalog-quiz-banner-btn"
            onClick={() => skinQuizController.openQuiz()}
            className="self-start md:self-auto px-4 py-2 bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 text-rose-900 rounded-full text-xs font-bold flex items-center gap-2 hover:shadow-xs transition-shadow"
          >
            <Sparkles className="w-4 h-4 text-rose-600 animate-spin-slow" />
            <span>Chưa biết da mình cần gì? Làm trắc nghiệm ngay</span>
          </button>
        </div>

        {/* Active Filter Tags */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 py-3">
            <span className="text-xs text-stone-500 font-medium">Đang lọc theo:</span>
            {filters.category !== 'Tất cả' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-200 text-xs font-semibold text-stone-800 rounded-lg">
                Danh mục: {filters.category}
                <button
                  onClick={() => productController.setCategory('Tất cả')}
                  className="hover:text-rose-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.skinType !== 'Tất cả' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-200 text-xs font-semibold text-stone-800 rounded-lg">
                Loại da: {filters.skinType}
                <button
                  onClick={() => productController.setSkinType('Tất cả')}
                  className="hover:text-rose-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.keyIngredient !== 'Tất cả' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-200 text-xs font-semibold text-stone-800 rounded-lg">
                Hoạt chất: {filters.keyIngredient}
                <button
                  onClick={() => productController.setKeyIngredient('Tất cả')}
                  className="hover:text-rose-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-200 text-xs font-semibold text-stone-800 rounded-lg">
                Từ khóa: "{filters.searchQuery}"
                <button
                  onClick={() => productController.setSearchQuery('')}
                  className="hover:text-rose-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.onlyInStock && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-stone-200 text-xs font-semibold text-stone-800 rounded-lg">
                Chỉ còn hàng
                <button
                  onClick={() => productController.setOnlyInStock(false)}
                  className="hover:text-rose-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => productController.resetFilters()}
              className="text-xs text-rose-700 hover:text-rose-900 font-semibold underline ml-1"
            >
              Xóa tất cả
            </button>
          </div>
        )}

        {/* Content Layout: Filter Sidebar + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {/* Sidebar Filter View */}
          <aside className="lg:col-span-3">
            <ProductFilterView filter={filters} totalMatches={filteredProducts.length} />
          </aside>

          {/* Product Grid View */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                  <PackageSearch className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-800">
                  Không tìm thấy sản phẩm phù hợp
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                  Không có sản phẩm nào khớp với các tiêu chí lọc hiện tại của bạn. Thử nới rộng mức giá hoặc xóa bớt bộ lọc.
                </p>
                <button
                  onClick={() => productController.resetFilters()}
                  className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Đặt lại bộ lọc tìm kiếm</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCardView
                    key={product.id}
                    product={product}
                    isWishlisted={wishlist.has(product.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer View */}
      <FooterView />

      {/* Modals & Drawers */}
      <ProductDetailModalView />
      <CartDrawerView />
      <CheckoutModalView />
      <OrderSuccessModalView />
      <SkinQuizModalView />
      <WishlistView />
      <AdminStockModalView />
      <AuthModalView />
      <OrderManagementModalView />
      <MVCInspectorView />
      <VisualStudioSqlModalView />
    </div>
  );
};
