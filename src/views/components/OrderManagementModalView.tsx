import React, { useState, useEffect } from 'react';
import { 
  X, 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  Truck, 
  PackageCheck, 
  CreditCard, 
  AlertCircle,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { orderModel } from '../../models/OrderModel';
import { userModel } from '../../models/UserModel';
import { authController } from '../../controllers/AuthController';
import { Order, User } from '../../types';

export const OrderManagementModalView: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(userModel.getCurrentUser());

  useEffect(() => {
    const unsubModal = authController.subscribeOrderModal(setIsOpen);
    const unsubOrders = orderModel.subscribe(setOrders);
    const unsubUser = userModel.subscribe(setCurrentUser);

    return () => {
      unsubModal();
      unsubOrders();
      unsubUser();
    };
  }, []);

  if (!isOpen) return null;

  const canManageOrders = userModel.hasPermission('order:update_status');

  const statusOptions: Order['status'][] = [
    'Chờ xác nhận',
    'Đang đóng gói',
    'Đang giao hàng',
    'Đã hoàn thành'
  ];

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Chờ xác nhận':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Đang đóng gói':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Đang giao hàng':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Đã hoàn thành':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div
      id="order-management-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      onClick={() => authController.closeOrderManagementModal()}
    >
      <div
        className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-stone-200 my-auto flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 text-white flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-stone-900 text-base sm:text-lg">
                  Trung Tâm Quản Lý Đơn Hàng (Sales & Admin)
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {orders.length} đơn hàng
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Phân quyền theo vai trò: Nhân viên Bán hàng & CSKH hoặc Quản trị viên cấp cao
              </p>
            </div>
          </div>
          <button
            id="close-order-management-btn"
            onClick={() => authController.closeOrderManagementModal()}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
            aria-label="Đóng quản lý đơn hàng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Permission Guard Banner if lacks permission */}
        {!canManageOrders ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-800">
              Quyền Hạn Bị Giới Hạn (403 Forbidden)
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              Tài khoản hiện tại của bạn là <b>{currentUser?.fullName}</b> ({currentUser?.roleName}). Vai trò này không được cấp quyền <code>order:update_status</code>.
            </p>
            <button
              onClick={() => {
                authController.closeOrderManagementModal();
                authController.openAuthModal('switch');
              }}
              className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors inline-flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Chuyển sang tài khoản Bán hàng / Quản trị viên</span>
            </button>
          </div>
        ) : (
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
            {orders.length === 0 ? (
              <div className="py-12 text-center text-stone-500 text-xs">
                Chưa có đơn hàng nào trong hệ thống.
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3.5 hover:border-stone-300 transition-all"
                >
                  {/* Top line: Order ID, Date, Total */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-stone-900">
                        #{order.id}
                      </span>
                      <span className="text-xs text-stone-500">
                        {order.createdAt}
                      </span>
                      {order.couponCode && (
                        <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold">
                          Mã {order.couponCode}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-stone-500">Tổng thanh toán:</span>
                      <span className="font-serif text-base font-bold text-rose-700">
                        {order.total.toLocaleString('vi-VN')} ₫
                      </span>
                    </div>
                  </div>

                  {/* Customer & Items Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Customer Info */}
                    <div className="bg-white p-3 rounded-xl border border-stone-200/80 space-y-1">
                      <p className="font-bold text-stone-800">
                        Khách hàng: {order.customer.fullName}
                      </p>
                      <p className="text-stone-600">SĐT: {order.customer.phone}</p>
                      <p className="text-stone-600">
                        Địa chỉ: {order.customer.address}, {order.customer.province}
                      </p>
                      {order.customer.note && (
                        <p className="text-stone-500 italic mt-1 bg-stone-50 p-1.5 rounded">
                          Ghi chú: "{order.customer.note}"
                        </p>
                      )}
                    </div>

                    {/* Order Items */}
                    <div className="bg-white p-3 rounded-xl border border-stone-200/80 space-y-1.5">
                      <p className="font-bold text-stone-800 mb-1">
                        Sản phẩm ({order.items.length} món):
                      </p>
                      <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-stone-600 text-[11px]">
                            <span className="truncate max-w-[200px]">{item.product.name}</span>
                            <span className="font-mono text-stone-900 font-semibold ml-2">
                              x{item.quantity} ({item.product.price.toLocaleString('vi-VN')} ₫)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Status update controls (RBAC Action) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    {/* Payment Status Switch */}
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-stone-500" />
                      <span className="text-xs text-stone-600">Thanh toán ({order.customer.paymentMethod}):</span>
                      <button
                        onClick={() => {
                          const nextStatus = order.paymentStatus === 'Đã thanh toán' ? 'Chờ thanh toán' : 'Đã thanh toán';
                          authController.updatePaymentStatus(order.id, nextStatus);
                        }}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-all ${
                          order.paymentStatus === 'Đã thanh toán'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        {order.paymentStatus}
                      </button>
                    </div>

                    {/* Order Status Selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-stone-700">Trạng thái đơn:</span>
                      <select
                        value={order.status}
                        onChange={(e) => {
                          authController.updateOrderStatus(order.id, e.target.value as Order['status']);
                        }}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-400 ${getStatusBadge(order.status)}`}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
