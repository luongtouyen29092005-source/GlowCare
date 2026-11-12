-- =============================================================================
-- HỆ THỐNG CƠ SỞ DỮ LIỆU CỬA HÀNG DƯỢC MỸ PHẨM GLOWCARE SKINCARE
-- Hệ quản trị CSDL: MySQL / MariaDB (XAMPP, phpMyAdmin, MySQL Workbench, DBeaver)
-- Chuẩn mã hóa: utf8mb4_unicode_ci (Hỗ trợ Tiếng Việt trọn vẹn)
-- =============================================================================

-- 1. KHỞI TẠO CƠ SỞ DỮ LIỆU
CREATE DATABASE IF NOT EXISTS `glowcare_skincare_db`
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `glowcare_skincare_db`;

-- 2. XÓA CÁC BẢNG CŨ (THEO THỨ TỰ KHÓA NGOẠI)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `product_skin_types`;
DROP TABLE IF EXISTS `product_ingredients`;
DROP TABLE IF EXISTS `product_usage_steps`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `brands`;
DROP TABLE IF EXISTS `skin_types`;
DROP TABLE IF EXISTS `ingredients`;
DROP TABLE IF EXISTS `coupons`;
DROP TABLE IF EXISTS `role_permissions`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `permissions`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `customers`;
SET FOREIGN_KEY_CHECKS = 1;

