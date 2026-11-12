import { Order, CustomerInfo, CartItem } from '../types';
import { eventBus } from './EventBus';

class OrderModel {
  private orders: Order[] = [];
  private currentOrder: Order | null = null;
  private listeners: Set<(orders: Order[]) => void> = new Set();
  private currentOrderListeners: Set<(order: Order | null) => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const saved = localStorage.getItem('glowcare_orders');
    if (saved) {
      try {
        this.orders = JSON.parse(saved);
      } catch (e) {
        this.orders = [];
      }
    }

    if (!this.orders || this.orders.length === 0) {
      // Seed default orders for realistic Sales Staff & Admin management testing
      this.orders = [
        {
          id: 'GC-892147',
          createdAt: '28/08/2026, 14:32:00',
          customer: {
            fullName: 'Nguyễn Văn An',
            phone: '0912345678',
            email: 'an.nguyen@gmail.com',
            address: '124 Phố Huế, P. Ngô Thì Nhậm',
            province: 'Hà Nội',
            paymentMethod: 'VIETQR',
            note: 'Giao giờ hành chính giúp mình nhé shop'
          },
          items: [
            {
              product: {
                id: 'prod-1',
                name: 'Kem Chống Nắng Phổ Rộng Dịu Nhẹ Ultra Shield SPF 50+ PA++++',
                brand: 'GlowCare Lab',
                category: 'Chống nắng',
                skinTypes: ['Da dầu', 'Da nhạy cảm', 'Da mụn'],
                price: 345000,
                originalPrice: 420000,
                discountPercent: 18,
                rating: 4.9,
                reviewCount: 142,
                inStock: true,
                stockCount: 45,
                image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80',
                volume: '50ml',
                keyIngredients: ['Zinc Oxide', 'Niacinamide', 'Rau má'],
                usageStep: 'Bước cuối cùng buổi sáng',
                routineType: 'AM',
                shortDesc: 'Kiềm dầu 8 giờ, không vệt trắng, làm dịu tức thì.',
                fullDesc: '',
                howToUse: [],
                reviews: []
              },
              quantity: 1
            },
            {
              product: {
                id: 'prod-2',
                name: 'Serum Niacinamide 10% + Kẽm Zinc PCA 1% Thu Nhỏ Lỗ Chân Lông',
                brand: 'GlowCare Pure',
                category: 'Serum & Tinh chất',
                skinTypes: ['Da dầu', 'Da mụn'],
                price: 295000,
                originalPrice: 350000,
                discountPercent: 15,
                rating: 4.8,
                reviewCount: 98,
                inStock: true,
                stockCount: 60,
                image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
                volume: '30ml',
                keyIngredients: ['Niacinamide 10%', 'Zinc PCA 1%'],
                usageStep: 'Sau bước toner',
                routineType: 'Both',
                shortDesc: 'Điều tiết bã nhờn, làm mờ thâm mụn.',
                fullDesc: '',
                howToUse: [],
                reviews: []
              },
              quantity: 1
            }
          ],
          subtotal: 640000,
          shippingFee: 0,
          discount: 128000,
          couponCode: 'GLOW20',
          total: 512000,
          status: 'Chờ xác nhận',
          paymentStatus: 'Đã thanh toán'
        },
        {
          id: 'GC-451920',
          createdAt: '29/08/2026, 09:15:20',
          customer: {
            fullName: 'Trần Mai Linh',
            phone: '0988776655',
            email: 'mailinh@outlook.com',
            address: '45 Lê Lợi, Bến Nghé, Quận 1',
            province: 'TP. Hồ Chí Minh',
            paymentMethod: 'COD',
            note: 'Gọi trước khi giao hàng 15 phút'
          },
          items: [
            {
              product: {
                id: 'prod-5',
                name: 'Kem Dưỡng Phục Hồi Cấp Ẩm Chuyên Sâu 5 Loại Ceramide + B5',
                brand: 'Barrier Defense',
                category: 'Kem dưỡng ẩm',
                skinTypes: ['Da khô', 'Da nhạy cảm'],
                price: 380000,
                originalPrice: 450000,
                discountPercent: 16,
                rating: 4.9,
                reviewCount: 88,
                inStock: true,
                stockCount: 30,
                image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=800&auto=format&fit=crop&q=80',
                volume: '50ml',
                keyIngredients: ['Ceramide Complex', 'Panthenol B5'],
                usageStep: 'Khóa ẩm ban đêm',
                routineType: 'Both',
                shortDesc: 'Tái tạo hàng rào bảo vệ da bị tổn thương sau treatment.',
                fullDesc: '',
                howToUse: [],
                reviews: []
              },
              quantity: 1
            }
          ],
          subtotal: 380000,
          shippingFee: 30000,
          discount: 0,
          total: 410000,
          status: 'Đang đóng gói',
          paymentStatus: 'Chờ thanh toán'
        }
      ];
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    localStorage.setItem('glowcare_orders', JSON.stringify(this.orders));
  }

