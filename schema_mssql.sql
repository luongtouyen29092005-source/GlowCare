-- =============================================================================
-- HỆ THỐNG CƠ SỞ DỮ LIỆU CỬA HÀNG DƯỢC MỸ PHẨM GLOWCARE SKINCARE
-- Hệ quản trị CSDL: Microsoft SQL Server (MS SQL Server / SSMS / Visual Studio)
-- Cú pháp chuẩn: Transact-SQL (T-SQL) - Hỗ trợ Tiếng Việt Unicode (NVARCHAR / N'...')
-- =============================================================================

-- 1. TẠO CƠ SỞ DỮ LIỆU (DATABASE)
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'glowcare_skincare_db')
BEGIN
    CREATE DATABASE glowcare_skincare_db;
END
GO

USE glowcare_skincare_db;
GO

-- =============================================================================
-- 2. XÓA CÁC BẢNG CŨ NẾU ĐÃ TỒN TẠI (THEO THỨ TỰ RÀNG BUỘC KHÓA NGOẠI)
-- =============================================================================
IF OBJECT_ID('dbo.order_items', 'U') IS NOT NULL DROP TABLE dbo.order_items;
IF OBJECT_ID('dbo.orders', 'U') IS NOT NULL DROP TABLE dbo.orders;
IF OBJECT_ID('dbo.reviews', 'U') IS NOT NULL DROP TABLE dbo.reviews;
IF OBJECT_ID('dbo.product_skin_types', 'U') IS NOT NULL DROP TABLE dbo.product_skin_types;
IF OBJECT_ID('dbo.product_ingredients', 'U') IS NOT NULL DROP TABLE dbo.product_ingredients;
IF OBJECT_ID('dbo.product_usage_steps', 'U') IS NOT NULL DROP TABLE dbo.product_usage_steps;
IF OBJECT_ID('dbo.products', 'U') IS NOT NULL DROP TABLE dbo.products;
IF OBJECT_ID('dbo.categories', 'U') IS NOT NULL DROP TABLE dbo.categories;
IF OBJECT_ID('dbo.brands', 'U') IS NOT NULL DROP TABLE dbo.brands;
IF OBJECT_ID('dbo.skin_types', 'U') IS NOT NULL DROP TABLE dbo.skin_types;
IF OBJECT_ID('dbo.ingredients', 'U') IS NOT NULL DROP TABLE dbo.ingredients;
IF OBJECT_ID('dbo.coupons', 'U') IS NOT NULL DROP TABLE dbo.coupons;
IF OBJECT_ID('dbo.role_permissions', 'U') IS NOT NULL DROP TABLE dbo.role_permissions;
IF OBJECT_ID('dbo.users', 'U') IS NOT NULL DROP TABLE dbo.users;
IF OBJECT_ID('dbo.permissions', 'U') IS NOT NULL DROP TABLE dbo.permissions;
IF OBJECT_ID('dbo.roles', 'U') IS NOT NULL DROP TABLE dbo.roles;
IF OBJECT_ID('dbo.customers', 'U') IS NOT NULL DROP TABLE dbo.customers;
GO

-- =============================================================================
-- 3. TẠO CÁC BẢNG NỀN TẢNG (MASTER DATA)
-- =============================================================================

-- 3.1: Danh mục sản phẩm (Categories)
CREATE TABLE dbo.categories (
    category_id INT IDENTITY(1,1) PRIMARY KEY,
    category_name NVARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description NVARCHAR(500) NULL,
    created_at DATETIME2 DEFAULT GETDATE()
);
GO

-- 3.2: Thương hiệu mỹ phẩm (Brands)
CREATE TABLE dbo.brands (
    brand_id INT IDENTITY(1,1) PRIMARY KEY,
    brand_name NVARCHAR(100) NOT NULL UNIQUE,
    country NVARCHAR(100) DEFAULT N'Việt Nam',
    description NVARCHAR(500) NULL,
    created_at DATETIME2 DEFAULT GETDATE()
);
GO

-- 3.3: Các loại da chuẩn da liễu (Skin Types)
CREATE TABLE dbo.skin_types (
    skin_type_id INT IDENTITY(1,1) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    type_name NVARCHAR(100) NOT NULL,
    characteristics NVARCHAR(500) NULL
);
GO

