import React, { useState, useEffect } from 'react';
import { Product, SkinType } from '../../types';
import { productModel } from '../../models/ProductModel';
import { productController } from '../../controllers/ProductController';
import { cartController } from '../../controllers/CartController';
import { 
  X, 
  Star, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Clock, 
  Plus, 
  Minus,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';

export const ProductDetailModalView: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'ingredients' | 'howTo' | 'reviews'>('desc');
  
  // Review form states
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSkinType, setReviewSkinType] = useState<SkinType>('Da dầu');

  useEffect(() => {
    return productModel.subscribeSelectedProduct((p) => {
      setProduct(p);
      setQuantity(1);
      setActiveTab('desc');
    });
  }, []);

  if (!product) return null;

  const handleAddToCart = () => {
    cartController.addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    cartController.addToCart(product, quantity);
    productController.closeProductDetail();
    cartController.openCheckout();
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = productController.submitReview(
      product.id,
      reviewName,
      reviewRating,
      reviewComment,
      reviewSkinType
    );
    if (ok) {
      setReviewName('');
      setReviewComment('');
    }
  };

  return (
    <div 
      id="product-detail-modal" 
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6"
      onClick={() => productController.closeProductDetail()}
    >
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-stone-200 my-auto flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-product-detail-btn"
          onClick={() => productController.closeProductDetail()}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
          aria-label="Đóng chi tiết sản phẩm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Product Image & Badges */}
            <div className="md:col-span-5 space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 aspect-square bg-stone-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {product.discountPercent > 0 && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-rose-600 text-white font-bold text-xs rounded-full shadow-md">
                    Tiết kiệm {product.discountPercent}%
                  </span>
                )}
              </div>

              {/* Quick Trust Badges */}
              <div className="grid grid-cols-2 gap-2 text-stone-600 text-[11px] font-medium bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Chính Hãng</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-rose-600" />
                  <span>Giao nhanh toàn quốc</span>
                </div>
              </div>
            </div>

            {/* Right Product Summary & Actions */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 uppercase tracking-wider mb-1">
                  <span>{product.brand}</span>
                  <span>•</span>
                  <span>{product.category}</span>
                  <span>•</span>
                  <span>{product.volume}</span>
                </div>

                <h1 className="font-serif text-2xl font-bold text-stone-900 leading-snug">
                  {product.name}
                </h1>

                {/* Rating & Stock */}
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span className="font-bold text-stone-800">{product.rating}</span>
                    <span className="text-stone-400">({product.reviewCount} đánh giá)</span>
                  </div>
                  <span>•</span>
                  {product.inStock ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Còn hàng ({product.stockCount} sản phẩm)
                    </span>
                  ) : (
                    <span className="text-rose-600 font-semibold">Tạm hết hàng</span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-2xl font-bold text-stone-900 tracking-tight">
                  {product.price.toLocaleString('vi-VN')} ₫
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-stone-400 line-through">
                    {product.originalPrice.toLocaleString('vi-VN')} ₫
                  </span>
                )}
                <span className="text-xs text-rose-700 font-medium ml-auto">
                  Đã bao gồm thuế VAT
                </span>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {product.shortDesc}
              </p>

              {/* Skin Type Recommendations */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Phù hợp nhất với:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {product.skinTypes.map((st) => (
                    <span
                      key={st}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-900 border border-rose-100"
                    >
                      {st}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700">
                    Chu trình: {product.usageStep}
                  </span>
                </div>
              </div>

              {/* Quantity Stepper & Add to cart */}
              <div className="pt-3 border-t border-stone-200 space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Số lượng:
                  </span>
                  <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || !product.inStock}
                      className="p-2 text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-colors"
                      aria-label="Giảm số lượng"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-stone-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                      disabled={quantity >= product.stockCount || !product.inStock}
                      className="p-2 text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-colors"
                      aria-label="Tăng số lượng"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    id="modal-add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm border border-stone-900 bg-white text-stone-900 hover:bg-stone-100 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Thêm Vào Giỏ</span>
                  </button>

                  <button
                    id="modal-buy-now-btn"
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    className="w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50 transition-colors shadow-md"
                  >
                    Mua Ngay
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content Section */}
          <div className="mt-10 pt-6 border-t border-stone-200">
            {/* Tab Headers */}
            <div className="flex border-b border-stone-200 gap-6 text-sm font-semibold">
              <button
                onClick={() => setActiveTab('desc')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'desc'
                    ? 'border-rose-700 text-rose-800'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Mô tả chi tiết
              </button>
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'ingredients'
                    ? 'border-rose-700 text-rose-800'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Thành phần hoạt chất
              </button>
              <button
                onClick={() => setActiveTab('howTo')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'howTo'
                    ? 'border-rose-700 text-rose-800'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Hướng dẫn sử dụng
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-rose-700 text-rose-800'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Đánh giá ({product.reviews.length})
              </button>
            </div>

            {/* Tab Body */}
            <div className="py-6 text-sm text-stone-700 leading-relaxed">
              {activeTab === 'desc' && (
                <div className="space-y-4">
                  <p>{product.fullDesc}</p>
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <h4 className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-rose-600" />
                      Lưu ý chuyên môn:
                    </h4>
                    <p className="text-xs text-stone-600">
                      Sản phẩm đã qua kiểm nghiệm da liễu nghiêm ngặt, không chứa Paraben, không cồn khô gây hại, không hương liệu nhân tạo dễ gây kích ứng.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'ingredients' && (
                <div className="space-y-4">
                  <p className="text-stone-600">
                    Bảng thành phần được phân tích khoa học với các hoạt chất sinh học nồng độ chuẩn y khoa:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.keyIngredients.map((ing, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-2.5"
                      >
                        <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </div>
                        <span className="font-semibold text-stone-900 text-xs">{ing}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'howTo' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-rose-800 font-semibold text-xs uppercase tracking-wider">
                    <Clock className="w-4 h-4" />
                    <span>Thời điểm sử dụng: {product.usageStep}</span>
                  </div>
                  <ol className="space-y-2.5 list-decimal list-inside text-stone-600 text-xs sm:text-sm">
                    {product.howToUse.map((step, idx) => (
                      <li key={idx} className="leading-relaxed pl-1">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Reviews List */}
                  {product.reviews.length > 0 ? (
                    <div className="space-y-3">
                      {product.reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-stone-900">{rev.userName}</span>
                              {rev.skinType && (
                                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-medium">
                                  {rev.skinType}
                                </span>
                              )}
                              <span className="text-emerald-700 text-[11px] font-medium">
                                ✓ Đã mua hàng
                              </span>
                            </div>
                            <span className="text-stone-400">{rev.date}</span>
                          </div>
                          <div className="flex text-amber-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < rev.rating ? 'fill-amber-400' : 'text-stone-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs sm:text-sm text-stone-700">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-stone-500 text-xs italic">
                      Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên trải nghiệm và chia sẻ!
                    </p>
                  )}

                  {/* Submit Review Form */}
                  <form
                    onSubmit={handleSubmitReview}
                    className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4"
                  >
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-rose-700" />
                      Viết cảm nhận của bạn về sản phẩm
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Họ và tên của bạn
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder="VD: Lê Mai Phương"
                          className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Loại da của bạn
                        </label>
                        <select
                          value={reviewSkinType}
                          onChange={(e) => setReviewSkinType(e.target.value as SkinType)}
                          className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none"
                        >
                          <option value="Da dầu">Da dầu</option>
                          <option value="Da mụn">Da mụn</option>
                          <option value="Da khô">Da khô</option>
                          <option value="Da nhạy cảm">Da nhạy cảm</option>
                          <option value="Da hỗn hợp">Da hỗn hợp</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Mức độ hài lòng (Số sao)
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            type="button"
                            key={num}
                            onClick={() => setReviewRating(num)}
                            className="p-1 text-amber-500 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                num <= reviewRating ? 'fill-amber-400' : 'text-stone-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Nội dung đánh giá & trải nghiệm
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Chia sẻ về độ thẩm thấu, mùi hương, hiệu quả sau khi sử dụng..."
                        className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
                    >
                      Gửi đánh giá
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
