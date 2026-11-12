import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Droplet, 
  Sun, 
  ShieldCheck, 
  Sparkle, 
  Tag
} from 'lucide-react';
import { skinQuizController } from '../../controllers/SkinQuizController';
import { productController } from '../../controllers/ProductController';
import { notificationController } from '../../controllers/NotificationController';
import { exportProjectAsZip } from '../../utils/projectZipExporter';

export const HeroBannerView: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      badge: 'Dược Mỹ Phẩm Phục Hồi Cao Cấp',
      title: 'Đánh Thức Làn Da Tỏa Sáng Căng Mịn',
      subtitle: 'Quy trình hoạt chất chuyên sâu: Niacinamide, B5 & Ceramide tái sinh hàng rào ẩm tự nhiên.',
      btnText: 'Mua Sắm Ngay',
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=85',
      category: 'Serum & Tinh chất'
    },
    {
      id: 2,
      badge: 'Xu Hướng Skincare 2026',
      title: 'Serum & Tinh Chất Đậm Đặc Phục Hồi',
      subtitle: 'Thấm nhanh, không nhờn rít, cấp ẩm đa tầng và làm dịu vùng da ửng đỏ tức thì.',
      btnText: 'Khám Phá Serum',
      imageUrl: 'https://images.unsplash.com/photo-1608248597359-2ffdb9556819?auto=format&fit=crop&w=1600&q=85',
      category: 'Serum & Tinh chất'
    },
    {
      id: 3,
      badge: 'Kháng Tia UV Phổ Rộng SPF50+',
      title: 'Bảo Vệ Hoàn Hảo Dưới Ánh Nắng',
      subtitle: 'Màng lọc quang phổ rộng, kiềm dầu 8 giờ và nâng tông tự nhiên suốt ngày dài.',
      btnText: 'Xem Kem Chống Nắng',
      imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1600&q=85',
      category: 'Chống nắng'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const categoriesShortcuts = [
    { name: 'Làm sạch', icon: <Droplet className="w-5 h-5 text-rose-600" />, bg: 'bg-rose-50 border-rose-200' },
    { name: 'Toner & Nước cân bằng', icon: <Sparkles className="w-5 h-5 text-sky-600" />, bg: 'bg-sky-50 border-sky-200' },
    { name: 'Serum & Tinh chất', icon: <Sparkle className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50 border-amber-200' },
    { name: 'Kem dưỡng ẩm', icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50 border-emerald-200' },
    { name: 'Chống nắng', icon: <Sun className="w-5 h-5 text-rose-600" />, bg: 'bg-orange-50 border-orange-200' },
  ];

  return (
    <div id="hero-banner-section" className="bg-stone-50 border-b border-stone-200 py-3 sm:py-5">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4">
        {/* Main Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
          {/* Main Visual Slider (8 cols) */}
          <div className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-sm border border-stone-200 h-[320px] sm:h-[400px]">
            {slides.map((s, idx) => (
              <div
                key={s.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={s.imageUrl}
                  alt={s.title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay for aesthetic text visibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/40 to-transparent flex items-center p-6 sm:p-10">
                  <div className="max-w-lg text-white space-y-2 sm:space-y-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-[11px] font-bold tracking-wide uppercase shadow-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{s.badge}</span>
                    </span>

                    <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
                      {s.title}
                    </h1>

                    <p className="text-xs sm:text-sm text-stone-200 line-clamp-2 max-w-md">
                      {s.subtitle}
                    </p>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => {
                          productController.setCategory(s.category as any);
                          const el = document.getElementById('catalog-section');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm rounded-full shadow-md active:scale-95 transition-all flex items-center gap-2"
                      >
                        <span>{s.btnText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => skinQuizController.openQuiz()}
                        className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm font-medium text-xs sm:text-sm rounded-full transition-all"
                      >
                        Chẩn đoán loại da
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Slider Controls */}
            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm p-1 rounded-full">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
                aria-label="Slide trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-white px-1">
                {currentSlide + 1}/{slides.length}
              </span>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
                aria-label="Slide tiếp theo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Side Visual Promo Tiles (4 cols) */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
            {/* Tile 1: Skin Diagnosis */}
            <div 
              className="relative rounded-3xl overflow-hidden shadow-sm border border-stone-200 h-[155px] sm:h-[190px] group cursor-pointer"
              onClick={() => skinQuizController.openQuiz()}
            >
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
                alt="Chẩn đoán da"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/40 to-transparent p-4 sm:p-5 flex flex-col justify-end text-white">
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-amber-300 mb-1">
                  <Sparkles className="w-3 h-3" />
                  Bác Sĩ Da Liễu
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg leading-tight text-white mb-1">
                  Trắc Nghiệm Chẩn Đoán Loại Da
                </h3>
                <p className="text-[11px] text-stone-300 line-clamp-1 mb-2">
                  Tìm chu trình dưỡng ẩm & phục hồi phù hợp nhất với bạn
                </p>
                <div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-300 group-hover:translate-x-1 transition-transform">
                    Bắt đầu trắc nghiệm <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>

            {/* Tile 2: Promo Discount */}
            <div 
              className="relative rounded-3xl overflow-hidden shadow-sm border border-stone-200 h-[155px] sm:h-[190px] group cursor-pointer"
              onClick={() => {
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"
                alt="Khuyến mãi dược mỹ phẩm"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-950/90 via-stone-950/40 to-transparent p-4 sm:p-5 flex flex-col justify-end text-white">
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-rose-300 mb-1">
                  <Tag className="w-3 h-3" />
                  Ưu Đãi Tuần Lễ Dược Mỹ Phẩm
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg leading-tight text-white mb-1">
                  Giảm 20% Cho Đơn Hàng Đầu Tiên
                </h3>
                <p className="text-[11px] text-stone-300 line-clamp-1 mb-2">
                  Nhập mã <b className="text-amber-300">GLOW20</b> khi thanh toán giỏ hàng
                </p>
                <div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-300 group-hover:translate-x-1 transition-transform">
                    Khám phá sản phẩm <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Category Shortcuts */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
          {categoriesShortcuts.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                productController.setCategory(cat.name as any);
                const el = document.getElementById('catalog-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white border border-stone-200 hover:border-stone-400 hover:shadow-xs active:scale-[0.98] transition-all text-left group"
            >
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${cat.bg}`}>
                {cat.icon}
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-stone-800 group-hover:text-rose-600 transition-colors truncate">
                  {cat.name}
                </span>
                <span className="text-[10px] text-stone-400 block truncate">Xem danh mục</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
