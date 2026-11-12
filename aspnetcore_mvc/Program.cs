using GlowCare_AspNetCore_MVC.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Thêm dịch vụ Controller & View (Mô hình MVC)
builder.Services.AddControllersWithViews();

// 2. Cấu hình Entity Framework Core kết nối Microsoft SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Server=(localdb)\\MSSQLLocalDB;Database=glowcare_skincare_db;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True;Connect Timeout=5;";
    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.CommandTimeout(5);
    });
});

// 3. Cấu hình Session (Quản lý Giỏ hàng của người dùng)
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(60);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// 4. Cấu hình Xác thực & Phân quyền Cookie
builder.Services.AddAuthentication("GlowCareCookieAuth")
    .AddCookie("GlowCareCookieAuth", options =>
    {
        options.Cookie.Name = "GlowCare.AuthCookie";
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/AccessDenied";
        options.ExpireTimeSpan = TimeSpan.FromDays(7);
    });

var app = builder.Build();

// Tự động kiểm tra và khởi tạo Database nếu chưa tồn tại
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        context.Database.SetCommandTimeout(5);
        context.Database.EnsureCreated();
        DbInitializer.Initialize(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogWarning("Chưa kết nối được SQL Server: {Message}. Ứng dụng sẽ hoạt động ở chế độ dữ liệu dự phòng (Fallback) an toàn.", ex.Message);
    }
}

// Cấu hình Middleware HTTP pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseSession();
app.UseAuthentication();
app.UseAuthorization();

// Định tuyến MVC chuẩn (Controller / Action / ID)
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
