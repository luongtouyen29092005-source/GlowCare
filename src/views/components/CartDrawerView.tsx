import React, { useState, useEffect } from 'react';
import { cartModel, CartState, FREE_SHIPPING_THRESHOLD, AVAILABLE_COUPONS } from '../../models/CartModel';
import { cartController } from '../../controllers/CartController';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Truck, 
  Tag, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const CartDrawerView: React.FC = () => {
  const [state, setState] = useState<CartState>(cartModel.getState());
  const [couponInput, setCouponInput] = useState('');

  useEffect(() => {
    return cartModel.subscribe(setState);
  }, []);

  if (!state.isOpen) return null;

  const freeShippingNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - state.subtotal);
  const freeShippingProgress = Math.min(100, Math.round((state.subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    cartController.applyCoupon(couponInput);
  };

  return (
    <div
      id="cart-drawer-overlay"
      className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end transition-opacity"
      onClick={() => cartController.closeCart()}
    >
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-700" />
            <h2 className="font-serif font-bold text-stone-900 text-lg">Giỏ hàng của bạn</h2>
            <span className="text-xs bg-stone-200 text-stone-700 font-bold px-2 py-0.5 rounded-full">
              {state.itemCount}
            </span>
          </div>
          <button
            id="close-cart-drawer-btn"
            onClick={() => cartController.closeCart()}
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors"
            aria-label="Đóng giỏ hàng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="p-3.5 bg-rose-50/70 border-b border-rose-100 text-xs text-stone-700">
          <div className="flex items-center gap-2 mb-1.5 font-medium">
            <Truck className="w-4 h-4 text-rose-700 flex-shrink-0" />
            {freeShippingNeeded > 0 ? (
              <span>
                Mua thêm <b>{freeShippingNeeded.toLocaleString('vi-VN')} ₫</b> để được{' '}
                <span className="text-rose-700 font-bold">Miễn phí giao hàng</span>!
              </span>
            ) : (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Chúc mừng! Bạn đã đạt điều kiện Miễn phí vận chuyển toàn quốc.
              </span>
            )}
          </div>
          <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                freeShippingProgress >= 100 ? 'bg-emerald-600' : 'bg-rose-600'
              }`}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {state.items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500 space-y-3">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-stone-800 text-base">Giỏ hàng của bạn đang trống</h3>
              <p className="text-xs text-stone-500 max-w-xs">
                Hãy lựa chọn các dòng serum, kem chống nắng và dưỡng ẩm phù hợp với làn da của bạn.
              </p>
              <button
                onClick={() => cartController.closeCart()}
                className="px-5 py-2.5 bg-stone-900 text-white rounded-full text-xs font-semibold hover:bg-stone-800 transition-colors"
              >
                Khám phá sản phẩm
              </button>
            </div>
          ) : (
            state.items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-3.5 p-3 rounded-2xl bg-stone-50/80 border border-stone-200 relative group"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-stone-200 flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-stone-900 line-clamp-2 leading-snug">
                        {product.name}
                      </h4>
                      <button
                        onClick={() => cartController.removeItem(product.id, product.name)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1 -mr-1 -mt-1"
                        aria-label="Xóa sản phẩm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[11px] text-stone-500 font-medium">
                      {product.volume} • {product.brand}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-200/60">
                    <span className="text-xs font-bold text-stone-900">
                      {(product.price * quantity).toLocaleString('vi-VN')} ₫
                    </span>

                    {/* Quantity steppers */}
                    <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => cartController.updateQuantity(product.id, quantity - 1)}
                        className="p-1 text-stone-600 hover:bg-stone-100 transition-colors"
                        aria-label="Giảm số lượng"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-stone-800">
                        {quantity}
                      </span>
                      <button
                        onClick={() => cartController.updateQuantity(product.id, quantity + 1)}
                        disabled={quantity >= product.stockCount}
                        className="p-1 text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-colors"
                        aria-label="Tăng số lượng"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Coupon & Checkout */}
        {state.items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-4">
            {/* Coupon Section */}
            <div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Nhập mã giảm giá..."
                    className="w-full text-xs uppercase font-medium pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                  <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
                >
                  Áp dụng
                </button>
              </form>

              {/* Available Coupon Chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {AVAILABLE_COUPONS.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setCouponInput(c.code);
                      cartController.applyCoupon(c.code);
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-medium border transition-colors ${
                      state.coupon?.code === c.code
                        ? 'bg-rose-100 text-rose-900 border-rose-300'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-rose-300'
                    }`}
                  >
                    {c.code} ({c.discountPercent ? `-${c.discountPercent}%` : c.freeShipping ? 'Freeship' : '-50k'})
                  </button>
                ))}
              </div>

              {state.coupon && (
                <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 mt-2">
                  <span>Đã áp dụng mã: <b>{state.coupon.code}</b> ({state.coupon.description})</span>
                  <button
                    onClick={() => cartController.removeCoupon()}
                    className="text-emerald-700 hover:text-emerald-950 underline text-[11px]"
                  >
                    Gỡ bỏ
                  </button>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-200">
              <div className="flex justify-between">
                <span>Tạm tính ({state.itemCount} món)</span>
                <span className="font-semibold text-stone-900">
                  {state.subtotal.toLocaleString('vi-VN')} ₫
                </span>
              </div>

              {state.discount > 0 && (
                <div className="flex justify-between text-rose-700 font-semibold">
                  <span>Giảm giá khuyến mãi</span>
                  <span>-{state.discount.toLocaleString('vi-VN')} ₫</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span className="font-semibold text-stone-900">
                  {state.shippingFee === 0 ? (
                    <span className="text-emerald-700">Miễn phí</span>
                  ) : (
                    `${state.shippingFee.toLocaleString('vi-VN')} ₫`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Tổng thanh toán</span>
                <span className="text-base text-rose-800">
                  {state.total.toLocaleString('vi-VN')} ₫
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              id="proceed-checkout-btn"
              onClick={() => cartController.openCheckout()}
              className="w-full py-3.5 px-4 bg-stone-900 text-white rounded-xl font-semibold text-xs sm:text-sm hover:bg-stone-800 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Tiến hành đặt hàng</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
