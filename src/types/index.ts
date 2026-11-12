export type SkinType = 'Da dầu' | 'Da khô' | 'Da nhạy cảm' | 'Da mụn' | 'Da hỗn hợp' | 'Mọi loại da';

export type ProductCategory = 
  | 'Tất cả'
  | 'Làm sạch'
  | 'Toner & Nước cân bằng'
  | 'Serum & Tinh chất'
  | 'Kem dưỡng ẩm'
  | 'Chống nắng'
  | 'Đặc trị & Tẩy da chết';

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  skinType?: SkinType;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  skinTypes: SkinType[];
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  image: string;
  volume: string;
  keyIngredients: string[];
  usageStep: string;
  routineType: 'AM' | 'PM' | 'Both';
  shortDesc: string;
  fullDesc: string;
  howToUse: string[];
  reviews: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  freeShipping?: boolean;
  minOrderValue: number;
  description: string;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  province: string;
  note?: string;
  paymentMethod: 'COD' | 'VIETQR' | 'MOMO' | 'VNPAY';
}

export interface Order {
  id: string;
  createdAt: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: 'Chờ xác nhận' | 'Đang đóng gói' | 'Đang giao hàng' | 'Đã hoàn thành';
  paymentStatus: 'Chờ thanh toán' | 'Đã thanh toán';
}

export interface FilterState {
  category: ProductCategory;
  skinType: SkinType | 'Tất cả';
  priceRange: [number, number];
  keyIngredient: string | 'Tất cả';
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'best-seller';
  searchQuery: string;
  onlyInStock: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: {
    label: string;
    description: string;
    skinTypeScore: SkinType;
    concern?: string;
  }[];
}

export interface SkinQuizResult {
  primarySkinType: SkinType;
  concerns: string[];
  recommendedRoutine: {
    morning: Product[];
    evening: Product[];
  };
  tips: string[];
}

export interface MVCEventLog {
  id: string;
  timestamp: string;
  layer: 'Model' | 'View' | 'Controller';
  action: string;
  details: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

// =============================================================================
// RBAC (ROLE-BASED ACCESS CONTROL) TYPES
// =============================================================================
export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'WAREHOUSE_STAFF' 
  | 'SALES_STAFF' 
  | 'MARKETING_STAFF' 
  | 'CUSTOMER';

export type UserPermission = 
  | 'product:view'
  | 'product:create'
  | 'product:update'
  | 'product:delete'
  | 'inventory:update_stock'
  | 'inventory:view_alerts'
  | 'order:view_all'
  | 'order:update_status'
  | 'order:cancel'
  | 'coupon:manage'
  | 'review:moderate'
  | 'report:view_revenue'
  | 'user:manage';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  roleName: string;
  avatarUrl?: string;
  permissions: UserPermission[];
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password?: string;
}

export interface RegisterPayload {
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  password?: string;
}
