import { User, UserRole, UserPermission, RegisterPayload } from '../types';
import { eventBus } from './EventBus';

export const ROLE_PERMISSIONS: Record<UserRole, UserPermission[]> = {
  SUPER_ADMIN: [
    'product:view',
    'product:create',
    'product:update',
    'product:delete',
    'inventory:update_stock',
    'inventory:view_alerts',
    'order:view_all',
    'order:update_status',
    'order:cancel',
    'coupon:manage',
    'review:moderate',
    'report:view_revenue',
    'user:manage'
  ],
  WAREHOUSE_STAFF: [
    'product:view',
    'inventory:update_stock',
    'inventory:view_alerts'
  ],
  SALES_STAFF: [
    'product:view',
    'order:view_all',
    'order:update_status',
    'review:moderate'
  ],
  MARKETING_STAFF: [
    'product:view',
    'coupon:manage',
    'product:view'
  ],
  CUSTOMER: [
    'product:view'
  ]
};

export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  SUPER_ADMIN: 'Quản trị viên cấp cao',
  WAREHOUSE_STAFF: 'Thủ kho / Quản lý kho',
  SALES_STAFF: 'Nhân viên Bán hàng & CSKH',
  MARKETING_STAFF: 'Nhân viên Marketing',
  CUSTOMER: 'Khách hàng thành viên'
};

// Seed demo users matching database schema
export const SEED_USERS: User[] = [
  {
    id: 'usr-admin',
    username: 'admin_glowcare',
    email: 'admin@glowcare.vn',
    fullName: 'Phạm Hoàng Minh',
    phone: '0901112233',
    role: 'SUPER_ADMIN',
    roleName: ROLE_DISPLAY_NAMES.SUPER_ADMIN,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    permissions: ROLE_PERMISSIONS.SUPER_ADMIN,
    createdAt: '2026-01-10'
  },
  {
    id: 'usr-warehouse',
    username: 'kho_haiau',
    email: 'kho.haiau@glowcare.vn',
    fullName: 'Lê Hải Âu',
    phone: '0902223344',
    role: 'WAREHOUSE_STAFF',
    roleName: ROLE_DISPLAY_NAMES.WAREHOUSE_STAFF,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    permissions: ROLE_PERMISSIONS.WAREHOUSE_STAFF,
    createdAt: '2026-02-15'
  },
  {
    id: 'usr-sales',
    username: 'sales_huongly',
    email: 'sales.ly@glowcare.vn',
    fullName: 'Đỗ Hương Ly',
    phone: '0903334455',
    role: 'SALES_STAFF',
    roleName: ROLE_DISPLAY_NAMES.SALES_STAFF,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    permissions: ROLE_PERMISSIONS.SALES_STAFF,
    createdAt: '2026-03-01'
  },
  {
    id: 'usr-customer',
    username: 'user_nguyenan',
    email: 'an.nguyen@gmail.com',
    fullName: 'Nguyễn Văn An',
    phone: '0912345678',
    role: 'CUSTOMER',
    roleName: ROLE_DISPLAY_NAMES.CUSTOMER,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    permissions: ROLE_PERMISSIONS.CUSTOMER,
    createdAt: '2026-08-20'
  }
];

class UserModel {
  private currentUser: User | null = null;
  private users: User[] = [...SEED_USERS];
  private listeners: Set<(user: User | null) => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    // Load registered users list
    const storedUsers = localStorage.getItem('glowcare_users_list');
    if (storedUsers) {
      try {
        const parsed = JSON.parse(storedUsers);
        // merge custom users with seed
        const existingIds = new Set(this.users.map((u) => u.id));
        parsed.forEach((u: User) => {
          if (!existingIds.has(u.id)) {
            this.users.push(u);
          }
        });
      } catch (e) {
        console.error('Lỗi khi tải danh sách người dùng', e);
      }
    }

