import { CustomerInfo, Order } from '../types';
import { cartModel } from '../models/CartModel';
import { orderModel } from '../models/OrderModel';
import { productModel } from '../models/ProductModel';
import { notificationController } from './NotificationController';
import { cartController } from './CartController';
import { eventBus } from '../models/EventBus';

class CheckoutController {
  private isSuccessModalOpen: boolean = false;
  private successModalListeners: Set<(open: boolean) => void> = new Set();

  public subscribeSuccessModal(listener: (open: boolean) => void): () => void {
    this.successModalListeners.add(listener);
    listener(this.isSuccessModalOpen);
    return () => {
      this.successModalListeners.delete(listener);
    };
  }

  public validateForm(customer: CustomerInfo): { valid: boolean; error?: string } {
    if (!customer.fullName.trim()) {
      return { valid: false, error: 'Vui lòng nhập họ và tên người nhận.' };
    }

    const phoneClean = customer.phone.replace(/\s+/g, '');
    if (!phoneClean || !/^(0[3|5|7|8|9])[0-9]{8}$/.test(phoneClean)) {
      return { valid: false, error: 'Số điện thoại không đúng định dạng (VD: 0987654321).' };
    }

    if (customer.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      return { valid: false, error: 'Địa chỉ Email chưa hợp lệ.' };
    }

    if (!customer.address.trim()) {
      return { valid: false, error: 'Vui lòng điền địa chỉ giao hàng cụ thể.' };
    }

    if (!customer.province.trim()) {
      return { valid: false, error: 'Vui lòng chọn Tỉnh / Thành phố.' };
    }

    return { valid: true };
  }

  public submitOrder(customer: CustomerInfo): { success: boolean; order?: Order; error?: string } {
    const validation = this.validateForm(customer);
    if (!validation.valid) {
      notificationController.show('warning', 'Thông tin chưa đầy đủ', validation.error || '');
      return { success: false, error: validation.error };
    }

    const cartState = cartModel.getState();
    if (cartState.items.length === 0) {
      notificationController.show('warning', 'Lỗi đặt hàng', 'Giỏ hàng của bạn đang trống.');
      return { success: false, error: 'Giỏ hàng trống' };
    }

    // Deduct stock from ProductModel
    cartState.items.forEach((item) => {
      productModel.updateStock(item.product.id, -item.quantity);
    });

    // Create order in OrderModel
    const newOrder = orderModel.createOrder(
      customer,
      cartState.items,
      cartState.subtotal,
      cartState.shippingFee,
      cartState.discount,
      cartState.coupon?.code
    );

    // Clear cart in CartModel
    cartModel.clearCart();
    cartController.closeCheckout();

    // Open success modal
    this.openSuccessModal();

    notificationController.show(
      'success',
      'Đặt hàng thành công!',
      `Đơn hàng #${newOrder.id} đã được tiếp nhận thành công.`
    );

    eventBus.logAction(
      'Controller',
      'CheckoutController.submitOrder',
      `Đã chuyển thông tin sang OrderModel và trừ số lượng trong ProductModel. Đơn hàng #${newOrder.id}`
    );

    return { success: true, order: newOrder };
  }

  public openSuccessModal(): void {
    this.isSuccessModalOpen = true;
    this.successModalListeners.forEach((l) => l(true));
  }

  public closeSuccessModal(): void {
    this.isSuccessModalOpen = false;
    this.successModalListeners.forEach((l) => l(false));
    orderModel.setCurrentOrder(null);
  }
}

export const checkoutController = new CheckoutController();
