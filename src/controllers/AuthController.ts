import { userModel } from '../models/UserModel';
import { orderModel } from '../models/OrderModel';
import { notificationController } from './NotificationController';
import { eventBus } from '../models/EventBus';
import { UserRole, RegisterPayload, Order } from '../types';

class AuthController {
  private isAuthModalOpen: boolean = false;
  private authModalTab: 'login' | 'register' | 'switch' = 'login';
  private isOrderManagementOpen: boolean = false;

  private authModalListeners: Set<(isOpen: boolean, tab: 'login' | 'register' | 'switch') => void> = new Set();
  private orderModalListeners: Set<(isOpen: boolean) => void> = new Set();

  public subscribeAuthModal(listener: (isOpen: boolean, tab: 'login' | 'register' | 'switch') => void): () => void {
    this.authModalListeners.add(listener);
    listener(this.isAuthModalOpen, this.authModalTab);
    return () => {
      this.authModalListeners.delete(listener);
    };
  }

  public subscribeOrderModal(listener: (isOpen: boolean) => void): () => void {
    this.orderModalListeners.add(listener);
    listener(this.isOrderManagementOpen);
    return () => {
      this.orderModalListeners.delete(listener);
    };
  }

  private notifyAuthModal(): void {
    this.authModalListeners.forEach((l) => l(this.isAuthModalOpen, this.authModalTab));
  }

  private notifyOrderModal(): void {
    this.orderModalListeners.forEach((l) => l(this.isOrderManagementOpen));
  }

  public openAuthModal(tab: 'login' | 'register' | 'switch' = 'login'): void {
    this.authModalTab = tab;
    this.isAuthModalOpen = true;
    this.notifyAuthModal();

    eventBus.logAction(
      'Controller',
      'AuthController.openAuthModal',
      `Mở giao diện Đăng nhập / Đăng ký / Phân quyền [Tab: ${tab}]`
    );
  }

  public closeAuthModal(): void {
    this.isAuthModalOpen = false;
    this.notifyAuthModal();
  }

  public setAuthTab(tab: 'login' | 'register' | 'switch'): void {
    this.authModalTab = tab;
    this.notifyAuthModal();
  }

  public openOrderManagementModal(): void {
    // Check permission
    if (!userModel.hasPermission('order:view_all')) {
      notificationController.show(
        'warning',
        'Yêu Cầu Phân Quyền',
        'Tài khoản hiện tại không có quyền quản lý đơn hàng. Vui lòng chuyển sang vai trò Nhân viên Bán hàng hoặc Quản trị viên.'
      );
      this.openAuthModal('switch');
      return;
    }

    this.isOrderManagementOpen = true;
    this.notifyOrderModal();

    eventBus.logAction(
      'Controller',
      'AuthController.openOrderManagementModal',
      `Người dùng ${userModel.getCurrentUser()?.fullName} truy cập trung tâm Quản lý đơn hàng`
    );
  }

  public closeOrderManagementModal(): void {
    this.isOrderManagementOpen = false;
    this.notifyOrderModal();
  }

  public login(username: string): boolean {
    eventBus.logAction('Controller', 'AuthController.login', `Thực thi đăng nhập với tên người dùng: ${username}`);

    const result = userModel.login(username);
    if (result.success && result.user) {
      notificationController.show(
        'success',
        'Đăng Nhập Thành Công',
        `Xin chào ${result.user.fullName} (${result.user.roleName})`
      );
      this.closeAuthModal();
      return true;
    } else {
      notificationController.show('error', 'Đăng Nhập Thất Bại', result.message);
      return false;
    }
  }

  public register(payload: RegisterPayload): boolean {
    eventBus.logAction(
      'Controller',
      'AuthController.register',
      `Thực thi đăng ký tài khoản mới: ${payload.fullName} (@${payload.username})`
    );

    const result = userModel.register(payload);
    if (result.success && result.user) {
      notificationController.show(
        'success',
        'Đăng Ký Thành Công',
        `Chào mừng bạn ${result.user.fullName}! Tài khoản đã được kích hoạt thành công.`
      );
      this.closeAuthModal();
      return true;
    } else {
      notificationController.show('error', 'Đăng Ký Thất Bại', result.message);
      return false;
    }
  }

  public quickSwitchRole(role: UserRole): void {
    eventBus.logAction(
      'Controller',
      'AuthController.quickSwitchRole',
      `Chuyển nhanh vai trò thử nghiệm sang [${role}]`
    );

    const res = userModel.quickSwitchRole(role);
    notificationController.show(
      'info',
      'Đã Chuyển Vai Trò (RBAC)',
      `Đang hoạt động dưới vai trò: ${res.user.roleName} (${res.user.permissions.length} quyền hệ thống)`
    );
    this.closeAuthModal();
  }

  public logout(): void {
    const user = userModel.getCurrentUser();
    userModel.logout();

    this.closeOrderManagementModal();

    notificationController.show(
      'info',
      'Đã Đăng Xuất',
      `Tài khoản ${user?.fullName || ''} đã kết thúc phiên làm việc.`
    );
  }

  public updateOrderStatus(orderId: string, status: Order['status']): boolean {
    if (!userModel.hasPermission('order:update_status')) {
      notificationController.show(
        'error',
        'Từ Chối Truy Cập (403 Forbidden)',
        'Tài khoản không có quyền [order:update_status]. Chỉ Nhân viên Bán hàng hoặc Quản trị viên mới được đổi trạng thái đơn.'
      );
      return false;
    }

    const success = orderModel.updateOrderStatus(orderId, status);
    if (success) {
      notificationController.show(
        'success',
        'Cập Nhật Đơn Hàng',
        `Đơn hàng #${orderId} đã được chuyển sang trạng thái: "${status}"`
      );
    }
    return success;
  }

  public updatePaymentStatus(orderId: string, paymentStatus: Order['paymentStatus']): boolean {
    if (!userModel.hasPermission('order:update_status')) {
      notificationController.show(
        'error',
        'Từ Chối Truy Cập (403 Forbidden)',
        'Bạn không có quyền thay đổi trạng thái thanh toán.'
      );
      return false;
    }

    const success = orderModel.updatePaymentStatus(orderId, paymentStatus);
    if (success) {
      notificationController.show(
        'success',
        'Cập Nhật Thanh Toán',
        `Đơn hàng #${orderId} đã cập nhật thanh toán: "${paymentStatus}"`
      );
    }
    return success;
  }
}

export const authController = new AuthController();
