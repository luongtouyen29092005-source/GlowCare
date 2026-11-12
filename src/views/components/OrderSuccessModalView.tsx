import React, { useState, useEffect } from 'react';
import { orderModel } from '../../models/OrderModel';
import { checkoutController } from '../../controllers/CheckoutController';
import { Order } from '../../types';
import { 
  CheckCircle, 
  QrCode, 
  MapPin, 
  Phone, 
  User, 
  Copy, 
  Calendar, 
  X,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { notificationController } from '../../controllers/NotificationController';

export const OrderSuccessModalView: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const unsubModal = checkoutController.subscribeSuccessModal(setIsOpen);
    const unsubOrder = orderModel.subscribeCurrentOrder(setOrder);

    return () => {
      unsubModal();
      unsubOrder();
    };
  }, []);

  if (!isOpen || !order) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    notificationController.show('info', 'Đã sao chép', `Đã chép ${label}: ${text}`);
  };

  // Generate VietQR payment image link: https://img.vietqr.io/image/MB-0388998888-compact.png?amount=XXX&addInfo=XXX
  const qrUrl = `https://api.vietqr.io/image/970422-0388998888-compact2.png?amount=${order.total}&addInfo=${order.id}&accountName=GLOWCARE%20SKINCARE%20VN`;

  return (
    <div
      id="order-success-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6"
      onClick={() => checkoutController.closeSuccessModal()}
    >
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-stone-200 my-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="close-order-success-btn"
          onClick={() => checkoutController.closeSuccessModal()}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
          aria-label="Đóng thông báo"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebration Header */}
        <div className="text-center space-y-2 pb-6 border-b border-stone-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 ring-8 ring-emerald-50">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Đặt Hàng Thành Công!
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
            Cảm ơn quý khách <b>{order.customer.fullName}</b> đã lựa chọn dược mỹ phẩm GlowCare. Đơn hàng đang được bộ phận chuyên môn đóng gói cẩn thận.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full text-xs font-bold text-stone-800">
            <span>Mã đơn hàng:</span>
            <span className="text-rose-700 font-mono text-sm">#{order.id}</span>
            <button
              onClick={() => copyToClipboard(order.id, 'mã đơn')}
              className="hover:text-stone-900 text-stone-400"
              title="Sao chép mã"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* VietQR Bank Payment Box (If VIETQR chosen) */}
        {order.customer.paymentMethod === 'VIETQR' && (
          <div className="mt-5 p-4 bg-rose-50/50 rounded-2xl border border-rose-200 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-36 h-36 bg-white p-2 rounded-xl border border-stone-200 shadow-xs flex-shrink-0 flex items-center justify-center">
              <img
                src={qrUrl}
                alt="Mã VietQR thanh toán"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-1 text-xs text-stone-700 flex-1">
              <div className="flex items-center gap-1.5 font-bold text-rose-800">
                <QrCode className="w-4 h-4" />
                <span>Quét mã VietQR chuyển khoản</span>
              </div>
              <p className="text-stone-500 text-[11px]">
                Mở ứng dụng ngân hàng bất kỳ để quét mã và tự động điền thông tin:
              </p>
              <div className="bg-white p-2.5 rounded-xl border border-rose-100 text-[11px] space-y-1 font-medium">
                <div>Ngân hàng: <b>MBBank (Ngân hàng Quân Đội)</b></div>
                <div>Số tài khoản: <b className="font-mono text-stone-900">0388998888</b></div>
                <div>Chủ tài khoản: <b>GLOWCARE SKINCARE VN</b></div>
                <div>Số tiền: <b className="text-rose-700">{order.total.toLocaleString('vi-VN')} ₫</b></div>
                <div>Nội dung CK: <b className="text-rose-800 font-mono">{order.id}</b></div>
              </div>
            </div>
          </div>
        )}

        {/* Customer & Shipping Details */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-200">
          <div className="space-y-1">
            <div className="font-bold text-stone-900 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-stone-600" />
              <span>Người nhận: {order.customer.fullName}</span>
            </div>
            <div className="text-stone-600 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-stone-400" />
              <span>{order.customer.phone}</span>
            </div>
            <div className="text-stone-600 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>{order.customer.address}, {order.customer.province}</span>
            </div>
          </div>

          <div className="space-y-1 sm:border-l sm:border-stone-200 sm:pl-3">
            <div className="font-bold text-stone-900 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-600" />
              <span>Dự kiến giao: 2 - 3 ngày làm việc</span>
            </div>
            <div className="text-stone-600">
              Phương thức: <b>{order.customer.paymentMethod}</b>
            </div>
            <div className="text-stone-600">
              Tổng số tiền:{' '}
              <b className="text-rose-800 text-sm">
                {order.total.toLocaleString('vi-VN')} ₫
              </b>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-rose-600 text-white rounded-full text-xs sm:text-sm font-semibold hover:bg-rose-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Xuất & In Hóa Đơn</span>
          </button>
          <button
            id="continue-shopping-btn"
            onClick={() => checkoutController.closeSuccessModal()}
            className="px-6 py-3 bg-stone-900 text-white rounded-full text-xs sm:text-sm font-semibold hover:bg-stone-800 transition-colors flex items-center gap-2 shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Tiếp tục mua sắm mỹ phẩm</span>
          </button>
        </div>
      </div>
    </div>
  );
};
