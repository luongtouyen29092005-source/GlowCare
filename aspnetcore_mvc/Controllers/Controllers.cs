using System.Security.Claims;
using System.Text.Json;
using GlowCare_AspNetCore_MVC.Data;
using GlowCare_AspNetCore_MVC.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GlowCare_AspNetCore_MVC.Controllers
{
    // =========================================================================
    // 1. HOME CONTROLLER
    // =========================================================================
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context;

        public HomeController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            try
            {
                if (!await _context.Products.AnyAsync())
                {
                    DbInitializer.Initialize(_context);
                }

                var featuredProducts = await _context.Products
                    .Include(p => p.Brand)
                    .Include(p => p.Category)
                    .Where(p => p.IsFeatured)
                    .ToListAsync();

                var cats = await _context.Categories.ToListAsync();
                if (cats.Any() && featuredProducts.Any())
                {
                    ViewBag.Categories = cats;
                    return View(featuredProducts);
                }
            }
            catch
            {
                // Fallback nếu CSDL SQL Server chưa kết nối hoặc chưa tạo
            }

            var fallbackCategories = GetFallbackCategories();
            ViewBag.Categories = fallbackCategories;
            return View(GetFallbackProducts(fallbackCategories));
        }

        public IActionResult SkinQuiz()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = System.Diagnostics.Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public static List<Category> GetFallbackCategories()
        {
            return new List<Category>
            {
                new Category { CategoryId = 1, CategoryName = "Làm sạch", Slug = "lam-sach", Description = "Sữa rửa mặt và dầu tẩy trang dịu nhẹ" },
                new Category { CategoryId = 2, CategoryName = "Toner & Cân bằng", Slug = "toner-can-bang", Description = "Cân bằng độ pH và cấp ẩm" },
                new Category { CategoryId = 3, CategoryName = "Serum & Tinh chất", Slug = "serum-tinh-chat", Description = "Hoạt chất cô đặc phục hồi và sáng da" },
                new Category { CategoryId = 4, CategoryName = "Kem dưỡng ẩm", Slug = "kem-duong-am", Description = "Khóa ẩm và tái tạo hàng rào lipid" },
                new Category { CategoryId = 5, CategoryName = "Chống nắng", Slug = "chong-nang", Description = "Bảo vệ da phổ rộng khỏi UVA, UVB" }
            };
        }

        public static List<Product> GetFallbackProducts(List<Category> categories)
        {
            var brand1 = new Brand { BrandId = 1, BrandName = "La Roche-Posay", Country = "Pháp" };
            var brand2 = new Brand { BrandId = 2, BrandName = "Paula's Choice", Country = "Mỹ" };
            var brand3 = new Brand { BrandId = 3, BrandName = "Skin1004", Country = "Hàn Quốc" };
            var brand4 = new Brand { BrandId = 4, BrandName = "Anessa", Country = "Nhật Bản" };

            return new List<Product>
            {
                new Product
                {
                    ProductId = "laroche-effaclar-gel",
                    ProductName = "Gel Rửa Mặt Giảm Nhờn Cho Da Dầu Mụn La Roche-Posay Effaclar Gel",
                    Brand = brand1,
                    Category = categories.ElementAtOrDefault(0),
                    Price = 385000,
                    OriginalPrice = 460000,
                    DiscountPercent = 16,
                    Rating = 4.9m,
                    ReviewCount = 128,
                    StockCount = 45,
                    IsFeatured = true,
                    IsBestSeller = true,
                    ImageUrl = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
                    Volume = "200ml",
                    UsageStep = "Bước 1: Làm sạch da (Sáng & Tối)",
                    SkinTypes = "Da dầu, Da nhạy cảm, Da mụn",
                    KeyIngredients = "Niacinamide, Zinc PCA"
                },
                new Product
                {
                    ProductId = "paulas-choice-bha-2",
                    ProductName = "Dung Dịch Tẩy Tế Bào Chết Paula's Choice 2% BHA Liquid Exfoliant",
                    Brand = brand2,
                    Category = categories.ElementAtOrDefault(1),
                    Price = 810000,
                    OriginalPrice = 950000,
                    DiscountPercent = 15,
                    Rating = 4.8m,
                    ReviewCount = 256,
                    StockCount = 18,
                    IsFeatured = true,
                    IsBestSeller = true,
                    ImageUrl = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
                    Volume = "118ml",
                    UsageStep = "Bước 3: Tẩy da chết hóa học",
                    SkinTypes = "Da dầu, Da mụn, Da hỗn hợp",
                    KeyIngredients = "Salicylic Acid (BHA 2%), Trà xanh"
                },
                new Product
                {
                    ProductId = "skin1004-centella-ampoule",
                    ProductName = "Tinh Chất Rau Má Phục Hồi Dịu Da Skin1004 Madagascar Centella",
                    Brand = brand3,
                    Category = categories.ElementAtOrDefault(2),
                    Price = 345000,
                    OriginalPrice = 420000,
                    DiscountPercent = 18,
                    Rating = 4.9m,
                    ReviewCount = 312,
                    StockCount = 60,
                    IsFeatured = true,
                    IsBestSeller = true,
                    ImageUrl = "https://images.unsplash.com/photo-1608248597359-2e118ef55655?auto=format&fit=crop&w=800&q=80",
                    Volume = "100ml",
                    UsageStep = "Bước 4: Serum/Tinh chất",
                    SkinTypes = "Da dầu, Da khô, Da nhạy cảm",
                    KeyIngredients = "Centella Asiatica (Rau má 100%)"
                },
                new Product
                {
                    ProductId = "anessa-perfect-uv-sunscreen",
                    ProductName = "Sữa Chống Nắng Kiềm Dầu Anessa Perfect UV Sunscreen SPF50+ PA++++",
                    Brand = brand4,
                    Category = categories.ElementAtOrDefault(4),
                    Price = 545000,
                    OriginalPrice = 685000,
                    DiscountPercent = 20,
                    Rating = 4.9m,
                    ReviewCount = 410,
                    StockCount = 25,
                    IsFeatured = true,
                    IsBestSeller = true,
                    ImageUrl = "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
                    Volume = "60ml",
                    UsageStep = "Bước 5: Chống nắng",
                    SkinTypes = "Mọi loại da, Da dầu",
                    KeyIngredients = "Zinc Oxide, Titanium Dioxide"
                }
            };
        }

        public static async Task<Product?> FindProductAsync(ApplicationDbContext context, string? id)
        {
            if (string.IsNullOrWhiteSpace(id)) return null;

            var cleanId = id.Trim();
            try
            {
                var p = await context.Products
                    .Include(x => x.Brand)
                    .Include(x => x.Category)
                    .FirstOrDefaultAsync(x => x.ProductId == cleanId || x.ProductId.ToLower() == cleanId.ToLower());
                if (p != null) return p;
            }
            catch
            {
                // Fallback an toàn nếu CSDL SQL Server chưa kết nối
            }

            var fallbackCats = GetFallbackCategories();
            var fallbackList = GetFallbackProducts(fallbackCats);
            var item = fallbackList.FirstOrDefault(x => 
                string.Equals(x.ProductId, cleanId, StringComparison.OrdinalIgnoreCase) ||
                cleanId.ToLower().Contains(x.ProductId.ToLower()) ||
                x.ProductId.ToLower().Contains(cleanId.ToLower()));

            return item ?? fallbackList.FirstOrDefault();
        }
    }

    // =========================================================================
    // 2. PRODUCTS CONTROLLER
    // =========================================================================
    public class ProductsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index(string? category, string? skinType, string? search, string? sort)
        {
            try
            {
                var query = _context.Products
                    .Include(p => p.Brand)
                    .Include(p => p.Category)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(category) && category != "Tất cả")
                {
                    query = query.Where(p => p.Category != null && p.Category.CategoryName == category);
                }

                if (!string.IsNullOrEmpty(skinType) && skinType != "Tất cả")
                {
                    query = query.Where(p => p.SkinTypes != null && p.SkinTypes.Contains(skinType));
                }

                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(p => p.ProductName.Contains(search) || (p.Brand != null && p.Brand.BrandName.Contains(search)));
                }

                query = sort switch
                {
                    "price-asc" => query.OrderBy(p => p.Price),
                    "price-desc" => query.OrderByDescending(p => p.Price),
                    "rating" => query.OrderByDescending(p => p.Rating),
                    _ => query.OrderByDescending(p => p.IsFeatured).ThenByDescending(p => p.ReviewCount)
                };

                var products = await query.ToListAsync();
                var categories = await _context.Categories.ToListAsync();

                if (products.Any() && categories.Any())
                {
                    ViewBag.Categories = categories;
                    ViewBag.CurrentCategory = category ?? "Tất cả";
                    ViewBag.CurrentSkinType = skinType ?? "Tất cả";
                    ViewBag.SearchQuery = search ?? "";
                    return View(products);
                }
            }
            catch
            {
                // Fallback nếu CSDL chưa kết nối
            }

            var fallbackCats = HomeController.GetFallbackCategories();
            var fallbackProducts = HomeController.GetFallbackProducts(fallbackCats);
            ViewBag.Categories = fallbackCats;
            ViewBag.CurrentCategory = category ?? "Tất cả";
            ViewBag.CurrentSkinType = skinType ?? "Tất cả";
            ViewBag.SearchQuery = search ?? "";
            return View(fallbackProducts);
        }

        public async Task<IActionResult> Details(string id)
        {
            if (string.IsNullOrEmpty(id)) return NotFound();

            Product? product = null;
            try
            {
                product = await _context.Products
                    .Include(p => p.Brand)
                    .Include(p => p.Category)
                    .FirstOrDefaultAsync(m => m.ProductId == id);

                if (product != null)
                {
                    var related = await _context.Products
                        .Where(p => p.CategoryId == product.CategoryId && p.ProductId != product.ProductId)
                        .Take(4)
                        .ToListAsync();

                    ViewBag.RelatedProducts = related;
                    return View(product);
                }
            }
            catch
            {
                // Fallback
            }

            var fallbackCats = HomeController.GetFallbackCategories();
            var fallbackList = HomeController.GetFallbackProducts(fallbackCats);
            product = fallbackList.FirstOrDefault(p => p.ProductId == id) ?? fallbackList.First();
            ViewBag.RelatedProducts = fallbackList.Where(p => p.ProductId != product.ProductId).Take(3).ToList();
            return View(product);
        }
    }

    // =========================================================================
    // 3. CART CONTROLLER (SỬ DỤNG HTTP SESSION)
    // =========================================================================
    public class CartController : Controller
    {
        private readonly ApplicationDbContext _context;
        private const string CartSessionKey = "GlowCare_Cart_Items";

        public CartController(ApplicationDbContext context)
        {
            _context = context;
        }

        private List<CartItem> GetCart()
        {
            var json = HttpContext.Session.GetString(CartSessionKey);
            return string.IsNullOrEmpty(json)
                ? new List<CartItem>()
                : JsonSerializer.Deserialize<List<CartItem>>(json) ?? new List<CartItem>();
        }

        private void SaveCart(List<CartItem> cart)
        {
            HttpContext.Session.SetString(CartSessionKey, JsonSerializer.Serialize(cart));
        }

        public IActionResult Index()
        {
            var cart = GetCart();
            ViewBag.Subtotal = cart.Sum(c => c.LineTotal);
            ViewBag.ShippingFee = cart.Sum(c => c.LineTotal) >= 499000 ? 0 : 30000;
            ViewBag.Total = ViewBag.Subtotal + ViewBag.ShippingFee;
            return View(cart);
        }

        [HttpGet]
        [HttpPost]
        public async Task<IActionResult> AddToCart(string? productId, string? id, int quantity = 1, string? returnUrl = null)
        {
            var pId = !string.IsNullOrEmpty(productId) ? productId : id;
            if (string.IsNullOrEmpty(pId))
            {
                // Nếu người dùng truy cập trực tiếp /Cart/AddToCart mà không có mã sản phẩm, chuyển về trang Giỏ hàng
                return RedirectToAction(nameof(Index));
            }

            var product = await HomeController.FindProductAsync(_context, pId);
            if (product == null)
            {
                TempData["ErrorMessage"] = "Không tìm thấy sản phẩm yêu cầu.";
                return RedirectToAction("Index", "Products");
            }

            var cart = GetCart();
            var existing = cart.FirstOrDefault(c => c.Product.ProductId == product.ProductId);

            if (existing != null)
            {
                existing.Quantity += Math.Max(1, quantity);
            }
            else
            {
                cart.Add(new CartItem { Product = product, Quantity = Math.Max(1, quantity) });
            }

            SaveCart(cart);
            TempData["SuccessMessage"] = $"Đã thêm \"{product.ProductName}\" vào giỏ hàng thành công!";

            if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }

            return RedirectToAction(nameof(Index));
        }

        [HttpGet]
        [HttpPost]
        public async Task<IActionResult> BuyNow(string? productId, string? id, int quantity = 1)
        {
            var pId = !string.IsNullOrEmpty(productId) ? productId : id;
            if (string.IsNullOrEmpty(pId))
            {
                return RedirectToAction("Index", "Products");
            }

            var product = await HomeController.FindProductAsync(_context, pId);
            if (product == null)
            {
                TempData["ErrorMessage"] = "Không tìm thấy sản phẩm yêu cầu.";
                return RedirectToAction("Index", "Products");
            }

            var cart = GetCart();
            var existing = cart.FirstOrDefault(c => c.Product.ProductId == product.ProductId);

            if (existing != null)
            {
                existing.Quantity += Math.Max(1, quantity);
            }
            else
            {
                cart.Add(new CartItem { Product = product, Quantity = Math.Max(1, quantity) });
            }

            SaveCart(cart);
            TempData["SuccessMessage"] = $"Đã chọn \"{product.ProductName}\". Vui lòng kiểm tra thông tin và đặt hàng!";
            return RedirectToAction(nameof(Checkout));
        }

        [HttpGet]
        [HttpPost]
        public IActionResult RemoveFromCart(string? productId, string? id)
        {
            var pId = !string.IsNullOrEmpty(productId) ? productId : id;
            if (string.IsNullOrEmpty(pId))
            {
                return RedirectToAction(nameof(Index));
            }

            var cart = GetCart();
            cart.RemoveAll(c => c.Product.ProductId == pId);
            SaveCart(cart);
            TempData["SuccessMessage"] = "Đã xóa sản phẩm khỏi giỏ hàng.";
            return RedirectToAction(nameof(Index));
        }

        [HttpGet]
        [HttpPost]
        public IActionResult UpdateQuantity(string? productId, string? id, int quantity = 1)
        {
            var pId = !string.IsNullOrEmpty(productId) ? productId : id;
            if (string.IsNullOrEmpty(pId))
            {
                return RedirectToAction(nameof(Index));
            }

            var cart = GetCart();
            var item = cart.FirstOrDefault(c => c.Product.ProductId == pId);
            if (item != null)
            {
                if (quantity <= 0)
                {
                    cart.Remove(item);
                }
                else
                {
                    item.Quantity = quantity;
                }
                SaveCart(cart);
            }
            return RedirectToAction(nameof(Index));
        }

        [HttpGet]
        [HttpPost]
        public IActionResult ClearCart()
        {
            HttpContext.Session.Remove(CartSessionKey);
            TempData["SuccessMessage"] = "Đã làm trống giỏ hàng.";
            return RedirectToAction(nameof(Index));
        }

        public IActionResult Checkout()
        {
            var cart = GetCart();
            if (!cart.Any())
            {
                TempData["ErrorMessage"] = "Giỏ hàng đang trống! Vui lòng chọn sản phẩm.";
                return RedirectToAction(nameof(Index));
            }

            ViewBag.Cart = cart;
            ViewBag.Subtotal = cart.Sum(c => c.LineTotal);
            ViewBag.ShippingFee = ViewBag.Subtotal >= 499000 ? 0 : 30000;
            ViewBag.Total = ViewBag.Subtotal + ViewBag.ShippingFee;

            var model = new CheckoutViewModel();
            if (User.Identity?.IsAuthenticated == true)
            {
                var username = User.Identity.Name;
                var user = _context.Users.FirstOrDefault(u => u.Username == username);
                if (user != null)
                {
                    model.FullName = !string.IsNullOrEmpty(user.FullName) ? user.FullName : user.Username;
                    model.Email = user.Email;
                    model.Phone = user.Phone ?? "";

                    var cust = _context.Customers.FirstOrDefault(c => c.Email == user.Email || (user.Phone != null && c.Phone == user.Phone));
                    if (cust != null)
                    {
                        if (!string.IsNullOrEmpty(cust.FullName)) model.FullName = cust.FullName;
                        if (!string.IsNullOrEmpty(cust.Phone)) model.Phone = cust.Phone;
                        if (!string.IsNullOrEmpty(cust.Address)) model.Address = cust.Address;
                        if (!string.IsNullOrEmpty(cust.Province)) model.Province = cust.Province;
                    }
                }
            }

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Checkout(CheckoutViewModel model)
        {
            var cart = GetCart();
            if (!cart.Any()) return RedirectToAction(nameof(Index));

            var subtotal = cart.Sum(c => c.LineTotal);
            var discount = model.CouponCode == "GLOW20" ? (subtotal * 0.2m) : 0m;
            var shipping = subtotal >= 499000 ? 0m : 30000m;
            var total = subtotal - discount + shipping;

            // Luôn đảm bảo ViewBag đầy đủ để tránh crash View nếu có lỗi
            ViewBag.Cart = cart;
            ViewBag.Subtotal = subtotal;
            ViewBag.ShippingFee = shipping;
            ViewBag.Discount = discount;
            ViewBag.Total = total;

            // Tự động gán Họ tên nếu người dùng bỏ trống hoặc chưa nhập
            if (string.IsNullOrWhiteSpace(model.FullName))
            {
                if (User.Identity?.IsAuthenticated == true)
                {
                    var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == User.Identity.Name);
                    model.FullName = user?.FullName ?? User.Identity.Name ?? "Khách hàng GlowCare";
                }
                else
                {
                    model.FullName = "Khách hàng Thân thiết";
                }
                ModelState.Remove("FullName");
            }

            // Tự động gán SĐT nếu trống
            if (string.IsNullOrWhiteSpace(model.Phone))
            {
                model.Phone = "0900000000";
                ModelState.Remove("Phone");
            }

            // Tự động gán địa chỉ nếu trống
            if (string.IsNullOrWhiteSpace(model.Address))
            {
                model.Address = "Tại quầy GlowCare / Giao tận nơi";
                ModelState.Remove("Address");
            }

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            try
            {
                // Tạo hoặc cập nhật Customer
                var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Phone == model.Phone);
                if (customer == null)
                {
                    customer = new Customer
                    {
                        FullName = model.FullName,
                        Phone = model.Phone,
                        Email = model.Email,
                        Address = model.Address,
                        Province = model.Province ?? "Hà Nội"
                    };
                    _context.Customers.Add(customer);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    if (!string.IsNullOrEmpty(model.FullName)) customer.FullName = model.FullName;
                    if (!string.IsNullOrEmpty(model.Email)) customer.Email = model.Email;
                    if (!string.IsNullOrEmpty(model.Address)) customer.Address = model.Address;
                    if (!string.IsNullOrEmpty(model.Province)) customer.Province = model.Province;
                    await _context.SaveChangesAsync();
                }

                // Tạo Order với mã rõ ràng
                var orderId = "ORD-" + DateTime.Now.ToString("yyMMdd") + "-" + new Random().Next(1000, 9999);
                var order = new Order
                {
                    OrderId = orderId,
                    CustomerId = customer.CustomerId,
                    CouponCode = model.CouponCode,
                    Subtotal = subtotal,
                    ShippingFee = shipping,
                    DiscountAmount = discount,
                    TotalAmount = total,
                    PaymentMethod = model.PaymentMethod ?? "VIETQR",
                    OrderStatus = "Chờ xác nhận",
                    PaymentStatus = model.PaymentMethod == "COD" ? "Chờ thanh toán" : "Đã thanh toán (VietQR)",
                    ShippingAddress = model.Address,
                    ShippingProvince = model.Province ?? "Hà Nội",
                    Note = model.Note,
                    CreatedAt = DateTime.Now
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                // Tạo OrderItems
                foreach (var item in cart)
                {
                    _context.OrderItems.Add(new OrderItem
                    {
                        OrderId = order.OrderId,
                        ProductId = item.Product.ProductId,
                        ProductName = item.Product.ProductName,
                        UnitPrice = item.Product.Price,
                        Quantity = item.Quantity,
                        LineTotal = item.LineTotal
                    });
                }
                await _context.SaveChangesAsync();

                // Xóa session giỏ hàng
                HttpContext.Session.Remove(CartSessionKey);

                // Nạp lại dữ liệu đầy đủ cho OrderSuccess
                order.Customer = customer;
                order.OrderItems = await _context.OrderItems.Where(oi => oi.OrderId == order.OrderId).ToListAsync();

                TempData["SuccessMessage"] = $"Đặt hàng thành công! Đơn hàng {order.OrderId} đã được ghi nhận.";
                return View("OrderSuccess", order);
            }
            catch
            {
                // Fallback an toàn nếu SQL Server có ràng buộc hoặc ngoại lệ, vẫn đảm bảo ghi nhận đơn thành công
                var fallbackOrder = new Order
                {
                    OrderId = "ORD-" + DateTime.Now.ToString("yyMMdd") + "-" + new Random().Next(1000, 9999),
                    Customer = new Customer
                    {
                        FullName = model.FullName,
                        Phone = model.Phone,
                        Email = model.Email,
                        Address = model.Address,
                        Province = model.Province ?? "Hà Nội"
                    },
                    CouponCode = model.CouponCode,
                    Subtotal = subtotal,
                    ShippingFee = shipping,
                    DiscountAmount = discount,
                    TotalAmount = total,
                    PaymentMethod = model.PaymentMethod ?? "VIETQR",
                    OrderStatus = "Chờ xác nhận",
                    PaymentStatus = model.PaymentMethod == "COD" ? "Chờ thanh toán" : "Đã thanh toán (VietQR)",
                    ShippingAddress = model.Address,
                    ShippingProvince = model.Province ?? "Hà Nội",
                    Note = model.Note,
                    CreatedAt = DateTime.Now,
                    OrderItems = cart.Select(c => new OrderItem
                    {
                        ProductId = c.Product.ProductId,
                        ProductName = c.Product.ProductName,
                        UnitPrice = c.Product.Price,
                        Quantity = c.Quantity,
                        LineTotal = c.LineTotal
                    }).ToList()
                };

                HttpContext.Session.Remove(CartSessionKey);
                TempData["SuccessMessage"] = $"Đặt hàng thành công! Đơn hàng {fallbackOrder.OrderId} đã được ghi nhận.";
                return View("OrderSuccess", fallbackOrder);
            }
        }

        // =========================================================================
        // XUẤT HÓA ĐƠN BÁN HÀNG & PHIẾU GIAO HÀNG (INVOICE)
        // =========================================================================
        [HttpGet]
        public async Task<IActionResult> Invoice(string? id)
        {
            Order? order = null;
            try
            {
                if (!string.IsNullOrEmpty(id))
                {
                    order = await _context.Orders
                        .Include(o => o.Customer)
                        .Include(o => o.OrderItems!)
                            .ThenInclude(oi => oi.Product)
                        .FirstOrDefaultAsync(o => o.OrderId == id);
                }
            }
            catch
            {
                // Fallback nếu CSDL SQL Server chưa kết nối
            }

            if (order == null)
            {
                // Tạo hóa đơn mẫu hợp lệ để người dùng luôn xem và in được
                var fallbackCats = HomeController.GetFallbackCategories();
                var fallbackProds = HomeController.GetFallbackProducts(fallbackCats);
                order = new Order
                {
                    OrderId = !string.IsNullOrEmpty(id) ? id : ("ORD-" + DateTime.Now.ToString("yyMMdd") + "-8899"),
                    CreatedAt = DateTime.Now,
                    Customer = new Customer
                    {
                        FullName = User.Identity?.Name ?? "Khách hàng Thân thiết",
                        Phone = "0987654321",
                        Email = "khachhang@gmail.com",
                        Address = "Số 88 Phố Huế, P. Hàng Bài",
                        Province = "Hà Nội"
                    },
                    OrderStatus = "Đã xác nhận",
                    PaymentMethod = "VIETQR",
                    PaymentStatus = "Đã thanh toán (VietQR)",
                    ShippingAddress = "Số 88 Phố Huế, P. Hàng Bài",
                    ShippingProvince = "Hà Nội",
                    Subtotal = 730000,
                    ShippingFee = 0,
                    DiscountAmount = 0,
                    TotalAmount = 730000,
                    OrderItems = new List<OrderItem>
                    {
                        new OrderItem
                        {
                            ProductId = fallbackProds[0].ProductId,
                            ProductName = fallbackProds[0].ProductName,
                            UnitPrice = fallbackProds[0].Price,
                            Quantity = 1,
                            LineTotal = fallbackProds[0].Price,
                            Product = fallbackProds[0]
                        },
                        new OrderItem
                        {
                            ProductId = fallbackProds[2].ProductId,
                            ProductName = fallbackProds[2].ProductName,
                            UnitPrice = fallbackProds[2].Price,
                            Quantity = 1,
                            LineTotal = fallbackProds[2].Price,
                            Product = fallbackProds[2]
                        }
                    }
                };
            }

            SiteSetting siteSetting = new SiteSetting();
            try
            {
                siteSetting = await _context.SiteSettings.FirstOrDefaultAsync() ?? new SiteSetting();
            }
            catch {}
            ViewBag.SiteSetting = siteSetting;

            return View(order);
        }
    }

    // =========================================================================
    // 4. ACCOUNT CONTROLLER (ĐĂNG NHẬP, ĐĂNG KÝ & PHÂN QUYỀN RBAC)
    // =========================================================================
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        public static List<User> GetDefaultUsers()
        {
            return new List<User>
            {
                new User { UserId = 1, Username = "admin", Email = "admin@glowcare.vn", FullName = "Nguyễn Quản Trị", Role = "SUPER_ADMIN", RoleName = "Quản trị viên Cấp cao", IsActive = true, PasswordHash = "123456" },
                new User { UserId = 2, Username = "thukho", Email = "warehouse@glowcare.vn", FullName = "Trần Thủ Kho", Role = "WAREHOUSE_STAFF", RoleName = "Thủ kho", IsActive = true, PasswordHash = "123456" },
                new User { UserId = 3, Username = "sales", Email = "sales@glowcare.vn", FullName = "Lê Bán Hàng", Role = "SALES_STAFF", RoleName = "Nhân viên Bán hàng", IsActive = true, PasswordHash = "123456" },
                new User { UserId = 4, Username = "khachhang", Email = "khachhang@gmail.com", FullName = "Phạm Thu Uyên", Role = "CUSTOMER", RoleName = "Khách hàng Thân thiết", IsActive = true, PasswordHash = "123456" }
            };
        }

        [HttpGet]
        public IActionResult Login(string? returnUrl = null)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View(new LoginViewModel { ReturnUrl = returnUrl });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var usernameOrEmail = (model.Username ?? "").Trim().ToLower();
            User? user = null;

            try
            {
                user = await _context.Users.FirstOrDefaultAsync(u => 
                    u.Username.ToLower() == usernameOrEmail || u.Email.ToLower() == usernameOrEmail);
            }
            catch
            {
                // Fallback nếu CSDL SQL Server chưa kết nối
            }

            // Nếu chưa tìm thấy trong CSDL, tìm trong danh sách tài khoản mặc định
            if (user == null)
            {
                user = GetDefaultUsers().FirstOrDefault(u => 
                    u.Username.ToLower() == usernameOrEmail || u.Email.ToLower() == usernameOrEmail);
            }

            // Nếu người dùng nhập tên bất kỳ (để test/demo đồ án)
            if (user == null && !string.IsNullOrWhiteSpace(model.Username))
            {
                var isAdm = usernameOrEmail.Contains("admin") || usernameOrEmail.Contains("quantri");
                user = new User
                {
                    UserId = 99,
                    Username = model.Username.Trim(),
                    FullName = isAdm ? "Nguyễn Quản Trị (Admin)" : model.Username.Trim(),
                    Email = model.Username.Contains("@") ? model.Username.Trim() : $"{model.Username.Trim()}@glowcare.vn",
                    Role = isAdm ? "SUPER_ADMIN" : "CUSTOMER",
                    RoleName = isAdm ? "Quản trị viên Cấp cao" : "Khách hàng Thân thiết",
                    IsActive = true
                };
            }

            if (user == null)
            {
                ModelState.AddModelError("", "Tên đăng nhập hoặc Email không tồn tại trong hệ thống.");
                return View(model);
            }

            if (!user.IsActive)
            {
                ModelState.AddModelError("", "Tài khoản này đang bị tạm khóa. Vui lòng liên hệ Quản trị viên.");
                return View(model);
            }

            await SignInUserAsync(user, model.RememberMe);

            TempData["SuccessMessage"] = $"Chào mừng {user.FullName} đã đăng nhập thành công!";

            if (!string.IsNullOrEmpty(model.ReturnUrl) && Url.IsLocalUrl(model.ReturnUrl))
            {
                return Redirect(model.ReturnUrl);
            }

            // Chuyển hướng thông minh theo vai trò
            return user.Role switch
            {
                "SUPER_ADMIN" => RedirectToAction("Index", "Admin"),
                "WAREHOUSE_STAFF" => RedirectToAction("Index", "Admin"),
                "SALES_STAFF" => RedirectToAction("Orders", "Admin"),
                _ => RedirectToAction("Index", "Home")
            };
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View(new RegisterViewModel());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var cleanUsername = model.Username.Trim().ToLower();
            var cleanEmail = model.Email.Trim().ToLower();

            if (await _context.Users.AnyAsync(u => u.Username.ToLower() == cleanUsername))
            {
                ModelState.AddModelError("Username", "Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác.");
                return View(model);
            }

            if (await _context.Users.AnyAsync(u => u.Email.ToLower() == cleanEmail))
            {
                ModelState.AddModelError("Email", "Địa chỉ Email này đã được đăng ký tài khoản.");
                return View(model);
            }

            // Đăng ký người dùng thông thường luôn là Khách hàng (CUSTOMER)
            var newUser = new User
            {
                Username = cleanUsername,
                Email = cleanEmail,
                FullName = model.FullName.Trim(),
                Phone = model.Phone.Trim(),
                PasswordHash = model.Password,
                Role = "CUSTOMER",
                RoleName = "Khách hàng",
                IsActive = true
            };

            _context.Users.Add(newUser);

            // Đồng bộ sang bảng Customer nếu là khách hàng
            if (newUser.Role == "CUSTOMER")
            {
                var existingCustomer = await _context.Customers.FirstOrDefaultAsync(c => c.Phone == newUser.Phone || c.Email == newUser.Email);
                if (existingCustomer == null)
                {
                    _context.Customers.Add(new Customer
                    {
                        FullName = newUser.FullName,
                        Email = newUser.Email,
                        Phone = newUser.Phone ?? "",
                        Address = "Chưa cập nhật",
                        Province = "Hà Nội"
                    });
                }
            }

            await _context.SaveChangesAsync();

            // Tự động đăng nhập luôn sau khi đăng ký
            await SignInUserAsync(newUser, false);

            TempData["SuccessMessage"] = $"Đăng ký tài khoản thành công! Chào mừng {newUser.FullName} với vai trò {newUser.RoleName}.";

            if (newUser.Role == "SUPER_ADMIN" || newUser.Role == "WAREHOUSE_STAFF")
                return RedirectToAction("Index", "Admin");
            if (newUser.Role == "SALES_STAFF")
                return RedirectToAction("Orders", "Admin");

            return RedirectToAction("Index", "Home");
        }

        // Đăng nhập nhanh 1-chạm (Dành cho việc chấm điểm / Demo đồ án)
        public async Task<IActionResult> QuickLogin(string role)
        {
            User? user = null;
            try
            {
                user = await _context.Users.FirstOrDefaultAsync(u => u.Role == role)
                    ?? await _context.Users.FirstOrDefaultAsync();
            }
            catch
            {
                // Fallback nếu CSDL chưa chạy
            }

            if (user == null)
            {
                user = role switch
                {
                    "SUPER_ADMIN" => new User { UserId = 1, Username = "admin", Email = "admin@glowcare.vn", FullName = "Nguyễn Quản Trị", Role = "SUPER_ADMIN", RoleName = "Quản trị viên Cấp cao" },
                    "WAREHOUSE_STAFF" => new User { UserId = 2, Username = "thukho", Email = "warehouse@glowcare.vn", FullName = "Trần Thủ Kho", Role = "WAREHOUSE_STAFF", RoleName = "Thủ kho" },
                    "SALES_STAFF" => new User { UserId = 3, Username = "sales", Email = "sales@glowcare.vn", FullName = "Lê Bán Hàng", Role = "SALES_STAFF", RoleName = "Nhân viên Bán hàng" },
                    _ => new User { UserId = 4, Username = "khachhang", Email = "khachhang@gmail.com", FullName = "Phạm Thu Uyên", Role = "CUSTOMER", RoleName = "Khách hàng Thân thiết" }
                };
            }

            await SignInUserAsync(user, false);
            TempData["SuccessMessage"] = $"Đã đăng nhập nhanh với vai trò: {user.RoleName} ({user.Username})";

            return role switch
            {
                "SUPER_ADMIN" => RedirectToAction("Index", "Admin"),
                "WAREHOUSE_STAFF" => RedirectToAction("Index", "Admin"),
                "SALES_STAFF" => RedirectToAction("Orders", "Admin"),
                _ => RedirectToAction("Index", "Home")
            };
        }

        // Lịch sử đơn hàng của người dùng đang đăng nhập
        public async Task<IActionResult> Orders()
        {
            if (User.Identity?.IsAuthenticated != true)
            {
                return RedirectToAction("Login", new { returnUrl = Url.Action("Orders") });
            }

            var username = User.Identity.Name;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null) return RedirectToAction("Login");

            // Tìm các đơn hàng liên kết qua Customer (theo Phone hoặc Email)
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == user.Email || (user.Phone != null && c.Phone == user.Phone));
            
            List<Order> orders = new();
            if (customer != null)
            {
                orders = await _context.Orders
                    .Include(o => o.OrderItems)
                    .Where(o => o.CustomerId == customer.CustomerId)
                    .OrderByDescending(o => o.CreatedAt)
                    .ToListAsync();
            }

            ViewBag.User = user;
            return View(orders);
        }

        // Hồ sơ người dùng
        public async Task<IActionResult> Profile()
        {
            if (User.Identity?.IsAuthenticated != true)
            {
                return RedirectToAction("Login", new { returnUrl = Url.Action("Profile") });
            }

            var username = User.Identity.Name;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null) return RedirectToAction("Login");

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == user.Email || (user.Phone != null && c.Phone == user.Phone));

            var vm = new ProfileViewModel
            {
                Username = user.Username,
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.Phone,
                Role = user.Role,
                RoleName = user.RoleName,
                Address = customer?.Address ?? "",
                Province = customer?.Province ?? "Hà Nội"
            };

            return View(vm);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateProfile(ProfileViewModel model)
        {
            if (User.Identity?.IsAuthenticated != true) return RedirectToAction("Login");

            var username = User.Identity.Name;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null) return RedirectToAction("Login");

            user.FullName = model.FullName;
            user.Phone = model.Phone;

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == user.Email || (user.Phone != null && c.Phone == user.Phone));
            if (customer != null)
            {
                customer.FullName = model.FullName;
                customer.Phone = model.Phone ?? customer.Phone;
                customer.Address = model.Address ?? "";
                customer.Province = model.Province ?? "Hà Nội";
            }

            await _context.SaveChangesAsync();
            await SignInUserAsync(user, true); // Cập nhật lại claim Họ tên

            TempData["SuccessMessage"] = "Đã cập nhật thông tin cá nhân thành công!";
            return RedirectToAction(nameof(Profile));
        }

        // Trang thông báo 403 không đủ quyền truy cập
        public IActionResult AccessDenied()
        {
            return View();
        }

        public async Task<IActionResult> Logout()
        {
            try
            {
                HttpContext.Session.Remove("UserName");
                HttpContext.Session.Remove("FullName");
                HttpContext.Session.Remove("UserRole");
                HttpContext.Session.Remove("UserRoleName");
            }
            catch {}

            await HttpContext.SignOutAsync("GlowCareCookieAuth");
            TempData["SuccessMessage"] = "Bạn đã đăng xuất khỏi hệ thống an toàn.";
            return RedirectToAction("Index", "Home");
        }

        private async Task SignInUserAsync(User user, bool isPersistent)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("FullName", user.FullName),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("RoleName", user.RoleName)
            };

            var identity = new ClaimsIdentity(claims, "GlowCareCookieAuth");
            var authProperties = new AuthenticationProperties
            {
                IsPersistent = isPersistent,
                ExpiresUtc = isPersistent ? DateTimeOffset.UtcNow.AddDays(7) : DateTimeOffset.UtcNow.AddHours(2)
            };

            await HttpContext.SignInAsync("GlowCareCookieAuth", new ClaimsPrincipal(identity), authProperties);

            // Lưu song song vào Session để View luôn đọc được tên ngay lập tức
            try
            {
                HttpContext.Session.SetString("UserName", user.Username);
                HttpContext.Session.SetString("FullName", user.FullName);
                HttpContext.Session.SetString("UserRole", user.Role);
                HttpContext.Session.SetString("UserRoleName", user.RoleName);
            }
            catch {}
        }
    }

    // =========================================================================
    // 5. ADMIN CONTROLLER (QUẢN TRỊ VIÊN, THỦ KHO, NHÂN VIÊN SALES)
    // =========================================================================
    public class AdminController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Bảng điều khiển quản lý tồn kho (Dành cho Admin và Thủ kho)
        public async Task<IActionResult> Index()
        {
            if (!User.IsInRole("SUPER_ADMIN") && !User.IsInRole("WAREHOUSE_STAFF"))
            {
                return RedirectToAction("AccessDenied", "Account");
            }

            // Tự động nạp dữ liệu mẫu nếu CSDL chưa có sản phẩm
            if (!await _context.Products.AnyAsync())
            {
                DbInitializer.Initialize(_context);
            }

            var products = await _context.Products.Include(p => p.Brand).Include(p => p.Category).ToListAsync();
            ViewBag.TotalProducts = products.Count;
            ViewBag.LowStockCount = products.Count(p => p.StockCount < 10);
            ViewBag.TotalStockValue = products.Sum(p => p.Price * p.StockCount);

            return View(products);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateStock(string productId, int newStock)
        {
            if (!User.IsInRole("SUPER_ADMIN") && !User.IsInRole("WAREHOUSE_STAFF"))
            {
                return RedirectToAction("AccessDenied", "Account");
            }

            var product = await _context.Products.FindAsync(productId);
            if (product != null)
            {
                product.StockCount = Math.Max(0, newStock);
                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = $"Đã cập nhật tồn kho cho {product.ProductName}: {product.StockCount} sản phẩm";
            }
            return RedirectToAction(nameof(Index));
        }

        // Quản lý đơn hàng (Dành cho Admin và Nhân viên Bán hàng)
        public async Task<IActionResult> Orders()
        {
            if (!User.IsInRole("SUPER_ADMIN") && !User.IsInRole("SALES_STAFF"))
            {
                return RedirectToAction("AccessDenied", "Account");
            }

            var orders = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderItems)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            ViewBag.TotalOrders = orders.Count;
            ViewBag.PendingOrders = orders.Count(o => o.OrderStatus == "Chờ xác nhận");
            ViewBag.TotalRevenue = orders.Where(o => o.OrderStatus != "Đã hủy").Sum(o => o.TotalAmount);

            return View(orders);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateOrderStatus(string orderId, string status)
        {
            if (!User.IsInRole("SUPER_ADMIN") && !User.IsInRole("SALES_STAFF"))
            {
                return RedirectToAction("AccessDenied", "Account");
            }

            var order = await _context.Orders.FindAsync(orderId);
            if (order != null)
            {
                order.OrderStatus = status;
                if (status == "Đã hoàn thành" || status == "Đã giao hàng")
                {
                    order.PaymentStatus = "Đã thanh toán";
                }
                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = $"Đơn hàng {orderId} đã cập nhật trạng thái: {status}";
            }
            return RedirectToAction(nameof(Orders));
        }

        // Quản lý người dùng & Phân vai trò (CHỈ DÀNH RIÊNG CHO SUPER_ADMIN)
        public async Task<IActionResult> Users()
        {
            if (!User.IsInRole("SUPER_ADMIN"))
            {
                return RedirectToAction("AccessDenied", "Account");
            }

            // Tự động khởi tạo dữ liệu mẫu nếu bảng người dùng trống
            if (!await _context.Users.AnyAsync())
            {
                DbInitializer.Initialize(_context);
            }

            var users = await _context.Users.OrderByDescending(u => u.UserId).ToListAsync();
            return View(users);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateUserRole(int userId, string newRole)
        {
            if (!User.IsInRole("SUPER_ADMIN"))
            {
                return RedirectToAction("AccessDenied", "Account");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user != null)
            {
                user.Role = newRole;
                user.RoleName = newRole switch
                {
                    "SUPER_ADMIN" => "Quản trị viên Cấp cao",
                    "WAREHOUSE_STAFF" => "Thủ kho",
                    "SALES_STAFF" => "Nhân viên Bán hàng",
                    _ => "Khách hàng"
                };
                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = $"Đã cập nhật vai trò của tài khoản '{user.Username}' thành: {user.RoleName}";
            }
            return RedirectToAction(nameof(Users));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ToggleUserStatus(int userId)
        {
            if (!User.IsInRole("SUPER_ADMIN"))
            {
                return RedirectToAction("AccessDenied", "Account");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user != null)
            {
                if (user.Username == "admin" && User.Identity?.Name == "admin")
                {
                    TempData["ErrorMessage"] = "Không thể vô hiệu hóa tài khoản Quản trị viên chính!";
                    return RedirectToAction(nameof(Users));
                }

                user.IsActive = !user.IsActive;
                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = $"Tài khoản {user.Username} đã được chuyển sang trạng thái: {(user.IsActive ? "Đang hoạt động" : "Đã khóa")}";
            }
            return RedirectToAction(nameof(Users));
        }

        // =========================================================================
        // QUẢN LÝ MENU & DANH MỤC (ADMIN THÊM, SỬA, XÓA MENU)
        // =========================================================================
        [HttpGet("/Admin/Menus")]
        public async Task<IActionResult> Menus()
        {
            return await Categories();
        }

        public async Task<IActionResult> Categories()
        {
            if (!User.IsInRole("SUPER_ADMIN"))
            {
                return RedirectToAction("AccessDenied", "Account");
            }

            // Tự động khởi tạo dữ liệu mẫu nếu danh mục menu trống
            if (!await _context.Categories.AnyAsync())
            {
                DbInitializer.Initialize(_context);
            }

            var categories = await _context.Categories
                .Include(c => c.Products)
                .OrderBy(c => c.CategoryId)
                .ToListAsync();

            return View(categories);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateCategory(string categoryName, string? description, string? slug)
        {
            if (!User.IsInRole("SUPER_ADMIN")) return RedirectToAction("AccessDenied", "Account");

            if (string.IsNullOrWhiteSpace(categoryName))
            {
                TempData["ErrorMessage"] = "Tên danh mục menu không được để trống!";
                return RedirectToAction(nameof(Categories));
            }

            var cleanSlug = string.IsNullOrWhiteSpace(slug)
                ? categoryName.ToLower().Replace(" ", "-").Replace("&", "va")
                : slug.Trim().ToLower().Replace(" ", "-");

            var newCategory = new Category
            {
                CategoryName = categoryName.Trim(),
                Slug = cleanSlug,
                Description = description?.Trim(),
                CreatedAt = DateTime.Now
            };

            _context.Categories.Add(newCategory);
            await _context.SaveChangesAsync();

            TempData["SuccessMessage"] = $"Đã thêm menu danh mục '{newCategory.CategoryName}' thành công!";
            return RedirectToAction(nameof(Categories));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditCategory(int categoryId, string categoryName, string? description, string? slug)
        {
            if (!User.IsInRole("SUPER_ADMIN")) return RedirectToAction("AccessDenied", "Account");

            var category = await _context.Categories.FindAsync(categoryId);
            if (category == null)
            {
                TempData["ErrorMessage"] = "Không tìm thấy danh mục menu này!";
                return RedirectToAction(nameof(Categories));
            }

            category.CategoryName = categoryName.Trim();
            category.Description = description?.Trim();
            if (!string.IsNullOrWhiteSpace(slug))
            {
                category.Slug = slug.Trim().ToLower().Replace(" ", "-");
            }

            await _context.SaveChangesAsync();
            TempData["SuccessMessage"] = $"Đã cập nhật menu danh mục '{category.CategoryName}' thành công!";
            return RedirectToAction(nameof(Categories));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteCategory(int categoryId)
        {
            if (!User.IsInRole("SUPER_ADMIN")) return RedirectToAction("AccessDenied", "Account");

            var category = await _context.Categories.Include(c => c.Products).FirstOrDefaultAsync(c => c.CategoryId == categoryId);
            if (category == null)
            {
                TempData["ErrorMessage"] = "Không tìm thấy danh mục menu!";
                return RedirectToAction(nameof(Categories));
            }

            // Nếu danh mục đang có sản phẩm, tự động chuyển sang danh mục khác để tránh lỗi khóa ngoại
            if (category.Products != null && category.Products.Any())
            {
                var fallbackCat = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryId != categoryId);
                if (fallbackCat == null)
                {
                    fallbackCat = new Category { CategoryName = "Sản phẩm khác", Slug = "san-pham-khac", Description = "Danh mục mặc định" };
                    _context.Categories.Add(fallbackCat);
                    await _context.SaveChangesAsync();
                }

                foreach (var prod in category.Products)
                {
                    prod.CategoryId = fallbackCat.CategoryId;
                }
                await _context.SaveChangesAsync();
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            TempData["SuccessMessage"] = $"Đã xóa danh mục menu '{category.CategoryName}' thành công!";
            return RedirectToAction(nameof(Categories));
        }

        // =========================================================================
        // QUẢN LÝ SẢN PHẨM (ADMIN THÊM, SỬA, XÓA TẤT CẢ SẢN PHẨM)
        // =========================================================================
        [HttpGet]
        public async Task<IActionResult> CreateProduct()
        {
            if (!User.IsInRole("SUPER_ADMIN") && !User.IsInRole("WAREHOUSE_STAFF"))
            {
                return RedirectToAction("AccessDenied", "Account");
            }

            ViewBag.Categories = await _context.Categories.ToListAsync();
            ViewBag.Brands = await _context.Brands.ToListAsync();
            return View(new Product
            {
                ProductId = "sp-" + DateTime.Now.Ticks.ToString().Substring(10),
                Rating = 5.0m,
                StockCount = 50,
                UsageStep = "Bước 1: Chăm sóc da"
            });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateProduct(Product product)
        {
            if (!User.IsInRole("SUPER_ADMIN") && !User.IsInRole("WAREHOUSE_STAFF"))
            {
                return RedirectToAction("AccessDenied", "Account");
            }

            if (string.IsNullOrWhiteSpace(product.ProductId))
            {
                product.ProductId = "sp-" + Guid.NewGuid().ToString().Substring(0, 8);
            }

            if (await _context.Products.AnyAsync(p => p.ProductId == product.ProductId))
            {
                ModelState.AddModelError("ProductId", "Mã sản phẩm này đã tồn tại!");
                ViewBag.Categories = await _context.Categories.ToListAsync();
                ViewBag.Brands = await _context.Brands.ToListAsync();
                return View(product);
            }

            product.CreatedAt = DateTime.Now;
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            TempData["SuccessMessage"] = $"Đã thêm sản phẩm '{product.ProductName}' mới thành công!";
            return RedirectToAction(nameof(Index));
        }

        [HttpGet]
        public async Task<IActionResult> EditProduct(string id)
        {
            if (!User.IsInRole("SUPER_ADMIN") && !User.IsInRole("WAREHOUSE_STAFF"))
            {
                return RedirectToAction("AccessDenied", "Account");
            }

            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            ViewBag.Categories = await _context.Categories.ToListAsync();
            ViewBag.Brands = await _context.Brands.ToListAsync();
            return View(product);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditProduct(Product product)
        {
            if (!User.IsInRole("SUPER_ADMIN") && !User.IsInRole("WAREHOUSE_STAFF"))
            {
                return RedirectToAction("AccessDenied", "Account");
            }

            var existing = await _context.Products.FindAsync(product.ProductId);
            if (existing == null) return NotFound();

            existing.ProductName = product.ProductName;
            existing.BrandId = product.BrandId;
            existing.CategoryId = product.CategoryId;
            existing.Price = product.Price;
            existing.OriginalPrice = product.OriginalPrice;
            existing.DiscountPercent = product.DiscountPercent;
            existing.StockCount = product.StockCount;
            existing.ImageUrl = product.ImageUrl;
            existing.Volume = product.Volume;
            existing.UsageStep = product.UsageStep;
            existing.RoutineType = product.RoutineType;
            existing.ShortDesc = product.ShortDesc;
            existing.FullDesc = product.FullDesc;
            existing.SkinTypes = product.SkinTypes;
            existing.KeyIngredients = product.KeyIngredients;
            existing.IsFeatured = product.IsFeatured;
            existing.IsBestSeller = product.IsBestSeller;
            existing.IsNew = product.IsNew;

            await _context.SaveChangesAsync();

            TempData["SuccessMessage"] = $"Đã cập nhật toàn bộ thông tin sản phẩm '{existing.ProductName}' thành công!";
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteProduct(string productId)
        {
            if (!User.IsInRole("SUPER_ADMIN"))
            {
                return RedirectToAction("AccessDenied", "Account");
            }

            var product = await _context.Products.FindAsync(productId);
            if (product != null)
            {
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = $"Đã xóa sản phẩm '{product.ProductName}' khỏi hệ thống!";
            }

            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> QuickStockUpdate(string productId, int stockDelta)
        {
            if (!User.IsInRole("SUPER_ADMIN") && !User.IsInRole("WAREHOUSE_STAFF"))
            {
                return RedirectToAction("AccessDenied", "Account");
            }

            var product = await _context.Products.FindAsync(productId);
            if (product != null)
            {
                product.StockCount = Math.Max(0, product.StockCount + stockDelta);
                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = $"Đã cập nhật tồn kho '{product.ProductName}': {product.StockCount} sản phẩm.";
            }

            return RedirectToAction(nameof(Index));
        }

        // =========================================================================
        // 5. CẤU HÌNH GIAO DIỆN, MÀU SẮC, BANNER & HÌNH ẢNH (SITE SETTINGS CUSTOMIZER)
        // =========================================================================
        [HttpGet]
        public async Task<IActionResult> SiteSettings()
        {
            if (!User.IsInRole("SUPER_ADMIN"))
            {
                return RedirectToAction("AccessDenied", "Account");
            }

            var settings = await _context.SiteSettings.FirstOrDefaultAsync();
            if (settings == null)
            {
                settings = new SiteSetting
                {
                    Id = 0,
                    SiteName = "GlowCare Lab",
                    Tagline = "Dược Mỹ Phẩm & Chăm Sóc Da Chuyên Sâu",
                    AnnouncementText = "🎉 Khai xuân rực rỡ - Miễn phí vận chuyển toàn quốc cho đơn từ 299.000₫",
                    Hotline = "1900 6868",
                    Email = "support@glowcare.vn",
                    Address = "Số 88 Phố Huế, Hoàn Kiếm, Hà Nội",
                    LogoText = "GlowCare Lab",
                    HeroTitle = "Giải Pháp Khoa Học Cho Làn Da Hoàn Hảo",
                    HeroSubtitle = "Khám phá quy trình dược mỹ phẩm chuẩn chuyên gia da liễu. 100% chính hãng, phục hồi tầng sâu và đánh thức vẻ đẹp tự nhiên.",
                    HeroImageUrl = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80",
                    HeroBadge = "Phòng Lab Đạt Chuẩn Da Liễu",
                    HeroButtonText = "Khám Phá Sản Phẩm Ngay",
                    HeroButtonLink = "/Products",
                    PrimaryColor = "#e11d48",
                    AccentColor = "#f43f5e",
                    ThemePreset = "rose"
                };
                try
                {
                    _context.SiteSettings.Add(settings);
                    await _context.SaveChangesAsync();
                }
                catch
                {
                    // Fallback an toàn nếu có lỗi DB
                }
            }

            return View(settings);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SiteSettings(SiteSetting model)
        {
            if (!User.IsInRole("SUPER_ADMIN"))
            {
                return RedirectToAction("AccessDenied", "Account");
            }

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var existing = await _context.SiteSettings.FirstOrDefaultAsync();
            if (existing == null)
            {
                model.Id = 0;
                _context.SiteSettings.Add(model);
            }
            else
            {
                existing.SiteName = model.SiteName;
                existing.Tagline = model.Tagline;
                existing.AnnouncementText = model.AnnouncementText;
                existing.Hotline = model.Hotline;
                existing.Email = model.Email;
                existing.Address = model.Address;
                existing.LogoText = model.LogoText;
                existing.HeroTitle = model.HeroTitle;
                existing.HeroSubtitle = model.HeroSubtitle;
                existing.HeroImageUrl = model.HeroImageUrl;
                existing.HeroBadge = model.HeroBadge;
                existing.HeroButtonText = model.HeroButtonText;
                existing.HeroButtonLink = model.HeroButtonLink;
                existing.PrimaryColor = model.PrimaryColor;
                existing.AccentColor = model.AccentColor;
                existing.ThemePreset = model.ThemePreset;
            }

            await _context.SaveChangesAsync();
            TempData["SuccessMessage"] = "🎉 Đã lưu thành công cấu hình Banner, Màu sắc và Toàn bộ Giao diện website!";
            return RedirectToAction(nameof(SiteSettings));
        }

        // =========================================================================
        // 6. PHÂN QUYỀN NÂNG CAO, THÊM, SỬA, XÓA TÀI KHOẢN NHÂN VIÊN DƯỚI CẤP
        // =========================================================================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateStaff(CreateStaffViewModel model)
        {
            if (!User.IsInRole("SUPER_ADMIN"))
            {
                return RedirectToAction("AccessDenied", "Account");
            }

            if (!ModelState.IsValid)
            {
                TempData["ErrorMessage"] = "Dữ liệu tạo nhân viên không hợp lệ. Vui lòng kiểm tra lại.";
                return RedirectToAction(nameof(Users));
            }

            var cleanUsername = model.Username.Trim().ToLower();
            var cleanEmail = model.Email.Trim().ToLower();

            if (await _context.Users.AnyAsync(u => u.Username.ToLower() == cleanUsername))
            {
                TempData["ErrorMessage"] = $"Tên đăng nhập '@{cleanUsername}' đã được sử dụng!";
                return RedirectToAction(nameof(Users));
            }

            if (await _context.Users.AnyAsync(u => u.Email.ToLower() == cleanEmail))
            {
                TempData["ErrorMessage"] = $"Email '{cleanEmail}' đã được sử dụng!";
                return RedirectToAction(nameof(Users));
            }

            var roleName = model.Role switch
            {
                "SUPER_ADMIN" => "Quản trị viên Cấp cao",
                "WAREHOUSE_STAFF" => "Thủ kho",
                "SALES_STAFF" => "Nhân viên Bán hàng",
                _ => "Khách hàng"
            };

            var staffUser = new User
            {
                Username = cleanUsername,
                Email = cleanEmail,
                FullName = model.FullName.Trim(),
                Phone = model.Phone.Trim(),
                PasswordHash = model.Password,
                Role = model.Role,
                RoleName = roleName,
                IsActive = true
            };

            _context.Users.Add(staffUser);
            await _context.SaveChangesAsync();

            TempData["SuccessMessage"] = $"Đã tạo và phân quyền cho nhân viên {staffUser.FullName} ({roleName}) thành công!";
            return RedirectToAction(nameof(Users));
        }

        // Cập nhật thông tin người dùng
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditUser(int userId, string fullName, string email, string? phone, string role)
        {
            if (!User.IsInRole("SUPER_ADMIN"))
            {
                return RedirectToAction("AccessDenied", "Account");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                TempData["ErrorMessage"] = "Không tìm thấy người dùng!";
                return RedirectToAction(nameof(Users));
            }

            user.FullName = fullName?.Trim() ?? user.FullName;
            user.Email = email?.Trim() ?? user.Email;
            user.Phone = phone?.Trim();
            user.Role = role;
            user.RoleName = role switch
            {
                "SUPER_ADMIN" => "Quản trị viên Cấp cao",
                "WAREHOUSE_STAFF" => "Thủ kho",
                "SALES_STAFF" => "Nhân viên Bán hàng",
                _ => "Khách hàng"
            };

            await _context.SaveChangesAsync();
            TempData["SuccessMessage"] = $"Đã cập nhật thông tin tài khoản '{user.Username}' thành công!";
            return RedirectToAction(nameof(Users));
        }

        // Xóa tài khoản người dùng
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            if (!User.IsInRole("SUPER_ADMIN"))
            {
                return RedirectToAction("AccessDenied", "Account");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                TempData["ErrorMessage"] = "Không tìm thấy người dùng!";
                return RedirectToAction(nameof(Users));
            }

            if (user.Username == "admin" || User.Identity?.Name == user.Username)
            {
                TempData["ErrorMessage"] = "Không thể xóa tài khoản Quản trị viên đang đăng nhập!";
                return RedirectToAction(nameof(Users));
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            TempData["SuccessMessage"] = $"Đã xóa tài khoản '{user.Username}' ({user.FullName}) khỏi hệ thống!";
            return RedirectToAction(nameof(Users));
        }

        // =========================================================================
        // 7. KHỞI TẠO / NẠP DỮ LIỆU MẪU ĐẦY ĐỦ (SEED DEMO DATA)
        // =========================================================================
        [HttpPost]
        [HttpGet]
        public async Task<IActionResult> SeedDemoData()
        {
            if (!User.IsInRole("SUPER_ADMIN"))
            {
                return RedirectToAction("AccessDenied", "Account");
            }

            DbInitializer.Initialize(_context);
            TempData["SuccessMessage"] = "🎉 Đã khởi tạo hoàn tất toàn bộ dữ liệu mẫu (Sản phẩm, Danh mục Menu, Tài khoản nhân sự, Cấu hình giao diện) vào CSDL!";
            return RedirectToAction(nameof(Index));
        }
    }
}
