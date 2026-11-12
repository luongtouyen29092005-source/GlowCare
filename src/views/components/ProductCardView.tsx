import React from 'react';
import { Product } from '../../types';
import { productController } from '../../controllers/ProductController';
import { cartController } from '../../controllers/CartController';
import { Star, Heart, ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
}

export const ProductCardView: React.FC<ProductCardProps> = ({ product, isWishlisted }) => {
  const [justAdded, setJustAdded] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    cartController.addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    productController.toggleWishlist(product.id);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => productController.openProductDetail(product.id)}
      className="group relative bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-xl hover:border-stone-300 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Badges and Top Actions */}
      <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Top left badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white shadow-xs">
              -{product.discountPercent}%
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-stone-900 shadow-xs">
              Bán chạy
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
              Mới ra mắt
            </span>
          )}
        </div>

        {/* Top right wishlist button */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all z-10 ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/80 text-stone-600 hover:text-rose-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="px-3 py-1.5 bg-white text-stone-900 text-xs font-bold rounded-lg shadow-sm">
              Tạm hết hàng
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="font-semibold text-rose-800">{product.brand}</span>
            <span>{product.volume}</span>
          </div>

          {/* Title */}
          <h3 className="font-medium text-stone-900 text-sm line-clamp-2 leading-snug group-hover:text-rose-900 transition-colors">
            {product.name}
          </h3>

          {/* Skin Type tags */}
          <div className="flex flex-wrap gap-1 mt-2.5">
            {product.skinTypes.slice(0, 2).map((st) => (
              <span
                key={st}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-stone-100 text-stone-600"
              >
                {st}
              </span>
            ))}
            {product.skinTypes.length > 2 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-stone-100 text-stone-500">
                +{product.skinTypes.length - 2}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-stone-800">{product.rating}</span>
            <span className="text-xs text-stone-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing & Add to cart */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-base font-bold text-stone-900 tracking-tight">
              {product.price.toLocaleString('vi-VN')} ₫
            </div>
            {product.originalPrice > product.price && (
              <div className="text-xs text-stone-400 line-through">
                {product.originalPrice.toLocaleString('vi-VN')} ₫
              </div>
            )}
          </div>

          <button
            id={`add-to-cart-btn-${product.id}`}
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`p-2.5 rounded-xl font-medium text-xs transition-all flex items-center justify-center ${
              !product.inStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-900 hover:bg-stone-800 text-white active:scale-90 shadow-sm'
            }`}
            aria-label="Thêm sản phẩm vào giỏ hàng"
          >
            {justAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