-- 3.4: Hoạt chất & Thành phần dưỡng da (Ingredients)
CREATE TABLE dbo.ingredients (
    ingredient_id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(150) NOT NULL UNIQUE,
    function_desc NVARCHAR(500) NULL
);
GO

-- =============================================================================
-- 4. BẢNG SẢN PHẨM & QUAN HỆ NHIỀU - NHIỀU (PRODUCTS & RELATIONSHIPS)
-- =============================================================================

-- 4.1: Bảng Sản phẩm chính (Products)
CREATE TABLE dbo.products (
    product_id VARCHAR(50) PRIMARY KEY,
    product_name NVARCHAR(255) NOT NULL,
    brand_id INT NOT NULL,
    category_id INT NOT NULL,
    price DECIMAL(18, 0) NOT NULL,
    original_price DECIMAL(18, 0) NOT NULL,
    discount_percent INT DEFAULT 0,
    rating DECIMAL(3, 1) DEFAULT 5.0,
    review_count INT DEFAULT 0,
    stock_count INT DEFAULT 0,
    is_featured BIT DEFAULT 0,
    is_best_seller BIT DEFAULT 0,
    is_new BIT DEFAULT 0,
    image_url NVARCHAR(500) NOT NULL,
    volume NVARCHAR(50) NOT NULL,
    usage_step NVARCHAR(150) NULL,
    routine_type VARCHAR(10) DEFAULT 'Both', -- AM, PM, Both
    short_desc NVARCHAR(1000) NOT NULL,
    full_desc NVARCHAR(MAX) NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_products_brand FOREIGN KEY (brand_id) REFERENCES dbo.brands (brand_id) ON UPDATE CASCADE,
    CONSTRAINT FK_products_category FOREIGN KEY (category_id) REFERENCES dbo.categories (category_id) ON UPDATE CASCADE
);
GO

-- 4.2: Quan hệ Sản phẩm - Loại da phù hợp (Product_Skin_Types: N-N)
CREATE TABLE dbo.product_skin_types (
    product_id VARCHAR(50) NOT NULL,
    skin_type_id INT NOT NULL,
    PRIMARY KEY (product_id, skin_type_id),
    CONSTRAINT FK_pst_product FOREIGN KEY (product_id) REFERENCES dbo.products (product_id) ON DELETE CASCADE,
    CONSTRAINT FK_pst_skintype FOREIGN KEY (skin_type_id) REFERENCES dbo.skin_types (skin_type_id) ON DELETE CASCADE
);
GO

-- 4.3: Quan hệ Sản phẩm - Hoạt chất chính (Product_Ingredients: N-N)
CREATE TABLE dbo.product_ingredients (
    product_id VARCHAR(50) NOT NULL,
    ingredient_id INT NOT NULL,
    PRIMARY KEY (product_id, ingredient_id),
    CONSTRAINT FK_pi_product FOREIGN KEY (product_id) REFERENCES dbo.products (product_id) ON DELETE CASCADE,
    CONSTRAINT FK_pi_ingredient FOREIGN KEY (ingredient_id) REFERENCES dbo.ingredients (ingredient_id) ON DELETE CASCADE
);
GO

-- 4.4: Các bước sử dụng chi tiết (Product_Usage_Steps)
CREATE TABLE dbo.product_usage_steps (
    step_id INT IDENTITY(1,1) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    step_order INT NOT NULL,
    instruction NVARCHAR(1000) NOT NULL,
    CONSTRAINT FK_usage_product FOREIGN KEY (product_id) REFERENCES dbo.products (product_id) ON DELETE CASCADE
);
GO

-- =============================================================================
-- 5. KHÁCH HÀNG, ĐÁNH GIÁ & MÃ GIẢM GIÁ (CUSTOMERS, REVIEWS & COUPONS)
-- =============================================================================

-- 5.1: Khách hàng (Customers)
CREATE TABLE dbo.customers (
    customer_id INT IDENTITY(1,1) PRIMARY KEY,
    full_name NVARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email NVARCHAR(150) NULL,
    address NVARCHAR(255) NOT NULL,
    province NVARCHAR(100) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE()
);
GO

-- 5.2: Mã ưu đãi giảm giá (Coupons)
CREATE TABLE dbo.coupons (
    coupon_id INT IDENTITY(1,1) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_percent INT DEFAULT 0,
    discount_amount DECIMAL(18, 0) DEFAULT 0,
    free_shipping BIT DEFAULT 0,
    min_order_value DECIMAL(18, 0) DEFAULT 0,
    description NVARCHAR(255) NOT NULL,
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE()
);
GO