  private notify(): void {
    this.saveToStorage();
    this.listeners.forEach((l) => l([...this.orders]));
    eventBus.emit('orders:changed', this.orders);
  }

  public subscribe(listener: (orders: Order[]) => void): () => void {
    this.listeners.add(listener);
    listener([...this.orders]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public subscribeCurrentOrder(listener: (order: Order | null) => void): () => void {
    this.currentOrderListeners.add(listener);
    listener(this.currentOrder);
    return () => {
      this.currentOrderListeners.delete(listener);
    };
  }

  public setCurrentOrder(order: Order | null): void {
    this.currentOrder = order;
    this.currentOrderListeners.forEach((l) => l(this.currentOrder));
    eventBus.logAction('Model', 'OrderModel.setCurrentOrder', order ? `Đang hiển thị đơn hàng: #${order.id}` : 'Đóng modal đơn hàng');
  }

  public createOrder(
    customer: CustomerInfo,
    items: CartItem[],
    subtotal: number,
    shippingFee: number,
    discount: number,
    couponCode?: string
  ): Order {
    const orderId = 'GC-' + Math.floor(100000 + Math.random() * 900000);
    const total = Math.max(0, subtotal - discount + shippingFee);

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toLocaleString('vi-VN'),
      customer,
      items: [...items],
      subtotal,
      shippingFee,
      discount,
      couponCode,
      total,
      status: 'Chờ xác nhận',
      paymentStatus: customer.paymentMethod === 'COD' ? 'Chờ thanh toán' : 'Đã thanh toán',
    };

    this.orders = [newOrder, ...this.orders];
    this.notify();
    this.setCurrentOrder(newOrder);

    eventBus.logAction(
      'Model',
      'OrderModel.createOrder',
      `Tạo đơn hàng thành công #${newOrder.id} - Tổng tiền: ${total.toLocaleString('vi-VN')} ₫ (${customer.paymentMethod})`
    );

    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: Order['status']): boolean {
    const orderIndex = this.orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) return false;

    const oldStatus = this.orders[orderIndex].status;
    this.orders[orderIndex] = {
      ...this.orders[orderIndex],
      status
    };

    if (this.currentOrder && this.currentOrder.id === orderId) {
      this.currentOrder = this.orders[orderIndex];
      this.currentOrderListeners.forEach((l) => l(this.currentOrder));
    }

    this.notify();
    eventBus.logAction(
      'Model',
      'OrderModel.updateOrderStatus',
      `Cập nhật đơn #${orderId}: [${oldStatus}] -> [${status}]`
    );
    return true;
  }

  public updatePaymentStatus(orderId: string, paymentStatus: Order['paymentStatus']): boolean {
    const orderIndex = this.orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) return false;

    const oldStatus = this.orders[orderIndex].paymentStatus;
    this.orders[orderIndex] = {
      ...this.orders[orderIndex],
      paymentStatus
    };

    if (this.currentOrder && this.currentOrder.id === orderId) {
      this.currentOrder = this.orders[orderIndex];
      this.currentOrderListeners.forEach((l) => l(this.currentOrder));
    }

    this.notify();
    eventBus.logAction(
      'Model',
      'OrderModel.updatePaymentStatus',
      `Cập nhật thanh toán đơn #${orderId}: [${oldStatus}] -> [${paymentStatus}]`
    );
    return true;
  }

  public getOrders(): Order[] {
    return [...this.orders];
  }
}

export const orderModel = new OrderModel();
