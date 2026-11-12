import React, { useState, useEffect } from 'react';
import { productModel } from '../../models/ProductModel';
import { productController } from '../../controllers/ProductController';
import { cartController } from '../../controllers/CartController';
import { Product } from '../../types';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export const WishlistView: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const unsubModal = productController.subscribeWishlistModal(setIsOpen);
    const unsubWishlist = productModel.subscribeWishlist(setWishlistIds);
    const unsubProducts = productModel.subscribe(setAllProducts);

    return () => {
      unsubModal();
      unsubWishlist();
      unsubProducts();
    };
  }, []);

  if (!isOpen) return null;

  const favoritedProducts = allProducts.filter((p) => wishlistIds.has(p.id));

  return (
    <div
      id="wishlist-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={() => productController.closeWishlistModal()}
    >
      <div
        className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-stone-200 my-auto flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
            <h2 className="font-serif font-bold text-stone-900 text-lg">
              Sản phẩm yêu thích ({favoritedProducts.length})
            </h2>
          </div>
          <button
            id="close-wishlist-modal-btn"
            onClick={() => productController.closeWishlistModal()}
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors"
            aria-label="Đóng danh sách yêu thích"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {favoritedProducts.length === 0 ? (
            <div className="py-12 text-center text-stone-500 space-y-3">
              <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
                <Heart className="w-7 h-7" />
              </div>
              <h4 className="font-semibold text-stone-800 text-sm">Chưa có sản phẩm yêu thích</h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Nhấn biểu tượng trái tim trên bất kỳ sản phẩm nào để lưu lại và theo dõi giá ưu đãi.
              </p>
            </div>
          ) : (
            favoritedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-stone-50 border border-stone-200 hover:border-rose-200 transition-colors"
              >
                <div
                  className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-stone-200 flex-shrink-0 cursor-pointer"
                  onClick={() => {
                    productController.closeWishlistModal();
                    productController.openProductDetail(product.id);
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-rose-700 uppercase">
                    {product.brand}
                  </span>
                  <h4
                    onClick={() => {
                      productController.closeWishlistModal();
                      productController.openProductDetail(product.id);
                    }}
                    className="text-xs font-semibold text-stone-900 line-clamp-1 hover:text-rose-800 cursor-pointer"
                  >
                    {product.name}
                  </h4>
                  <div className="text-xs font-bold text-stone-900 mt-1">
                    {product.price.toLocaleString('vi-VN')} ₫
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      cartController.addToCart(product, 1);
                    }}
                    className="p-2 bg-stone-900 text-white rounded-xl text-xs hover:bg-stone-800 transition-colors"
                    title="Thêm vào giỏ"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => productController.toggleWishlist(product.id)}
                    className="p-2 text-stone-400 hover:text-rose-600 transition-colors"
                    title="Xóa khỏi yêu thích"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