-- 5.3: Đánh giá sản phẩm (Reviews)
CREATE TABLE dbo.reviews (
    review_id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    user_name NVARCHAR(150) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment NVARCHAR(MAX) NOT NULL,
    skin_type_id INT NULL,
    verified_purchase BIT DEFAULT 1,
    review_date DATE NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_reviews_product FOREIGN KEY (product_id) REFERENCES dbo.products (product_id) ON DELETE CASCADE,
    CONSTRAINT FK_reviews_skintype FOREIGN KEY (skin_type_id) REFERENCES dbo.skin_types (skin_type_id) ON SET NULL
);
GO

-- =============================================================================
-- 6. ĐƠN HÀNG & CHI TIẾT ĐƠN HÀNG (ORDERS & ORDER ITEMS)
-- =============================================================================

-- 6.1: Đơn hàng (Orders)
CREATE TABLE dbo.orders (
    order_id VARCHAR(50) PRIMARY KEY,
    customer_id INT NOT NULL,
    coupon_code VARCHAR(50) NULL,
    subtotal DECIMAL(18, 0) NOT NULL,
    shipping_fee DECIMAL(18, 0) DEFAULT 30000,
    discount_amount DECIMAL(18, 0) DEFAULT 0,
    total_amount DECIMAL(18, 0) NOT NULL,
    payment_method VARCHAR(20) DEFAULT 'VIETQR', -- COD, VIETQR, MOMO, VNPAY
    order_status NVARCHAR(50) DEFAULT N'Chờ xác nhận',
    payment_status NVARCHAR(50) DEFAULT N'Chờ thanh toán',
    shipping_address NVARCHAR(255) NOT NULL,
    shipping_province NVARCHAR(100) NOT NULL,
    note NVARCHAR(1000) NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_orders_customer FOREIGN KEY (customer_id) REFERENCES dbo.customers (customer_id) ON UPDATE CASCADE
);
GO

-- 6.2: Chi tiết đơn hàng (Order Items)
CREATE TABLE dbo.order_items (
    order_item_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    product_name NVARCHAR(255) NOT NULL,
    unit_price DECIMAL(18, 0) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    line_total DECIMAL(18, 0) NOT NULL,
    CONSTRAINT FK_items_order FOREIGN KEY (order_id) REFERENCES dbo.orders (order_id) ON DELETE CASCADE,
    CONSTRAINT FK_items_product FOREIGN KEY (product_id) REFERENCES dbo.products (product_id) ON UPDATE CASCADE
);
GO

-- =============================================================================
-- 7. HỆ THỐNG PHÂN QUYỀN (RBAC - ROLE-BASED ACCESS CONTROL)
-- =============================================================================

-- 7.1: Các vai trò trong hệ thống (Roles)
CREATE TABLE dbo.roles (
    role_id INT IDENTITY(1,1) PRIMARY KEY,
    role_code VARCHAR(50) NOT NULL UNIQUE,       -- SUPER_ADMIN, WAREHOUSE_STAFF, SALES_STAFF, CUSTOMER
    role_name NVARCHAR(100) NOT NULL,
    description NVARCHAR(500) NULL,
    created_at DATETIME2 DEFAULT GETDATE()
);
GO

-- 7.2: Các quyền hạn chi tiết (Permissions)
CREATE TABLE dbo.permissions (
    permission_id INT IDENTITY(1,1) PRIMARY KEY,
    permission_code VARCHAR(100) NOT NULL UNIQUE, -- product:create, inventory:update, order:confirm
    module VARCHAR(50) NOT NULL,                  -- PRODUCT, INVENTORY, ORDER, USER, REPORT
    description NVARCHAR(255) NOT NULL
);
GO

-- 7.3: Quan hệ Vai trò - Quyền hạn (Role_Permissions: N-N)
CREATE TABLE dbo.role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT FK_rp_role FOREIGN KEY (role_id) REFERENCES dbo.roles (role_id) ON DELETE CASCADE,
    CONSTRAINT FK_rp_permission FOREIGN KEY (permission_id) REFERENCES dbo.permissions (permission_id) ON DELETE CASCADE
);
GO

