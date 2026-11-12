import { CartItem, Product, Coupon } from '../types';
import { eventBus } from './EventBus';

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'GLOW20',
    discountPercent: 20,
    minOrderValue: 300000,
    description: 'Giảm 20% cho đơn hàng từ 300.000 ₫'
  },
  {
    code: 'FREESHIP',
    freeShipping: true,
    minOrderValue: 200000,
    description: 'Miễn phí vận chuyển cho đơn hàng từ 200.000 ₫'
  },
  {
    code: 'SKINCARE50',
    discountAmount: 50000,
    minOrderValue: 400000,
    description: 'Giảm trực tiếp 50.000 ₫ cho đơn từ 400.000 ₫'
  }
];

export const FREE_SHIPPING_THRESHOLD = 499000;
export const STANDARD_SHIPPING_FEE = 30000;

export interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  itemCount: number;
  isOpen: boolean;
}

class CartModel {
  private items: CartItem[] = [];
  private coupon: Coupon | null = null;
  private isOpen: boolean = false;
  private listeners: Set<(state: CartState) => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const saved = localStorage.getItem('glowcare_cart');
    if (saved) {
      try {
        this.items = JSON.parse(saved);
      } catch (e) {
        this.items = [];
      }
    }
    const savedCoupon = localStorage.getItem('glowcare_coupon');
    if (savedCoupon) {
      try {
        this.coupon = JSON.parse(savedCoupon);
      } catch (e) {
        this.coupon = null;
      }
    }
  }

  private saveToStorage(): void {
    localStorage.setItem('glowcare_cart', JSON.stringify(this.items));
    if (this.coupon) {
      localStorage.setItem('glowcare_coupon', JSON.stringify(this.coupon));
    } else {
      localStorage.removeItem('glowcare_coupon');
    }
  }

  public getState(): CartState {
    const subtotal = this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);

    let shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
    let discount = 0;

    if (this.coupon && subtotal >= this.coupon.minOrderValue) {
      if (this.coupon.freeShipping) {
        shippingFee = 0;
      }
      if (this.coupon.discountPercent) {
        discount = Math.round((subtotal * this.coupon.discountPercent) / 100);
      } else if (this.coupon.discountAmount) {
        discount = this.coupon.discountAmount;
      }
    }

    const total = Math.max(0, subtotal - discount + shippingFee);

    return {
      items: [...this.items],
      coupon: this.coupon,
      subtotal,
      discount,
      shippingFee,
      total,
      itemCount,
      isOpen: this.isOpen
    };
  }

  private notify(): void {
    this.saveToStorage();
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
    eventBus.emit('cart:changed', state);
  }

  public subscribe(listener: (state: CartState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public setIsOpen(open: boolean): void {
    this.isOpen = open;
    this.notify();
    eventBus.logAction('Model', 'CartModel.setIsOpen', open ? 'Mở ngăn giỏ hàng' : 'Đóng ngăn giỏ hàng');
  }

  public addItem(product: Product, quantity: number = 1): { success: boolean; message: string } {
    if (!product.inStock || product.stockCount <= 0) {
      return { success: false, message: 'Sản phẩm hiện đang tạm hết hàng!' };
    }

    const existingIndex = this.items.findIndex((item) => item.product.id === product.id);

    if (existingIndex > -1) {
      const currentQty = this.items[existingIndex].quantity;
      const newQty = currentQty + quantity;

      if (newQty > product.stockCount) {
        return {
          success: false,
          message: `Số lượng vượt quá tồn kho hiện có (${product.stockCount} sản phẩm)`
        };
      }

      this.items[existingIndex].quantity = newQty;
    } else {
      if (quantity > product.stockCount) {
        return {
          success: false,
          message: `Số lượng vượt quá tồn kho hiện có (${product.stockCount} sản phẩm)`
        };
      }

      this.items.push({ product, quantity });
    }

    this.notify();
    eventBus.logAction('Model', 'CartModel.addItem', `Đã thêm ${quantity}x "${product.name}" vào giỏ`);
    return { success: true, message: `Đã thêm "${product.name}" vào giỏ hàng!` };
  }

  public addMultipleItems(products: Product[]): void {
    products.forEach((p) => {
      if (p.inStock && p.stockCount > 0) {
        const existingIndex = this.items.findIndex((item) => item.product.id === p.id);
        if (existingIndex > -1) {
          this.items[existingIndex].quantity = Math.min(this.items[existingIndex].quantity + 1, p.stockCount);
        } else {
          this.items.push({ product: p, quantity: 1 });
        }
      }
    });
    this.notify();
    eventBus.logAction('Model', 'CartModel.addMultipleItems', `Đã thêm toàn bộ bộ routine (${products.length} sản phẩm) vào giỏ`);
  }

  public updateQuantity(productId: string, quantity: number): boolean {
    const item = this.items.find((i) => i.product.id === productId);
    if (!item) return false;

    if (quantity <= 0) {
      return this.removeItem(productId);
    }

    if (quantity > item.product.stockCount) {
      return false;
    }

    item.quantity = quantity;
    this.notify();
    eventBus.logAction('Model', 'CartModel.updateQuantity', `Cập nhật số lượng "${item.product.name}": ${quantity}`);
    return true;
  }

  public removeItem(productId: string): boolean {
    const index = this.items.findIndex((i) => i.product.id === productId);
    if (index === -1) return false;

    const removed = this.items.splice(index, 1)[0];
    this.notify();
    eventBus.logAction('Model', 'CartModel.removeItem', `Đã xóa "${removed.product.name}" khỏi giỏ hàng`);
    return true;
  }

  public applyCoupon(code: string): { success: boolean; message: string } {
    const trimmed = code.trim().toUpperCase();
    const found = AVAILABLE_COUPONS.find((c) => c.code === trimmed);

    if (!found) {
      return { success: false, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn.' };
    }

    const state = this.getState();
    if (state.subtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Mã ${found.code} yêu cầu đơn hàng tối thiểu từ ${found.minOrderValue.toLocaleString('vi-VN')} ₫.`
      };
    }

    this.coupon = found;
    this.notify();
    eventBus.logAction('Model', 'CartModel.applyCoupon', `Đã áp dụng mã giảm giá: ${found.code}`);
    return { success: true, message: `Áp dụng thành công mã giảm giá ${found.code}!` };
  }

  public removeCoupon(): void {
    const old = this.coupon?.code;
    this.coupon = null;
    this.notify();
    eventBus.logAction('Model', 'CartModel.removeCoupon', `Đã gỡ bỏ mã giảm giá: ${old || 'N/A'}`);
  }

  public clearCart(): void {
    this.items = [];
    this.coupon = null;
    this.notify();
    eventBus.logAction('Model', 'CartModel.clearCart', 'Đã làm rỗng giỏ hàng sau khi đặt hàng');
  }
}

export const cartModel = new CartModel();
