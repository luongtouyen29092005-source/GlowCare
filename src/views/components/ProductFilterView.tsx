import React from 'react';
import { FilterState, ProductCategory, SkinType } from '../../types';
import { productController } from '../../controllers/ProductController';
import { RotateCcw, Filter, Check } from 'lucide-react';

interface ProductFilterProps {
  filter: FilterState;
  totalMatches: number;
}

export const ProductFilterView: React.FC<ProductFilterProps> = ({ filter, totalMatches }) => {
  const categories: ProductCategory[] = [
    'Tất cả',
    'Làm sạch',
    'Toner & Nước cân bằng',
    'Serum & Tinh chất',
    'Kem dưỡng ẩm',
    'Chống nắng',
    'Đặc trị & Tẩy da chết'
  ];

  const skinTypes: (SkinType | 'Tất cả')[] = [
    'Tất cả',
    'Da dầu',
    'Da mụn',
    'Da khô',
    'Da nhạy cảm',
    'Da hỗn hợp'
  ];

  const ingredients: string[] = [
    'Tất cả',
    'Niacinamide',
    'BHA',
    'Ceramide',
    'Hyaluronic Acid',
    'Rau Má',
    'Retinol',
    'Tràm Trà'
  ];

  const sortOptions = [
    { value: 'featured', label: 'Nổi bật nhất' },
    { value: 'best-seller', label: 'Bán chạy nhất' },
    { value: 'price-asc', label: 'Giá: Thấp đến cao' },
    { value: 'price-desc', label: 'Giá: Cao đến thấp' },
    { value: 'rating', label: 'Đánh giá cao nhất' }
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-700" />
          <h3 className="font-semibold text-stone-900 text-sm">Bộ lọc tìm kiếm</h3>
        </div>
        <button
          id="reset-filter-btn"
          onClick={() => productController.resetFilters()}
          className="text-xs text-rose-700 hover:text-rose-900 flex items-center gap-1 font-medium transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
          Sắp xếp theo
        </label>
        <select
          id="sort-select"
          value={filter.sortBy}
          onChange={(e) => productController.setSortBy(e.target.value as any)}
          className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category Section */}
      <div>
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
          Danh mục sản phẩm
        </label>
        <div className="space-y-1">
          {categories.map((cat) => {
            const isSelected = filter.category === cat;
            return (
              <button
                key={cat}
                id={`filter-cat-${cat}`}
                onClick={() => productController.setCategory(cat)}
                className={`w-full flex items-center justify-between text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-rose-50 text-rose-900 font-semibold'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-rose-700" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Skin Type Section */}
      <div>
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
          Phù hợp cho loại da
        </label>
        <div className="flex flex-wrap gap-1.5">
          {skinTypes.map((st) => {
            const isSelected = filter.skinType === st;
            return (
              <button
                key={st}
                id={`filter-skin-${st}`}
                onClick={() => productController.setSkinType(st)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Key Ingredients */}
      <div>
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
          Hoạt chất nổi bật
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ingredients.map((ing) => {
            const isSelected = filter.keyIngredient === ing;
            return (
              <button
                key={ing}
                id={`filter-ing-${ing}`}
                onClick={() => productController.setKeyIngredient(ing)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-rose-100 text-rose-900 border border-rose-300'
                    : 'bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {ing}
              </button>
            );
          })}
        </div>
      </div>

      {/* Max Price Range Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Mức giá tối đa
          </label>
          <span className="text-xs font-semibold text-rose-800">
            {filter.priceRange[1].toLocaleString('vi-VN')} ₫
          </span>
        </div>
        <input
          id="price-range-slider"
          type="range"
          min="150000"
          max="600000"
          step="20000"
          value={filter.priceRange[1]}
          onChange={(e) => productController.setPriceRange([0, Number(e.target.value)])}
          className="w-full accent-rose-700 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-stone-400 mt-1">
          <span>150.000 ₫</span>
          <span>600.000 ₫</span>
        </div>
      </div>

      {/* In-Stock Toggle */}
      <div className="pt-2 border-t border-stone-200">
        <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
          <input
            id="only-in-stock-checkbox"
            type="checkbox"
            checked={filter.onlyInStock}
            onChange={(e) => productController.setOnlyInStock(e.target.checked)}
            className="rounded text-rose-700 focus:ring-rose-500 w-4 h-4"
          />
          <span>Chỉ hiển thị sản phẩm còn hàng</span>
        </label>
      </div>

      {/* Results Count Summary */}
      <div className="pt-2 text-center text-xs text-stone-500 font-medium">
        Đang hiển thị <b>{totalMatches}</b> sản phẩm
      </div>
    </div>
  );
};