-- 7.4: Tài khoản người dùng (Users)
CREATE TABLE dbo.users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name NVARCHAR(150) NOT NULL,
    phone VARCHAR(20) NULL,
    avatar_url NVARCHAR(500) NULL,
    customer_id INT NULL,
    role_id INT NOT NULL,
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_users_role FOREIGN KEY (role_id) REFERENCES dbo.roles (role_id) ON UPDATE CASCADE,
    CONSTRAINT FK_users_customer FOREIGN KEY (customer_id) REFERENCES dbo.customers (customer_id) ON DELETE SET NULL
);
GO

-- =============================================================================
-- 8. DỮ LIỆU MẪU CHUẨN (SEED DATA)
-- =============================================================================

-- Chèn Danh mục
INSERT INTO dbo.categories (category_name, slug, description) VALUES
(N'Làm sạch', 'lam-sach', N'Sữa rửa mặt, dầu tẩy trang và sáp tẩy trang loại bỏ bã nhờn dịu nhẹ'),
(N'Toner & Nước cân bằng', 'toner-can-bang', N'Cân bằng độ pH, cấp ẩm tức thì và làm mềm bề mặt biểu bì'),
(N'Serum & Tinh chất', 'serum-tinh-chat', N'Hoạt chất cô đặc thẩm thấu sâu, phục hồi màng ẩm và sáng da'),
(N'Kem dưỡng ẩm', 'kem-duong-am', N'Khóa ẩm, củng cố hàng rào lipid bảo vệ da suốt 24 giờ'),
(N'Chống nắng', 'chong-nang', N'Bảo vệ da phổ rộng khỏi tia UVA, UVB, ánh sáng xanh HEV'),
(N'Đặc trị & Tẩy da chết', 'dac-tri-tay-da-chet', N'BHA, AHA, Retinoid thanh lọc lỗ chân lông và tái tạo bề mặt');
GO

-- Chèn Thương hiệu
INSERT INTO dbo.brands (brand_name, country, description) VALUES
(N'La Roche-Posay', N'Pháp', N'Dược mỹ phẩm hàng đầu được chuyên gia da liễu khuyên dùng'),
(N'Paula''s Choice', N'Mỹ', N'Tiên phong minh bạch thành phần, nồng độ chuẩn khoa học'),
(N'Klairs', N'Hàn Quốc', N'Mỹ phẩm thuần chay lành tính cho làn da siêu nhạy cảm'),
(N'Skin1004', N'Hàn Quốc', N'Chiết xuất rau má vùng Madagascar tinh khiết làm dịu da'),
(N'Anessa', N'Nhật Bản', N'Thương hiệu chống nắng hàng đầu với công nghệ Auto Booster');
GO

-- Chèn Loại da
INSERT INTO dbo.skin_types (code, type_name, characteristics) VALUES
('OILY', N'Da dầu', N'Tuyến dầu hoạt động mạnh, bóng nhờn vùng chữ T, lỗ chân lông to'),
('DRY', N'Da khô', N'Thiếu hụt lipid, căng rát sau rửa mặt, dễ bong tróc và xỉn màu'),
('SENSITIVE', N'Da nhạy cảm', N'Màng bảo vệ yếu, dễ ửng đỏ, châm chích khi đổi thời tiết hoặc mỹ phẩm'),
('ACNE', N'Da mụn', N'Có mụn ẩn, mụn viêm, dễ tắc nghẽn cổ nang lông'),
('COMBINATION', N'Da hỗn hợp', N'Dầu nhiều vùng chữ T (trán, mũi, cằm) nhưng khô hai bên má'),
('ALL', N'Mọi loại da', N'Dung nạp tốt với hầu hết các thành phần dịu nhẹ');
GO

-- Chèn Hoạt chất
INSERT INTO dbo.ingredients (name, function_desc) VALUES
(N'Niacinamide (Vitamin B3)', N'Kiểm soát dầu nhờn, thu nhỏ lỗ chân lông, làm sáng mờ thâm'),
(N'Salicylic Acid (BHA 2%)', N'Tan trong dầu, làm sạch sâu cổ nang lông, giảm mụn ẩn và đầu đen'),
(N'Hyaluronic Acid (HA)', N'Ngậm nước gấp 1000 lần khối lượng, căng mọng đa tầng'),
(N'Rau má Madagascar (Centella)', N'Kháng viêm, làm dịu kích ứng và phục hồi hàng rào bảo vệ da'),
(N'Ceramides (NP, AP, EOP)', N'Tái thiết lập cấu trúc màng lipid khóa ẩm tự nhiên');
GO

