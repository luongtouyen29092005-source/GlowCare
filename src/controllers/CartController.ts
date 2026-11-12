import { Product } from '../types';
import { cartModel } from '../models/CartModel';
import { notificationController } from './NotificationController';
import { eventBus } from '../models/EventBus';

class CartController {
  private isCheckoutOpen: boolean = false;
  private checkoutListeners: Set<(open: boolean) => void> = new Set();

  public subscribeCheckout(listener: (open: boolean) => void): () => void {
    this.checkoutListeners.add(listener);
    listener(this.isCheckoutOpen);
    return () => {
      this.checkoutListeners.delete(listener);
    };
  }

  public openCart(): void {
    cartModel.setIsOpen(true);
    eventBus.logAction('Controller', 'CartController.openCart', 'Mở giao diện giỏ hàng');
  }

  public closeCart(): void {
    cartModel.setIsOpen(false);
    eventBus.logAction('Controller', 'CartController.closeCart', 'Đóng giao diện giỏ hàng');
  }

  public toggleCart(): void {
    const currentState = cartModel.getState();
    cartModel.setIsOpen(!currentState.isOpen);
  }

  public addToCart(product: Product, quantity: number = 1): void {
    const res = cartModel.addItem(product, quantity);
    if (res.success) {
      notificationController.show('success', 'Đã thêm vào giỏ', `${quantity}x ${product.name}`);
      eventBus.logAction('Controller', 'CartController.addToCart', `Gửi yêu cầu thêm sản phẩm "${product.name}" sang CartModel`);
    } else {
      notificationController.show('warning', 'Không thể thêm', res.message);
    }
  }

  public addRoutineToCart(products: Product[]): void {
    cartModel.addMultipleItems(products);
    notificationController.show('success', 'Routine Da Hoàn Chỉnh', `Đã thêm trọn bộ ${products.length} sản phẩm theo routine vào giỏ hàng!`);
    cartModel.setIsOpen(true);
    eventBus.logAction('Controller', 'CartController.addRoutineToCart', `Thêm combo ${products.length} sản phẩm từ Quiz Routine`);
  }

  public updateQuantity(productId: string, quantity: number): void {
    const ok = cartModel.updateQuantity(productId, quantity);
    if (!ok && quantity > 0) {
      notificationController.show('warning', 'Kho hàng', 'Số lượng yêu cầu vượt quá tồn kho sẵn có.');
    }
  }

  public removeItem(productId: string, productName?: string): void {
    cartModel.removeItem(productId);
    notificationController.show('info', 'Giỏ hàng', `Đã bỏ ${productName || 'sản phẩm'} khỏi giỏ.`);
  }

  public applyCoupon(code: string): void {
    if (!code.trim()) {
      notificationController.show('warning', 'Mã giảm giá', 'Vui lòng nhập mã ưu đãi.');
      return;
    }

    const res = cartModel.applyCoupon(code);
    if (res.success) {
      notificationController.show('success', 'Mã giảm giá', res.message);
    } else {
      notificationController.show('error', 'Mã giảm giá', res.message);
    }
  }

  public removeCoupon(): void {
    cartModel.removeCoupon();
    notificationController.show('info', 'Mã giảm giá', 'Đã gỡ bỏ mã khuyến mãi.');
  }

  public openCheckout(): void {
    const state = cartModel.getState();
    if (state.items.length === 0) {
      notificationController.show('warning', 'Giỏ hàng trống', 'Vui lòng chọn ít nhất 1 sản phẩm trước khi thanh toán.');
      return;
    }
    this.closeCart();
    this.isCheckoutOpen = true;
    this.checkoutListeners.forEach((l) => l(true));
    eventBus.logAction('Controller', 'CartController.openCheckout', 'Bắt đầu quy trình đặt hàng và thanh toán');
  }

  public closeCheckout(): void {
    this.isCheckoutOpen = false;
    this.checkoutListeners.forEach((l) => l(false));
  }
}

export const cartController = new CartController();
