import { Link } from 'react-router-dom';
import { Home, Search, Calendar, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">BookingSport</span>
            </Link>
            <p className="text-gray-400 max-w-md">
              Nền tảng đặt lịch sân thể thao trực tuyến hàng đầu. Tìm và đặt sân yêu thích của bạn chỉ trong vài bước đơn giản.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <Home className="w-4 h-4" />
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/courts" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <Search className="w-4 h-4" />
                  Tìm sân
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <Calendar className="w-4 h-4" />
                  Lịch đặt của tôi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@bookingsport.vn</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>1900 xxxx</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Đà Nẵng, Việt Nam</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 BookingSport. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