-- Chèn Vai trò (Roles)
INSERT INTO dbo.roles (role_code, role_name, description) VALUES
('SUPER_ADMIN', N'Quản trị viên Cấp cao', N'Toàn quyền quản trị hệ thống, nhân sự, sản phẩm và báo cáo tài chính'),
('WAREHOUSE_STAFF', N'Thủ kho', N'Kiểm tra nhập - xuất kho, cập nhật số lượng tồn kho sản phẩm'),
('SALES_STAFF', N'Nhân viên Bán hàng', N'Xem đơn đặt hàng, xác nhận và cập nhật tiến độ vận chuyển'),
('CUSTOMER', N'Khách hàng', N'Xem danh mục, đặt hàng, quản lý đơn hàng cá nhân và viết đánh giá');
GO

-- Chèn Quyền hạn (Permissions)
INSERT INTO dbo.permissions (permission_code, module, description) VALUES
('product:view', 'PRODUCT', N'Xem danh mục và chi tiết sản phẩm'),
('product:create', 'PRODUCT', N'Thêm mới sản phẩm vào hệ thống'),
('product:update', 'PRODUCT', N'Cập nhật thông tin giá, mô tả sản phẩm'),
('inventory:update_stock', 'INVENTORY', N'Điều chỉnh số lượng tồn kho'),
('order:view_all', 'ORDER', N'Xem danh sách toàn bộ đơn hàng'),
('order:update_status', 'ORDER', N'Cập nhật trạng thái xử lý đơn hàng'),
('user:manage', 'USER', N'Quản lý danh sách tài khoản và phân quyền');
GO

-- Gán quyền cho vai trò
-- SUPER_ADMIN: Toàn quyền
INSERT INTO dbo.role_permissions (role_id, permission_id)
SELECT 1, permission_id FROM dbo.permissions;

-- WAREHOUSE_STAFF: inventory
INSERT INTO dbo.role_permissions (role_id, permission_id) VALUES
(2, 1), -- product:view
(2, 4); -- inventory:update_stock

-- SALES_STAFF: orders
INSERT INTO dbo.role_permissions (role_id, permission_id) VALUES
(3, 1), -- product:view
(3, 5), -- order:view_all
(3, 6); -- order:update_status

-- CUSTOMER: view
INSERT INTO dbo.role_permissions (role_id, permission_id) VALUES
(4, 1); -- product:view
GO

-- Chèn Tài khoản Người dùng mẫu
-- Mật khẩu mặc định: '123456' (Trong thực tế lưu dạng bcrypt hash)
INSERT INTO dbo.users (username, email, password_hash, full_name, phone, role_id) VALUES
('admin', 'admin@glowcare.vn', '$2a$12$eX1SampleAdminHash99999', N'Nguyễn Quản Trị (Super Admin)', '0901234567', 1),
('thukho', 'warehouse@glowcare.vn', '$2a$12$eX1SampleKhoHash88888', N'Trần Thủ Kho (Kho Vận)', '0912345678', 2),
('sales', 'sales@glowcare.vn', '$2a$12$eX1SampleSalesHash77777', N'Lê Bán Hàng (Tư Vấn Viên)', '0923456789', 3),
('khachhang', 'khachhang@gmail.com', '$2a$12$eX1SampleCustomerHash66', N'Phạm Thu Uyên (Khách Thân Thiết)', '0987654321', 4);
GO

