import React, { useState, useEffect } from 'react';
import { productModel } from '../../models/ProductModel';
import { productController } from '../../controllers/ProductController';
import { userModel } from '../../models/UserModel';
import { authController } from '../../controllers/AuthController';
import { Product, User } from '../../types';
import { X, Boxes, Plus, Minus, RotateCcw, AlertCircle, ShieldAlert, ShieldCheck } from 'lucide-react';

export const AdminStockModalView: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(userModel.getCurrentUser());

  useEffect(() => {
    const unsubModal = productController.subscribeStockModal(setIsOpen);
    const unsubProducts = productModel.subscribe(setProducts);
    const unsubUser = userModel.subscribe(setCurrentUser);

    return () => {
      unsubModal();
      unsubProducts();
      unsubUser();
    };
  }, []);

  if (!isOpen) return null;

  const canEditStock = userModel.hasPermission('inventory:update_stock');

  const handleAdjust = (productId: string, delta: number) => {
    if (!canEditStock) {
      authController.openAuthModal('switch');
      return;
    }
    productController.adjustStock(productId, delta);
  };

  return (
    <div
      id="stock-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      onClick={() => productController.closeStockModal()}
    >
      <div
        className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-stone-200 my-auto flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 text-white flex items-center justify-center">
              <Boxes className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-stone-900 text-base sm:text-lg">
                  Quản lý kho hàng & Tồn kho (Warehouse RBAC)
                </h2>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                  canEditStock ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-rose-100 text-rose-800 border-rose-200'
                }`}>
                  {canEditStock ? 'Đã cấp quyền chỉnh sửa' : 'Chỉ xem (Read-only)'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Quyền thực thi: [inventory:update_stock] dành cho Thủ kho & Quản trị viên
              </p>
            </div>
          </div>
          <button
            id="close-stock-modal-btn"
            onClick={() => productController.closeStockModal()}
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors"
            aria-label="Đóng quản lý kho"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* RBAC Warning Banner if user is not authorized */}
        {!canEditStock && (
          <div className="p-3.5 bg-rose-50 border-b border-rose-200 text-xs text-rose-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>
                Tài khoản <b>{currentUser?.fullName}</b> ({currentUser?.roleName}) chưa có quyền sửa số lượng tồn kho.
              </span>
            </div>
            <button
              onClick={() => authController.openAuthModal('switch')}
              className="px-2.5 py-1 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 flex-shrink-0 text-[11px]"
            >
              Chuyển sang Thủ kho
            </button>
          </div>
        )}

        {/* Notice */}
        <div className="p-3.5 bg-amber-50 border-b border-amber-100 text-xs text-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Thử giảm số lượng về 0 để kiểm tra trạng thái "Tạm hết hàng" trên giao diện.</span>
          </div>
          {canEditStock && (
            <button
              onClick={() => productController.resetAllData()}
              className="px-2.5 py-1 bg-white text-stone-800 border border-amber-200 rounded-lg font-semibold hover:bg-amber-100 flex items-center gap-1 text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Khôi phục gốc</span>
            </button>
          )}
        </div>

        {/* Products Table */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-white border border-stone-200 overflow-hidden flex-shrink-0">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-stone-900 truncate">{p.name}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500">
                    <span>{p.category}</span>
                    <span>•</span>
                    <span>{p.price.toLocaleString('vi-VN')} ₫</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                      p.inStock
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {p.inStock ? `Còn ${p.stockCount} sp` : 'Hết hàng (0)'}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleAdjust(p.id, -5)}
                    disabled={p.stockCount <= 0 || !canEditStock}
                    className="px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title={canEditStock ? "Giảm 5 sản phẩm" : "Cần quyền Thủ kho"}
                  >
                    -5
                  </button>
                  <button
                    onClick={() => handleAdjust(p.id, -1)}
                    disabled={p.stockCount <= 0 || !canEditStock}
                    className="p-1 bg-white border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title={canEditStock ? "Giảm 1 sản phẩm" : "Cần quyền Thủ kho"}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleAdjust(p.id, 1)}
                    disabled={!canEditStock}
                    className="p-1 bg-white border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title={canEditStock ? "Tăng 1 sản phẩm" : "Cần quyền Thủ kho"}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleAdjust(p.id, 5)}
                    disabled={!canEditStock}
                    className="px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title={canEditStock ? "Tăng 5 sản phẩm" : "Cần quyền Thủ kho"}
                  >
                    +5
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
