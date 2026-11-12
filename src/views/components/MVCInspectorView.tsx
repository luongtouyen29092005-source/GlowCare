import React, { useState, useEffect } from 'react';
import { mvcInspectorController } from '../../controllers/MVCInspectorController';
import { eventBus } from '../../models/EventBus';
import { MVCEventLog } from '../../types';
import { productModel } from '../../models/ProductModel';
import { cartModel } from '../../models/CartModel';
import { orderModel } from '../../models/OrderModel';
import { 
  X, 
  Layers, 
  Database, 
  Layout, 
  Cpu, 
  Trash2, 
  Activity, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export const MVCInspectorView: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<MVCEventLog[]>([]);

  // Real-time Model State Metrics
  const [productCount, setProductCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const unsubModal = mvcInspectorController.subscribe(setIsOpen);
    const unsubLogs = eventBus.subscribeLogs(setLogs);

    const unsubProducts = productModel.subscribe((p) => setProductCount(p.length));
    const unsubCart = cartModel.subscribe((c) => {
      setCartCount(c.itemCount);
      setCartTotal(c.total);
    });
    const unsubOrders = orderModel.subscribe((o) => setOrderCount(o.length));

    return () => {
      unsubModal();
      unsubLogs();
      unsubProducts();
      unsubCart();
      unsubOrders();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div
      id="mvc-inspector-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6"
      onClick={() => mvcInspectorController.close()}
    >
      <div
        className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-stone-200 my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-base sm:text-lg text-white">
                  Kiến Trúc Mô Hình MVC (Model - View - Controller)
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                  LIVE TRACER
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Theo dõi luồng xử lý dữ liệu và phản ứng giao diện theo thời gian thực
              </p>
            </div>
          </div>
          <button
            id="close-mvc-inspector-btn"
            onClick={() => mvcInspectorController.close()}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Đóng bảng kiến trúc"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Pillars Flowchart Explanation */}
        <div className="p-5 bg-stone-50 border-b border-stone-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* View */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                  <Layout className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-stone-900 uppercase">View (Giao diện)</h3>
                  <span className="text-[10px] text-stone-500">Presentation Layer</span>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Hiển thị dữ liệu thuần túy (Catalog, Card, Drawer, Modal) và bắt sự kiện người dùng tương tác.
              </p>
              <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center text-[10px] text-rose-700 font-bold">
                <span>Gửi User Action</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </div>

            {/* Controller */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-stone-900 uppercase">Controller (Điều khiển)</h3>
                  <span className="text-[10px] text-stone-500">Business Logic Handler</span>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tiếp nhận sự kiện từ View, kiểm tra tính hợp lệ (Validate phone, mã voucher), gọi Model tương ứng.
              </p>
              <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center text-[10px] text-indigo-700 font-bold">
                <span>Tác động Model</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </div>

            {/* Model */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs relative">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-stone-900 uppercase">Model (Mô hình dữ liệu)</h3>
                  <span className="text-[10px] text-stone-500">State & Data Store</span>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Quản lý trạng thái gốc (Sản phẩm, Giỏ hàng, Đơn hàng, Quiz), lưu trữ dữ liệu và thông báo cho View qua Observer.
              </p>
              <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center text-[10px] text-emerald-700 font-bold">
                <CheckCircle className="w-3 h-3 mr-1" />
                <span>Notify Observers (Views)</span>
              </div>
            </div>
          </div>

          {/* Current Live State Metrics */}
          <div className="mt-4 pt-3 border-t border-stone-200/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 bg-white rounded-xl border border-stone-200">
              <div className="text-stone-500 text-[11px]">Sản phẩm (ProductModel)</div>
              <div className="font-bold text-stone-900 text-sm">{productCount} mã</div>
            </div>
            <div className="p-2 bg-white rounded-xl border border-stone-200">
              <div className="text-stone-500 text-[11px]">Giỏ hàng (CartModel)</div>
              <div className="font-bold text-rose-700 text-sm">{cartCount} món</div>
            </div>
            <div className="p-2 bg-white rounded-xl border border-stone-200">
              <div className="text-stone-500 text-[11px]">Tổng giá trị giỏ</div>
              <div className="font-bold text-stone-900 text-sm">{cartTotal.toLocaleString('vi-VN')} ₫</div>
            </div>
            <div className="p-2 bg-white rounded-xl border border-stone-200">
              <div className="text-stone-500 text-[11px]">Đơn hàng (OrderModel)</div>
              <div className="font-bold text-emerald-700 text-sm">{orderCount} đơn</div>
            </div>
          </div>
        </div>

        {/* Live Event Log */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-stone-700" />
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Nhật ký tương tác thời gian thực ({logs.length} sự kiện)
              </h4>
            </div>
            <button
              onClick={() => mvcInspectorController.clearLogs()}
              className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa nhật ký</span>
            </button>
          </div>

          <div className="space-y-2 font-mono text-xs max-h-72 overflow-y-auto pr-1">
            {logs.length === 0 ? (
              <div className="py-8 text-center text-stone-400 text-xs italic">
                Chưa có sự kiện nào được ghi nhận. Hãy thử lọc sản phẩm, thêm vào giỏ hàng hoặc làm trắc nghiệm da!
              </div>
            ) : (
              logs.map((log) => {
                const badgeColor =
                  log.layer === 'Model'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : log.layer === 'Controller'
                    ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                    : 'bg-rose-100 text-rose-800 border-rose-200';

                return (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-stone-400">{log.timestamp}</span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeColor}`}
                      >
                        [{log.layer}]
                      </span>
                      <span className="font-semibold text-stone-900 text-[11px] truncate">
                        {log.action}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-600 sm:text-right font-sans truncate">
                      {log.details}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
