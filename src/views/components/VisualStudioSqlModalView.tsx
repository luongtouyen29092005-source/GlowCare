import React, { useState, useEffect } from 'react';
import { visualStudioModalController } from '../../controllers/VisualStudioModalController';
import { notificationController } from '../../controllers/NotificationController';
import { exportProjectAsZip } from '../../utils/projectZipExporter';
import { 
  X, 
  Terminal, 
  Database, 
  Copy, 
  Check, 
  Download, 
  Code2, 
  Play, 
  Laptop, 
  FileCode2, 
  FolderOpen, 
  ExternalLink,
  ShieldCheck,
  Server,
  Layers,
  Sparkles,
  Loader2,
  PackageCheck
} from 'lucide-react';

export const VisualStudioSqlModalView: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'aspnet' | 'vscode' | 'mssql' | 'mysql' | 'code'>('aspnet');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedCodeView, setSelectedCodeView] = useState<'mssql' | 'mysql' | 'server' | 'vscode_launch'>('mssql');
  const [isExportingZip, setIsExportingZip] = useState(false);

  useEffect(() => {
    const unsub = visualStudioModalController.subscribe((open, tab) => {
      setIsOpen(open);
      setActiveTab(tab);
    });
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const handleDownloadFullZip = async () => {
    try {
      setIsExportingZip(true);
      notificationController.show('info', 'Đang nén dự án...', 'Hệ thống đang đóng gói toàn bộ code, file .sln và SQL thành file .ZIP');
      await exportProjectAsZip();
      notificationController.show('success', 'Tải thành công!', 'File GlowCare_Skincare_MVC_VisualStudio.zip đã được tải về máy.');
    } catch (err) {
      notificationController.show('error', 'Lỗi tải file', 'Không thể tạo file zip, vui lòng thử lại.');
    } finally {
      setIsExportingZip(false);
    }
  };

  const copyToClipboard = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    notificationController.show('success', 'Đã sao chép!', `Nội dung ${label} đã được lưu vào clipboard`);
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2000);
  };

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    notificationController.show('success', 'Đang tải file', `Tệp ${filename} đã được tải về máy của bạn.`);
  };

  // Sample scripts for quick copy/preview
  const mssqlSnippet = `-- 1. TẠO CƠ SỞ DỮ LIỆU MICROSOFT SQL SERVER
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'glowcare_skincare_db')
BEGIN
    CREATE DATABASE glowcare_skincare_db;
END
GO

USE glowcare_skincare_db;
GO

-- 2. TẠO BẢNG SẢN PHẨM (CHUẨN T-SQL, NVARCHAR, IDENTITY, BIT)
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
    image_url NVARCHAR(500) NOT NULL,
    volume NVARCHAR(50) NOT NULL,
    usage_step NVARCHAR(150) NULL,
    routine_type VARCHAR(10) DEFAULT 'Both',
    short_desc NVARCHAR(1000) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE()
);
GO

-- 3. STORED PROCEDURE LẤY SẢN PHẨM THEO DANH MỤC
CREATE OR ALTER PROCEDURE dbo.sp_GetProductsByCategory
    @CategorySlug VARCHAR(120) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SELECT p.*, b.brand_name, c.category_name
    FROM dbo.products p
    JOIN dbo.brands b ON p.brand_id = b.brand_id
    JOIN dbo.categories c ON p.category_id = c.category_id
    WHERE (@CategorySlug IS NULL OR c.slug = @CategorySlug)
    ORDER BY p.rating DESC;
END;
GO`;

  const mysqlSnippet = `-- 1. TẠO CƠ SỞ DỮ LIỆU MYSQL / PHPMYADMIN
CREATE DATABASE IF NOT EXISTS \`glowcare_skincare_db\`
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE \`glowcare_skincare_db\`;

-- 2. TẠO BẢNG SẢN PHẨM (INNODB, UTF8MB4)
CREATE TABLE \`products\` (
    \`product_id\` VARCHAR(50) PRIMARY KEY,
    \`product_name\` VARCHAR(255) NOT NULL,
    \`brand_id\` INT NOT NULL,
    \`category_id\` INT NOT NULL,
    \`price\` DECIMAL(12, 0) NOT NULL,
    \`original_price\` DECIMAL(12, 0) NOT NULL,
    \`discount_percent\` INT DEFAULT 0,
    \`rating\` DECIMAL(2, 1) DEFAULT 5.0,
    \`review_count\` INT DEFAULT 0,
    \`stock_count\` INT DEFAULT 0,
    \`is_featured\` BOOLEAN DEFAULT FALSE,
    \`image_url\` VARCHAR(500) NOT NULL,
    \`volume\` VARCHAR(50) NOT NULL,
    \`usage_step\` VARCHAR(150) NULL,
    \`routine_type\` ENUM('AM', 'PM', 'Both') DEFAULT 'Both',
    \`short_desc\` TEXT NOT NULL,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

  const vscodeLaunchSnippet = `{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "🚀 Chạy GlowCare Web (npm run dev)",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev",
      "serverReadyAction": {
        "pattern": "http://localhost:3000",
        "uriFormat": "http://localhost:3000",
        "action": "openExternally"
      }
    },
    {
      "name": "⚡ Chạy Express Backend Server (server.ts)",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npx",
      "runtimeArgs": ["tsx", "server.ts"],
      "console": "integratedTerminal"
    }
  ]
}`;

  return (
    <div
      id="visual-studio-sql-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6"
      onClick={() => visualStudioModalController.close()}
    >
      <div
        className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-stone-200 my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-base sm:text-lg text-white">
                  Chạy Dự Án Trên Visual Studio & Hệ CSDL SQL
                </h2>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 font-mono px-2 py-0.5 rounded-full border border-rose-500/30">
                  FULL GUIDE & SCRIPTS
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Hướng dẫn cài đặt từ A-Z trên máy tính cho Visual Studio Code, Visual Studio 2022, SQL Server & MySQL
              </p>
            </div>
          </div>
          <button
            id="close-vs-modal-btn"
            onClick={() => visualStudioModalController.close()}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Đóng hướng dẫn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => visualStudioModalController.setTab('aspnet')}
            className={`flex items-center gap-2 px-5 py-3.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'aspnet'
                ? 'border-purple-600 text-purple-700 bg-white font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-100/50'
            }`}
          >
            <Code2 className="w-4 h-4 text-purple-600" />
            <span>🔷 ASP.NET Core 8 MVC (C# & EF Core)</span>
          </button>
          <button
            onClick={() => visualStudioModalController.setTab('vscode')}
            className={`flex items-center gap-2 px-5 py-3.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'vscode'
                ? 'border-rose-600 text-rose-700 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-100/50'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>React / Node MVC</span>
          </button>
          <button
            onClick={() => visualStudioModalController.setTab('mssql')}
            className={`flex items-center gap-2 px-5 py-3.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'mssql'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-100/50'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>2. Microsoft SQL Server (SSMS)</span>
          </button>
          <button
            onClick={() => visualStudioModalController.setTab('mysql')}
            className={`flex items-center gap-2 px-5 py-3.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'mysql'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-100/50'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>3. MySQL / XAMPP</span>
          </button>
          <button
            onClick={() => visualStudioModalController.setTab('code')}
            className={`flex items-center gap-2 px-5 py-3.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'code'
                ? 'border-indigo-600 text-indigo-700 bg-white'
                : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-100/50'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>4. Tải & Xem Mã Nguồn SQL</span>
          </button>
        </div>

        {/* Quick Download ZIP Header Banner */}
        <div className="mx-5 sm:mx-6 mt-4 p-4 rounded-2xl bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-rose-800/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-300 shrink-0">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm sm:text-base">
                  Tải Trọn Bộ Mã Nguồn Dự Án (.ZIP)
                </span>
                <span className="bg-amber-400 text-stone-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  1-Click Ready
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                Bao gồm toàn bộ React, Express, Models, Views, Controllers, GlowCare.sln, schema_mssql.sql & schema_mysql.sql
              </p>
            </div>
          </div>
          <button
            onClick={handleDownloadFullZip}
            disabled={isExportingZip}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95 disabled:opacity-50"
          >
            {isExportingZip ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang đóng gói file...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>TẢI FILE .ZIP VỀ MÁY</span>
              </>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB ASP.NET CORE MVC */}
          {activeTab === 'aspnet' && (
            <div className="space-y-5">
              <div className="bg-purple-50/90 border border-purple-200 rounded-2xl p-4 text-xs text-purple-950 flex items-start gap-3">
                <Code2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-sm">Kiến Trúc ASP.NET Core 8 MVC (C# & Entity Framework Core & SQL Server)</p>
                  <p className="text-stone-700 leading-relaxed">
                    Dự án đã được tạo sẵn trọn bộ cấu trúc chuẩn theo môn học Lập trình Web ASP.NET Core: File Solution <b>GlowCare.sln</b>, Project <b>GlowCare_AspNetCore_MVC.csproj</b> (.NET 8.0), Các Controller C# (<b>HomeController, ProductsController, CartController, AccountController, AdminController</b>), <b>ApplicationDbContext</b> kết nối SQL Server và giao diện Razor Views (<b>.cshtml</b>).
                  </p>
                </div>
              </div>

              {/* 3 Simple Steps */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm">
                      Bấm nút Tải File .ZIP ở trên & Giải nén vào thư mục repos
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 pl-8">
                    Bấm nút màu cam <b>[TẢI FILE .ZIP VỀ MÁY]</b> ở trên -&gt; Giải nén vào thư mục: <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono text-purple-700 font-bold">C:\Users\DELL\source\repos\GlowCare</code>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm">
                      Mở trong Visual Studio (Cửa sổ trên màn hình của bạn)
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 pl-8">
                    Tại màn hình <b>Get started</b> của Visual Studio, bấm dòng thứ 2: <b>Open a project or solution</b> -&gt; Chọn tệp: <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono font-bold text-stone-900">GlowCare.sln</code> (hoặc bấm <i>Open a folder</i> trỏ vào thư mục vừa giải nén).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm">
                      Nhấn phím F5 (Hoặc nút Run màu xanh trên Visual Studio)
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 pl-8">
                    Visual Studio sẽ tự động restore các gói NuGet <b>Microsoft.EntityFrameworkCore.SqlServer</b>, biên dịch mã nguồn C# và khởi chạy trang web ASP.NET Core MVC trên trình duyệt của bạn!
                  </p>
                  <div className="pl-8 pt-1">
                    <div className="p-3 bg-stone-900 text-white rounded-xl font-mono text-xs space-y-1">
                      <div className="text-stone-400">// Hoặc chạy lệnh trong Developer PowerShell / Terminal:</div>
                      <div className="text-emerald-400">cd aspnetcore_mvc</div>
                      <div className="text-emerald-400">dotnet run</div>
                    </div>
                  </div>
                </div>

                {/* Structure details */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Cấu trúc thư mục ASP.NET Core MVC tạo sẵn trong file ZIP:</h4>
                  <div className="font-mono text-xs text-stone-600 space-y-1 bg-white p-3 rounded-xl border border-stone-200">
                    <div>📂 <b>GlowCare.sln</b> (Visual Studio Solution File)</div>
                    <div>📂 <b>aspnetcore_mvc/</b></div>
                    <div>├── 📄 <b>GlowCare_AspNetCore_MVC.csproj</b> (.NET 8.0)</div>
                    <div>├── 📄 <b>Program.cs</b> (Config EF Core, Session, Cookie Auth)</div>
                    <div>├── 📄 <b>appsettings.json</b> (Chuỗi kết nối SQL Server localhost / SQLEXPRESS)</div>
                    <div>├── 📂 <b>Models/</b> (Product.cs, Category.cs, Order.cs, User.cs, CartItem.cs)</div>
                    <div>├── 📂 <b>Data/</b> (ApplicationDbContext.cs kết nối CSDL và Seed Data)</div>
                    <div>├── 📂 <b>Controllers/</b> (HomeController, ProductsController, CartController, AccountController, AdminController)</div>
                    <div>└── 📂 <b>Views/</b> (_Layout.cshtml, Home/Index.cshtml, Cart/Index.cshtml, Admin/Index.cshtml)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: VISUAL STUDIO / VS CODE */}
          {activeTab === 'vscode' && (
            <div className="space-y-5">
              <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-4 text-xs text-rose-950 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-sm">Chạy trên máy tính chỉ với 3 lệnh đơn giản</p>
                  <p className="text-stone-700 leading-relaxed">
                    Dự án đã được đóng gói sẵn file cấu hình gỡ lỗi <b>.vscode/launch.json</b> và <b>tasks.json</b>. Bạn có thể mở bằng <b>Visual Studio Code</b> hoặc <b>Visual Studio 2022 (Open Folder)</b> và nhấn <b>F5</b> để chạy ngay!
                  </p>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm">
                      Mở thư mục trong Visual Studio Code hoặc Visual Studio 2022
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 pl-8">
                    Khởi động <b>VS Code</b> -&gt; Chọn menu <b>File</b> -&gt; <b>Open Folder...</b> -&gt; Trỏ tới thư mục chứa toàn bộ code của dự án.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm">
                      Cài đặt thư viện dependencies
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 pl-8">
                    Mở Terminal trong VS Code (phím tắt: <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono text-stone-800">Ctrl + `</code>) và chạy lệnh:
                  </p>
                  <div className="pl-8 pt-1">
                    <div className="bg-stone-900 text-stone-100 p-3 rounded-xl font-mono text-xs flex items-center justify-between">
                      <code>npm install</code>
                      <button
                        onClick={() => copyToClipboard('npm install', 'cmd-install', 'Lệnh npm install')}
                        className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-md text-[11px] flex items-center gap-1.5 transition-colors"
                      >
                        {copiedKey === 'cmd-install' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'cmd-install' ? 'Đã chép' : 'Sao chép'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm">
                      Khởi chạy giao diện và máy chủ
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 pl-8">
                    Bạn có thể chọn 1 trong 2 chế độ sau:
                  </p>
                  <div className="pl-8 grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-stone-900">Chế độ Vite Dev (Nhanh nhất)</span>
                        <Play className="w-3.5 h-3.5 text-rose-600" />
                      </div>
                      <div className="bg-stone-900 text-stone-100 p-2 rounded-lg font-mono text-[11px] flex items-center justify-between">
                        <code>npm run dev</code>
                        <button
                          onClick={() => copyToClipboard('npm run dev', 'cmd-dev', 'Lệnh npm run dev')}
                          className="text-stone-400 hover:text-white"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-500">Mở trình duyệt tại <b>http://localhost:3000</b></p>
                    </div>

                    <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-stone-900">Chế độ Express Fullstack (server.ts)</span>
                        <Server className="w-3.5 h-3.5 text-indigo-600" />
                      </div>
                      <div className="bg-stone-900 text-stone-100 p-2 rounded-lg font-mono text-[11px] flex items-center justify-between">
                        <code>npx tsx server.ts</code>
                        <button
                          onClick={() => copyToClipboard('npx tsx server.ts', 'cmd-server', 'Lệnh chạy Express server')}
                          className="text-stone-400 hover:text-white"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-500">Chạy kèm RESTful API và kết nối CSDL SQL</p>
                    </div>
                  </div>
                </div>

                {/* Hotkey Tip */}
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-indigo-950 flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    <b>Mẹo phím tắt VS Code</b>: Nhấn phím <b>F5</b> hoặc chuyển sang tab <b>Run & Debug</b> để chạy tự động không cần gõ lệnh.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MICROSOFT SQL SERVER */}
          {activeTab === 'mssql' && (
            <div className="space-y-5">
              <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 text-xs text-blue-950 flex items-start gap-3">
                <Database className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-sm">Hướng dẫn Microsoft SQL Server (T-SQL / SSMS / Visual Studio)</p>
                  <p className="text-stone-700 leading-relaxed">
                    Dành cho các bài báo cáo, đồ án môn học Cơ sở dữ liệu và Lập trình ứng dụng trên Windows / .NET. Script <b>schema_mssql.sql</b> đã được tối ưu 100% cú pháp Transact-SQL với kiểu dữ liệu <b>NVARCHAR</b> lưu tiếng Việt trọn vẹn.
                  </p>
                </div>
              </div>

              {/* Steps for SQL Server */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm">
                      Mở SQL Server Management Studio (SSMS) hoặc Visual Studio
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 pl-8">
                    Kết nối vào SQL Server cục bộ (ví dụ: <code className="bg-stone-100 px-1 rounded font-mono">localhost</code> hoặc <code className="bg-stone-100 px-1 rounded font-mono">.\SQLEXPRESS</code>).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm">
                      Mở file schema_mssql.sql và nhấn Execute (F5)
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 pl-8">
                    Trong SSMS, nhấn <b>Ctrl + O</b> và mở tệp <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono font-bold text-blue-700">schema_mssql.sql</code> trong thư mục dự án. Nhấn nút <b>Execute (F5)</b>.
                  </p>
                  <div className="pl-8 pt-1 flex items-center gap-2">
                    <button
                      onClick={() => visualStudioModalController.setTab('code')}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <FileCode2 className="w-3.5 h-3.5" />
                      <span>Xem nội dung file schema_mssql.sql</span>
                    </button>
                    <button
                      onClick={() => downloadFile('schema_mssql.sql', mssqlSnippet, 'application/sql')}
                      className="px-3 py-1.5 bg-stone-100 text-stone-800 hover:bg-stone-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải về file .sql</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm">
                      Kết quả cơ sở dữ liệu sau khi chạy
                    </h3>
                  </div>
                  <div className="pl-8 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs pt-1">
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                      <div className="text-[11px] text-stone-500">Tên CSDL</div>
                      <div className="font-bold text-stone-900">glowcare_db</div>
                    </div>
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                      <div className="text-[11px] text-stone-500">Số bảng 3NF</div>
                      <div className="font-bold text-blue-700">16 bảng</div>
                    </div>
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                      <div className="text-[11px] text-stone-500">Thủ tục lưu trữ</div>
                      <div className="font-bold text-emerald-700">Stored Procedures</div>
                    </div>
                    <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                      <div className="text-[11px] text-stone-500">Bảo mật</div>
                      <div className="font-bold text-amber-700">RBAC 4 vai trò</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MYSQL / XAMPP */}
          {activeTab === 'mysql' && (
            <div className="space-y-5">
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 flex items-start gap-3">
                <Server className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-sm">Hướng dẫn MySQL / MariaDB (XAMPP & phpMyAdmin)</p>
                  <p className="text-stone-700 leading-relaxed">
                    Dành cho các bạn sử dụng XAMPP, WampServer, Laragon hoặc MySQL Workbench. Script <b>schema_mysql.sql</b> sử dụng bảng mã <b>utf8mb4_unicode_ci</b> và Engine <b>InnoDB</b> đảm bảo toàn vẹn dữ liệu.
                  </p>
                </div>
              </div>

              {/* Steps for MySQL */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm">
                      Khởi động dịch vụ trong XAMPP Control Panel
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 pl-8">
                    Mở <b>XAMPP Control Panel</b> -&gt; Bấm <b>Start</b> ở 2 dòng <b>Apache</b> và <b>MySQL</b>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm">
                      Mở phpMyAdmin và Import file schema_mysql.sql
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 pl-8">
                    Truy cập vào <code className="bg-stone-100 px-1.5 py-0.5 rounded font-mono font-bold text-emerald-700">http://localhost/phpmyadmin</code> trên trình duyệt -&gt; Chọn tab <b>Import (Nhập)</b> -&gt; Chọn tệp <b>schema_mysql.sql</b> và bấm <b>Thực hiện (Import)</b>.
                  </p>
                  <div className="pl-8 pt-1 flex items-center gap-2">
                    <button
                      onClick={() => visualStudioModalController.setTab('code')}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <FileCode2 className="w-3.5 h-3.5" />
                      <span>Xem nội dung file schema_mysql.sql</span>
                    </button>
                    <button
                      onClick={() => downloadFile('schema_mysql.sql', mysqlSnippet, 'application/sql')}
                      className="px-3 py-1.5 bg-stone-100 text-stone-800 hover:bg-stone-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải về file .sql</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm">
                      Cấu hình file .env để kết nối MySQL
                    </h3>
                  </div>
                  <div className="pl-8 pt-1">
                    <div className="bg-stone-900 text-stone-100 p-3 rounded-xl font-mono text-xs space-y-1">
                      <div>DB_TYPE=mysql</div>
                      <div>DB_HOST=localhost</div>
                      <div>DB_PORT=3306</div>
                      <div>DB_USER=root</div>
                      <div>DB_PASSWORD=</div>
                      <div>DB_NAME=glowcare_skincare_db</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CODE PREVIEW & DOWNLOAD */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              {/* File selector buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedCodeView('mssql')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedCodeView === 'mssql'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  schema_mssql.sql (SQL Server)
                </button>
                <button
                  onClick={() => setSelectedCodeView('mysql')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedCodeView === 'mysql'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  schema_mysql.sql (MySQL)
                </button>
                <button
                  onClick={() => setSelectedCodeView('vscode_launch')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedCodeView === 'vscode_launch'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  .vscode/launch.json
                </button>
              </div>

              {/* Code viewer box */}
              <div className="border border-stone-200 rounded-2xl overflow-hidden bg-stone-950 text-stone-200">
                <div className="px-4 py-2.5 bg-stone-900 border-b border-stone-800 flex items-center justify-between text-xs">
                  <span className="font-mono text-stone-300">
                    {selectedCodeView === 'mssql' && 'schema_mssql.sql - Microsoft SQL Server (T-SQL)'}
                    {selectedCodeView === 'mysql' && 'schema_mysql.sql - MySQL / phpMyAdmin'}
                    {selectedCodeView === 'vscode_launch' && '.vscode/launch.json - VS Code Debug Config'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const content =
                          selectedCodeView === 'mssql'
                            ? mssqlSnippet
                            : selectedCodeView === 'mysql'
                            ? mysqlSnippet
                            : vscodeLaunchSnippet;
                        copyToClipboard(content, 'code-preview', 'mã nguồn');
                      }}
                      className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-[11px] flex items-center gap-1.5 transition-colors"
                    >
                      {copiedKey === 'code-preview' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'code-preview' ? 'Đã sao chép' : 'Sao chép toàn bộ'}</span>
                    </button>
                    <button
                      onClick={() => {
                        if (selectedCodeView === 'mssql') {
                          downloadFile('schema_mssql.sql', mssqlSnippet, 'application/sql');
                        } else if (selectedCodeView === 'mysql') {
                          downloadFile('schema_mysql.sql', mysqlSnippet, 'application/sql');
                        } else {
                          downloadFile('launch.json', vscodeLaunchSnippet, 'application/json');
                        }
                      }}
                      className="px-2.5 py-1 bg-rose-700 hover:bg-rose-600 text-white rounded text-[11px] flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải về file</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 font-mono text-xs overflow-x-auto max-h-80 leading-relaxed text-stone-300">
                  <pre>
                    {selectedCodeView === 'mssql' && mssqlSnippet}
                    {selectedCodeView === 'mysql' && mysqlSnippet}
                    {selectedCodeView === 'vscode_launch' && vscodeLaunchSnippet}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Mã nguồn hoàn chỉnh, hỗ trợ bảo vệ đồ án tốt nghiệp & báo cáo thực tập</span>
          </div>
          <button
            onClick={() => visualStudioModalController.close()}
            className="px-4 py-2 bg-stone-900 text-white font-semibold rounded-xl hover:bg-stone-800 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