    // Load active session
    const storedUser = localStorage.getItem('glowcare_current_user');
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
      } catch (e) {
        this.currentUser = SEED_USERS[3]; // default to customer
      }
    } else {
      // Default to Customer account for seamless first-visit preview
      this.currentUser = SEED_USERS[3];
      this.saveSession();
    }
  }

  private saveSession(): void {
    if (this.currentUser) {
      localStorage.setItem('glowcare_current_user', JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem('glowcare_current_user');
    }
  }

  private saveUsersList(): void {
    localStorage.setItem('glowcare_users_list', JSON.stringify(this.users));
  }

  private notify(): void {
    this.saveSession();
    this.listeners.forEach((listener) => listener(this.currentUser));
    eventBus.emit('auth:user_changed', this.currentUser);
  }

  public subscribe(listener: (user: User | null) => void): () => void {
    this.listeners.add(listener);
    listener(this.currentUser);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public getAvailableUsers(): User[] {
    return [...this.users];
  }

  public hasPermission(permission: UserPermission): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.permissions.includes(permission);
  }

  public hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }

  public login(username: string): { success: boolean; message: string; user?: User } {
    const cleanUsername = username.trim().toLowerCase();
    const foundUser = this.users.find(
      (u) => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanUsername
    );

    if (!foundUser) {
      return {
        success: false,
        message: 'Tài khoản không tồn tại. Vui lòng kiểm tra lại hoặc đăng ký mới.'
      };
    }

    this.currentUser = foundUser;
    this.notify();

    eventBus.logAction(
      'Model',
      'UserModel.login',
      `Người dùng ${foundUser.fullName} (@${foundUser.username}) đăng nhập với vai trò [${foundUser.roleName}]`
    );

    return {
      success: true,
      message: `Đăng nhập thành công! Chào mừng ${foundUser.fullName} (${foundUser.roleName})`,
      user: foundUser
    };
  }

  public register(payload: RegisterPayload): { success: boolean; message: string; user?: User } {
    const cleanUsername = payload.username.trim().toLowerCase();
    const cleanEmail = payload.email.trim().toLowerCase();

    if (!cleanUsername || !cleanEmail || !payload.fullName.trim()) {
      return {
        success: false,
        message: 'Vui lòng điền đầy đủ các trường thông tin bắt buộc.'
      };
    }

    const isExisted = this.users.some(
      (u) => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanEmail
    );

    if (isExisted) {
      return {
        success: false,
        message: 'Tên đăng nhập hoặc email này đã được sử dụng!'
      };
    }

    const newUser: User = {
      id: 'usr-' + Date.now(),
      username: cleanUsername,
      email: cleanEmail,
      fullName: payload.fullName.trim(),
      phone: payload.phone?.trim() || '',
      role: 'CUSTOMER',
      roleName: ROLE_DISPLAY_NAMES.CUSTOMER,
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${cleanUsername}`,
      permissions: ROLE_PERMISSIONS.CUSTOMER,
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.users.push(newUser);
    this.saveUsersList();
    this.currentUser = newUser;
    this.notify();

    eventBus.logAction(
      'Model',
      'UserModel.register',
      `Tạo tài khoản khách hàng mới: ${newUser.fullName} (@${newUser.username})`
    );

    return {
      success: true,
      message: `Đăng ký tài khoản thành công! Chào mừng ${newUser.fullName} đến với GlowCare Skincare.`,
      user: newUser
    };
  }

  public quickSwitchRole(role: UserRole): { success: boolean; user: User } {
    // Find matching seed user for role
    const matched = this.users.find((u) => u.role === role) || SEED_USERS.find((u) => u.role === role)!;
    this.currentUser = matched;
    this.notify();

    eventBus.logAction(
      'Model',
      'UserModel.quickSwitchRole',
      `Chuyển đổi vai trò sang: [${matched.roleName}] - Quyền hạn: ${matched.permissions.length} quyền`
    );

    return {
      success: true,
      user: matched
    };
  }

  public logout(): void {
    const prev = this.currentUser?.fullName || 'Khách';
    this.currentUser = null;
    this.notify();

    eventBus.logAction('Model', 'UserModel.logout', `Tài khoản ${prev} đã đăng xuất khỏi phiên làm việc.`);
  }
}

export const userModel = new UserModel();
