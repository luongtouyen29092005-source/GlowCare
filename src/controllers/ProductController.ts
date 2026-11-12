import { FilterState, ProductCategory, SkinType, Product, Review } from '../types';
import { productModel } from '../models/ProductModel';
import { notificationController } from './NotificationController';
import { eventBus } from '../models/EventBus';

export const DEFAULT_FILTERS: FilterState = {
  category: 'Tất cả',
  skinType: 'Tất cả',
  priceRange: [0, 600000],
  keyIngredient: 'Tất cả',
  sortBy: 'featured',
  searchQuery: '',
  onlyInStock: false,
};

class ProductController {
  private filterState: FilterState = { ...DEFAULT_FILTERS };
  private listeners: Set<(state: FilterState) => void> = new Set();
  private isStockModalOpen: boolean = false;
  private stockModalListeners: Set<(open: boolean) => void> = new Set();
  private isWishlistModalOpen: boolean = false;
  private wishlistModalListeners: Set<(open: boolean) => void> = new Set();

  public subscribeFilter(listener: (state: FilterState) => void): () => void {
    this.listeners.add(listener);
    listener({ ...this.filterState });
    return () => {
      this.listeners.delete(listener);
    };
  }

  public subscribeStockModal(listener: (open: boolean) => void): () => void {
    this.stockModalListeners.add(listener);
    listener(this.isStockModalOpen);
    return () => {
      this.stockModalListeners.delete(listener);
    };
  }

  public subscribeWishlistModal(listener: (open: boolean) => void): () => void {
    this.wishlistModalListeners.add(listener);
    listener(this.isWishlistModalOpen);
    return () => {
      this.wishlistModalListeners.delete(listener);
    };
  }

  private notifyFilter(): void {
    this.listeners.forEach((l) => l({ ...this.filterState }));
    eventBus.logAction('Controller', 'ProductController.updateFilter', `Cập nhật bộ lọc: Danh mục=${this.filterState.category}, Loại da=${this.filterState.skinType}, Tìm kiếm="${this.filterState.searchQuery}"`);
  }

  public setCategory(category: ProductCategory): void {
    this.filterState.category = category;
    this.notifyFilter();
  }

  public setSkinType(skinType: SkinType | 'Tất cả'): void {
    this.filterState.skinType = skinType;
    this.notifyFilter();
  }

  public setPriceRange(range: [number, number]): void {
    this.filterState.priceRange = range;
    this.notifyFilter();
  }

  public setKeyIngredient(ingredient: string): void {
    this.filterState.keyIngredient = ingredient;
    this.notifyFilter();
  }

  public setSearchQuery(query: string): void {
    this.filterState.searchQuery = query;
    this.notifyFilter();
  }

  public setSortBy(sort: FilterState['sortBy']): void {
    this.filterState.sortBy = sort;
    this.notifyFilter();
  }

  public setOnlyInStock(inStock: boolean): void {
    this.filterState.onlyInStock = inStock;
    this.notifyFilter();
  }

  public resetFilters(): void {
    this.filterState = { ...DEFAULT_FILTERS };
    this.notifyFilter();
    notificationController.show('info', 'Bộ lọc', 'Đã đặt lại tất cả tiêu chí tìm kiếm.');
  }

  public openProductDetail(productId: string): void {
    const product = productModel.getById(productId);
    if (product) {
      productModel.setSelectedProduct(product);
      eventBus.logAction('Controller', 'ProductController.openProductDetail', `Xem chi tiết sản phẩm: ${product.name}`);
    }
  }

  public closeProductDetail(): void {
    productModel.setSelectedProduct(null);
  }

  public toggleWishlist(productId: string): void {
    const isAdded = productModel.toggleWishlist(productId);
    const product = productModel.getById(productId);
    const name = product ? product.name : 'sản phẩm';
    
    if (isAdded) {
      notificationController.show('success', 'Yêu thích', `Đã lưu "${name}" vào danh sách yêu thích.`);
    } else {
      notificationController.show('info', 'Yêu thích', `Đã xóa "${name}" khỏi danh sách yêu thích.`);
    }
  }

  public submitReview(productId: string, userName: string, rating: number, comment: string, skinType?: SkinType): boolean {
    if (!userName.trim() || !comment.trim()) {
      notificationController.show('warning', 'Đánh giá', 'Vui lòng nhập họ tên và nội dung cảm nhận của bạn.');
      return false;
    }

    const success = productModel.addReview(productId, {
      userName: userName.trim(),
      rating,
      comment: comment.trim(),
      skinType,
      verifiedPurchase: true,
    });

    if (success) {
      notificationController.show('success', 'Đánh giá thành công', 'Cảm ơn bạn đã gửi đánh giá quý báu cho sản phẩm!');
    }
    return success;
  }

  public adjustStock(productId: string, delta: number): void {
    const ok = productModel.updateStock(productId, delta);
    const p = productModel.getById(productId);
    if (ok && p) {
      notificationController.show(
        'info',
        'Kho hàng (MVC)',
        `Cập nhật tồn kho "${p.name}" thành ${p.stockCount} chiếc`
      );
    }
  }

  public openStockModal(): void {
    this.isStockModalOpen = true;
    this.stockModalListeners.forEach((l) => l(true));
    eventBus.logAction('Controller', 'ProductController.openStockModal', 'Mở bảng điều khiển quản lý tồn kho (Admin)');
  }

  public closeStockModal(): void {
    this.isStockModalOpen = false;
    this.stockModalListeners.forEach((l) => l(false));
  }

  public openWishlistModal(): void {
    this.isWishlistModalOpen = true;
    this.wishlistModalListeners.forEach((l) => l(true));
    eventBus.logAction('Controller', 'ProductController.openWishlistModal', 'Mở danh sách sản phẩm yêu thích');
  }

  public closeWishlistModal(): void {
    this.isWishlistModalOpen = false;
    this.wishlistModalListeners.forEach((l) => l(false));
  }

  public resetAllData(): void {
    productModel.resetToDefault();
    this.resetFilters();
    notificationController.show('success', 'Dữ liệu', 'Đã khôi phục dữ liệu mỹ phẩm về mặc định!');
  }
}

export const productController = new ProductController();