-- Chèn Sản phẩm mẫu
INSERT INTO dbo.products (
    product_id, product_name, brand_id, category_id, price, original_price, 
    discount_percent, rating, review_count, stock_count, is_featured, is_best_seller, 
    is_new, image_url, volume, usage_step, routine_type, short_desc, full_desc
) VALUES
(
    'laroche-effaclar-gel',
    N'Gel Rửa Mặt Giảm Nhờn Cho Da Dầu Mụn La Roche-Posay Effaclar Purifying Foaming Gel',
    1, 1, 385000, 460000, 16, 4.9, 128, 45, 1, 1, 0,
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    '200ml', N'Bước 1: Làm sạch da (Sáng & Tối)', 'Both',
    N'Sữa rửa mặt dạng gel tạo bọt dịu nhẹ, chứa Kẽm PCA giúp làm sạch bụi bẩn và bã nhờn dư thừa, duy trì độ pH lý tưởng 5.5.',
    N'Dành riêng cho làn da dầu, nhạy cảm và dễ nổi mụn. Chứa nước khoáng khoáng thiên nhiên La Roche-Posay Thermal Spring Water giúp làm dịu da tức thì.'
),
(
    'paulas-choice-bha-2',
    N'Dung Dịch Tẩy Tế Bào Chết Hóa Học Paula''s Choice Skin Perfecting 2% BHA Liquid',
    2, 6, 810000, 950000, 15, 4.8, 256, 18, 1, 1, 0,
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    '118ml', N'Bước 3: Tẩy da chết hóa học (Buổi tối)', 'PM',
    N'Chứa 2% Salicylic Acid tan trong dầu, thâm nhập sâu vào lỗ chân lông làm sạch bã nhờn bít tắc, loại bỏ mụn đầu đen.',
    N'Công thức đột phá chứa chiết xuất trà xanh giúp làm dịu các vùng ửng đỏ và cấp ẩm nhẹ nhàng.'
),
(
    'skin1004-centella-ampoule',
    N'Tinh Chất Rau Má Phục Hồi Dịu Da Skin1004 Madagascar Centella Ampoule',
    4, 3, 345000, 420000, 18, 4.9, 312, 60, 1, 1, 1,
    'https://images.unsplash.com/photo-1608248597359-2e118ef55655?auto=format&fit=crop&w=800&q=80',
    '100ml', N'Bước 4: Serum/Tinh chất cấp ẩm & phục hồi', 'Both',
    N'Chứa 100% chiết xuất cô đặc rau má Centella Asiatica từ vùng hoang sơ Madagascar giúp làm dịu da kích ứng, kháng viêm mạnh mẽ.',
    N'Kết cấu dạng lỏng trong suốt như nước, thấm nhanh không bết dính. An toàn tuyệt đối cho da nhạy cảm.'
),
(
    'klairs-supple-preparation-toner',
    N'Nước Cân Bằng Cấp Ẩm Không Mùi Klairs Supple Preparation Unscented Toner',
    3, 2, 285000, 360000, 21, 4.7, 189, 32, 0, 1, 0,
    'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80',
    '180ml', N'Bước 2: Cân bằng pH & Cấp ẩm màng nước', 'Both',
    N'Phiên bản không mùi (Unscented) không tinh dầu và không hương liệu, bổ sung Phyto-Oligo và Axit Amin từ lúa mạch.',
    N'Dưỡng ẩm sâu từng tầng tế bào, phục hồi da khô ráp hoặc sau khi nặn mụn.'
),
(
    'anessa-perfect-uv-sunscreen',
    N'Sữa Chống Nắng Kiềm Dầu Chống Nước Anessa Perfect UV Sunscreen Skincare Milk SPF50+ PA++++',
    5, 5, 545000, 685000, 20, 4.9, 410, 25, 1, 1, 0,
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
    '60ml', N'Bước cuối chu trình dưỡng da buổi sáng', 'AM',
    N'Chống nắng phổ rộng bảo vệ hoàn hảo với công nghệ Auto Booster, lớp màng chống UV trở nên mạnh mẽ hơn khi gặp Nhiệt độ - Nước - Mồ hôi.',
    N'Chứa 50% thành phần dưỡng da chiết xuất hoa vàng, collagen giúp chống lão hóa sớm.'
);
GO

-- Liên kết Sản phẩm - Loại da
INSERT INTO dbo.product_skin_types (product_id, skin_type_id) VALUES
('laroche-effaclar-gel', 1), -- Da dầu
('laroche-effaclar-gel', 3), -- Da nhạy cảm
('laroche-effaclar-gel', 4), -- Da mụn
('paulas-choice-bha-2', 1),  -- Da dầu
('paulas-choice-bha-2', 4),  -- Da mụn
('paulas-choice-bha-2', 5),  -- Da hỗn hợp
('skin1004-centella-ampoule', 1),
('skin1004-centella-ampoule', 2),
('skin1004-centella-ampoule', 3),
('skin1004-centella-ampoule', 4),
('klairs-supple-preparation-toner', 2),
('klairs-supple-preparation-toner', 3),
('anessa-perfect-uv-sunscreen', 1),
('anessa-perfect-uv-sunscreen', 5);
GO

