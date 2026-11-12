import { Product, FilterState, Review } from '../types';
import { eventBus } from './EventBus';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Kem Chống Nắng Phổ Rộng Dịu Nhẹ Ultra Shield SPF 50+ PA++++',
    brand: 'GlowCare Lab',
    category: 'Chống nắng',
    skinTypes: ['Da dầu', 'Da nhạy cảm', 'Da mụn', 'Da hỗn hợp'],
    price: 345000,
    originalPrice: 420000,
    discountPercent: 18,
    rating: 4.9,
    reviewCount: 142,
    inStock: true,
    stockCount: 45,
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80',
    volume: '50ml',
    keyIngredients: ['Zinc Oxide', 'Niacinamide 2%', 'Rau Má Centella', 'Vitamin E'],
    usageStep: 'Bước cuối cùng vào buổi sáng',
    routineType: 'AM',
    shortDesc: 'Kiềm dầu 8 giờ, không vệt trắng, làm dịu da tức thì và bảo vệ toàn diện trước tia UVA/UVB và ánh sáng xanh.',
    fullDesc: 'Kem chống nắng vật lý lai hóa học thế hệ mới với màng lọc chống nắng tiên tiến bảo vệ da toàn diện. Kết cấu dạng sữa mỏng nhẹ thẩm thấu nhanh, nâng tone tự nhiên nhẹ nhàng mà không gây bết dính hay bít tắc lỗ chân lông. Bổ sung chiết xuất rau má và Niacinamide giúp làm dịu vết đỏ và phục hồi hàng rào ẩm.',
    howToUse: [
      'Lắc nhẹ chai trước khi sử dụng.',
      'Thoa đều một lượng bằng 2 ngón tay lên toàn bộ khuôn mặt và vùng cổ 15-20 phút trước khi ra nắng.',
      'Thoa lại sau mỗi 2-3 giờ khi vận động nhiều hoặc tiếp xúc trực tiếp dưới ánh nắng gắt.'
    ],
    reviews: [
      {
        id: 'rev-1',
        userName: 'Nguyễn Thu Trang',
        rating: 5,
        date: '28/08/2026',
        comment: 'Chất kem rất thích, thấm cực nhanh và kiềm dầu cả ngày mà không bị mụn ẩn!',
        skinType: 'Da dầu',
        verifiedPurchase: true
      },
      {
        id: 'rev-2',
        userName: 'Trần Minh Anh',
        rating: 5,
        date: '20/08/2026',
        comment: 'Dùng hết 3 tuýp rồi, không bị cay mắt như các loại kem chống nắng khác.',
        skinType: 'Da nhạy cảm',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-2',
    name: 'Serum Niacinamide 10% + Kẽm Zinc PCA 1% Thu Nhỏ Lỗ Chân Lông',
    brand: 'GlowCare Pure',
    category: 'Serum & Tinh chất',
    skinTypes: ['Da dầu', 'Da mụn', 'Da hỗn hợp'],
    price: 295000,
    originalPrice: 350000,
    discountPercent: 15,
    rating: 4.8,
    reviewCount: 98,
    inStock: true,
    stockCount: 60,
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    volume: '30ml',
    keyIngredients: ['Niacinamide 10%', 'Zinc PCA 1%', 'Chiết xuất Trà Xanh', 'Hyaluronic Acid'],
    usageStep: 'Sau bước toner, trước bước kem dưỡng',
    routineType: 'Both',
    shortDesc: 'Điều tiết bã nhờn, làm mờ thâm mụn, se khít lỗ chân lông và củng cố hàng rào bảo vệ da.',
    fullDesc: 'Công thức tinh chất vàng kết hợp 10% Vitamin B3 tinh khiết và 1% muối kẽm PCA kháng viêm. Giúp kiểm soát hoạt động tuyến bã nhờn, ngăn ngừa mụn mới hình thành, làm đều màu các vết thâm sau mụn và mang lại làn da mịn màng, sáng khỏe.',
    howToUse: [
      'Sau khi làm sạch và cân bằng da với toner, nhỏ 3-4 giọt serum ra lòng bàn tay.',
      'Vỗ nhẹ nhàng khắp mặt và cổ cho đến khi tinh chất thẩm thấu hoàn toàn.',
      'Sử dụng đều đặn cả sáng và tối.'
    ],
    reviews: [
      {
        id: 'rev-3',
        userName: 'Lê Hoàng Yến',
        rating: 5,
        date: '15/08/2026',
        comment: 'Vết thâm mụn mờ rõ sau 2 tuần sử dụng, da bớt đổ dầu vùng chữ T hẳn.',
        skinType: 'Da mụn',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-3',
    name: 'Nước Hoa Hồng Cấp Ẩm Phục Hồi Hyaluronic Acid Đa Tầng',
    brand: 'Hydra Botanical',
    category: 'Toner & Nước cân bằng',
    skinTypes: ['Da khô', 'Da nhạy cảm', 'Da hỗn hợp', 'Mọi loại da'],
    price: 260000,
    originalPrice: 310000,
    discountPercent: 16,
    rating: 4.9,
    reviewCount: 76,
    inStock: true,
    stockCount: 38,
    isFeatured: true,
    isBestSeller: false,
    isNew: true,
    image: 'https://images.unsplash.com/photo-1608248597359-009772a8183a?w=800&auto=format&fit=crop&q=80',
    volume: '200ml',
    keyIngredients: ['5 Loại Hyaluronic Acid', 'Panthenol B5', 'Chiết xuất Hoa Cúc La Mã'],
    usageStep: 'Ngay sau bước rửa mặt',
    routineType: 'Both',
    shortDesc: 'Cấp ẩm sâu vào từng tầng biểu bì, cân bằng độ pH chuẩn 5.5, làm dịu da kích ứng ngay lập tức.',
    fullDesc: 'Chứa phức hợp 5 kích thước phân tử Hyaluronic Acid giúp cấp ẩm đa tầng từ bề mặt đến tầng sâu tế bào. Kết hợp Panthenol B5 nồng độ cao phục hồi làn da đang bong tróc, khô căng sau khi rửa mặt.',
    howToUse: [
      'Thấm một lượng vừa đủ ra bông tẩy trang hoặc đổ trực tiếp ra lòng bàn tay sạch.',
      'Thoa đều và vỗ nhẹ lên da theo hướng từ dưới lên trên.',
      'Có thể đắp lotion mask trong 3 phút để tăng cường độ ẩm tức thì.'
    ],
    reviews: [
      {
        id: 'rev-4',
        userName: 'Phạm Phương Thảo',
        rating: 5,
        date: '10/08/2026',
        comment: 'Nước hoa hồng cực kỳ mướt da, không cồn không hương liệu nên rất an tâm.',
        skinType: 'Da khô',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-4',
    name: 'Kem Dưỡng Phục Hồi Ceramide & Pro-Vitamin B5 Barrier Repair',
    brand: 'GlowCare Lab',
    category: 'Kem dưỡng ẩm',
    skinTypes: ['Da khô', 'Da nhạy cảm', 'Mọi loại da', 'Da mụn'],
    price: 380000,
    originalPrice: 450000,
    discountPercent: 15,
    rating: 4.9,
    reviewCount: 115,
    inStock: true,
    stockCount: 52,
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    volume: '60ml',
    keyIngredients: ['Ceramide NP 3%', 'Vitamin B5 5%', 'Madecassoside Rau Má', 'Squalane Thực Vật'],
    usageStep: 'Bước khóa ẩm cuối cùng trong chu trình dưỡng da',
    routineType: 'Both',
    shortDesc: 'Tái thiết lập màng ẩm sinh học tự nhiên, giảm đỏ rát, chữa lành tổn thương do treatment hay ô nhiễm.',
    fullDesc: 'Kem dưỡng phục hồi chuyên sâu với tỉ lệ vàng 3 loại Ceramide tương thích sinh học cao. Bổ sung Squalane chiết xuất từ quả ô-liu giúp khóa chặt các phân tử nước trong biểu bì suốt 24 giờ, hỗ trợ tái tạo màng bảo vệ da bị tổn thương do mụn hoặc treatment quá đà.',
    howToUse: [
      'Lấy lượng kem vừa đủ bằng hạt đậu chấm lên 5 điểm trên khuôn mặt.',
      'Massage nhẹ nhàng theo chuyển động tròn từ trong ra ngoài cho đến khi kem thẩm thấu.',
      'Sử dụng mỗi sáng và tối để có làn da mềm mại, căng tràn sức sống.'
    ],
    reviews: [
      {
        id: 'rev-5',
        userName: 'Đỗ Hải Đăng',
        rating: 5,
        date: '02/09/2026',
        comment: 'Cứu tinh cho da mình lúc dùng tretinoin bị tróc vảy đỏ rát. 2 ngày là êm ru!',
        skinType: 'Da nhạy cảm',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-5',
    name: 'Gel Rửa Mặt Tràm Trà & BHA 0.5% Làm Sạch Sâu Dịu Nhẹ',
    brand: 'Pure Botanical',
    category: 'Làm sạch',
    skinTypes: ['Da dầu', 'Da mụn', 'Da hỗn hợp'],
    price: 210000,
    originalPrice: 250000,
    discountPercent: 16,
    rating: 4.7,
    reviewCount: 88,
    inStock: true,
    stockCount: 70,
    isFeatured: false,
    isBestSeller: true,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1556228722-d9b3be373b98?w=800&auto=format&fit=crop&q=80',
    volume: '150ml',
    keyIngredients: ['Tinh dầu Tràm Trà Úc', 'Salicylic Acid (BHA 0.5%)', 'Allantoin'],
    usageStep: 'Bước làm sạch đầu tiên buổi sáng và sau tẩy trang buổi tối',
    routineType: 'Both',
    shortDesc: 'Làm sạch bã nhờn sâu trong lỗ chân lông mà không làm khô căng hay tổn thương lớp màng ẩm.',
    fullDesc: 'Sữa rửa mặt dạng gel không chứa xà phòng (soap-free), độ pH lý tưởng 5.5 giúp loại bỏ bụi bẩn và dầu thừa mà vẫn giữ nguyên độ ẩm tự nhiên của da. Tinh dầu tràm trà hữu cơ kháng khuẩn tự nhiên ngăn ngừa mụn phát triển.',
    howToUse: [
      'Làm ướt mặt bằng nước ấm.',
      'Lấy một lượng gel cỡ đồng xu ra tay, xoa tạo bọt nhẹ.',
      'Massage nhẹ nhàng khắp mặt trong 60 giây, chú ý vùng chữ T.',
      'Rửa sạch lại với nước mát và lau khô bằng khăn mềm.'
    ],
    reviews: []
  },
  {
    id: 'prod-6',
    name: 'Dung Dịch Tẩy Tế Bào Chết Hóa Học Salicylic Acid BHA 2% Liquid',
    brand: 'GlowCare Lab',
    category: 'Đặc trị & Tẩy da chết',
    skinTypes: ['Da dầu', 'Da mụn', 'Da hỗn hợp'],
    price: 420000,
    originalPrice: 490000,
    discountPercent: 14,
    rating: 4.8,
    reviewCount: 65,
    inStock: true,
    stockCount: 30,
    isFeatured: true,
    isBestSeller: false,
    isNew: true,
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&auto=format&fit=crop&q=80',
    volume: '100ml',
    keyIngredients: ['BHA 2% (Salicylic Acid)', 'Chiết xuất Vỏ Liễu Trắng', 'Trà Xanh'],
    usageStep: 'Sau bước toner, sử dụng buổi tối 2-3 lần/tuần',
    routineType: 'PM',
    shortDesc: 'Thẩm thấu sâu hòa tan bã nhờn tích tụ, giải phóng mụn đầu đen và mụn ẩn dưới da.',
    fullDesc: 'Công thức BHA 2% tối ưu độ thẩm thấu với pH 3.5-3.9, tác động sâu vào lỗ chân lông loại bỏ tế bào chết già cỗi, gom cồi mụn nhanh chóng và làm mịn bề mặt da thô ráp.',
    howToUse: [
      'Bắt đầu sử dụng 1-2 lần/tuần vào buổi tối.',
      'Thấm dung dịch ra bông tẩy trang và thoa nhẹ nhàng lên vùng da có mụn cám, mụn đầu đen.',
      'Không cần rửa lại. Đợi 10-15 phút trước khi tiếp tục các bước dưỡng tiếp theo.'
    ],
    reviews: []
  },
  {
    id: 'prod-7',
    name: 'Nước Tẩy Trang Rau Má Dịu Nhẹ Centella Micellar Cleansing Water',
    brand: 'Pure Botanical',
    category: 'Làm sạch',
    skinTypes: ['Da nhạy cảm', 'Da dầu', 'Da khô', 'Da mụn', 'Mọi loại da'],
    price: 235000,
    originalPrice: 280000,
    discountPercent: 16,
    rating: 4.9,
    reviewCount: 94,
    inStock: true,
    stockCount: 40,
    isFeatured: false,
    isBestSeller: true,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=800&auto=format&fit=crop&q=80',
    volume: '300ml',
    keyIngredients: ['Chiết xuất Rau Má Đảo Jeju', 'Công nghệ Micellar', 'Glycerin'],
    usageStep: 'Bước đầu tiên trong chu trình làm sạch buổi tối',
    routineType: 'PM',
    shortDesc: 'Cuốn trôi 99% lớp trang điểm, kem chống nắng và bụi mịn PM2.5 mà không cần chà xát mạnh.',
    fullDesc: 'Với hạt micelle siêu nhỏ thông minh hút sạch cặn bẩn bám dính, sản phẩm mang lại cảm giác thanh mát tức thì mà hoàn toàn không để lại lớp nhờn dính trên mặt.',
    howToUse: [
      'Thấm đẫm nước tẩy trang ra bông cotton.',
      'Nhẹ nhàng lau khắp mặt theo hướng từ trong ra ngoài và từ dưới lên trên.',
      'Giữ bông trên mắt và môi khoảng 5 giây trước khi lau nhẹ nhàng.'
    ],
    reviews: []
  },
  {
    id: 'prod-8',
    name: 'Mặt Nạ Đất Sét Khoáng Núi Lửa & Bột Tràm Trà Thanh Lọc Thải Độc',
    brand: 'GlowCare Pure',
    category: 'Đặc trị & Tẩy da chết',
    skinTypes: ['Da dầu', 'Da mụn', 'Da hỗn hợp'],
    price: 280000,
    originalPrice: 320000,
    discountPercent: 12,
    rating: 4.7,
    reviewCount: 52,
    inStock: true,
    stockCount: 25,
    isFeatured: false,
    isBestSeller: false,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80',
    volume: '100g',
    keyIngredients: ['Đất Sét Trắng Kaolin', 'Bùn Khoáng Núi Lửa', 'Bột Lá Tràm Trà'],
    usageStep: 'Sử dụng 1-2 lần mỗi tuần sau bước làm sạch',
    routineType: 'PM',
    shortDesc: 'Hút sạch bã nhờn dư thừa, se khít lỗ chân lông, làm sáng và thanh lọc độc tố cho da.',
    fullDesc: 'Sự kết hợp giữa đất sét Kaolin tinh khiết và tro núi lửa hấp thụ triệt để dầu thừa tận sâu lỗ chân lông, mang lại làn da khô thoáng, mát mịn mà không hề gây cảm giác nứt nẻ hay khô ráp.',
    howToUse: [
      'Sau khi rửa mặt, thoa một lớp mặt nạ đều lên khắp mặt, tránh vùng mắt và môi.',
      'Thư giãn trong 10-15 phút đến khi mặt nạ se lại.',
      'Rửa sạch bằng nước ấm kết hợp massage nhẹ nhàng theo hình xoắn ốc.'
    ],
    reviews: []
  },
  {
    id: 'prod-9',
    name: 'Xịt Khoáng Cấp Nước Làm Dịu Khẩn Cấp Chiết Xuất Xương Rồng & Cúc La Mã',
    brand: 'Hydra Botanical',
    category: 'Toner & Nước cân bằng',
    skinTypes: ['Mọi loại da', 'Da nhạy cảm', 'Da khô'],
    price: 195000,
    originalPrice: 230000,
    discountPercent: 15,
    rating: 4.8,
    reviewCount: 43,
    inStock: true,
    stockCount: 50,
    isFeatured: false,
    isBestSeller: false,
    isNew: true,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    volume: '150ml',
    keyIngredients: ['Nước Xương Rồng Sa Mạc', 'Chiết Xuất Hoa Cúc La Mã', 'Khoáng Chất Biển Sâu'],
    usageStep: 'Dùng bất cứ khi nào da cảm thấy khô căng hoặc nóng rát',
    routineType: 'Both',
    shortDesc: 'Tia sương siêu mịn làm mát dịu tức thì, cấp ẩm và khóa lớp makeup bền màu cả ngày.',
    fullDesc: 'Xịt khoáng với vòi xịt vi hạt Nano tạo màn sương phủ đều mỏng nhẹ. Cung cấp độ ẩm dồi dào cho da văn phòng ngồi điều hòa liên tục hoặc khi hoạt động ngoài trời nắng nóng.',
    howToUse: [
      'Đặt chai xịt song song với mặt, cách khoảng 20cm.',
      'Nhấn vòi xịt và di chuyển theo hình tròn khắp khuôn mặt.',
      'Vỗ nhẹ để khoáng chất thẩm thấu tốt hơn.'
    ],
    reviews: []
  },
  {
    id: 'prod-10',
    name: 'Tinh Chất Retinol Tinh Khiết 0.5% Trong Squalane Trẻ Hóa Tái Sinh Da',
    brand: 'GlowCare Lab',
    category: 'Serum & Tinh chất',
    skinTypes: ['Da khô', 'Da hỗn hợp', 'Da dầu'],
    price: 490000,
    originalPrice: 580000,
    discountPercent: 15,
    rating: 4.9,
    reviewCount: 71,
    inStock: true,
    stockCount: 18,
    isFeatured: true,
    isBestSeller: false,
    isNew: false,
    image: 'https://images.unsplash.com/photo-1512290900672-1f02e604f86d?w=800&auto=format&fit=crop&q=80',
    volume: '30ml',
    keyIngredients: ['Pure Retinol 0.5%', 'Squalane Thực Vật', 'Dầu Jojoba', 'Vitamin E'],
    usageStep: 'Sử dụng vào buổi tối, trước bước kem dưỡng ẩm',
    routineType: 'PM',
    shortDesc: 'Kích thích tăng sinh Collagen tự nhiên, xóa mờ nếp nhăn li ti và làm phẳng mịn bề mặt da.',
    fullDesc: 'Sản phẩm chống lão hóa và tái tạo da chuyên biệt, hòa tan Retinol trong nền dầu Squalane êm dịu nhằm hạn chế tối đa nguy cơ kích ứng, đỏ rát cho người mới bắt đầu treatment.',
    howToUse: [
      'Sử dụng 2-3 giọt vào buổi tối sau bước toner.',
      'Bắt đầu với tần suất 2 lần/tuần và tăng dần khi da đã quen.',
      'Bắt buộc dùng kem chống nắng phổ rộng vào ban ngày.'
    ],
    reviews: []
  }
];

class ProductModel {
  private products: Product[] = [];
  private listeners: Set<(products: Product[]) => void> = new Set();
  private selectedProduct: Product | null = null;
  private selectedProductListeners: Set<(product: Product | null) => void> = new Set();
  private wishlist: Set<string> = new Set();
  private wishlistListeners: Set<(wishlist: Set<string>) => void> = new Set();

  constructor() {
    this.init();
  }

  private init(): void {
    const saved = localStorage.getItem('glowcare_products');
    if (saved) {
      try {
        this.products = JSON.parse(saved);
      } catch (e) {
        this.products = [...INITIAL_PRODUCTS];
      }
    } else {
      this.products = [...INITIAL_PRODUCTS];
      this.saveToStorage();
    }

    const savedWishlist = localStorage.getItem('glowcare_wishlist');
    if (savedWishlist) {
      try {
        this.wishlist = new Set(JSON.parse(savedWishlist));
      } catch (e) {
        this.wishlist = new Set();
      }
    }
  }

  private saveToStorage(): void {
    localStorage.setItem('glowcare_products', JSON.stringify(this.products));
    localStorage.setItem('glowcare_wishlist', JSON.stringify(Array.from(this.wishlist)));
  }

  private notify(): void {
    this.saveToStorage();
    this.listeners.forEach((listener) => listener([...this.products]));
    eventBus.emit('products:changed', this.products);
  }

  public subscribe(listener: (products: Product[]) => void): () => void {
    this.listeners.add(listener);
    listener([...this.products]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public subscribeSelectedProduct(listener: (product: Product | null) => void): () => void {
    this.selectedProductListeners.add(listener);
    listener(this.selectedProduct);
    return () => {
      this.selectedProductListeners.delete(listener);
    };
  }

  public subscribeWishlist(listener: (wishlist: Set<string>) => void): () => void {
    this.wishlistListeners.add(listener);
    listener(new Set(this.wishlist));
    return () => {
      this.wishlistListeners.delete(listener);
    };
  }

  public getAll(): Product[] {
    return [...this.products];
  }

  public getById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  public setSelectedProduct(product: Product | null): void {
    this.selectedProduct = product;
    this.selectedProductListeners.forEach((l) => l(this.selectedProduct));
    eventBus.logAction('Model', 'ProductModel.setSelectedProduct', product ? `Đã chọn: ${product.name}` : 'Đã đóng chi tiết sản phẩm');
  }

  public toggleWishlist(productId: string): boolean {
    let isAdded = false;
    if (this.wishlist.has(productId)) {
      this.wishlist.delete(productId);
    } else {
      this.wishlist.add(productId);
      isAdded = true;
    }
    this.saveToStorage();
    this.wishlistListeners.forEach((l) => l(new Set(this.wishlist)));
    eventBus.logAction('Model', 'ProductModel.toggleWishlist', `${isAdded ? 'Đã thêm vào' : 'Đã bỏ khỏi'} yêu thích (ID: ${productId})`);
    return isAdded;
  }

  public isWishlisted(productId: string): boolean {
    return this.wishlist.has(productId);
  }

  public updateStock(productId: string, delta: number): boolean {
    const p = this.products.find((item) => item.id === productId);
    if (!p) return false;

    p.stockCount = Math.max(0, p.stockCount + delta);
    p.inStock = p.stockCount > 0;
    this.notify();
    eventBus.logAction('Model', 'ProductModel.updateStock', `Cập nhật tồn kho "${p.name}" số lượng mới: ${p.stockCount}`);
    return true;
  }

  public addReview(productId: string, review: Omit<Review, 'id' | 'date'>): boolean {
    const p = this.products.find((item) => item.id === productId);
    if (!p) return false;

    const newRev: Review = {
      ...review,
      id: 'rev-' + Date.now(),
      date: new Date().toLocaleDateString('vi-VN'),
    };

    p.reviews = [newRev, ...p.reviews];
    p.reviewCount = p.reviews.length;
    p.rating = Number((p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length).toFixed(1));

    this.notify();
    if (this.selectedProduct?.id === productId) {
      this.setSelectedProduct({ ...p });
    }
    eventBus.logAction('Model', 'ProductModel.addReview', `Đã thêm đánh giá ${review.rating} sao cho "${p.name}"`);
    return true;
  }

  public filterAndSort(filter: FilterState): Product[] {
    let result = [...this.products];

    // Category filter
    if (filter.category !== 'Tất cả') {
      result = result.filter((p) => p.category === filter.category);
    }

    // Skin type filter
    if (filter.skinType !== 'Tất cả') {
      result = result.filter((p) => p.skinTypes.includes(filter.skinType as any) || p.skinTypes.includes('Mọi loại da'));
    }

    // Price range
    result = result.filter((p) => p.price >= filter.priceRange[0] && p.price <= filter.priceRange[1]);

    // Key Ingredient
    if (filter.keyIngredient !== 'Tất cả') {
      result = result.filter((p) => p.keyIngredients.some((ing) => ing.toLowerCase().includes(filter.keyIngredient.toLowerCase())));
    }

    // Search query
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase().trim();
      result = result.filter((p) => 
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.keyIngredients.some((ing) => ing.toLowerCase().includes(q))
      );
    }

    // In stock only
    if (filter.onlyInStock) {
      result = result.filter((p) => p.inStock);
    }

    // Sorting
    switch (filter.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'best-seller':
        result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }

  public resetToDefault(): void {
    this.products = [...INITIAL_PRODUCTS];
    this.saveToStorage();
    this.notify();
    eventBus.logAction('Model', 'ProductModel.resetToDefault', 'Đã đặt lại dữ liệu sản phẩm mặc định');
  }
}

export const productModel = new ProductModel();