-- 3. BẢNG DANH MỤC & THUỘC TÍNH NỀN TẢNG
CREATE TABLE `categories` (
    `category_id` INT AUTO_INCREMENT PRIMARY KEY,
    `category_name` VARCHAR(100) NOT NULL UNIQUE,
    `slug` VARCHAR(120) NOT NULL UNIQUE,
    `description` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `brands` (
    `brand_id` INT AUTO_INCREMENT PRIMARY KEY,
    `brand_name` VARCHAR(100) NOT NULL UNIQUE,
    `country` VARCHAR(50) DEFAULT 'Việt Nam',
    `description` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `skin_types` (
    `skin_type_id` INT AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(50) NOT NULL UNIQUE,
    `type_name` VARCHAR(100) NOT NULL,
    `characteristics` TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `ingredients` (
    `ingredient_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL UNIQUE,
    `function_desc` TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. BẢNG SẢN PHẨM & QUAN HỆ
CREATE TABLE `products` (
    `product_id` VARCHAR(50) PRIMARY KEY,
    `product_name` VARCHAR(255) NOT NULL,
    `brand_id` INT NOT NULL,
    `category_id` INT NOT NULL,
    `price` DECIMAL(12, 0) NOT NULL,
    `original_price` DECIMAL(12, 0) NOT NULL,
    `discount_percent` INT DEFAULT 0,
    `rating` DECIMAL(2, 1) DEFAULT 5.0,
    `review_count` INT DEFAULT 0,
    `stock_count` INT DEFAULT 0,
    `is_featured` BOOLEAN DEFAULT FALSE,
    `is_best_seller` BOOLEAN DEFAULT FALSE,
    `is_new` BOOLEAN DEFAULT FALSE,
    `image_url` VARCHAR(500) NOT NULL,
    `volume` VARCHAR(50) NOT NULL,
    `usage_step` VARCHAR(150) NULL,
    `routine_type` ENUM('AM', 'PM', 'Both') DEFAULT 'Both',
    `short_desc` TEXT NOT NULL,
    `full_desc` LONGTEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_products_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`) ON UPDATE CASCADE,
    CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_skin_types` (
    `product_id` VARCHAR(50) NOT NULL,
    `skin_type_id` INT NOT NULL,
    PRIMARY KEY (`product_id`, `skin_type_id`),
    CONSTRAINT `fk_pst_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_pst_skintype` FOREIGN KEY (`skin_type_id`) REFERENCES `skin_types` (`skin_type_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_ingredients` (
    `product_id` VARCHAR(50) NOT NULL,
    `ingredient_id` INT NOT NULL,
    PRIMARY KEY (`product_id`, `ingredient_id`),
    CONSTRAINT `fk_pi_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_pi_ingredient` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`ingredient_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. KHÁCH HÀNG & MÃ GIẢM GIÁ
CREATE TABLE `customers` (
    `customer_id` INT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `email` VARCHAR(150) NULL,
    `address` VARCHAR(255) NOT NULL,
    `province` VARCHAR(100) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_customer_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `coupons` (
    `coupon_id` INT AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(50) NOT NULL UNIQUE,
    `discount_percent` INT NULL DEFAULT 0,
    `discount_amount` DECIMAL(12, 0) NULL DEFAULT 0,
    `free_shipping` BOOLEAN DEFAULT FALSE,
    `min_order_value` DECIMAL(12, 0) DEFAULT 0,
    `description` VARCHAR(255) NOT NULL,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `reviews` (
    `review_id` VARCHAR(50) PRIMARY KEY,
    `product_id` VARCHAR(50) NOT NULL,
    `user_name` VARCHAR(150) NOT NULL,
    `rating` INT NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
    `comment` TEXT NOT NULL,
    `skin_type_id` INT NULL,
    `verified_purchase` BOOLEAN DEFAULT TRUE,
    `review_date` DATE NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_reviews_skintype` FOREIGN KEY (`skin_type_id`) REFERENCES `skin_types` (`skin_type_id`) ON SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. ĐƠN HÀNG
CREATE TABLE `orders` (
    `order_id` VARCHAR(50) PRIMARY KEY,
    `customer_id` INT NOT NULL,
    `coupon_code` VARCHAR(50) NULL,
    `subtotal` DECIMAL(12, 0) NOT NULL,
    `shipping_fee` DECIMAL(12, 0) NOT NULL DEFAULT 30000,
    `discount_amount` DECIMAL(12, 0) NOT NULL DEFAULT 0,
    `total_amount` DECIMAL(12, 0) NOT NULL,
    `payment_method` ENUM('COD', 'VIETQR', 'MOMO', 'VNPAY') NOT NULL DEFAULT 'VIETQR',
    `order_status` ENUM('Chờ xác nhận', 'Đang đóng gói', 'Đang giao hàng', 'Đã hoàn thành', 'Đã hủy') DEFAULT 'Chờ xác nhận',
    `payment_status` ENUM('Chờ thanh toán', 'Đã thanh toán', 'Đã hoàn tiền') DEFAULT 'Chờ thanh toán',
    `shipping_address` VARCHAR(255) NOT NULL,
    `shipping_province` VARCHAR(100) NOT NULL,
    `note` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_orders_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `order_items` (
    `order_item_id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` VARCHAR(50) NOT NULL,
    `product_id` VARCHAR(50) NOT NULL,
    `product_name` VARCHAR(255) NOT NULL,
    `unit_price` DECIMAL(12, 0) NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    `line_total` DECIMAL(12, 0) NOT NULL,
    CONSTRAINT `fk_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. PHÂN QUYỀN RBAC
CREATE TABLE `roles` (
    `role_id` INT AUTO_INCREMENT PRIMARY KEY,
    `role_code` VARCHAR(50) NOT NULL UNIQUE,
    `role_name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `permissions` (
    `permission_id` INT AUTO_INCREMENT PRIMARY KEY,
    `permission_code` VARCHAR(100) NOT NULL UNIQUE,
    `module` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `role_permissions` (
    `role_id` INT NOT NULL,
    `permission_id` INT NOT NULL,
    PRIMARY KEY (`role_id`, `permission_id`),
    CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_rp_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`permission_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `users` (
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(100) NOT NULL UNIQUE,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `avatar_url` VARCHAR(500) NULL,
    `customer_id` INT NULL,
    `role_id` INT NOT NULL,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON UPDATE CASCADE,
    CONSTRAINT `fk_users_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. DỮ LIỆU MẪU (SEED DATA)
INSERT INTO `categories` (`category_name`, `slug`, `description`) VALUES
('Làm sạch', 'lam-sach', 'Sữa rửa mặt, dầu tẩy trang và sáp tẩy trang loại bỏ bã nhờn'),
('Toner & Nước cân bằng', 'toner-can-bang', 'Cân bằng độ pH và làm dịu màng da'),
('Serum & Tinh chất', 'serum-tinh-chat', 'Hoạt chất cô đặc phục hồi và làm sáng da'),
('Kem dưỡng ẩm', 'kem-duong-am', 'Khóa ẩm và tái tạo hàng rào lipid'),
('Chống nắng', 'chong-nang', 'Bảo vệ da phổ rộng khỏi tia UVA, UVB'),
('Đặc trị & Tẩy da chết', 'dac-tri-tay-da-chet', 'BHA, AHA, Retinoids tái tạo da');

INSERT INTO `brands` (`brand_name`, `country`) VALUES
('La Roche-Posay', 'Pháp'),
('Paula''s Choice', 'Mỹ'),
('Klairs', 'Hàn Quốc'),
('Skin1004', 'Hàn Quốc'),
('Anessa', 'Nhật Bản');

INSERT INTO `skin_types` (`code`, `type_name`, `characteristics`) VALUES
('OILY', 'Da dầu', 'Tuyến bã nhờn hoạt động mạnh, bóng dầu chữ T'),
('DRY', 'Da khô', 'Thiếu ẩm, dễ bong tróc và căng rát'),
('SENSITIVE', 'Da nhạy cảm', 'Dễ mẩn đỏ, rát buốt khi tiếp xúc hoạt chất mạnh'),
('ACNE', 'Da mụn', 'Tắc nghẽn chân lông, có mụn ẩn và mụn viêm'),
('COMBINATION', 'Da hỗn hợp', 'Dầu vùng chữ T, khô vùng chữ U'),
('ALL', 'Mọi loại da', 'Lành tính, dùng an toàn cho mọi nền da');

INSERT INTO `ingredients` (`name`, `function_desc`) VALUES
('Niacinamide (Vitamin B3)', 'Kiểm soát dầu, se khít lỗ chân lông và làm đều màu da'),
('Salicylic Acid (BHA 2%)', 'Thâm nhập sâu làm sạch lỗ chân lông, tiêu sừng'),
('Hyaluronic Acid (HA)', 'Cấp nước đa tầng, duy trì độ căng bóng'),
('Centella Asiatica (Rau má)', 'Kháng viêm, làm dịu tổn thương và tái sinh mô da');

INSERT INTO `roles` (`role_code`, `role_name`, `description`) VALUES
('SUPER_ADMIN', 'Quản trị viên Cấp cao', 'Toàn quyền điều hành website'),
('WAREHOUSE_STAFF', 'Thủ kho', 'Quản lý số lượng xuất - nhập tồn kho'),
('SALES_STAFF', 'Nhân viên Bán hàng', 'Xử lý đơn hàng của người mua'),
('CUSTOMER', 'Khách hàng', 'Mua sắm và theo dõi đơn cá nhân');

INSERT INTO `permissions` (`permission_code`, `module`, `description`) VALUES
('product:view', 'PRODUCT', 'Xem danh sách sản phẩm'),
('inventory:update_stock', 'INVENTORY', 'Chỉnh sửa tồn kho'),
('order:view_all', 'ORDER', 'Xem toàn bộ đơn hàng'),
('order:update_status', 'ORDER', 'Chuyển trạng thái đơn hàng'),
('user:manage', 'USER', 'Quản trị tài khoản');

INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(2, 1), (2, 2),
(3, 1), (3, 3), (3, 4),
(4, 1);

INSERT INTO `users` (`username`, `email`, `password_hash`, `full_name`, `phone`, `role_id`) VALUES
('admin', 'admin@glowcare.vn', '$2a$12$eX1SampleAdminHash99999', 'Nguyễn Quản Trị (Super Admin)', '0901234567', 1),
('thukho', 'warehouse@glowcare.vn', '$2a$12$eX1SampleKhoHash88888', 'Trần Thủ Kho (Kho Vận)', '0912345678', 2),
('sales', 'sales@glowcare.vn', '$2a$12$eX1SampleSalesHash77777', 'Lê Bán Hàng (Tư Vấn Viên)', '0923456789', 3),
('khachhang', 'khachhang@gmail.com', '$2a$12$eX1SampleCustomerHash66', 'Phạm Thu Uyên (Khách Thân Thiết)', '0987654321', 4);

INSERT INTO `products` (
    `product_id`, `product_name`, `brand_id`, `category_id`, `price`, `original_price`, 
    `discount_percent`, `rating`, `review_count`, `stock_count`, `is_featured`, `is_best_seller`, 
    `is_new`, `image_url`, `volume`, `usage_step`, `routine_type`, `short_desc`, `full_desc`
) VALUES
(
    'laroche-effaclar-gel',
    'Gel Rửa Mặt Giảm Nhờn Cho Da Dầu Mụn La Roche-Posay Effaclar Gel',
    1, 1, 385000, 460000, 16, 4.9, 128, 45, 1, 1, 0,
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    '200ml', 'Bước 1: Làm sạch da (Sáng & Tối)', 'Both',
    'Sữa rửa mặt dạng gel tạo bọt dịu nhẹ, chứa Kẽm PCA giúp làm sạch dầu thừa.',
    'Dành riêng cho làn da dầu mụn nhạy cảm. Giữ độ pH cân bằng 5.5.'
),
(
    'paulas-choice-bha-2',
    'Dung Dịch Tẩy Tế Bào Chết Paula''s Choice 2% BHA Liquid',
    2, 6, 810000, 950000, 15, 4.8, 256, 18, 1, 1, 0,
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    '118ml', 'Bước 3: Tẩy da chết hóa học (Buổi tối)', 'PM',
    'Chứa 2% Salicylic Acid tan trong dầu, làm sạch sâu cổ nang lông giảm bã nhờn.',
    'Giúp mờ mụn đầu đen, thu nhỏ chân lông và tái cấu trúc làn da.'
);

INSERT INTO `coupons` (`code`, `discount_percent`, `min_order_value`, `description`) VALUES
('GLOW20', 20, 300000, 'Ưu đãi giảm 20% cho đơn từ 300.000 ₫'),
('FREESHIP', 0, 200000, 'Miễn phí vận chuyển toàn quốc');
UPDATE `coupons` SET `free_shipping` = TRUE WHERE `code` = 'FREESHIP';