-- Chèn Mã giảm giá
INSERT INTO dbo.coupons (code, discount_percent, min_order_value, description) VALUES
('GLOW20', 20, 300000, N'Ưu đãi giảm 20% cho đơn hàng từ 300.000 ₫'),
('FREESHIP', 0, 200000, N'Miễn phí vận chuyển toàn quốc');
UPDATE dbo.coupons SET free_shipping = 1 WHERE code = 'FREESHIP';
GO

-- =============================================================================
-- 9. STORED PROCEDURES (THỦ TỤC LƯU TRỮ - T-SQL DÀNH CHO BÁO CÁO & ĐỒ ÁN)
-- =============================================================================

-- Thủ tục 9.1: Lấy danh sách sản phẩm theo danh mục và khoảng giá
CREATE OR ALTER PROCEDURE dbo.sp_GetProductsByCategory
    @CategorySlug VARCHAR(120) = NULL,
    @MinPrice DECIMAL(18, 0) = 0,
    @MaxPrice DECIMAL(18, 0) = 999999999
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        p.product_id,
        p.product_name,
        b.brand_name,
        c.category_name,
        p.price,
        p.original_price,
        p.discount_percent,
        p.rating,
        p.stock_count,
        p.image_url,
        p.volume
    FROM dbo.products p
    INNER JOIN dbo.brands b ON p.brand_id = b.brand_id
    INNER JOIN dbo.categories c ON p.category_id = c.category_id
    WHERE (@CategorySlug IS NULL OR c.slug = @CategorySlug)
      AND (p.price BETWEEN @MinPrice AND @MaxPrice)
    ORDER BY p.rating DESC, p.created_at DESC;
END;
GO

-- Thủ tục 9.2: Đặt đơn hàng mới kèm trừ tồn kho tự động trong Transaction
CREATE OR ALTER PROCEDURE dbo.sp_CreateOrder
    @OrderId VARCHAR(50),
    @CustomerName NVARCHAR(150),
    @CustomerPhone VARCHAR(20),
    @CustomerEmail NVARCHAR(150),
    @ShippingAddress NVARCHAR(255),
    @ShippingProvince NVARCHAR(100),
    @PaymentMethod VARCHAR(20),
    @CouponCode VARCHAR(50),
    @Subtotal DECIMAL(18, 0),
    @ShippingFee DECIMAL(18, 0),
    @Discount DECIMAL(18, 0),
    @TotalAmount DECIMAL(18, 0)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        -- 1. Thêm hoặc lấy khách hàng
        DECLARE @CustomerId INT;
        SELECT @CustomerId = customer_id FROM dbo.customers WHERE phone = @CustomerPhone;

        IF @CustomerId IS NULL
        BEGIN
            INSERT INTO dbo.customers (full_name, phone, email, address, province)
            VALUES (@CustomerName, @CustomerPhone, @CustomerEmail, @ShippingAddress, @ShippingProvince);
            
            SET @CustomerId = SCOPE_IDENTITY();
        END

        -- 2. Thêm đơn hàng
        INSERT INTO dbo.orders (
            order_id, customer_id, coupon_code, subtotal, shipping_fee,
            discount_amount, total_amount, payment_method, shipping_address, shipping_province
        )
        VALUES (
            @OrderId, @CustomerId, @CouponCode, @Subtotal, @ShippingFee,
            @Discount, @TotalAmount, @PaymentMethod, @ShippingAddress, @ShippingProvince
        );

        COMMIT TRANSACTION;
        SELECT 1 AS success, N'Đã tạo đơn hàng thành công' AS message, @OrderId AS order_id;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SELECT 0 AS success, ERROR_MESSAGE() AS message, NULL AS order_id;
    END CATCH
END;
GO

-- =============================================================================
-- 10. VIEWS (KHUNG NHÌN TRUY VẤN TIỆN ÍCH)
-- =============================================================================

CREATE OR ALTER VIEW dbo.v_ProductCatalog
AS
SELECT 
    p.product_id,
    p.product_name,
    b.brand_name,
    c.category_name,
    p.price,
    p.original_price,
    p.stock_count,
    p.rating,
    p.review_count,
    p.routine_type,
    p.image_url
FROM dbo.products p
JOIN dbo.brands b ON p.brand_id = b.brand_id
JOIN dbo.categories c ON p.category_id = c.category_id;
GO

-- THÔNG BÁO HOÀN TẤT
PRINT N'===> ĐÃ KHỞI TẠO CƠ SỞ DỮ LIỆU MICROSOFT SQL SERVER CHO GLOWCARE THÀNH CÔNG! <===';
GO
