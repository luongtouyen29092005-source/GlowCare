using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GlowCare_AspNetCore_MVC.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }

        [Required(ErrorMessage = "Tên danh mục không được để trống")]
        [StringLength(100)]
        public string CategoryName { get; set; } = string.Empty;

        [StringLength(120)]
        public string Slug { get; set; } = string.Empty;

        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public ICollection<Product>? Products { get; set; }
    }

    public class Brand
    {
        [Key]
        public int BrandId { get; set; }

        [Required]
        [StringLength(100)]
        public string BrandName { get; set; } = string.Empty;

        [StringLength(50)]
        public string Country { get; set; } = "Việt Nam";

        public string? Description { get; set; }

        public ICollection<Product>? Products { get; set; }
    }

    public class Product
    {
        [Key]
        [StringLength(50)]
        public string ProductId { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tên sản phẩm bắt buộc nhập")]
        [StringLength(255)]
        public string ProductName { get; set; } = string.Empty;

        public int BrandId { get; set; }
        [ForeignKey("BrandId")]
        public Brand? Brand { get; set; }

        public int CategoryId { get; set; }
        [ForeignKey("CategoryId")]
        public Category? Category { get; set; }

        [Column(TypeName = "decimal(18, 0)")]
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(18, 0)")]
        public decimal OriginalPrice { get; set; }

        public int DiscountPercent { get; set; }

        [Column(TypeName = "decimal(3, 1)")]
        public decimal Rating { get; set; } = 5.0m;

        public int ReviewCount { get; set; }

        public int StockCount { get; set; }

        public bool IsFeatured { get; set; }
        public bool IsBestSeller { get; set; }
        public bool IsNew { get; set; }

        [StringLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        [StringLength(50)]
        public string Volume { get; set; } = "100ml";

        [StringLength(150)]
        public string? UsageStep { get; set; }

        [StringLength(10)]
        public string RoutineType { get; set; } = "Both"; // AM, PM, Both

        [StringLength(1000)]
        public string ShortDesc { get; set; } = string.Empty;

        public string? FullDesc { get; set; }

        public string? SkinTypes { get; set; } // Da dầu, Da mụn, Da nhạy cảm

        public string? KeyIngredients { get; set; } // Niacinamide, BHA, HA

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }

    public class Customer
    {
        [Key]
        public int CustomerId { get; set; }

        [Required]
        [StringLength(150)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;

        [StringLength(150)]
        public string? Email { get; set; }

        [StringLength(255)]
        public string Address { get; set; } = string.Empty;

        [StringLength(100)]
        public string Province { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public ICollection<Order>? Orders { get; set; }
    }

    public class Order
    {
        [Key]
        [StringLength(50)]
        public string OrderId { get; set; } = string.Empty;

        public int CustomerId { get; set; }
        [ForeignKey("CustomerId")]
        public Customer? Customer { get; set; }

        [StringLength(50)]
        public string? CouponCode { get; set; }

        [Column(TypeName = "decimal(18, 0)")]
        public decimal Subtotal { get; set; }

        [Column(TypeName = "decimal(18, 0)")]
        public decimal ShippingFee { get; set; } = 30000;

        [Column(TypeName = "decimal(18, 0)")]
        public decimal DiscountAmount { get; set; }

        [Column(TypeName = "decimal(18, 0)")]
        public decimal TotalAmount { get; set; }

        [StringLength(20)]
        public string PaymentMethod { get; set; } = "VIETQR"; // COD, VIETQR, MOMO, VNPAY

        [StringLength(50)]
        public string OrderStatus { get; set; } = "Chờ xác nhận";

        [StringLength(50)]
        public string PaymentStatus { get; set; } = "Chờ thanh toán";

        [StringLength(255)]
        public string ShippingAddress { get; set; } = string.Empty;

        [StringLength(100)]
        public string ShippingProvince { get; set; } = string.Empty;

        public string? Note { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public ICollection<OrderItem>? OrderItems { get; set; }
    }

    public class OrderItem
    {
        [Key]
        public int OrderItemId { get; set; }

        [StringLength(50)]
        public string OrderId { get; set; } = string.Empty;
        [ForeignKey("OrderId")]
        public Order? Order { get; set; }

        [StringLength(50)]
        public string ProductId { get; set; } = string.Empty;
        [ForeignKey("ProductId")]
        public Product? Product { get; set; }

        [StringLength(255)]
        public string ProductName { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18, 0)")]
        public decimal UnitPrice { get; set; }

        public int Quantity { get; set; } = 1;

        [Column(TypeName = "decimal(18, 0)")]
        public decimal LineTotal { get; set; }
    }

    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        [StringLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [StringLength(150)]
        public string Email { get; set; } = string.Empty;

        [StringLength(255)]
        public string PasswordHash { get; set; } = string.Empty;

        [StringLength(150)]
        public string FullName { get; set; } = string.Empty;

        [StringLength(20)]
        public string? Phone { get; set; }

        [StringLength(50)]
        public string Role { get; set; } = "CUSTOMER"; // SUPER_ADMIN, WAREHOUSE_STAFF, SALES_STAFF, CUSTOMER

        [StringLength(100)]
        public string RoleName { get; set; } = "Khách hàng";

        public bool IsActive { get; set; } = true;
    }

    public class CartItem
    {
        public Product Product { get; set; } = new Product();
        public int Quantity { get; set; } = 1;
        public decimal LineTotal => Product.Price * Quantity;
    }

    public class CheckoutViewModel
    {
        public string? FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng nhập số điện thoại nhận hàng")]
        public string Phone { get; set; } = string.Empty;

        public string? Email { get; set; }

        public string? Address { get; set; } = string.Empty;

        public string Province { get; set; } = "Hà Nội";

        public string PaymentMethod { get; set; } = "VIETQR";
        public string? CouponCode { get; set; }
        public string? Note { get; set; }
    }

    public class LoginViewModel
    {
        [Required(ErrorMessage = "Vui lòng nhập Tên đăng nhập hoặc Email")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng nhập Mật khẩu")]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;

        public bool RememberMe { get; set; } = true;
        public string? ReturnUrl { get; set; }
    }

    public class RegisterViewModel
    {
        [Required(ErrorMessage = "Họ và tên bắt buộc nhập")]
        [StringLength(100, ErrorMessage = "Họ và tên tối đa 100 ký tự")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tên đăng nhập bắt buộc nhập")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Tên đăng nhập từ 3 đến 50 ký tự")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email bắt buộc nhập")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Số điện thoại bắt buộc nhập")]
        [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mật khẩu bắt buộc nhập")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Mật khẩu phải từ 6 ký tự trở lên")]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng xác nhận mật khẩu")]
        [Compare("Password", ErrorMessage = "Mật khẩu xác nhận không khớp")]
        [DataType(DataType.Password)]
        public string ConfirmPassword { get; set; } = string.Empty;

        public string Role { get; set; } = "CUSTOMER"; // Mặc định là khách hàng, có thể chọn demo
    }

    public class ProfileViewModel
    {
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string Role { get; set; } = string.Empty;
        public string RoleName { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string? Province { get; set; }
    }

    public class SiteSetting
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; } = 0;

        [Required(ErrorMessage = "Tên website không được để trống")]
        [StringLength(150)]
        public string SiteName { get; set; } = "GlowCare Lab";

        [StringLength(255)]
        public string Tagline { get; set; } = "Dược Mỹ Phẩm & Chăm Sóc Da Chuyên Sâu";

        [StringLength(500)]
        public string AnnouncementText { get; set; } = "🎉 Khai xuân rực rỡ - Miễn phí vận chuyển toàn quốc cho đơn từ 299.000₫";

        [StringLength(50)]
        public string Hotline { get; set; } = "1900 6868";

        [StringLength(100)]
        public string Email { get; set; } = "support@glowcare.vn";

        [StringLength(255)]
        public string Address { get; set; } = "Số 88 Phố Huế, Hoàn Kiếm, Hà Nội";

        [NotMapped]
        public string FooterAddress => Address;

        [StringLength(255)]
        public string LogoText { get; set; } = "GlowCare Lab";

        // Banner Hero
        [Required(ErrorMessage = "Tiêu đề Banner không được để trống")]
        [StringLength(255)]
        public string HeroTitle { get; set; } = "Giải Pháp Khoa Học Cho Làn Da Hoàn Hảo";

        [StringLength(500)]
        public string HeroSubtitle { get; set; } = "Khám phá quy trình dược mỹ phẩm chuẩn chuyên gia da liễu. 100% chính hãng, phục hồi tầng sâu và đánh thức vẻ đẹp tự nhiên.";

        [StringLength(500)]
        public string HeroImageUrl { get; set; } = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80";

        [StringLength(100)]
        public string HeroBadge { get; set; } = "Phòng Lab Đạt Chuẩn Da Liễu";

        [StringLength(100)]
        public string HeroButtonText { get; set; } = "Khám Phá Sản Phẩm Ngay";

        [StringLength(255)]
        public string HeroButtonLink { get; set; } = "/Products";

        // Màu sắc giao diện (Theme Styling)
        [StringLength(50)]
        public string PrimaryColor { get; set; } = "#e11d48"; // Rose

        [StringLength(50)]
        public string AccentColor { get; set; } = "#f43f5e";

        [StringLength(50)]
        public string ThemePreset { get; set; } = "rose"; // rose, emerald, indigo, amber, dark
    }

    public class CreateStaffViewModel
    {
        [Required(ErrorMessage = "Họ và tên bắt buộc nhập")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tên đăng nhập bắt buộc nhập")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email bắt buộc nhập")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Số điện thoại bắt buộc nhập")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mật khẩu bắt buộc nhập")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Mật khẩu phải từ 6 ký tự trở lên")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng chọn vai trò")]
        public string Role { get; set; } = "WAREHOUSE_STAFF"; // SUPER_ADMIN, WAREHOUSE_STAFF, SALES_STAFF
    }

    public class ErrorViewModel
    {
        public string? RequestId { get; set; }
        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);
        public string? Message { get; set; }
    }
}
