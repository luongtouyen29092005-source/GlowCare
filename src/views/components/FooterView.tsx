import React, { useState } from 'react';
import { 
  Droplets, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Heart,
  Send,
  Sparkles
} from 'lucide-react';
import { notificationController } from '../../controllers/NotificationController';
import { skinQuizController } from '../../controllers/SkinQuizController';
import { mvcInspectorController } from '../../controllers/MVCInspectorController';
import { visualStudioModalController } from '../../controllers/VisualStudioModalController';
import { Code2 } from 'lucide-react';

export const FooterView: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      notificationController.show('warning', 'Email', 'Vui lòng nhập địa chỉ Email hợp lệ.');
      return;
    }
    notificationController.show('success', 'Đăng ký thành công', 'Cảm ơn bạn đã đăng ký nhận bản tin mẹo chăm sóc da từ bác sĩ da liễu!');
    setNewsletterEmail('');
  };

  return (
    <footer id="main-footer" className="bg-stone-900 text-stone-300 border-t border-stone-800">
      {/* Newsletter Strip */}
      <div className="border-b border-stone-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
                Bản Tin Da Liễu Hàng Tuần
              </span>
              <h3 className="font-serif text-2xl font-bold text-white mt-1">
                Nhận cẩm nang chăm sóc da khoa học & mã giảm 20%
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Không spam. Bạn có thể hủy đăng ký bất cứ lúc nào chỉ với 1 cú nhấp chuột.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full md:w-auto flex gap-2 max-w-md">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Nhập email của bạn..."
                className="w-full text-xs px-4 py-3 bg-stone-800/80 border border-stone-700 rounded-xl text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-rose-700 text-white rounded-xl text-xs font-semibold hover:bg-rose-600 transition-colors flex items-center gap-1.5 flex-shrink-0"
              >
                <span>Đăng ký</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                <Droplets className="w-5 h-5 fill-rose-500/40" />
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-tight">
                GlowCare Lab
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Thương hiệu dược mỹ phẩm tiên phong kết hợp khoa học hoạt chất và công nghệ phần mềm mô hình MVC chuẩn mực. Cam kết mang đến làn da khỏe đẹp và trải nghiệm mua sắm mượt mà nhất.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                onClick={() => skinQuizController.openQuiz()}
                className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-rose-300 text-xs font-medium border border-stone-700 flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Trắc nghiệm chẩn đoán da</span>
              </button>
              <button
                onClick={() => mvcInspectorController.open()}
                className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-indigo-300 text-xs font-medium border border-stone-700 transition-colors"
              >
                Xem Kiến Trúc MVC
              </button>
              <button
                onClick={() => visualStudioModalController.open('vscode')}
                className="px-3.5 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 text-xs font-semibold border border-rose-800 flex items-center gap-1.5 transition-colors"
              >
                <Code2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Chạy Visual Studio & SQL</span>
              </button>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Liên hệ tư vấn
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-bold block">1900 6868</span>
                  <span className="text-[11px]">8:00 - 22:00 (Tất cả các ngày)</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>support@glowcare.vn</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span>Hỗ trợ trực tuyến 24/7</span>
              </li>
            </ul>
          </div>

          {/* Store Addresses */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Hệ thống cửa hàng
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <b className="text-white">Chi nhánh Hà Nội:</b>
                  <p className="text-[11px]">68 Phố Huế, P. Hàng Bài, Q. Hoàn Kiếm</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <b className="text-white">Chi nhánh TP. HCM:</b>
                  <p className="text-[11px]">235 Nguyễn Trãi, P. Nguyễn Cư Trinh, Q. 1</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Policies & Guarantees */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Chính sách & An tâm
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-center gap-1.5 text-stone-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Chính hãng có tem phụ</span>
              </li>
              <li>Miễn phí vận chuyển từ 499k</li>
              <li>Đổi trả trong 7 ngày nếu kích ứng</li>
              <li>Đồng kiểm tra trước khi nhận</li>
              <li>Bảo mật thông tin thanh toán SSL</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 GlowCare Skincare. Thiết kế và phát triển theo mô hình MVC (Model - View - Controller).</p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Phát triển vì một làn da rạng rỡ</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
