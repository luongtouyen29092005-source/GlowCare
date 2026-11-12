import React, { useState, useEffect } from 'react';
import { cartModel, CartState } from '../../models/CartModel';
import { cartController } from '../../controllers/CartController';
import { checkoutController } from '../../controllers/CheckoutController';
import { CustomerInfo } from '../../types';
import { 
  X, 
  CreditCard, 
  Truck, 
  QrCode, 
  Wallet, 
  ShieldCheck, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Lock 
} from 'lucide-react';

export const CheckoutModalView: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartState, setCartState] = useState<CartState>(cartModel.getState());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    province: 'Hà Nội',
    note: '',
    paymentMethod: 'VIETQR'
  });

  const provinces = [
    'Hà Nội',
    'TP. Hồ Chí Minh',
    'Đà Nẵng',
    'Hải Phòng',
    'Cần Thơ',
    'Quảng Ninh',
    'Bình Dương',
    'Đồng Nai',
    'Khánh Hòa',
    'Huế',
    'Khác (Toàn quốc)'
  ];

  useEffect(() => {
    const unsubCart = cartModel.subscribe(setCartState);
    const unsubCheckout = cartController.subscribeCheckout(setIsOpen);

    return () => {
      unsubCart();
      unsubCheckout();
    };
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      checkoutController.submitOrder(customer);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div
      id="checkout-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6"
      onClick={() => cartController.closeCheckout()}
    >
      <div
        className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-stone-200 my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-700" />
            <h2 className="font-serif font-bold text-stone-900 text-lg">
              Thanh toán đơn hàng an toàn
            </h2>
          </div>
          <button
            id="close-checkout-modal-btn"
            onClick={() => cartController.closeCheckout()}
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors"
            aria-label="Đóng thanh toán"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 sm:p-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Customer Info & Payment Method */}
            <div className="lg:col-span-7 space-y-6">
              {/* Section 1: Customer Info */}
              <div>
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-rose-700" />
                  1. Thông tin giao nhận hàng
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Họ và tên người nhận *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={customer.fullName}
                        onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                        placeholder="VD: Nguyễn Văn An"
                        className="w-full text-xs pl-8 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      />
                      <User className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Số điện thoại *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        placeholder="0912 345 678"
                        className="w-full text-xs pl-8 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      />
                      <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Email (nhận biên lai)
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        placeholder="tenban@gmail.com"
                        className="w-full text-xs pl-8 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      />
                      <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Tỉnh / Thành phố *
                    </label>
                    <select
                      value={customer.province}
                      onChange={(e) => setCustomer({ ...customer, province: e.target.value })}
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none"
                    >
                      {provinces.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Địa chỉ cụ thể (Số nhà, đường) *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        placeholder="VD: 124 Phố Huế, Phường Ngô Thì Nhậm"
                        className="w-full text-xs pl-8 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      />
                      <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Ghi chú đơn hàng (nếu có)
                    </label>
                    <input
                      type="text"
                      value={customer.note}
                      onChange={(e) => setCustomer({ ...customer, note: e.target.value })}
                      placeholder="VD: Giao giờ hành chính, gọi trước khi đến..."
                      className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Payment Method */}
              <div className="pt-4 border-t border-stone-200">
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-rose-700" />
                  2. Phương thức thanh toán
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* VietQR Bank Transfer */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      customer.paymentMethod === 'VIETQR'
                        ? 'border-rose-700 bg-rose-50/50 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={customer.paymentMethod === 'VIETQR'}
                      onChange={() => setCustomer({ ...customer, paymentMethod: 'VIETQR' })}
                      className="mt-0.5 text-rose-700 focus:ring-rose-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                        <QrCode className="w-4 h-4 text-rose-700" />
                        <span>Chuyển khoản VietQR (Khuyên dùng)</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Quét mã QR từ mọi App ngân hàng, xác nhận tự động tức thì.
                      </p>
                    </div>
                  </label>

                  {/* COD Cash On Delivery */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      customer.paymentMethod === 'COD'
                        ? 'border-rose-700 bg-rose-50/50 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={customer.paymentMethod === 'COD'}
                      onChange={() => setCustomer({ ...customer, paymentMethod: 'COD' })}
                      className="mt-0.5 text-rose-700 focus:ring-rose-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                        <Truck className="w-4 h-4 text-stone-700" />
                        <span>Thanh toán khi nhận hàng (COD)</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Kiểm tra hàng chính hãng và thanh toán tiền mặt cho shipper.
                      </p>
                    </div>
                  </label>

                  {/* MoMo */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      customer.paymentMethod === 'MOMO'
                        ? 'border-rose-700 bg-rose-50/50 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={customer.paymentMethod === 'MOMO'}
                      onChange={() => setCustomer({ ...customer, paymentMethod: 'MOMO' })}
                      className="mt-0.5 text-rose-700 focus:ring-rose-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                        <Wallet className="w-4 h-4 text-pink-600" />
                        <span>Ví Điện Tử MoMo</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Thanh toán 1 chạm qua ứng dụng ví MoMo.
                      </p>
                    </div>
                  </label>

                  {/* VNPay */}
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      customer.paymentMethod === 'VNPAY'
                        ? 'border-rose-700 bg-rose-50/50 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={customer.paymentMethod === 'VNPAY'}
                      onChange={() => setCustomer({ ...customer, paymentMethod: 'VNPAY' })}
                      className="mt-0.5 text-rose-700 focus:ring-rose-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <span>Cổng Thanh Toán VNPay-QR</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Hỗ trợ thẻ ATM nội địa & thẻ quốc tế Visa/Mastercard.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5 bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
                  Tóm tắt đơn hàng ({cartState.itemCount} sản phẩm)
                </h3>

                {/* Items preview list */}
                <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
                  {cartState.items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 max-w-[70%]">
                        <span className="font-bold text-stone-900 flex-shrink-0">
                          {quantity}x
                        </span>
                        <span className="text-stone-700 line-clamp-1">{product.name}</span>
                      </div>
                      <span className="font-semibold text-stone-900">
                        {(product.price * quantity).toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculation */}
                <div className="space-y-1.5 text-xs text-stone-600 pt-3 border-t border-stone-200 mt-3">
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span>{cartState.subtotal.toLocaleString('vi-VN')} ₫</span>
                  </div>

                  {cartState.discount > 0 && (
                    <div className="flex justify-between text-rose-700 font-semibold">
                      <span>Mã ưu đãi ({cartState.coupon?.code})</span>
                      <span>-{cartState.discount.toLocaleString('vi-VN')} ₫</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Phí vận chuyển</span>
                    <span>
                      {cartState.shippingFee === 0 ? (
                        <span className="text-emerald-700 font-semibold">Miễn phí</span>
                      ) : (
                        `${cartState.shippingFee.toLocaleString('vi-VN')} ₫`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                    <span>Tổng thanh toán</span>
                    <span className="text-base text-rose-800">
                      {cartState.total.toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-stone-200 space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-stone-900 text-white rounded-xl font-bold text-xs sm:text-sm hover:bg-stone-800 disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    {isSubmitting
                      ? 'Đang xử lý đơn hàng...'
                      : `Đặt hàng ngay (${cartState.total.toLocaleString('vi-VN')} ₫)`}
                  </span>
                </button>
                <p className="text-[10px] text-center text-stone-400">
                  Bằng cách nhấn đặt hàng, bạn đồng ý với chính sách bán lẻ và bảo mật của GlowCare.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
