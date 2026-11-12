using GlowCare_AspNetCore_MVC.Models;
using Microsoft.EntityFrameworkCore;

namespace GlowCare_AspNetCore_MVC.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<SiteSetting> SiteSettings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Category>().ToTable("categories");
            modelBuilder.Entity<Brand>().ToTable("brands");
            modelBuilder.Entity<Product>().ToTable("products");
            modelBuilder.Entity<Customer>().ToTable("customers");
            modelBuilder.Entity<Order>().ToTable("orders");
            modelBuilder.Entity<OrderItem>().ToTable("order_items");
            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<SiteSetting>(b =>
            {
                b.ToTable("site_settings");
                b.HasKey(s => s.Id);
                b.Property(s => s.Id).ValueGeneratedOnAdd();
            });
        }
    }

    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            // 1. Seed SiteSetting nếu chưa có (Không truyền Id để SQL Server tự sinh IDENTITY)
            try
            {
                if (!context.SiteSettings.Any())
                {
                    context.SiteSettings.Add(new SiteSetting
                    {
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
                    });
                    context.SaveChanges();
                }
            }
            catch { /* Bỏ qua nếu đã có bản ghi */ }

            // 2. Seed Categories (Menu) nếu chưa có
            try
            {
                if (!context.Categories.Any())
                {
                    var categories = new Category[]
                    {
                        new Category { CategoryName = "Làm sạch", Slug = "lam-sach", Description = "Sữa rửa mặt và dầu tẩy trang dịu nhẹ chuẩn da liễu" },
                        new Category { CategoryName = "Toner & Nước cân bằng", Slug = "toner-can-bang", Description = "Cân bằng độ pH và cấp ẩm tầng biểu bì" },
                        new Category { CategoryName = "Serum & Tinh chất", Slug = "serum-tinh-chat", Description = "Hoạt chất cô đặc phục hồi và làm sáng da" },
                        new Category { CategoryName = "Kem dưỡng ẩm", Slug = "kem-duong-am", Description = "Khóa ẩm và tái tạo hàng rào lipid bảo vệ da" },
                        new Category { CategoryName = "Chống nắng", Slug = "chong-nang", Description = "Bảo vệ da phổ rộng khỏi tia UVA, UVB" },
                        new Category { CategoryName = "Đặc trị & Tẩy da chết", Slug = "dac-tri-tay-da-chet", Description = "BHA, AHA làm sạch sâu cổ nang lông và trị mụn" }
                    };
                    context.Categories.AddRange(categories);
                    context.SaveChanges();
                }
            }
            catch { /* Safe catch */ }

            // 3. Seed Brands nếu chưa có
            try
            {
                if (!context.Brands.Any())
                {
                    var brands = new Brand[]
                    {
                        new Brand { BrandName = "La Roche-Posay", Country = "Pháp" },
                        new Brand { BrandName = "Paula's Choice", Country = "Mỹ" },
                        new Brand { BrandName = "Skin1004", Country = "Hàn Quốc" },
                        new Brand { BrandName = "Klairs", Country = "Hàn Quốc" },
                        new Brand { BrandName = "Anessa", Country = "Nhật Bản" }
                    };
                    context.Brands.AddRange(brands);
                    context.SaveChanges();
                }
            }
            catch { /* Safe catch */ }

            // 4. Seed Users (Demo RBAC) nếu chưa có
            try
            {
                if (!context.Users.Any())
                {
                    var users = new User[]
                    {
                        new User { Username = "admin", Email = "admin@glowcare.vn", FullName = "Nguyễn Quản Trị", Role = "SUPER_ADMIN", RoleName = "Quản trị viên Cấp cao", IsActive = true },
                        new User { Username = "thukho", Email = "warehouse@glowcare.vn", FullName = "Trần Thủ Kho", Role = "WAREHOUSE_STAFF", RoleName = "Thủ kho", IsActive = true },
                        new User { Username = "sales", Email = "sales@glowcare.vn", FullName = "Lê Bán Hàng", Role = "SALES_STAFF", RoleName = "Nhân viên Bán hàng", IsActive = true },
                        new User { Username = "khachhang", Email = "khachhang@gmail.com", FullName = "Phạm Thu Uyên", Role = "CUSTOMER", RoleName = "Khách hàng Thân thiết", IsActive = true }
                    };
                    context.Users.AddRange(users);
                    context.SaveChanges();
                }
            }
            catch { /* Safe catch */ }

            // 5. Seed Products nếu chưa có
            try
            {
                if (!context.Products.Any())
                {
                    var cats = context.Categories.ToList();
                    var brs = context.Brands.ToList();

                    if (cats.Any() && brs.Any())
                    {
                        var catLamSach = cats.FirstOrDefault(c => c.Slug == "lam-sach") ?? cats[0];
                        var catToner = cats.FirstOrDefault(c => c.Slug == "toner-can-bang") ?? (cats.Count > 1 ? cats[1] : cats[0]);
                        var catSerum = cats.FirstOrDefault(c => c.Slug == "serum-tinh-chat") ?? (cats.Count > 2 ? cats[2] : cats[0]);
                        var catKemDuong = cats.FirstOrDefault(c => c.Slug == "kem-duong-am") ?? (cats.Count > 3 ? cats[3] : cats[0]);
                        var catChongNang = cats.FirstOrDefault(c => c.Slug == "chong-nang") ?? (cats.Count > 4 ? cats[4] : cats[0]);
                        var catDacTri = cats.FirstOrDefault(c => c.Slug == "dac-tri-tay-da-chet") ?? (cats.Count > 5 ? cats[5] : cats[0]);

                        var brandLaRoche = brs.FirstOrDefault(b => b.BrandName.Contains("La Roche")) ?? brs[0];
                        var brandPaula = brs.FirstOrDefault(b => b.BrandName.Contains("Paula")) ?? (brs.Count > 1 ? brs[1] : brs[0]);
                        var brandSkin1004 = brs.FirstOrDefault(b => b.BrandName.Contains("Skin1004")) ?? (brs.Count > 2 ? brs[2] : brs[0]);
                        var brandKlairs = brs.FirstOrDefault(b => b.BrandName.Contains("Klairs")) ?? (brs.Count > 3 ? brs[3] : brs[0]);
                        var brandAnessa = brs.FirstOrDefault(b => b.BrandName.Contains("Anessa")) ?? (brs.Count > 4 ? brs[4] : brs[0]);

                        var products = new Product[]
                        {
                            new Product
                            {
                                ProductId = "laroche-effaclar-gel",
                                ProductName = "Gel Rửa Mặt Giảm Nhờn Cho Da Dầu Mụn La Roche-Posay Effaclar Gel",
                                BrandId = brandLaRoche.BrandId,
                                CategoryId = catLamSach.CategoryId,
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
                                RoutineType = "Both",
                                ShortDesc = "Sữa rửa mặt dạng gel tạo bọt dịu nhẹ, chứa Kẽm PCA giúp làm sạch bụi bẩn và bã nhờn dư thừa, duy trì độ pH lý tưởng 5.5.",
                                SkinTypes = "Da dầu, Da nhạy cảm, Da mụn",
                                KeyIngredients = "Niacinamide, Zinc PCA"
                            },
                            new Product
                            {
                                ProductId = "paulas-choice-bha-2",
                                ProductName = "Dung Dịch Tẩy Tế Bào Chết Paula's Choice 2% BHA Liquid Exfoliant",
                                BrandId = brandPaula.BrandId,
                                CategoryId = catDacTri.CategoryId,
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
                                UsageStep = "Bước 3: Tẩy da chết hóa học (Buổi tối)",
                                RoutineType = "PM",
                                ShortDesc = "Chứa 2% Salicylic Acid tan trong dầu, thâm nhập sâu vào lỗ chân lông làm sạch bã nhờn bít tắc, loại bỏ mụn đầu đen.",
                                SkinTypes = "Da dầu, Da mụn, Da hỗn hợp",
                                KeyIngredients = "Salicylic Acid (BHA 2%), Trà xanh"
                            },
                            new Product
                            {
                                ProductId = "skin1004-centella-ampoule",
                                ProductName = "Tinh Chất Rau Má Phục Hồi Dịu Da Skin1004 Madagascar Centella Ampoule",
                                BrandId = brandSkin1004.BrandId,
                                CategoryId = catSerum.CategoryId,
                                Price = 345000,
                                OriginalPrice = 420000,
                                DiscountPercent = 18,
                                Rating = 4.9m,
                                ReviewCount = 312,
                                StockCount = 60,
                                IsFeatured = true,
                                IsBestSeller = true,
                                IsNew = true,
                                ImageUrl = "https://images.unsplash.com/photo-1608248597359-2e118ef55655?auto=format&fit=crop&w=800&q=80",
                                Volume = "100ml",
                                UsageStep = "Bước 4: Serum/Tinh chất cấp ẩm & phục hồi",
                                RoutineType = "Both",
                                ShortDesc = "Chứa 100% chiết xuất cô đặc rau má Centella Asiatica từ Madagascar giúp làm dịu da kích ứng, kháng viêm mạnh mẽ.",
                                SkinTypes = "Da dầu, Da khô, Da nhạy cảm, Da mụn",
                                KeyIngredients = "Centella Asiatica (Rau má 100%)"
                            },
                            new Product
                            {
                                ProductId = "anessa-perfect-uv-sunscreen",
                                ProductName = "Sữa Chống Nắng Kiềm Dầu Chống Nước Anessa Perfect UV Sunscreen Skincare Milk SPF50+ PA++++",
                                BrandId = brandAnessa.BrandId,
                                CategoryId = catChongNang.CategoryId,
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
                                UsageStep = "Bước 5: Chống nắng ban ngày",
                                RoutineType = "AM",
                                ShortDesc = "Chống nắng phổ rộng bảo vệ hoàn hảo với công nghệ Auto Booster, chống trôi nước mồ hôi 80 phút.",
                                SkinTypes = "Da dầu, Da hỗn hợp, Mọi loại da",
                                KeyIngredients = "Zinc Oxide, Titanium Dioxide"
                            },
                            new Product
                            {
                                ProductId = "klairs-supple-toner",
                                ProductName = "Nước Hoa Hồng Cấp Ẩm Sâu Không Mùi Klairs Supple Preparation Unscented Toner",
                                BrandId = brandKlairs.BrandId,
                                CategoryId = catToner.CategoryId,
                                Price = 285000,
                                OriginalPrice = 360000,
                                DiscountPercent = 21,
                                Rating = 4.8m,
                                ReviewCount = 180,
                                StockCount = 38,
                                IsFeatured = true,
                                ImageUrl = "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80",
                                Volume = "180ml",
                                UsageStep = "Bước 2: Nước hoa hồng cân bằng da",
                                RoutineType = "Both",
                                ShortDesc = "Chiết xuất thực vật lành tính, cấp ẩm sâu tức thì cho làn da nhạy cảm mà không gây nhờn rít hay châm chích.",
                                SkinTypes = "Da khô, Da nhạy cảm, Mọi loại da",
                                KeyIngredients = "Hyaluronic Acid, Centella Asiatica, Lipidure"
                            },
                            new Product
                            {
                                ProductId = "laroche-b5-baume",
                                ProductName = "Kem Dưỡng Làm Dịu & Phục Hồi Da La Roche-Posay Cicaplast Baume B5+ Ultra-Repairing",
                                BrandId = brandLaRoche.BrandId,
                                CategoryId = catKemDuong.CategoryId,
                                Price = 320000,
                                OriginalPrice = 390000,
                                DiscountPercent = 18,
                                Rating = 4.9m,
                                ReviewCount = 520,
                                StockCount = 70,
                                IsFeatured = true,
                                IsBestSeller = true,
                                ImageUrl = "https://images.unsplash.com/photo-1556228722-d0b97779f401?auto=format&fit=crop&w=800&q=80",
                                Volume = "40ml",
                                UsageStep = "Bước 5: Kem dưỡng khóa ẩm phục hồi",
                                RoutineType = "Both",
                                ShortDesc = "Công thức cải tiến với Tribioma và Madecassoside cùng 5% Panthenol giúp làm dịu tức thì vết đỏ rát, tái tạo hàng rào bảo vệ da.",
                                SkinTypes = "Da khô, Da nhạy cảm, Da tổn thương sau treatment",
                                KeyIngredients = "Panthenol 5% (B5), Madecassoside, Tribioma"
                            }
                        };
                        context.Products.AddRange(products);
                        context.SaveChanges();
                    }
                }
            }
            catch { /* Safe catch */ }
        }
    }
}
